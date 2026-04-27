/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG — Supabase Integration Layer
   ║  Real auth + per-client dynamic data
   ╚══════════════════════════════════════════════════════════ */

'use strict';

const _SB_URL  = 'https://zwangblfyccxqigifmgm.supabase.co';
const _SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YW5nYmxmeWNjeHFpZ2lmbWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ2NjcsImV4cCI6MjA5MTI3MDY2N30.LFtZ_rEWbKE04qFVvdPNoxA8j5bJeLCwjKPrg9NcLho';

let _sb            = null;
let _currentUser   = null;
let _currentProfile = null;

/* ── Error translation ────────────────────────────────────── */
function _xlErr(msg) {
  const map = {
    'Invalid login credentials':   'Email o password non corrette.',
    'Email not confirmed':         'Conferma prima la tua email.',
    'User already registered':     'Email già registrata. Accedi con le tue credenziali.',
    'Password should be at least 6 characters': 'La password deve avere almeno 6 caratteri.',
    'Unable to validate email address: invalid format': 'Formato email non valido.',
    'Database error querying schema': 'Errore interno del login. Ci scusiamo per il disagio.',
    'Database error':              'Errore interno del login. Ci scusiamo per il disagio.',
    'unexpected_failure':          'Errore interno del login. Ci scusiamo per il disagio.',
  };
  // Catch any database/schema/server errors generically
  if (!msg) return 'Errore interno del login. Ci scusiamo per il disagio.';
  if (msg.toLowerCase().includes('database') || msg.toLowerCase().includes('schema') ||
      msg.toLowerCase().includes('internal') || msg.toLowerCase().includes('server error')) {
    return 'Errore interno del login. Ci scusiamo per il disagio.';
  }
  return map[msg] || msg;
}

/* ── Login UI helpers ─────────────────────────────────────── */
function _showLoginError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _hideLoginError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
function _setBtnLoading(id, loading, defaultText) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Attendere...' : defaultText;
}

/* ── Build VERA-compatible client object from Supabase rows ─ */
function _buildClientObj(client, ghgEntries, reports) {
  const name     = client.name || '';
  const initials = name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || 'CL';

  const obj = {
    id:          client.id,
    _dbId:       client.id,          // keep UUID for DB ops
    initials,
    avatarBg:    '#dcfce7',
    avatarColor: '#14532d',
    name,
    cf:          client.cf        || '',
    sector:      client.sector    || '',
    ateco:       client.ateco     || '',
    employees:   client.employees || 0,
    city:        client.city      || '',
    year:        client.year      || 2024,
    std:         client.standard  || null,  // null = not yet determined by AI assessment
    status:      client.status    || 'new',
    step:        client.step      || 0,
    plan:        client.plan      || 'base',
    ghg:         null,
    stamp:       { applied: false },
    ghgRows:     [],
  };

  // GHG entries
  if (ghgEntries && ghgEntries.length > 0) {
    let s1 = 0, s2 = 0, s3 = 0;
    const rows = ghgEntries.map(e => {
      const em = Number(e.emissions_kgco2e) || 0;
      if (e.scope === 1) s1 += em;
      else if (e.scope === 2) s2 += em;
      else if (e.scope === 3) s3 += em;
      const tag = e.scope === 1 ? 'tag-g' : e.scope === 2 ? 'tag-b' : 'tag-o';
      return {
        mat:   e.material || '',
        scope: e.scope,
        tag,
        qty:   `${e.quantity || ''} ${e.unit || ''}`.trim(),
        fe:    String(e.emission_factor || ''),
        src:   e.ef_source || '',
        em,
      };
    });
    obj.ghgRows = rows;
    obj.ghg     = { s1, s2, s3, total: s1 + s2 + s3 };
  }

  // Approved report → stamp
  if (reports && reports.length > 0) {
    const approved = reports.find(r => r.status === 'approved');
    if (approved) {
      obj.stamp = {
        applied: true,
        code:    approved.stamp_code || '',
        hash:    approved.stamp_hash || '',
        date:    approved.stamp_date || '',
      };
    }
  }

  return obj;
}

/* ── Immediate UI transition to app shell ─────────────────── */
function _transitionToApp() {
  const landing = document.getElementById('view-landing');
  const login   = document.getElementById('view-login');
  const app     = document.getElementById('view-app');
  if (landing) { landing.style.display = 'none'; landing.classList.remove('active'); }
  if (login)   { login.style.display   = 'none'; login.classList.remove('active'); }
  if (app)     { app.style.display     = 'flex'; app.classList.add('active'); }
}

/* ══════════════════════════════════════════════════════════
   MAIN veraAuth OBJECT
══════════════════════════════════════════════════════════ */

const veraAuth = {

  _signingIn: false,   // guard against double _onSignedIn calls

  /* ── Initialise Supabase & check session ──────────────── */
  async init() {
    if (!window.supabase) {
      console.error('VERA: Supabase SDK not loaded');
      return;
    }
    _sb = window.supabase.createClient(_SB_URL, _SB_KEY);

    // Listen for future auth changes (fired after signInWithPassword too)
    _sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Skip if handleLogin already called _onSignedIn directly
        if (this._signingIn) return;
        await this._onSignedIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        _currentUser    = null;
        _currentProfile = null;
        this._signingIn = false;
      }
    });

    // Check for existing session (page reload / tab reopen)
    const { data: { session } } = await _sb.auth.getSession();
    if (session) {
      await this._onSignedIn(session.user);
    }
  },

  /* ── Called after successful Supabase sign-in ─────────── */
  async _onSignedIn(user) {
    _currentUser = user;

    // Fetch profile
    const { data: profile, error } = await _sb
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      // Profile missing — sign out and show error
      this._signingIn = false;
      await _sb.auth.signOut();
      _showLoginError('login-error', 'Profilo utente non trovato. Contatta il supporto.');
      _setBtnLoading('login-submit', false, 'Accedi →');
      return;
    }
    _currentProfile = profile;

    const role = profile.role; // 'admin' | 'client'

    if (role === 'client' && profile.client_id) {
      await this._loadClientIntoApp(profile.client_id);
    } else if (role === 'admin') {
      // For admin, ensure demo data is loaded (or real clients)
      // We'll refresh the clients table from Supabase
    }

    // Hand off to vera.js auth system
    if (window.auth && typeof window.auth.login === 'function') {
      window.auth.login(role, { user, profile });
    }

    // Reset guard after successful sign-in
    this._signingIn = false;
  },

  /* ── Load one client's data from Supabase into app state ─ */
  async _loadClientIntoApp(clientId) {
    const [
      { data: client },
      { data: ghgEntries },
      { data: reports },
    ] = await Promise.all([
      _sb.from('clients').select('*').eq('id', clientId).single(),
      _sb.from('ghg_entries').select('*').eq('client_id', clientId),
      _sb.from('reports').select('*').eq('client_id', clientId),
    ]);

    if (!client) return;

    const clientObj = _buildClientObj(client, ghgEntries || [], reports || []);

    // Inject into VERA's in-memory store (keyed by DB UUID)
    window.CLIENTS_DATA               = {};
    window.CLIENTS_DATA[client.id]    = clientObj;
    window._currentClientId           = client.id;

    // Also expose DB ID for save calls
    window._veraDbClientId = client.id;
  },

  /* ── Admin: load all clients from Supabase ────────────── */
  async loadAllClientsForAdmin() {
    if (!_sb) return [];
    const { data, error } = await _sb
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  },

  /* ── Admin: refresh the client table in the UI ────────── */
  async refreshAdminClientTable() {
    const clients = await this.loadAllClientsForAdmin();
    const tbody   = document.getElementById('clients-table-body');
    if (!tbody) return;

    if (clients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-3);padding:24px">Nessun cliente ancora registrato</td></tr>';
      return;
    }

    const statusLabel = {
      new:         '<span class="tag" style="background:#ffe4e6;color:#be123c;border-color:#fecdd3">🆕 Nuova registrazione</span>',
      active:      '<span class="tag tag-g">✓ Attivo</span>',
      in_progress: '<span class="tag" style="background:#fef9c3;color:#854d0e;border-color:#fde68a">⚙ In lavorazione</span>',
      completed:   '<span class="tag tag-g">✓ Completato</span>',
    };

    tbody.innerHTML = clients.map(c => {
      const initials = (c.name || '').split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
      const stdTag   = c.standard === 'gri'
        ? '<span class="tag" style="background:#dbeafe;color:#1e40af;border-color:#bfdbfe">GRI 2021</span>'
        : c.standard === 'vsme'
          ? '<span class="tag tag-g">VSME</span>'
          : '<span class="tag">—</span>';
      const statusHtml = statusLabel[c.status] || statusLabel.new;
      const safeId = JSON.stringify(c.id);

      return `<tr>
        <td>
          <div class="client-name-cell">
            <div class="client-avatar">${initials}</div>
            <div><b>${c.name || '—'}</b><br/>
              <small style="color:var(--text-3)">${c.client_email || c.cf || ''}</small>
            </div>
          </div>
        </td>
        <td>${c.sector || '—'}</td>
        <td>${stdTag}</td>
        <td>${c.employees || '—'}</td>
        <td>${statusHtml}</td>
        <td><button class="btn btn-primary btn-sm" onclick="veraAuth.adminOpenClient(${safeId})">Apri →</button></td>
      </tr>`;
    }).join('');

    // Update subtitle text
    const sub = document.getElementById('clients-sub');
    const completed  = clients.filter(c => c.status === 'completed').length;
    const inProgress = clients.filter(c => c.status === 'in_progress').length;
    const newC       = clients.filter(c => c.status === 'new').length;
    const active     = clients.filter(c => c.status === 'active').length;
    if (sub) {
      sub.textContent = `${clients.length} aziende · ${completed} completate · ${inProgress} in corso · ${newC} nuove`;
    }

    // Update portfolio summary counters
    const setSpan = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setSpan('stat-completed',   completed);
    setSpan('stat-in-progress', inProgress);
    setSpan('stat-active',      active);
    setSpan('stat-new',         newC);
    setSpan('stat-total',       clients.length);
  },

  /* ── Admin: open a client workspace ──────────────────── */
  async adminOpenClient(clientId) {
    const [
      { data: client },
      { data: ghgEntries },
      { data: reports },
    ] = await Promise.all([
      _sb.from('clients').select('*').eq('id', clientId).single(),
      _sb.from('ghg_entries').select('*').eq('client_id', clientId),
      _sb.from('reports').select('*').eq('client_id', clientId),
    ]);

    if (!client) { window.toast && toast('Cliente non trovato', 'error'); return; }

    const clientObj = _buildClientObj(client, ghgEntries || [], reports || []);

    window.CLIENTS_DATA               = window.CLIENTS_DATA || {};
    window.CLIENTS_DATA[client.id]    = clientObj;
    window._currentClientId           = client.id;
    window._veraDbClientId            = client.id;

    if (window.loadClient) {
      loadClient(client.id);
    }
  },

  /* ── Save assessment result ───────────────────────────── */
  async saveAssessmentResult(standard) {
    const clientId = window._veraDbClientId;
    if (!_sb || !clientId) return;

    await _sb.from('clients').update({
      standard:   standard,
      status:     'in_progress',
      step:       2,
      updated_at: new Date().toISOString(),
    }).eq('id', clientId);
  },

  /* ── Save GHG entries ────────────────────────────────── */
  async saveGhgEntries(rows) {
    const clientId = window._veraDbClientId;
    if (!_sb || !clientId || !rows || rows.length === 0) return;

    // Delete existing, then insert new
    await _sb.from('ghg_entries').delete().eq('client_id', clientId);

    const dbRows = rows.map(r => ({
      client_id:       clientId,
      material:        r.mat || '',
      scope:           r.scope || 1,
      quantity:        parseFloat(String(r.qty).replace(/[^\d.]/g, '')) || 0,
      unit:            (String(r.qty).replace(/[\d.\s]/g, '') || 'kWh').trim(),
      emission_factor: parseFloat(String(r.fe).replace(',', '.')) || 0,
      ef_source:       r.src || '',
      emissions_kgco2e: Number(r.em) || 0,
      year:            (window.currentClient && window.currentClient()) ? (window.currentClient().year || 2024) : 2024,
    }));

    await _sb.from('ghg_entries').insert(dbRows);
  },

  /* ── Request / update report ─────────────────────────── */
  async requestReport(standard, pdfData) {
    const clientId = window._veraDbClientId;
    if (!_sb || !clientId) return null;

    const insertPayload = {
      client_id:    clientId,
      standard,
      status:       'requested',
      requested_at: new Date().toISOString(),
    };
    if (pdfData) insertPayload.pdf_data = pdfData;

    const { data } = await _sb
      .from('reports')
      .insert(insertPayload)
      .select()
      .single();

    return data;
  },

  /* ── Admin: approve report + apply stamp ────────────── */
  async approveReport(reportId, stampCode, stampHash, stampDate) {
    if (!_sb) return;
    await _sb.from('reports').update({
      status:      'approved',
      approved_at: new Date().toISOString(),
      stamp_code:  stampCode,
      stamp_hash:  stampHash,
      stamp_date:  stampDate,
    }).eq('id', reportId);
  },

  /* ── Admin: create a new client record ───────────────── */
  async createClient(fields) {
    if (!_sb) throw new Error('Supabase non inizializzato.');
    const payload = {
      name:         fields.name         || '',
      client_email: fields.client_email || '',
      sector:       fields.sector       || '',
      ateco:        fields.ateco        || '',
      employees:    fields.employees    ? parseInt(fields.employees, 10) : null,
      city:         fields.city         || '',
      year:         fields.year         ? parseInt(fields.year, 10) : new Date().getFullYear(),
      standard:     fields.standard     || null,
      status:       'new',
      step:         0,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    };
    const { data, error } = await _sb
      .from('clients')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /* ── Admin: show modal to create a new client ─────────── */
  showCreateClientModal() {
    // Remove any existing overlay
    const existing = document.getElementById('create-client-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'create-client-overlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9998;padding:16px;
    `;

    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:40px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
          <div>
            <h2 style="margin:0 0 4px 0;font-size:22px;font-weight:700;color:#111">Nuovo cliente</h2>
            <p style="margin:0;font-size:13px;color:#6b7280">Inserisci i dati aziendali per creare il profilo cliente</p>
          </div>
          <button onclick="document.getElementById('create-client-overlay').remove()"
            style="border:none;background:#f3f4f6;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:18px;color:#6b7280;display:flex;align-items:center;justify-content:center;flex-shrink:0">✕</button>
        </div>

        <form id="create-client-form" style="display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Nome azienda *</label>
            <input id="cc-name" type="text" placeholder="es. Rossi Metalli S.r.l." required
              style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Email referente</label>
            <input id="cc-email" type="email" placeholder="referente@azienda.it"
              style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Settore</label>
              <input id="cc-sector" type="text" placeholder="es. Manifatturiero"
                style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
                onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Codice ATECO</label>
              <input id="cc-ateco" type="text" placeholder="es. 25.11"
                style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
                onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">N. dipendenti</label>
              <input id="cc-employees" type="number" min="1" placeholder="es. 45"
                style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
                onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Città</label>
              <input id="cc-city" type="text" placeholder="es. Milano"
                style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
                onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:600;color:#374151;display:block;margin-bottom:6px">Anno rendicontazione</label>
              <input id="cc-year" type="number" min="2020" max="2030" placeholder="${new Date().getFullYear()}"
                style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;outline:none"
                onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1d5db'"/>
            </div>
          </div>
          <div style="padding:10px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:12.5px;color:#166534">
            ✦ Lo standard ESG (VSME o GRI) verrà determinato dall'AI dopo il completamento del questionario di assessment.
          </div>

          <div id="cc-error" style="display:none;padding:10px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:13px;color:#dc2626"></div>

          <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
            <button type="button" onclick="document.getElementById('create-client-overlay').remove()"
              style="padding:10px 20px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#374151;cursor:pointer;font-size:14px;font-weight:500">
              Annulla
            </button>
            <button type="button" id="cc-submit"
              onclick="veraAuth._submitCreateClient()"
              style="padding:10px 24px;border:none;border-radius:8px;background:#16a34a;color:#fff;cursor:pointer;font-size:14px;font-weight:600">
              Crea cliente
            </button>
          </div>
        </form>
      </div>`;

    document.body.appendChild(overlay);
    // Focus first field
    setTimeout(() => { const f = document.getElementById('cc-name'); if (f) f.focus(); }, 50);
  },

  /* ── Admin: handle create client form submit ──────────── */
  async _submitCreateClient() {
    const nameEl   = document.getElementById('cc-name');
    const errorEl  = document.getElementById('cc-error');
    const submitEl = document.getElementById('cc-submit');

    const name = (nameEl && nameEl.value || '').trim();
    if (!name) {
      if (errorEl) { errorEl.textContent = 'Il nome azienda è obbligatorio.'; errorEl.style.display = 'block'; }
      if (nameEl) nameEl.focus();
      return;
    }
    if (errorEl) errorEl.style.display = 'none';

    const fields = {
      name,
      client_email: (document.getElementById('cc-email')     || {}).value || '',
      sector:       (document.getElementById('cc-sector')    || {}).value || '',
      ateco:        (document.getElementById('cc-ateco')     || {}).value || '',
      employees:    (document.getElementById('cc-employees') || {}).value || '',
      city:         (document.getElementById('cc-city')      || {}).value || '',
      year:         (document.getElementById('cc-year')      || {}).value || '',
      standard:     null, // determined by AI assessment questionnaire
    };

    if (submitEl) { submitEl.disabled = true; submitEl.textContent = 'Creazione...'; }

    try {
      await this.createClient(fields);
      document.getElementById('create-client-overlay').remove();
      if (window.VERA && window.VERA.ui && window.VERA.ui.toast) {
        window.VERA.ui.toast(`Cliente "${name}" creato con successo`, 'success');
      }
      await this.refreshAdminClientTable();
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Errore durante la creazione del cliente.';
      if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
      if (submitEl) { submitEl.disabled = false; submitEl.textContent = 'Crea cliente'; }
    }
  },

  /* ── Update client company profile ───────────────────── */
  async updateClientProfile(fields) {
    const clientId = window._veraDbClientId;
    if (!_sb || !clientId) return;
    await _sb.from('clients').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', clientId);
  },

  /* ── Sign out ────────────────────────────────────────── */
  async signOut() {
    if (!_sb) return;
    await _sb.auth.signOut();
    // Clear local state
    window.CLIENTS_DATA    = {};
    window._veraDbClientId = null;
    // Return to landing
    document.querySelectorAll('.view').forEach(v => {
      v.style.display = 'none';
      v.classList.remove('active');
    });
    const land = document.getElementById('view-landing');
    if (land) { land.style.display = 'block'; land.classList.add('active'); }
  },

  /* ── Login form handler ──────────────────────────────── */
  async handleLogin(e) {
    e.preventDefault();
    _hideLoginError('login-error');
    const email    = (document.getElementById('login-email')    || {}).value || '';
    const password = (document.getElementById('login-password') || {}).value || '';
    if (!email || !password) { _showLoginError('login-error', 'Inserisci email e password.'); return; }

    _setBtnLoading('login-submit', true, 'Accedi →');

    try {
      const { data, error } = await _sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Set guard BEFORE transition so onAuthStateChange (which fires
      // synchronously after signInWithPassword resolves) skips its own call
      this._signingIn = true;
      _transitionToApp();
      await this._onSignedIn(data.user);
    } catch (err) {
      this._signingIn = false;
      _showLoginError('login-error', _xlErr(err.message));
      _setBtnLoading('login-submit', false, 'Accedi →');
    }
  },

  /* ── Forgot-password handler ────────────────────────── */
  async handleForgotPassword(e) {
    e.preventDefault();
    _hideLoginError('forgot-error');
    const email = (document.getElementById('forgot-email') || {}).value || '';
    if (!email) { _showLoginError('forgot-error', 'Inserisci la tua email.'); return; }

    _setBtnLoading('forgot-submit', true, 'Invia email →');

    try {
      const { error } = await _sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname + '?reset=1',
      });
      if (error) throw error;

      document.getElementById('forgot-panel').innerHTML = `
        <div style="text-align:center;padding:32px 0">
          <div style="font-size:48px;margin-bottom:16px">📧</div>
          <h3 style="color:var(--green-d);margin-bottom:8px">Email inviata!</h3>
          <p style="color:var(--text-2);max-width:320px;margin:0 auto">
            Controlla la tua casella <b>${email}</b> e clicca il link per reimpostare la password.
          </p>
          <button class="btn btn-outline" style="margin-top:24px" onclick="veraAuth.showLogin()">← Torna al login</button>
        </div>`;
    } catch (err) {
      _showLoginError('forgot-error', _xlErr(err.message));
      _setBtnLoading('forgot-submit', false, 'Invia email →');
    }
  },

  /* ── Toggle login panels ─────────────────────────────── */
  showLogin() {
    document.getElementById('forgot-panel').style.display   = 'none';
    document.getElementById('login-panel').style.display    = 'block';
  },
  showForgotPassword() {
    document.getElementById('login-panel').style.display    = 'none';
    document.getElementById('forgot-panel').style.display   = 'block';
  },

  /* ── Accessors ──────────────────────────────────────── */
  getClientId()    { return _currentProfile?.client_id || window._veraDbClientId || null; },
  getUserId()      { return _currentUser?.id || null; },
  isAdmin()        { return _currentProfile?.role === 'admin'; },
  getProfile()     { return _currentProfile; },
  getSupabase()    { return _sb; },
};

/* ── Boot on DOMContentLoaded ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  veraAuth.init();
});

/* ── Expose globally ─────────────────────────────────────── */
window.veraAuth = veraAuth;
