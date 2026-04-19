/* ╔══════════════════════════════════════════════════════
   ║  VERA ESG — Assistente Chat
   ║  Smart keyword-matching · no backend needed
   ╚══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     KNOWLEDGE BASE
  ══════════════════════════════════════════════════════ */
  const KB = [
    {
      keys: ['vsme','voluntary small medium enterprise','efrag','efrag vsme'],
      title: 'Cos\'è il VSME?',
      answer: `Il <b>VSME (Voluntary standard for non-listed SMEs)</b> è il framework di rendicontazione ESG sviluppato da <b>EFRAG</b> per le PMI europee non quotate.<br><br>
È pensato per essere <b>proporzionato e accessibile</b>: richiede meno risorse rispetto al GRI e si concentra sugli indicatori più rilevanti per imprese fino a 250 dipendenti.<br><br>
<b>Quando sceglierlo:</b>
<ul>
  <li>Prima rendicontazione ESG</li>
  <li>Mercato prevalentemente italiano/europeo</li>
  <li>Richieste da banche o supply chain domestica</li>
  <li>Azienda &lt; 250 dipendenti</li>
</ul>`
    },
    {
      keys: ['gri','global reporting initiative','gri standards','gri 2021'],
      title: 'Cos\'è il GRI?',
      answer: `Il <b>GRI (Global Reporting Initiative)</b> è lo standard internazionale più diffuso per la rendicontazione di sostenibilità, aggiornato nel 2021.<br><br>
Copre in modo approfondito i temi E, S e G con disclosure specifiche per settore.<br><br>
<b>Quando sceglierlo:</b>
<ul>
  <li>Clienti o investitori internazionali</li>
  <li>Azienda con 3+ anni di rendicontazione</li>
  <li>Esigenza di comparabilità globale</li>
  <li>Quotazione in borsa o fondi ESG</li>
</ul>`
    },
    {
      keys: ['differenza vsme gri','vsme o gri','quale standard','scegliere standard','confronto'],
      title: 'VSME vs GRI — quale scegliere?',
      answer: `<table style="width:100%;border-collapse:collapse;font-size:12.5px">
<tr style="border-bottom:1px solid #e5e7eb"><th style="text-align:left;padding:5px 8px;color:#6b7280">Criterio</th><th style="padding:5px 8px;color:#16a34a">VSME</th><th style="padding:5px 8px;color:#2563eb">GRI</th></tr>
<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:5px 8px">Complessità</td><td style="padding:5px 8px;text-align:center">⬤⬤○○</td><td style="padding:5px 8px;text-align:center">⬤⬤⬤⬤</td></tr>
<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:5px 8px">Riconoscimento IT</td><td style="padding:5px 8px;text-align:center">⬤⬤⬤⬤</td><td style="padding:5px 8px;text-align:center">⬤⬤⬤○</td></tr>
<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:5px 8px">Riconoscimento globale</td><td style="padding:5px 8px;text-align:center">⬤⬤○○</td><td style="padding:5px 8px;text-align:center">⬤⬤⬤⬤</td></tr>
<tr><td style="padding:5px 8px">Costo implementazione</td><td style="padding:5px 8px;text-align:center">€</td><td style="padding:5px 8px;text-align:center">€€€</td></tr>
</table><br>
Il nostro <b>questionario AI</b> ti guida nella scelta in base al tuo profilo specifico.`
    },
    {
      keys: ['scope 1','scope1','emissioni dirette','combustione diretta'],
      title: 'Scope 1 — Emissioni dirette',
      answer: `Le <b>emissioni Scope 1</b> sono le emissioni dirette generate dall'azienda:<br><br>
<ul>
  <li>🔥 Combustione di gas naturale, gasolio, GPL nei propri impianti</li>
  <li>🚗 Flotta aziendale di proprietà</li>
  <li>🏭 Processi industriali diretti</li>
  <li>❄️ Fughe di refrigeranti (HFC)</li>
</ul>
<b>Unità:</b> kgCO₂e · <b>Fattori:</b> ISPRA 2024 / IPCC AR6<br><br>
In VERA puoi inserire consumi in <b>Sm³, litri, kWh o kg</b> — il sistema calcola automaticamente le emissioni con i fattori di emissione aggiornati.`
    },
    {
      keys: ['scope 2','scope2','energia elettrica','elettricità','energia indiretta'],
      title: 'Scope 2 — Energia acquistata',
      answer: `Le <b>emissioni Scope 2</b> derivano dall'energia elettrica e termica <i>acquistata</i> dall'esterno:<br><br>
<ul>
  <li>⚡ Elettricità dalla rete nazionale</li>
  <li>♨️ Calore/vapore acquistato</li>
  <li>❄️ Raffreddamento acquistato</li>
</ul>
<b>Due metodi:</b><br>
• <b>Location-based</b>: usa il mix di rete nazionale (fattore ISPRA medio IT)<br>
• <b>Market-based</b>: usa il contratto energetico specifico (se hai GOO/certificati verdi)<br><br>
VERA supporta entrambi i metodi e li dichiara nel report.`
    },
    {
      keys: ['scope 3','scope3','catena fornitura','supply chain','upstream','downstream','trasferte'],
      title: 'Scope 3 — Catena del valore',
      answer: `Lo <b>Scope 3</b> copre tutte le emissioni indirette nella catena del valore:<br><br>
<b>Upstream (fornitori):</b>
<ul>
  <li>Acquisto beni/servizi, materiali</li>
  <li>Trasporti e logistica in entrata</li>
  <li>Rifiuti generati</li>
</ul>
<b>Downstream (clienti):</b>
<ul>
  <li>Distribuzione e logistica in uscita</li>
  <li>Trasferte dei dipendenti</li>
  <li>Uso del prodotto venduto</li>
</ul>
Per le PMI il VSME prevede una selezione proporzionata delle categorie Scope 3 più rilevanti.`
    },
    {
      keys: ['ghg','gas serra','emissioni','calcolo emissioni','calcolatore','inventario ghg'],
      title: 'Come funziona il calcolo GHG?',
      answer: `VERA segue il <b>GHG Protocol Corporate Standard</b> per il calcolo:<br><br>
<ol>
  <li><b>Carica i dati</b>: consumi energetici, combustibili, trasporti (Excel/CSV o inserimento manuale)</li>
  <li><b>L'AI analizza</b> il file e classifica automaticamente ogni voce per scope</li>
  <li><b>Applica fattori</b>: DEFRA 2024, ISPRA 2024, IPCC AR6 selezionati automaticamente</li>
  <li><b>Genera il report</b>: totali Scope 1+2+3 in kgCO₂e e tCO₂e</li>
</ol>
<b>Formati accettati:</b> .xlsx, .xls, .csv<br>
<b>Unità supportate:</b> kWh, Sm³, litri, km, kg, ton`
    },
    {
      keys: ['doppia materialità','materialità','esrs','impatti','rischi opportunità','mat'],
      title: 'Doppia Materialità',
      answer: `La <b>Doppia Materialità</b> è richiesta dagli ESRS (European Sustainability Reporting Standards) e valuta due prospettive:<br><br>
<b>1. Impact Materiality</b> → impatti dell'azienda su ambiente e persone (inside-out)<br>
<b>2. Financial Materiality</b> → rischi e opportunità ESG che impattano finanziariamente l'azienda (outside-in)<br><br>
<b>Temi coperti:</b><br>
E1 Cambiamenti climatici · E2 Inquinamento · E3 Acque · E4 Biodiversità · E5 Economia circolare<br>
S1-S4 Temi sociali · G1 Etica d'impresa<br><br>
In VERA trovi il modulo Doppia Materialità nel menu laterale → compila le schede per ogni tema ESRS.`
    },
    {
      keys: ['csrd','corporate sustainability reporting directive','obblighi normativi','obbligo'],
      title: 'CSRD e PMI — cosa devo fare?',
      answer: `La <b>CSRD</b> si applica direttamente alle grandi imprese (> 250 dip., > €50M fatturato).<br><br>
<b>Per le PMI la situazione è:</b><br>
<ul>
  <li>🟡 <b>Obblighi indiretti</b>: se sei fornitore di grandi aziende, ti verrà chiesto di rendicontare (supply chain pressure)</li>
  <li>🟢 <b>Volontario</b>: puoi scegliere VSME per anticipare il mercato e accedere a finanziamenti ESG</li>
  <li>🔴 <b>PMI quotate</b>: CSRD si applicherà dal 2026 con standard specifici</li>
</ul>
Il questionario AI di VERA identifica la tua situazione normativa specifica.`
    },
    {
      keys: ['timbro','timbro metodologico','certificazione','validazione','hash'],
      title: 'Cos\'è il Timbro Metodologico?',
      answer: `Il <b>Timbro Metodologico VERA</b> è una firma digitale che attesta l'integrità del report:<br><br>
<ul>
  <li>🔐 Genera un <b>hash SHA-256</b> univoco dei dati del report</li>
  <li>📋 Include: standard usato, data calcolo, versione metodologia</li>
  <li>✅ Verificabile da terze parti tramite codice univoco</li>
  <li>📄 Appare in intestazione di tutti i report scaricati</li>
</ul>
Fornisce trasparenza metodologica senza richiedere assurance esterna formale — ideale per PMI.`
    },
    {
      keys: ['come funziona','iniziare','primo passo','onboarding','processo','workflow','flusso'],
      title: 'Come funziona VERA?',
      answer: `Il processo VERA si divide in <b>6 passi</b>:<br><br>
<ol>
  <li>🤖 <b>Valutazione AI</b> (7 domande) → scelta dello standard ESG ottimale</li>
  <li>📋 <b>Standard</b> → conferma VSME o GRI con spiegazione personalizzata</li>
  <li>📤 <b>Carica dati</b> → Excel/CSV con consumi energetici e attività</li>
  <li>⚡ <b>Calcolo GHG</b> → emissioni calcolate automaticamente per scope</li>
  <li>📄 <b>Report</b> → bilancio di sostenibilità conforme allo standard scelto</li>
  <li>🏷 <b>Timbro</b> → validazione metodologica del report finale</li>
</ol>
Tempo medio: <b>4 giorni lavorativi*</b> per il primo report completo.`
    },
    {
      keys: ['excel','csv','file','formato','caricare','upload','dati','template'],
      title: 'Come preparare il file dati?',
      answer: `Il file da caricare deve contenere i <b>consumi aziendali</b>.<br><br>
<b>Colonne consigliate:</b><br>
<code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px">Descrizione · Categoria · Quantità · Unità · Periodo</code><br><br>
<b>Esempi di voci:</b>
<ul>
  <li>Gas naturale uffici · combustione · 4500 · Sm³ · 2024</li>
  <li>Elettricità totale · energia · 85000 · kWh · 2024</li>
  <li>Gasolio automezzi · flotta · 2300 · litri · 2024</li>
  <li>Trasferte aereo · Scope 3 · 12000 · km · 2024</li>
</ul>
L'AI di VERA interpreta anche formati non strutturati — puoi caricare anche un estratto conto energetico.`
    },
    {
      keys: ['prezzo','costo','quanto costa','piano','abbonamento','pricing'],
      title: 'Piani e prezzi',
      answer: `VERA offre piani per ogni esigenza — vedi la sezione <b>Prezzi</b> nella landing page.<br><br>
Il primo report è incluso nel piano base. Consulenti e studi professionali hanno piani dedicati multi-cliente.<br><br>
Vuoi una demo personalizzata? <button onclick="openApp('signup');this.closest('#vera-chat-window').style.display='none'" style="background:#16a34a;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;font-weight:600">Inizia gratis →</button>`
    },
    {
      keys: ['report','bilancio sostenibilità','pdf','scaricare','download'],
      title: 'Come scaricare il report?',
      answer: `Una volta completato il calcolo GHG, il report è disponibile in due formati:<br><br>
<ul>
  <li>📄 <b>PDF</b>: report completo pronto per stakeholder, banche o clienti</li>
  <li>📊 <b>Dati strutturati</b>: per integrazioni o revisioni interne</li>
</ul>
Vai su <b>Report</b> nel menu laterale → scegli VSME o GRI → clicca <b>Scarica PDF</b>.<br><br>
Il PDF include automaticamente il timbro metodologico, i dati aziendali e la tabella emissioni per scope.`
    },
  ];

  /* Default fallback */
  const FALLBACK = `Non ho trovato una risposta precisa a questa domanda. Posso aiutarti con:<br><br>
• Standard ESG (VSME, GRI, CSRD)<br>
• Calcolo emissioni GHG (Scope 1, 2, 3)<br>
• Come usare VERA<br>
• Doppia Materialità<br>
• Report e timbro metodologico<br><br>
Oppure <b>inizia direttamente</b> con la valutazione AI — sono solo 7 domande!`;

  /* ══════════════════════════════════════════════════════
     SEARCH
  ══════════════════════════════════════════════════════ */
  function findAnswer(input) {
    const q = input.toLowerCase().trim();
    // Score each entry
    let best = null, bestScore = 0;
    for (const entry of KB) {
      let score = 0;
      for (const kw of entry.keys) {
        if (q.includes(kw)) score += kw.split(' ').length * 3;
        else {
          const words = kw.split(' ');
          for (const w of words) {
            if (q.includes(w) && w.length > 3) score += 1;
          }
        }
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return bestScore > 0 ? best : null;
  }

  /* ══════════════════════════════════════════════════════
     QUICK CHIPS (shown at start)
  ══════════════════════════════════════════════════════ */
  const CHIPS = [
    'Come funziona?',
    'VSME o GRI?',
    'Scope 1, 2, 3',
    'Calcolo GHG',
    'Doppia Materialità',
    'Timbro metodologico',
  ];

  /* ══════════════════════════════════════════════════════
     DOM BUILD
  ══════════════════════════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
#vera-chat-btn {
  position:fixed;bottom:24px;right:24px;z-index:8000;
  width:52px;height:52px;border-radius:50%;
  background:linear-gradient(135deg,#16a34a,#0d9488);
  border:none;cursor:pointer;
  box-shadow:0 4px 20px oklch(0.44 0.15 150/.45);
  display:flex;align-items:center;justify-content:center;
  transition:transform .2s cubic-bezier(0.34,1.56,0.64,1), box-shadow .2s;
}
#vera-chat-btn:hover { transform:scale(1.1); box-shadow:0 6px 28px oklch(0.44 0.15 150/.6); }
#vera-chat-btn .cb-icon { transition: transform .3s, opacity .2s; }
#vera-chat-btn.open .cb-icon-chat { opacity:0; transform:scale(0.5) rotate(90deg); }
#vera-chat-btn:not(.open) .cb-icon-close { opacity:0; transform:scale(0.5) rotate(-90deg); }
#vera-chat-btn .cb-icon-close { position:absolute; }

#vera-chat-notif {
  position:absolute;top:-2px;right:-2px;
  width:16px;height:16px;border-radius:50%;
  background:#ef4444;border:2px solid #030a06;
  font-size:9px;color:#fff;display:flex;align-items:center;justify-content:center;
  font-weight:700;pointer-events:none;
}

#vera-chat-window {
  position:fixed;bottom:88px;right:24px;z-index:7999;
  width:min(380px, calc(100vw - 32px));
  max-height:min(580px, calc(100vh - 120px));
  background:var(--white, #fff);
  border:1px solid var(--border, #e5e7eb);
  border-radius:20px;
  box-shadow:0 8px 40px #0004, 0 0 0 1px var(--border, #e5e7eb);
  display:flex;flex-direction:column;overflow:hidden;
  transform:translateY(12px) scale(0.97);opacity:0;
  transition:transform .25s cubic-bezier(0.34,1.56,0.64,1), opacity .2s ease;
  pointer-events:none;
}
#vera-chat-window.visible {
  transform:translateY(0) scale(1);opacity:1;pointer-events:all;
}

.vc-header {
  padding:16px 18px;
  background:linear-gradient(135deg,#14532d,#0f3d2a);
  display:flex;align-items:center;gap:12px;flex-shrink:0;
}
.vc-avatar {
  width:36px;height:36px;border-radius:50%;
  background:oklch(0.72 0.21 150/.2);
  border:1.5px solid oklch(0.72 0.21 150/.4);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;
}
.vc-hname { font-weight:700;font-size:14px;color:#f0fdf4;font-family:'DM Sans',sans-serif; }
.vc-hstatus { font-size:11.5px;color:oklch(0.72 0.21 150);display:flex;align-items:center;gap:5px;font-family:'DM Sans',sans-serif; }
.vc-hstatus::before { content:'';width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block; }
.vc-close {
  margin-left:auto;background:none;border:none;cursor:pointer;
  color:oklch(0.72 0.21 150/.7);font-size:18px;padding:2px 6px;border-radius:6px;line-height:1;
  transition:color .15s;
}
.vc-close:hover { color:#4ade80; }

.vc-messages {
  flex:1;overflow-y:auto;padding:16px;
  display:flex;flex-direction:column;gap:12px;
  scrollbar-width:thin;scrollbar-color:var(--border,#e5e7eb) transparent;
}

.vc-msg {
  display:flex;gap:8px;max-width:92%;
  animation:vcMsgIn .25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes vcMsgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.vc-msg.user { align-self:flex-end;flex-direction:row-reverse; }
.vc-msg-bubble {
  padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.55;
  font-family:'DM Sans',sans-serif;
}
.vc-msg.bot .vc-msg-bubble {
  background:var(--surface, #f9fafb);
  border:1px solid var(--border, #e5e7eb);
  color:var(--text, #111);
  border-bottom-left-radius:4px;
}
.vc-msg.user .vc-msg-bubble {
  background:linear-gradient(135deg,#16a34a,#0d9488);
  color:#fff;border-bottom-right-radius:4px;
}
.vc-msg-avatar {
  width:28px;height:28px;border-radius:50%;flex-shrink:0;
  background:oklch(0.72 0.21 150/.15);
  border:1px solid oklch(0.72 0.21 150/.25);
  display:flex;align-items:center;justify-content:center;font-size:13px;
  align-self:flex-end;
}

.vc-title { font-weight:700;color:var(--text,#111);font-size:14px;margin-bottom:6px; }

.vc-typing {
  display:flex;gap:4px;align-items:center;padding:10px 14px;
  background:var(--surface,#f9fafb);border:1px solid var(--border,#e5e7eb);
  border-radius:14px;border-bottom-left-radius:4px;width:fit-content;
}
.vc-typing span {
  width:6px;height:6px;border-radius:50%;background:var(--text-3,#9ca3af);
  animation:vcDot 1.2s infinite;
}
.vc-typing span:nth-child(2){animation-delay:.2s}
.vc-typing span:nth-child(3){animation-delay:.4s}
@keyframes vcDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

.vc-chips {
  display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 8px;
}
.vc-chip {
  padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;
  border:1.5px solid oklch(0.72 0.21 150/.35);
  color:oklch(0.44 0.15 150);background:oklch(0.72 0.21 150/.06);
  cursor:pointer;transition:background .15s,border-color .15s;
  font-family:'DM Sans',sans-serif;white-space:nowrap;
}
.vc-chip:hover { background:oklch(0.72 0.21 150/.14);border-color:oklch(0.72 0.21 150/.6); }

.vc-input-row {
  padding:12px 14px;border-top:1px solid var(--border,#e5e7eb);
  display:flex;gap:8px;flex-shrink:0;background:var(--white,#fff);
}
#vc-input {
  flex:1;padding:10px 14px;border:1.5px solid var(--border,#e5e7eb);border-radius:10px;
  font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;
  background:var(--white,#fff);color:var(--text,#111);
  transition:border-color .15s;
}
#vc-input:focus { border-color:#22d06a; }
#vc-send {
  padding:10px 16px;background:#16a34a;color:#fff;border:none;
  border-radius:10px;cursor:pointer;font-size:14px;
  transition:background .15s,transform .1s;
  display:flex;align-items:center;
}
#vc-send:hover { background:#15803d; }
#vc-send:active { transform:scale(0.95); }
`;
  document.head.appendChild(style);

  /* ── Button ─────────────────────────────────────────── */
  const btn = document.createElement('button');
  btn.id = 'vera-chat-btn';
  btn.setAttribute('aria-label', 'Assistente VERA');
  btn.innerHTML = `
    <svg class="cb-icon cb-icon-chat" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
    </svg>
    <svg class="cb-icon cb-icon-close" width="20" height="20" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
    <div id="vera-chat-notif">1</div>
  `;
  document.body.appendChild(btn);

  /* ── Window ─────────────────────────────────────────── */
  const win = document.createElement('div');
  win.id = 'vera-chat-window';
  win.innerHTML = `
<div class="vc-header">
  <div class="vc-avatar">🌿</div>
  <div>
    <div class="vc-hname">Assistente VERA</div>
    <div class="vc-hstatus">Online · ESG Expert</div>
  </div>
  <button class="vc-close" onclick="window.__veraChat.close()" aria-label="Chiudi">✕</button>
</div>
<div class="vc-messages" id="vc-messages"></div>
<div class="vc-input-row">
  <input id="vc-input" type="text" placeholder="Chiedi informazioni su ESG, VSME, GHG…" autocomplete="off"/>
  <button id="vc-send" onclick="window.__veraChat.send()">
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7"/>
    </svg>
  </button>
</div>
`;
  document.body.appendChild(win);

  /* ── State ──────────────────────────────────────────── */
  let open = false;
  const msgs = document.getElementById('vc-messages');
  const input = document.getElementById('vc-input');

  input.addEventListener('keydown', e => { if (e.key === 'Enter') window.__veraChat.send(); });

  /* ── Helpers ─────────────────────────────────────────── */
  function addMsg(role, html, showTitle) {
    const div = document.createElement('div');
    div.className = `vc-msg ${role}`;
    if (role === 'bot') {
      div.innerHTML = `
        <div class="vc-msg-avatar">🌿</div>
        <div class="vc-msg-bubble">${showTitle ? `<div class="vc-title">${showTitle}</div>` : ''}${html}</div>`;
    } else {
      div.innerHTML = `<div class="vc-msg-bubble">${html}</div>`;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'vc-msg bot';
    d.id = 'vc-typing-indicator';
    d.innerHTML = `<div class="vc-msg-avatar">🌿</div><div class="vc-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function removeTyping() {
    const t = document.getElementById('vc-typing-indicator');
    if (t) t.remove();
  }

  function showChips() {
    const d = document.createElement('div');
    d.className = 'vc-msg bot';
    d.innerHTML = `<div class="vc-msg-avatar" style="visibility:hidden">🌿</div>
      <div class="vc-chips">${CHIPS.map(c =>
        `<button class="vc-chip" onclick="window.__veraChat.ask('${c}')">${c}</button>`
      ).join('')}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── Public API ──────────────────────────────────────── */
  window.__veraChat = {
    open() {
      open = true;
      win.classList.add('visible');
      btn.classList.add('open');
      document.getElementById('vera-chat-notif').style.display = 'none';
      input.focus();
    },
    close() {
      open = false;
      win.classList.remove('visible');
      btn.classList.remove('open');
    },
    toggle() { open ? this.close() : this.open(); },

    async ask(text) {
      input.value = '';
      addMsg('user', text);
      const typing = showTyping();
      const delay = 600 + Math.random() * 500;
      await new Promise(r => setTimeout(r, delay));
      removeTyping();

      const entry = findAnswer(text);
      if (entry) {
        addMsg('bot', entry.answer, entry.title);
      } else {
        addMsg('bot', FALLBACK);
      }
    },

    send() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      this.ask(text);
    }
  };

  btn.addEventListener('click', () => window.__veraChat.toggle());

  /* ── Welcome message (after 1.5s) ───────────────────── */
  setTimeout(() => {
    addMsg('bot', `Ciao! Sono l'assistente di VERA 👋<br>Posso aiutarti con domande su <b>ESG, VSME, GRI, calcolo GHG</b> e molto altro.`);
    showChips();
  }, 400);

})();
