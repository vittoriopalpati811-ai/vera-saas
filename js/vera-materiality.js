/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG — Modulo Doppia Materialità v3
   ║  Flusso: Fase 1 Materialità → Fase 2 Standard → Fase 3 GHG+Report
   ║  Base: ESRS (EFRAG) · Output: VSME 2023 o GRI Standards
   ╚══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════════════════════════
   LIBRERIA COMPLETA IMPATTI ESRS
   Fonte: EFRAG ESRS Set 1 (luglio 2023), EFRAG VSME (dic 2023)
══════════════════════════════════════════════════════════ */
const IMPACT_LIBRARY = {

  E1: [
    { id:'E1-1',  label:'Emissioni GHG dirette (Scope 1)',         subtopic:'Mitigazione', desc:'Combustione combustibili fossili, processi industriali, fughe di refrigeranti.' },
    { id:'E1-2',  label:'Emissioni GHG indirette da energia (Scope 2)', subtopic:'Mitigazione', desc:'Acquisto di elettricità, vapore, calore da fonti esterne.' },
    { id:'E1-3',  label:'Emissioni GHG catena del valore (Scope 3)', subtopic:'Mitigazione', desc:'Emissioni upstream (fornitori) e downstream (uso prodotti, fine vita).' },
    { id:'E1-4',  label:'Consumo di energia da fonti fossili',      subtopic:'Energia',      desc:'Uso di gas naturale, gasolio, carbone nei processi produttivi.' },
    { id:'E1-5',  label:'Mancata transizione a energia rinnovabile',subtopic:'Energia',      desc:'Dipendenza da fonti non rinnovabili e ritardo nella decarbonizzazione.' },
    { id:'E1-6',  label:'Efficienza energetica insufficiente',      subtopic:'Energia',      desc:'Sprechi di energia per inefficienze di processo, edifici, macchinari.' },
    { id:'E1-7',  label:'Vulnerabilità a eventi climatici estremi', subtopic:'Adattamento',  desc:'Danni da alluvioni, siccità, ondate di calore, interruzioni produttive.' },
    { id:'E1-8',  label:'Rischio fisico da cambiamento climatico',  subtopic:'Adattamento',  desc:'Impatto cronico (variazioni temperature, precipitazioni) su operazioni.' },
    { id:'E1-9',  label:'Carbon footprint di prodotti / servizi',   subtopic:'Mitigazione',  desc:'Emissioni incorporate nei prodotti venduti lungo il ciclo di vita.' },
  ],

  E2: [
    { id:'E2-1',  label:'Emissioni di inquinanti in aria (NOx, SOx, PM)', subtopic:"Inquinamento dell'aria", desc:'Emissioni da processi di combustione, verniciatura, solventi.' },
    { id:'E2-2',  label:'Composti organici volatili (COV)',          subtopic:"Inquinamento dell'aria", desc:'Emissioni da solventi, vernici, adesivi, processi chimici.' },
    { id:'E2-3',  label:'Scarichi di acque reflue',                  subtopic:'Inquinamento delle acque', desc:'Reflui industriali con sostanze inquinanti in corpi idrici o fognatura.' },
    { id:'E2-4',  label:'Contaminazione del suolo',                  subtopic:'Inquinamento del suolo', desc:'Sversamenti accidentali, depositi interrati, attività estrattive.' },
    { id:'E2-5',  label:'Uso di sostanze chimiche pericolose (SVHC)',subtopic:'Sostanze preoccupanti', desc:'Utilizzo di sostanze REACH/CLP, biocidi, pesticidi.' },
    { id:'E2-6',  label:'Gestione refrigeranti (HFC/CFC)',           subtopic:'Sostanze preoccupanti', desc:'Perdite di gas refrigeranti ad alto GWP da impianti di condizionamento.' },
    { id:'E2-7',  label:'Generazione di microplastiche',             subtopic:'Microplastiche',  desc:'Rilascio di microplastiche da produzione, usura, lavaggio tessuti.' },
    { id:'E2-8',  label:'Rumore, vibrazioni, odori',                 subtopic:"Inquinamento dell'aria", desc:'Impatti su comunità circostanti da operazioni industriali.' },
  ],

  E3: [
    { id:'E3-1',  label:'Prelievo da bacini idrici in stress idrico', subtopic:'Acque', desc:'Estrazione in zone con scarsità idrica certificata (WRI Aqueduct).' },
    { id:'E3-2',  label:'Alto consumo di acqua nei processi',         subtopic:'Acque', desc:'Consumo intensivo di acqua per raffreddamento, pulizia, produzione.' },
    { id:'E3-3',  label:'Qualità delle acque di scarico',             subtopic:'Acque', desc:'Parametri chimici, biologici, termici degli scarichi idrici.' },
    { id:'E3-4',  label:'Impatti su ecosistemi acquatici',            subtopic:'Ecosistemi marini', desc:'Alterazione di habitat fluviali, lacustri, marini da scarichi o prelievi.' },
    { id:'E3-5',  label:'Alterazione del ciclo idrologico',           subtopic:'Acque', desc:'Impermeabilizzazione, drenaggio, modifiche alla falda freatica.' },
  ],

  E4: [
    { id:'E4-1',  label:'Consumo di suolo e impermeabilizzazione',   subtopic:'Cause dirette', desc:'Espansione edificata, parcheggi, strade che riducono la permeabilità.' },
    { id:'E4-2',  label:'Frammentazione degli habitat naturali',      subtopic:'Cause dirette', desc:'Infrastrutture che interrompono la connettività ecologica.' },
    { id:'E4-3',  label:'Impatti su specie protette o a rischio',     subtopic:'Impatti su specie', desc:'Perturbazione diretta di fauna e flora in Rete Natura 2000 o IUCN.' },
    { id:'E4-4',  label:'Introduzione di specie aliene invasive',     subtopic:'Cause dirette', desc:'Rischio di invasione biologica da logistica, commercio, produzione.' },
    { id:'E4-5',  label:'Deforestazione o degrado foreste',           subtopic:'Cause dirette', desc:'Acquisto di materie prime (soia, palma, cacao, legno) a rischio deforestazione.' },
    { id:'E4-6',  label:'Fertilizzanti e pesticidi dannosi',          subtopic:'Impatti su specie', desc:'Eutrofizzazione, moria di insetti impollinatori, contaminazione del suolo.' },
  ],

  E5: [
    { id:'E5-1',  label:'Consumo elevato di materie prime vergini',  subtopic:'Risorse in entrata', desc:'Dipendenza da risorse non rinnovabili (minerali critici, plastiche, legno vergine).' },
    { id:'E5-2',  label:'Basso tasso di utilizzo di materiali riciclati', subtopic:'Risorse in entrata', desc:'Produzione basata su materie prime invece di secondary materials.' },
    { id:'E5-3',  label:'Generazione di rifiuti pericolosi',          subtopic:'Deflussi: rifiuti', desc:'Rifiuti contenenti sostanze tossiche, cancerogene o eco-tossiche.' },
    { id:'E5-4',  label:'Generazione di rifiuti non pericolosi',      subtopic:'Deflussi: rifiuti', desc:'Rifiuti di imballaggio, scarti di produzione, RAEE.' },
    { id:'E5-5',  label:'Packaging non riciclabile o non riutilizzabile', subtopic:'Deflussi: prodotti', desc:'Imballaggi multi-materiale, plastiche miste, non conformi a direttiva SUP.' },
    { id:'E5-6',  label:'Breve vita utile dei prodotti (obsolescenza)', subtopic:'Deflussi: prodotti', desc:'Design non orientato alla durabilità, riparabilità, modularità.' },
    { id:'E5-7',  label:'Basso recupero e riciclo degli scarti',      subtopic:'Deflussi: rifiuti', desc:'Assenza di filiere di recupero, smaltimento in discarica o incenerimento.' },
  ],

  S1: [
    { id:'S1-1',  label:'Retribuzione non equa o sotto living wage',  subtopic:'Condizioni di lavoro', desc:'Salari inferiori al costo della vita nella regione di operazione.' },
    { id:'S1-2',  label:'Divario retributivo di genere',              subtopic:'Parità di trattamento', desc:'Gap salariale non giustificato tra donne e uomini a parità di ruolo.' },
    { id:'S1-3',  label:'Incidenti e infortuni sul lavoro',           subtopic:'Condizioni di lavoro', desc:'Tasso di infortuni, malattie professionali, near miss.' },
    { id:'S1-4',  label:'Stress lavoro-correlato e burnout',          subtopic:'Condizioni di lavoro', desc:'Carichi eccessivi, pressione, assenza di supporto psicologico.' },
    { id:'S1-5',  label:'Orario di lavoro eccessivo',                 subtopic:'Condizioni di lavoro', desc:'Straordinari non retribuiti, turni lunghi, mancato rispetto riposo.' },
    { id:'S1-6',  label:'Discriminazione (genere, età, origine, disabilità)', subtopic:'Parità di trattamento', desc:'Episodi di discriminazione nell\'accesso a promozioni, formazione, stipendi.' },
    { id:'S1-7',  label:'Assenza di libertà sindacale',               subtopic:'Altri diritti', desc:'Ostacoli alla rappresentanza sindacale o alla contrattazione collettiva.' },
    { id:'S1-8',  label:'Insufficiente formazione e sviluppo',        subtopic:'Condizioni di lavoro', desc:'Basso investimento in upskilling, reskilling, aggiornamento professionale.' },
    { id:'S1-9',  label:'Bassa presenza di donne in posizioni dirigenziali', subtopic:'Parità di trattamento', desc:'Soffitto di cristallo, gap di genere nei ruoli apicali.' },
    { id:'S1-10', label:'Utilizzo eccessivo di contratti precari',    subtopic:'Condizioni di lavoro', desc:'Abuso di contratti a tempo determinato, interinale, collaborazioni.' },
  ],

  S2: [
    { id:'S2-1',  label:'Lavoro minorile nella catena di fornitura',  subtopic:'Condizioni di lavoro', desc:'Utilizzo di minori in attività pericolose o che interferiscono con istruzione.' },
    { id:'S2-2',  label:'Lavoro forzato o schiavitù moderna',         subtopic:'Diritti fondamentali', desc:'Pratiche di bonded labour, traffico di esseri umani, servitù da debiti.' },
    { id:'S2-3',  label:'Condizioni di lavoro degradanti nei fornitori', subtopic:'Condizioni di lavoro', desc:'Ambienti insicuri, mancanza di DPI, orari eccessivi nei fornitori.' },
    { id:'S2-4',  label:'Mancanza di salario adeguato nei fornitori', subtopic:'Condizioni di lavoro', desc:'Fornitori che pagano sotto il minimo legale o living wage locale.' },
    { id:'S2-5',  label:'Assenza di audit e due diligence fornitori', subtopic:'Diritti fondamentali', desc:'Mancato controllo delle pratiche sociali e dei diritti umani nella filiera.' },
  ],

  S3: [
    { id:'S3-1',  label:'Impatti negativi sull\'economia locale',     subtopic:'Impatti economici', desc:'Delocalizzazione, chiusura stabilimenti, riduzione di occupazione locale.' },
    { id:'S3-2',  label:'Limitazione accesso a risorse naturali',     subtopic:'Diritti civili', desc:'Attività che riducono l\'accesso delle comunità ad acqua, terra, foreste.' },
    { id:'S3-3',  label:'Violazione diritti di comunità indigene',    subtopic:'Diritti indigeni', desc:'Operazioni in territori indigeni senza FPIC (Free, Prior and Informed Consent).' },
    { id:'S3-4',  label:'Impatto acustico e ambientale su comunità',  subtopic:'Impatti economici', desc:'Rumore, polveri, traffico da impianti produttivi in aree abitate.' },
  ],

  S4: [
    { id:'S4-1',  label:'Sicurezza di prodotti e servizi',            subtopic:"Impatti correlati all'informazione", desc:'Rischi per la salute fisica degli utenti da difetti di progettazione o produzione.' },
    { id:'S4-2',  label:'Violazione della privacy e dati personali',  subtopic:'Privacy', desc:'Data breach, profilazione non autorizzata, raccolta eccessiva di dati.' },
    { id:'S4-3',  label:'Marketing ingannevole o greenwashing',       subtopic:"Impatti correlati all'informazione", desc:'Pubblicità false o fuorvianti su caratteristiche ambientali e sociali.' },
    { id:'S4-4',  label:'Inaccessibilità per persone con disabilità', subtopic:'Sicurezza personale', desc:'Prodotti/servizi non inclusivi, assenza di design for all.' },
    { id:'S4-5',  label:'Impatto sulla salute mentale degli utenti',  subtopic:'Sicurezza personale', desc:'Piattaforme digitali con pattern addictivi, algoritmi dannosi.' },
  ],

  G1: [
    { id:'G1-1',  label:'Corruzione e concussione',                   subtopic:'Corruzione e concussione', desc:'Pagamenti illeciti, facilitazioni, corruzione nella pubblica amministrazione.' },
    { id:'G1-2',  label:'Pratiche anticoncorrenziali',                subtopic:'Cultura aziendale e etica', desc:'Cartelli, accordi di prezzo, abuso di posizione dominante.' },
    { id:'G1-3',  label:'Evasione / elusione fiscale aggressiva',     subtopic:'Cultura aziendale e etica', desc:'Utilizzo di strutture offshore, transfer pricing aggressivo.' },
    { id:'G1-4',  label:'Assenza di protezione per i whistleblower',  subtopic:'Cultura aziendale e etica', desc:'Mancanza di canali sicuri per la segnalazione di irregolarità.' },
    { id:'G1-5',  label:'Gestione non etica dei fornitori',           subtopic:'Gestione relazioni fornitori', desc:'Pagamenti ritardati, clausole unfair, abuso di potere contrattuale.' },
    { id:'G1-6',  label:'Lobby e influenza politica non trasparente', subtopic:'Lobby e impegno politico', desc:'Finanziamenti politici, lobbying non dichiarato, revolving door.' },
    { id:'G1-7',  label:'Carenze nella governance e supervisione',    subtopic:'Cultura aziendale e etica', desc:'Assenza di board indipendente, conflitti di interesse, controllo inadeguato.' },
  ],
};

/* ══════════════════════════════════════════════════════════
   STRUTTURA ESRS TOPICS (navigazione sidebar)
══════════════════════════════════════════════════════════ */
const ESRS_TOPICS = {
  E: {
    label: 'Ambiente', icon: '🌿',
    color: '#22d06a', bg: 'var(--green-bg)', accent: '#22d06a',
    topics: [
      { id:'E1', label:'Cambiamenti climatici',      short:'Clima',      subtopics:['Mitigazione','Adattamento','Energia'] },
      { id:'E2', label:'Inquinamento',               short:'Inquin.',    subtopics:["Aria",'Acque','Suolo','Sostanze pericolose','Microplastiche'] },
      { id:'E3', label:'Risorse idriche e marine',   short:'Acqua',      subtopics:['Acque','Ecosistemi marini'] },
      { id:'E4', label:'Biodiversità ed ecosistemi', short:'Biodiv.',    subtopics:['Cause dirette','Impatti su specie'] },
      { id:'E5', label:'Economia circolare',         short:'Circolare',  subtopics:['Risorse in entrata','Deflussi e rifiuti'] },
    ]
  },
  S: {
    label: 'Sociale', icon: '👥',
    color: '#60a5fa', bg: 'var(--blue-l)', accent: '#60a5fa',
    topics: [
      { id:'S1', label:'Forza lavoro propria',              short:'Personale',  subtopics:['Condizioni di lavoro','Parità','Diritti'] },
      { id:'S2', label:'Lavoratori nella catena del valore',short:'Filiera',    subtopics:['Condizioni','Diritti fondamentali'] },
      { id:'S3', label:'Comunità colpite',                  short:'Comunità',   subtopics:['Impatti econ.','Diritti civili'] },
      { id:'S4', label:'Consumatori e utenti',              short:'Clienti',    subtopics:['Info e privacy','Sicurezza'] },
    ]
  },
  G: {
    label: 'Governance', icon: '⚖️',
    color: '#fb923c', bg: 'var(--orange-l)', accent: '#fb923c',
    topics: [
      { id:'G1', label:'Condotta aziendale', short:'Governance', subtopics:['Etica','Fornitori','Corruzione','Lobby'] },
    ]
  }
};

/* ══════════════════════════════════════════════════════════
   MAPPING VSME MODULI E GRI STANDARDS
══════════════════════════════════════════════════════════ */
const VSME_MODULES = {
  B: {
    code:'B', name:'Informazioni generali e governance',
    desc:'Business model, strategia, obiettivi ESG, struttura governance.',
    always: true, // sempre richiesto
    color:'#64748b',
  },
  C: {
    code:'C', name:'Cambiamenti climatici (Energia & GHG)',
    desc:'Consumo energetico, emissioni Scope 1/2/3, target di riduzione.',
    triggers:['E1'], color:'#22d06a',
    ghgRequired: true,
  },
  D: {
    code:'D', name:'Inquinamento',
    desc:'Emissioni in aria, acqua, suolo; sostanze pericolose.',
    triggers:['E2'], color:'#f59e0b',
  },
  E: {
    code:'E', name:'Acqua e risorse marine',
    desc:'Prelievo idrico, scarichi, impatti ecosistemi acquatici.',
    triggers:['E3'], color:'#3b82f6',
  },
  F: {
    code:'F', name:'Biodiversità ed ecosistemi',
    desc:'Uso del suolo, habitat, specie, deforestazione.',
    triggers:['E4'], color:'#10b981',
  },
  G: {
    code:'G', name:'Economia circolare',
    desc:'Materiali, rifiuti, packaging, ciclo di vita prodotti.',
    triggers:['E5'], color:'#8b5cf6',
  },
  H: {
    code:'H', name:'Forza lavoro propria',
    desc:'Salute e sicurezza, diversità, formazione, retribuzione equa.',
    triggers:['S1'], color:'#ec4899',
  },
  I: {
    code:'I', name:'Lavoratori e comunità nella catena del valore',
    desc:'Due diligence fornitori, impatto su comunità, diritti umani.',
    triggers:['S2','S3'], color:'#f97316',
  },
  J: {
    code:'J', name:'Consumatori e utenti finali',
    desc:'Sicurezza prodotti, privacy, informazione corretta.',
    triggers:['S4'], color:'#06b6d4',
  },
  K: {
    code:'K', name:'Condotta aziendale e governance',
    desc:'Anti-corruzione, concorrenza, fiscalità, whistleblowing.',
    triggers:['G1'], color:'#d97706',
  },
};

const GRI_STANDARDS = {
  'GRI 2':   { name:'GRI 2 — Informazioni generali', topics:[], always:true, color:'#64748b' },
  'GRI 302': { name:'GRI 302 — Energia',         topics:['E1'], color:'#22d06a', ghgRequired:true },
  'GRI 305': { name:'GRI 305 — Emissioni GHG',   topics:['E1','E2'], color:'#22d06a', ghgRequired:true },
  'GRI 303': { name:'GRI 303 — Acqua e scarichi', topics:['E3'], color:'#3b82f6' },
  'GRI 304': { name:'GRI 304 — Biodiversità',    topics:['E4'], color:'#10b981' },
  'GRI 301': { name:'GRI 301 — Materiali',       topics:['E5'], color:'#8b5cf6' },
  'GRI 306': { name:'GRI 306 — Rifiuti',         topics:['E2','E5'], color:'#f59e0b' },
  'GRI 403': { name:'GRI 403 — Salute e sicurezza', topics:['S1'], color:'#ec4899' },
  'GRI 401': { name:'GRI 401 — Occupazione',     topics:['S1'], color:'#ec4899' },
  'GRI 404': { name:'GRI 404 — Formazione',      topics:['S1'], color:'#ec4899' },
  'GRI 405': { name:'GRI 405 — Diversità e pari opportunità', topics:['S1'], color:'#ec4899' },
  'GRI 408': { name:'GRI 408 — Lavoro minorile', topics:['S2'], color:'#f97316' },
  'GRI 409': { name:'GRI 409 — Lavoro forzato',  topics:['S2'], color:'#f97316' },
  'GRI 414': { name:'GRI 414 — Valutazione sociale fornitori', topics:['S2','S3'], color:'#f97316' },
  'GRI 413': { name:'GRI 413 — Comunità locali', topics:['S3'], color:'#06b6d4' },
  'GRI 416': { name:'GRI 416 — Salute clienti',  topics:['S4'], color:'#06b6d4' },
  'GRI 418': { name:'GRI 418 — Privacy clienti', topics:['S4'], color:'#06b6d4' },
  'GRI 205': { name:'GRI 205 — Anti-corruzione', topics:['G1'], color:'#d97706' },
  'GRI 206': { name:'GRI 206 — Concorrenza sleale', topics:['G1'], color:'#d97706' },
  'GRI 207': { name:'GRI 207 — Fiscalità',       topics:['G1'], color:'#d97706' },
};

/* ══════════════════════════════════════════════════════════
   STATO MODULO
══════════════════════════════════════════════════════════ */
const _matState = {
  phase: 1,           // 1=materialità, 2=standard, 3=riepilogo
  activeTopic: 'E1',
  // Per ogni impact id: { active, nature, scale, scope, irremediability, likelihood }
  selected: {},
  // Rischi finanziario: { topicId: [ { type, name, probability, magnitude, horizon } ] }
  finRisks: {},
  // Topics marcati materiali (calcolato automaticamente)
  materialTopics: [],
  // Standard scelto nella fase 2
  chosenStandard: null, // 'vsme' | 'gri'
  // Moduli attivi per standard
  activeModules: [],    // es. ['B','C','H'] per VSME o ['GRI 2','GRI 302'] per GRI
  dirty: false,
  loaded: false,
};

/* ══════════════════════════════════════════════════════════
   CALCOLO MATERIALITÀ
   Score = scale × scope × irremediability (neg.) | × likelihood (pos.)
   Soglia materiale: score ≥ 8 su 64 (12.5%)
══════════════════════════════════════════════════════════ */
const MAT_THRESHOLD = 8;

function _calcScore(sel) {
  if (!sel || !sel.active) return 0;
  const sc = Number(sel.scale    || 1);
  const sp = Number(sel.scope    || 1);
  const ir = Number(sel.nature === 'positive' ? (sel.likelihood || 1) : (sel.irremediability || 1));
  return sc * sp * ir;
}

function _isMaterial(impactId) {
  const s = _matState.selected[impactId];
  return s && s.active && _calcScore(s) >= MAT_THRESHOLD;
}

function _getMaterialTopics() {
  const mat = new Set();
  Object.entries(IMPACT_LIBRARY).forEach(([topicId, impacts]) => {
    impacts.forEach(imp => {
      if (_isMaterial(imp.id)) mat.add(topicId);
    });
  });
  return [...mat];
}

function _countActive(topicId) {
  return (IMPACT_LIBRARY[topicId] || []).filter(i => _matState.selected[i.id]?.active).length;
}

function _countMaterial(topicId) {
  return (IMPACT_LIBRARY[topicId] || []).filter(i => _isMaterial(i.id)).length;
}

function _pillarOf(id) { return id.charAt(0); }
function _topicDef(id) {
  const p = _pillarOf(id);
  return ESRS_TOPICS[p]?.topics?.find(t => t.id === id);
}

/* ══════════════════════════════════════════════════════════
   RENDER PRINCIPALE
══════════════════════════════════════════════════════════ */
function matRenderScreen() {
  const container = document.getElementById('screen-materiality');
  if (!container) return;
  const c = (typeof currentClient === 'function') ? currentClient() : null;

  // DMA è accessibile a tutti i piani — nessun gate qui

  container.innerHTML = `
    ${_renderPhaseBar()}
    <div id="mat-phase-1" style="${_matState.phase !== 1 ? 'display:none' : ''}">
      ${_renderPhase1()}
    </div>
    <div id="mat-phase-2" style="${_matState.phase !== 2 ? 'display:none' : ''}">
      ${_renderPhase2()}
    </div>
    <div id="mat-phase-3" style="${_matState.phase !== 3 ? 'display:none' : ''}">
      ${_renderPhase3()}
    </div>`;

  _updateSidebarActive();
  _updatePhaseCounts();
}

/* ── PHASE BAR ──────────────────────────────────────────── */
function _renderPhaseBar() {
  const phases = [
    { n:1, label:'Analisi Materialità',   icon:'⚡', desc:'Identifica impatti rilevanti' },
    { n:2, label:'Scelta Standard',       icon:'📋', desc:'VSME o GRI, moduli applicabili' },
    { n:3, label:'GHG & Report',          icon:'📊', desc:'Calcola emissioni e genera report' },
  ];
  return `
    <div class="mat-phase-bar">
      ${phases.map((ph, i) => `
        <div class="mat-phase-step ${_matState.phase === ph.n ? 'active' : (_matState.phase > ph.n ? 'done' : '')}"
             onclick="materialityModule.goPhase(${ph.n})" title="${ph.desc}">
          <div class="mat-phase-icon">${_matState.phase > ph.n ? '✓' : ph.icon}</div>
          <div class="mat-phase-label">${ph.label}</div>
          <div class="mat-phase-desc">${ph.desc}</div>
        </div>
        ${i < phases.length - 1 ? '<div class="mat-phase-arrow">›</div>' : ''}
      `).join('')}
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   FASE 1 — ANALISI MATERIALITÀ
══════════════════════════════════════════════════════════ */
function _renderPhase1() {
  const matTopics = _getMaterialTopics();
  const totalActive = Object.values(_matState.selected).filter(s => s.active).length;

  return `
    <div class="mat-phase1-wrap">
      <!-- HEADER FASE 1 -->
      <div class="mat-header">
        <div class="mat-header-left">
          <div class="mat-title">Analisi Doppia Materialità ESRS</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:4px">
            Seleziona gli impatti rilevanti per la tua azienda e valutane la materialità con lo scoring EFRAG
          </div>
        </div>
        <div class="mat-header-actions">
          <button class="btn btn-outline btn-sm" onclick="materialityModule.load()">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Ricarica
          </button>
          <button class="btn btn-outline btn-sm" onclick="materialityModule.save()">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            Salva
          </button>
          <button class="btn btn-primary btn-sm" onclick="materialityModule.goPhase(2)" ${matTopics.length === 0 ? 'disabled title="Seleziona almeno un impatto materiale"' : ''}>
            Fase 2: Scegli standard →
          </button>
        </div>
      </div>

      <!-- STATS ROW -->
      <div class="mat-stats-row">
        <div class="mat-stat-chip"><span class="mat-stat-n" id="msc-active">${totalActive}</span><span class="mat-stat-l">Impatti valutati</span></div>
        <div class="mat-stat-chip mat-stat-chip-green"><span class="mat-stat-n" id="msc-material">${matTopics.length}</span><span class="mat-stat-l">Topic materiali</span></div>
        <div class="mat-stat-chip"><span class="mat-stat-n" id="msc-topics">10</span><span class="mat-stat-l">Topic ESRS totali</span></div>
      </div>

      <!-- BODY: SIDEBAR + DETAIL -->
      <div class="mat-body">
        <aside class="mat-sidebar" id="mat-sidebar">
          ${_renderSidebar1()}
        </aside>
        <div class="mat-detail" id="mat-detail">
          ${_renderImpactDetail(_matState.activeTopic)}
        </div>
      </div>
    </div>`;
}

function _renderSidebar1() {
  let html = '';
  Object.entries(ESRS_TOPICS).forEach(([pk, pillar]) => {
    html += `
      <div class="mat-pillar">
        <div class="mat-pillar-header">
          <span style="font-size:14px">${pillar.icon}</span>
          <span style="color:${pillar.color};font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.08em">${pk} — ${pillar.label}</span>
        </div>
        <ul class="mat-topic-list">`;
    pillar.topics.forEach(t => {
      const active   = _countActive(t.id);
      const material = _countMaterial(t.id);
      const isMat    = material > 0;
      html += `
          <li class="mat-topic-item" id="mat-nav-${t.id}" onclick="materialityModule.selectTopic('${t.id}')">
            <span class="mat-topic-id" style="color:${pillar.color}">${t.id}</span>
            <span class="mat-topic-lbl">${t.label}</span>
            <div style="display:flex;gap:4px;align-items:center;margin-left:auto">
              ${active > 0 ? `<span class="mat-topic-count mat-count-has" id="mat-count-${t.id}">${active}</span>` : `<span class="mat-topic-count" id="mat-count-${t.id}">0</span>`}
              ${isMat ? `<span style="font-size:9px;background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);border-radius:4px;padding:1px 5px;font-weight:700">MAT</span>` : ''}
            </div>
          </li>`;
    });
    html += `</ul></div>`;
  });
  return html;
}

function _renderImpactDetail(topicId) {
  const pillarKey = _pillarOf(topicId);
  const pillar    = ESRS_TOPICS[pillarKey];
  const topic     = _topicDef(topicId);
  if (!topic || !pillar) return '<div class="mat-empty">Seleziona un topic.</div>';

  const impacts    = IMPACT_LIBRARY[topicId] || [];
  const matCount   = _countMaterial(topicId);
  const activeCount = _countActive(topicId);

  return `
    <div class="mat-detail-header">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div>
          <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:${pillar.color};margin-bottom:3px">${topicId} · ${pillar.label}</div>
          <div style="font-size:17px;font-weight:700;color:var(--text)">${topic.label}</div>
          <div style="font-size:12.5px;color:var(--text-3);margin-top:4px">
            ${impacts.length} impatti disponibili nella libreria EFRAG
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          ${matCount > 0 ? `<span style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700">${matCount} materiali ⚡</span>` : ''}
          ${activeCount > 0 ? `<span style="background:var(--surface);color:var(--text-2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600">${activeCount} valutati</span>` : ''}
        </div>
      </div>
    </div>

    <div class="mat-panel-section">
      <div class="mat-panel-label" style="margin-bottom:12px">
        Libreria impatti ESRS — seleziona quelli applicabili e valutane la materialità
      </div>

      <div style="display:flex;flex-direction:column;gap:10px">
        ${impacts.map(imp => _renderImpactCard(imp, pillar, topicId)).join('')}
      </div>

      <!-- SCORING LEGEND -->
      <div class="mat-scoring-legend">
        <div style="font-size:11px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Come funziona lo scoring EFRAG</div>
        <div class="mat-legend-grid">
          <div class="mat-legend-item"><span class="mat-legend-dot" style="background:var(--green)"></span><strong>Scala</strong>: quanto è grave l'impatto</div>
          <div class="mat-legend-item"><span class="mat-legend-dot" style="background:var(--blue)"></span><strong>Perimetro</strong>: quante persone/ecosistemi coinvolge</div>
          <div class="mat-legend-item"><span class="mat-legend-dot" style="background:var(--orange)"></span><strong>Irrimediabilità</strong>: quanto è difficile rimediare (neg.) o probabilità (pos.)</div>
          <div class="mat-legend-item"><span class="mat-legend-dot" style="background:#a78bfa"></span><strong>Soglia materiale</strong>: score ≥ 8/64</div>
        </div>
      </div>
    </div>`;
}

function _renderImpactCard(imp, pillar, topicId) {
  const sel = _matState.selected[imp.id] || {};
  const active = !!sel.active;
  const score  = active ? _calcScore(sel) : 0;
  const mat    = active && score >= MAT_THRESHOLD;
  const pct    = Math.round((score / 64) * 100);

  const scaleOpts    = [[1,'Limitata'],[2,'Moderata'],[3,'Significativa'],[4,'Molto alta']];
  const scopeOpts    = [[1,'Locale'],[2,'Regionale'],[3,'Nazionale'],[4,'Globale']];
  const irremOpts    = [[1,'Bassa'],[2,'Media'],[3,'Alta'],[4,'Molto alta / Irreversibile']];
  const likelOpts    = [[1,'Improbabile'],[2,'Possibile'],[3,'Probabile'],[4,'Quasi certo']];

  const isPositive = sel.nature === 'positive';

  const mkSelect = (field, opts, val, label) => `
    <div>
      <label class="mat-label">${label}</label>
      <select class="mat-select mat-select-sm" onchange="materialityModule.updateSelected('${imp.id}','${field}',+this.value)" ${!active ? 'disabled' : ''}>
        ${opts.map(([v, l]) => `<option value="${v}" ${+val === v ? 'selected' : ''}>${v} — ${l}</option>`).join('')}
      </select>
    </div>`;

  return `
    <div class="mat-impact-card ${active ? 'active' : ''} ${mat ? 'material' : ''}" id="mic-${imp.id}">
      <div class="mat-impact-card-header">
        <label class="mat-impact-toggle">
          <input type="checkbox" ${active ? 'checked' : ''}
            onchange="materialityModule.toggleImpact('${imp.id}', this.checked)">
          <span class="mat-impact-toggle-box"></span>
        </label>
        <div class="mat-impact-card-info">
          <div class="mat-impact-card-name">${imp.label}</div>
          <div class="mat-impact-card-desc">${imp.desc}</div>
        </div>
        <div class="mat-impact-card-badges">
          <span class="mat-subtopic-tag" style="border-color:${pillar.color}20;color:${pillar.color}">${imp.subtopic}</span>
          ${active ? `
            <span class="mat-score-badge ${mat ? 'mat-score-material' : (score >= 4 ? 'mat-score-medium' : 'mat-score-low')}">
              ${mat ? '⚡' : '◦'} ${score}/64
            </span>` : ''}
        </div>
      </div>

      ${active ? `
        <div class="mat-impact-card-body">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
            <label class="mat-radio mat-inline-radio">
              <input type="radio" name="nat-${imp.id}" value="negative"
                ${!isPositive ? 'checked' : ''}
                onchange="materialityModule.updateSelected('${imp.id}','nature','negative');materialityModule.refreshDetail()">
              <span>Negativo</span>
            </label>
            <label class="mat-radio mat-inline-radio">
              <input type="radio" name="nat-${imp.id}" value="positive"
                ${isPositive ? 'checked' : ''}
                onchange="materialityModule.updateSelected('${imp.id}','nature','positive');materialityModule.refreshDetail()">
              <span>Positivo</span>
            </label>
            <label class="mat-radio mat-inline-radio">
              <input type="radio" name="nat-${imp.id}" value="potential"
                ${sel.nature === 'potential' ? 'checked' : ''}
                onchange="materialityModule.updateSelected('${imp.id}','nature','potential');materialityModule.refreshDetail()">
              <span>Potenziale</span>
            </label>
          </div>

          <div class="mat-score-row">
            ${mkSelect('scale', scaleOpts, sel.scale || 1, '📏 Scala')}
            ${mkSelect('scope', scopeOpts, sel.scope || 1, '🌐 Perimetro')}
            ${isPositive
              ? mkSelect('likelihood', likelOpts, sel.likelihood || 1, '🎲 Probabilità')
              : mkSelect('irremediability', irremOpts, sel.irremediability || 1, '🔄 Irrimediabilità')}
            <div style="display:flex;flex-direction:column;justify-content:flex-end">
              <label class="mat-label">Materialità</label>
              <div class="mat-score-display ${mat ? 'mat-score-display-high' : ''}">
                <div class="mat-score-big">${score}<span style="font-size:12px;font-weight:400">/64</span></div>
                <div class="mat-mini-bar"><div class="mat-mini-fill" style="width:${pct}%;background:${mat ? 'var(--green)' : (score >= 4 ? 'var(--orange)' : 'var(--text-4)')}"></div></div>
                ${mat ? '<div style="font-size:10px;color:var(--green);font-weight:700">MATERIALE ⚡</div>' : `<div style="font-size:10px;color:var(--text-3)">soglia: ${MAT_THRESHOLD}</div>`}
              </div>
            </div>
          </div>
        </div>` : ''}
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   FASE 2 — SCELTA STANDARD E MODULI
══════════════════════════════════════════════════════════ */
function _renderPhase2() {
  const matTopics = _getMaterialTopics();
  const c = (typeof currentClient === 'function') ? currentClient() : null;
  const defaultStd = (c && c.std) ? c.std : 'vsme';
  if (!_matState.chosenStandard) _matState.chosenStandard = defaultStd;

  const isVsme = _matState.chosenStandard === 'vsme';

  // Calcola moduli raccomandati
  const recVsme = Object.values(VSME_MODULES).filter(m =>
    m.always || (m.triggers && m.triggers.some(t => matTopics.includes(t)))
  );
  const recGri = Object.values(GRI_STANDARDS).filter(s =>
    s.always || (s.topics && s.topics.some(t => matTopics.includes(t)))
  );

  const needsGhg = matTopics.includes('E1');

  return `
    <div class="mat-phase2-wrap">
      <div class="mat-header">
        <div class="mat-header-left">
          <div class="mat-title">Scelta Standard di Rendicontazione</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:4px">
            Basato sui ${matTopics.length} topic materiali identificati, seleziona lo standard e i moduli da applicare
          </div>
        </div>
        <div class="mat-header-actions">
          <button class="btn btn-outline btn-sm" onclick="materialityModule.goPhase(1)">← Torna alla materialità</button>
          <button class="btn btn-primary btn-sm" onclick="materialityModule.confirmStandard()">
            Conferma e vai a GHG →
          </button>
        </div>
      </div>

      <!-- MATERIAL TOPICS RECAP -->
      <div class="mat-recap-bar">
        <div style="font-size:12px;font-weight:700;color:var(--text-2);margin-bottom:8px">Topic materiali identificati:</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${matTopics.length === 0
            ? '<span style="color:var(--text-3);font-size:13px">Nessun topic materiale — torna alla Fase 1</span>'
            : matTopics.map(tid => {
                const pk = _pillarOf(tid);
                const pl = ESRS_TOPICS[pk];
                const td = _topicDef(tid);
                return `<span class="mat-material-chip" style="border-color:${pl.color}40;color:${pl.color}">
                  ${pl.icon} ${tid} — ${td?.label}
                </span>`;
              }).join('')
          }
        </div>
      </div>

      <!-- SCELTA STANDARD -->
      <div class="mat-std-choice">
        <div class="mat-std-card ${isVsme ? 'selected' : ''}" onclick="materialityModule.setStandard('vsme')">
          <div class="mat-std-card-icon">📘</div>
          <div class="mat-std-card-body">
            <div class="mat-std-card-name">VSME 2023 <span class="mat-std-card-rec">Raccomandato per PMI</span></div>
            <div class="mat-std-card-desc">Standard EFRAG per piccole e medie imprese. Più semplice, proporzionato. Ideale se fatturato &lt; 50M€ o dipendenti &lt; 250.</div>
            <div class="mat-std-card-modules">${recVsme.length} moduli applicabili</div>
          </div>
          ${isVsme ? '<div class="mat-std-check">✓</div>' : ''}
        </div>
        <div class="mat-std-card ${!isVsme ? 'selected' : ''}" onclick="materialityModule.setStandard('gri')">
          <div class="mat-std-card-icon">📗</div>
          <div class="mat-std-card-body">
            <div class="mat-std-card-name">GRI Standards 2021</div>
            <div class="mat-std-card-desc">Framework internazionale più diffuso. Più dettagliato e riconosciuto globalmente da stakeholder e investitori.</div>
            <div class="mat-std-card-modules">${recGri.length} standard applicabili</div>
          </div>
          ${!isVsme ? '<div class="mat-std-check">✓</div>' : ''}
        </div>
      </div>

      <!-- MODULI APPLICABILI -->
      <div class="mat-modules-section">
        <div class="mat-modules-title">
          ${isVsme ? 'Moduli VSME applicabili' : 'Standard GRI applicabili'}
          <span style="font-size:12px;font-weight:400;color:var(--text-3)">Deseleziona quelli non rilevanti</span>
        </div>

        <div class="mat-modules-grid" id="mat-modules-grid">
          ${isVsme ? recVsme.map(m => _renderVsmeModule(m, matTopics)).join('') : recGri.map(s => _renderGriStandard(s, matTopics)).join('')}
        </div>

        ${needsGhg ? `
          <div class="mat-ghg-alert">
            <span style="font-size:18px">⚡</span>
            <div>
              <strong>Il topic E1 (Cambiamenti climatici) è materiale</strong> — il calcolo GHG Scope 1/2/3 è obbligatorio.
              <div style="font-size:12px;margin-top:2px;color:var(--text-3)">Nella fase successiva potrai inserire i dati di consumo energia e attività.</div>
            </div>
          </div>` : ''}
      </div>
    </div>`;
}

function _renderVsmeModule(m, matTopics) {
  const isRequired = m.always;
  const isActive = _matState.activeModules.length === 0
    ? true  // default all selected
    : _matState.activeModules.includes(m.code);

  const triggeredBy = (m.triggers || []).filter(t => matTopics.includes(t));

  return `
    <div class="mat-module-card ${isRequired ? 'required' : ''} ${isActive ? 'active' : ''}"
         onclick="${isRequired ? '' : `materialityModule.toggleModule('${m.code}')`}"
         style="${isRequired ? 'cursor:default' : 'cursor:pointer'}">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div class="mat-module-letter" style="background:${m.color}20;color:${m.color};border:1px solid ${m.color}40">${m.code}</div>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:700;margin-bottom:3px">${m.name}</div>
          <div style="font-size:12px;color:var(--text-2);line-height:1.5">${m.desc}</div>
          <div style="display:flex;gap:6px;margin-top:7px;flex-wrap:wrap">
            ${isRequired ? '<span class="mat-module-tag mat-module-tag-req">Sempre richiesto</span>' : ''}
            ${triggeredBy.map(t => `<span class="mat-module-tag" style="border-color:${m.color}30;color:${m.color}">${t}</span>`).join('')}
            ${m.ghgRequired ? '<span class="mat-module-tag mat-module-tag-ghg">Richiede calcolo GHG</span>' : ''}
          </div>
        </div>
        ${!isRequired ? `<div class="mat-module-check" style="${isActive ? '' : 'opacity:0.2'}">${isActive ? '✓' : '○'}</div>` : ''}
      </div>
    </div>`;
}

function _renderGriStandard(s, matTopics) {
  const isRequired = s.always;
  const isActive = _matState.activeModules.length === 0
    ? true
    : _matState.activeModules.includes(s.name.split(' — ')[0].trim());
  const key = Object.keys(GRI_STANDARDS).find(k => GRI_STANDARDS[k] === s);
  const triggeredBy = (s.topics || []).filter(t => matTopics.includes(t));

  return `
    <div class="mat-module-card ${isRequired ? 'required' : ''} ${isActive ? 'active' : ''}"
         onclick="${isRequired ? '' : `materialityModule.toggleModule('${key}')`}"
         style="${isRequired ? 'cursor:default' : 'cursor:pointer'}">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div class="mat-module-letter" style="background:${s.color}20;color:${s.color};border:1px solid ${s.color}40;font-size:9px;min-width:38px">${key}</div>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:700;margin-bottom:3px">${s.name}</div>
          <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
            ${isRequired ? '<span class="mat-module-tag mat-module-tag-req">Sempre richiesto</span>' : ''}
            ${triggeredBy.map(t => `<span class="mat-module-tag" style="border-color:${s.color}30;color:${s.color}">${t}</span>`).join('')}
            ${s.ghgRequired ? '<span class="mat-module-tag mat-module-tag-ghg">Richiede calcolo GHG</span>' : ''}
          </div>
        </div>
        ${!isRequired ? `<div class="mat-module-check" style="${isActive ? '' : 'opacity:0.2'}">${isActive ? '✓' : '○'}</div>` : ''}
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   FASE 3 — RIEPILOGO + CTA GHG / REPORT
══════════════════════════════════════════════════════════ */
function _renderPhase3() {
  const matTopics = _getMaterialTopics();
  const isVsme = _matState.chosenStandard !== 'gri';
  const stdLabel = isVsme ? 'VSME 2023' : 'GRI Standards 2021';

  const allMaterial = Object.entries(IMPACT_LIBRARY).flatMap(([tid, imps]) =>
    imps.filter(i => _isMaterial(i.id)).map(i => ({ ...i, topicId: tid }))
  );

  const activeModules = _matState.activeModules.length > 0
    ? _matState.activeModules
    : (isVsme
        ? Object.values(VSME_MODULES).filter(m => m.always || (m.triggers || []).some(t => matTopics.includes(t))).map(m => m.code)
        : Object.keys(GRI_STANDARDS).filter(k => { const s = GRI_STANDARDS[k]; return s.always || (s.topics || []).some(t => matTopics.includes(t)); })
      );

  const needsGhg = matTopics.includes('E1');

  return `
    <div class="mat-phase3-wrap">
      <div class="mat-header">
        <div class="mat-header-left">
          <div class="mat-title">Riepilogo Materialità & Prossimi Passi</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:4px">
            Analisi completata · Standard selezionato: <strong>${stdLabel}</strong>
          </div>
        </div>
        <div class="mat-header-actions">
          <button class="btn btn-outline btn-sm" onclick="materialityModule.goPhase(2)">← Modifica standard</button>
          <button class="btn btn-primary btn-sm" onclick="materialityModule.save()">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            Salva analisi
          </button>
        </div>
      </div>

      <div class="mat-phase3-grid">
        <!-- IMPATTI MATERIALI -->
        <div class="acard">
          <div class="acard-title">⚡ Impatti materiali (${allMaterial.length})</div>
          ${allMaterial.length === 0
            ? '<div class="mat-empty">Nessun impatto materiale — torna alla Fase 1.</div>'
            : `<div style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto">
                ${allMaterial.map(i => {
                  const pk = _pillarOf(i.topicId);
                  const pl = ESRS_TOPICS[pk];
                  const score = _calcScore(_matState.selected[i.id]);
                  return `<div class="mat-result-row">
                    <span class="mat-result-topic" style="color:${pl.color};border-color:${pl.color}30">${i.topicId}</span>
                    <span class="mat-result-label">${i.label}</span>
                    <span class="mat-result-score">${score}/64</span>
                  </div>`;
                }).join('')}
              </div>`}
        </div>

        <!-- MODULI ATTIVI -->
        <div class="acard">
          <div class="acard-title">📋 ${stdLabel} — moduli da applicare</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${activeModules.map(code => {
              const m = isVsme ? VSME_MODULES[code] : null;
              const g = !isVsme ? GRI_STANDARDS[code] : null;
              const item = m || g;
              if (!item) return '';
              const color = item.color || '#64748b';
              return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;background:var(--surface);border:1px solid var(--border)">
                <div style="width:28px;height:28px;border-radius:6px;background:${color}20;color:${color};border:1px solid ${color}40;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0">${code}</div>
                <div style="font-size:13px;font-weight:600">${item.name}</div>
                ${item.ghgRequired ? '<span style="font-size:10px;background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);border-radius:4px;padding:1px 6px;margin-left:auto">GHG</span>' : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- CTA AZIONI -->
      <div class="mat-cta-bar">
        ${needsGhg ? `
          <div class="mat-cta-card mat-cta-primary" onclick="materialityModule.goToGhg()">
            <div style="font-size:28px;margin-bottom:8px">🌡️</div>
            <div style="font-size:16px;font-weight:700;margin-bottom:4px">Calcola GHG</div>
            <div style="font-size:13px;color:var(--text-2)">E1 è materiale → inserisci i dati energia e calcola le emissioni Scope 1/2/3</div>
            <div class="btn btn-primary" style="margin-top:14px;width:100%;justify-content:center">Vai al calcolo GHG →</div>
          </div>` : ''}
        <div class="mat-cta-card mat-cta-primary" onclick="materialityModule.startQuestionnaire()" style="order:-1">
          <div style="font-size:28px;margin-bottom:8px">📝</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">Compila le Disclosure</div>
          <div style="font-size:13px;color:var(--text-2)">Inserisci i dati ESG per i ${activeModules.length} moduli selezionati — guida passo-passo</div>
          <div class="btn btn-primary" style="margin-top:14px;width:100%;justify-content:center">Inizia il questionario ESG →</div>
        </div>
        <div class="mat-cta-card" onclick="materialityModule.goToReport()">
          <div style="font-size:28px;margin-bottom:8px">📄</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">Genera Report</div>
          <div style="font-size:13px;color:var(--text-2)">Crea il report ${stdLabel} con i ${activeModules.length} moduli selezionati</div>
          <div class="btn btn-outline" style="margin-top:14px;width:100%;justify-content:center">Vai al report →</div>
        </div>
        <div class="mat-cta-card" onclick="materialityModule.exportMatrix()">
          <div style="font-size:28px;margin-bottom:8px">📊</div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">Esporta Matrice</div>
          <div style="font-size:13px;color:var(--text-2)">Scarica la matrice di materialità in CSV per documentazione interna</div>
          <div class="btn btn-outline" style="margin-top:14px;width:100%;justify-content:center">Esporta CSV →</div>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   HELPER
══════════════════════════════════════════════════════════ */
function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _updateSidebarActive() {
  document.querySelectorAll('.mat-topic-item').forEach(el => el.classList.remove('active'));
  const a = document.getElementById('mat-nav-' + _matState.activeTopic);
  if (a) a.classList.add('active');
}

function _updatePhaseCounts() {
  // Update stats chips
  const totalActive = Object.values(_matState.selected).filter(s => s.active).length;
  const matTopics   = _getMaterialTopics().length;
  const nA = document.getElementById('msc-active');
  const nM = document.getElementById('msc-material');
  if (nA) nA.textContent = totalActive;
  if (nM) nM.textContent = matTopics;
}

/* ══════════════════════════════════════════════════════════
   MODULO PUBBLICO
══════════════════════════════════════════════════════════ */
const materialityModule = {

  init() { matRenderScreen(); this.load(); },

  goPhase(n) {
    // Validazione fase
    if (n === 2 && _getMaterialTopics().length === 0 && n > _matState.phase) {
      if (typeof toast === 'function') toast('Seleziona almeno un impatto materiale prima di continuare', 'error');
      return;
    }
    _matState.phase = n;
    matRenderScreen();
  },

  selectTopic(id) {
    _matState.activeTopic = id;
    const detail = document.getElementById('mat-detail');
    if (detail) {
      detail.innerHTML = _renderImpactDetail(id);
    }
    _updateSidebarActive();
  },

  toggleImpact(impId, checked) {
    if (!_matState.selected[impId]) {
      _matState.selected[impId] = { active: false, nature: 'negative', scale:1, scope:1, irremediability:2, likelihood:2 };
    }
    _matState.selected[impId].active = checked;
    _matState.dirty = true;
    this._refreshCard(impId);
    _updatePhaseCounts();
    _updateSidebarActive();
  },

  updateSelected(impId, field, value) {
    if (!_matState.selected[impId]) return;
    _matState.selected[impId][field] = value;
    _matState.dirty = true;
    this._refreshCard(impId);
    _updatePhaseCounts();
    _updateSidebarActive();
  },

  refreshDetail() {
    const detail = document.getElementById('mat-detail');
    if (detail) detail.innerHTML = _renderImpactDetail(_matState.activeTopic);
    _updateSidebarActive();
    _updatePhaseCounts();
  },

  _refreshCard(impId) {
    // Re-render solo la card specifica per performance
    const card = document.getElementById('mic-' + impId);
    if (!card) return;
    const topicId = impId.slice(0, 2);
    const imp = (IMPACT_LIBRARY[topicId] || []).find(i => i.id === impId);
    if (!imp) return;
    const pk = _pillarOf(topicId);
    const pl = ESRS_TOPICS[pk];
    card.outerHTML = _renderImpactCard(imp, pl, topicId);
    _updateSidebarActive();
    _updatePhaseCounts();
  },

  setStandard(std) {
    _matState.chosenStandard = std;
    _matState.activeModules = []; // reset — auto-selezionerà
    const ph2 = document.getElementById('mat-phase-2');
    if (ph2) ph2.innerHTML = _renderPhase2();
  },

  toggleModule(code) {
    if (_matState.activeModules.length === 0) {
      // Prima toggle — popola con tutti i raccomandati meno quello cliccato
      const matTopics = _getMaterialTopics();
      const isVsme = _matState.chosenStandard !== 'gri';
      if (isVsme) {
        _matState.activeModules = Object.values(VSME_MODULES)
          .filter(m => m.always || (m.triggers || []).some(t => matTopics.includes(t)))
          .map(m => m.code)
          .filter(c => c !== code);
      } else {
        _matState.activeModules = Object.keys(GRI_STANDARDS)
          .filter(k => { const s = GRI_STANDARDS[k]; return s.always || (s.topics || []).some(t => matTopics.includes(t)); })
          .filter(k => k !== code);
      }
    } else {
      const idx = _matState.activeModules.indexOf(code);
      if (idx >= 0) _matState.activeModules.splice(idx, 1);
      else _matState.activeModules.push(code);
    }
    const ph2 = document.getElementById('mat-phase-2');
    if (ph2) ph2.innerHTML = _renderPhase2();
  },

  confirmStandard() {
    // Aggiorna il cliente con lo standard scelto
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    if (c) {
      c.std = _matState.chosenStandard;
      if (window.veraAuth && window.veraAuth.getSupabase && window._veraDbClientId) {
        const sb = window.veraAuth.getSupabase();
        sb.from('clients').update({ standard: _matState.chosenStandard }).eq('id', window._veraDbClientId).then(() => {});
      }
    }
    this.save();
    this.goPhase(3);
  },

  goToGhg() {
    if (typeof showScreen === 'function') {
      showScreen('upload', document.getElementById('nav-upload'));
    }
  },

  goToReport() {
    if (typeof showScreen === 'function') {
      showScreen('report', document.getElementById('nav-report'));
    }
  },

  exportMatrix() {
    const matTopics = _getMaterialTopics();
    const allMaterial = Object.entries(IMPACT_LIBRARY).flatMap(([tid, imps]) =>
      imps.filter(i => _isMaterial(i.id)).map(i => {
        const s = _matState.selected[i.id] || {};
        return [tid, i.label, i.subtopic, s.nature || 'negative', s.scale || 1, s.scope || 1, s.irremediability || 1, _calcScore(s)];
      })
    );
    const header = ['Topic ESRS','Impatto','Sub-topic','Natura','Scala (1-4)','Perimetro (1-4)','Irrimediabilità (1-4)','Score materialità'];
    const csv = [header, ...allMaterial].map(row => row.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'VERA-MatriceDouble-Materialita.csv'; a.click();
    if (typeof toast === 'function') toast('Matrice esportata in CSV', 'success');
  },

  startQuestionnaire() {
    const std    = _matState.chosenStandard || 'vsme';
    const sector = (typeof currentClient === 'function' && currentClient())
      ? (currentClient().sector || '') : '';
    if (typeof showScreen === 'function') {
      showScreen('assess', document.getElementById('nav-assess'));
    }
    setTimeout(() => {
      if (typeof typeformQuestionnaire !== 'undefined') {
        typeformQuestionnaire.open(std, sector);
      } else if (typeof questionnaire !== 'undefined') {
        questionnaire.open(std, sector);
      }
    }, 150);
  },

  /* ── SAVE ── */
  async save() {
    const clientId = window._veraDbClientId || null;
    const payload = {
      impacts:      _matState.selected,
      matTopics:    _getMaterialTopics(),
      chosenStd:    _matState.chosenStandard,
      activeModules: _matState.activeModules,
      updatedAt:    new Date().toISOString(),
    };

    if (window.veraAuth?.getSupabase && clientId) {
      try {
        const sb = window.veraAuth.getSupabase();
        await sb.from('materiality_assessments').upsert({
          client_id:    clientId,
          updated_at:   payload.updatedAt,
          impacts_count: Object.values(_matState.selected).filter(s => s.active).length,
          risks_count:  0,
          data_json:    JSON.stringify(payload),
        }, { onConflict: 'client_id' });
        _matState.dirty = false;
        if (typeof toast === 'function') toast('Analisi materialità salvata ✓', 'success');
      } catch (err) {
        console.warn('[mat.save]', err);
        if (typeof toast === 'function') toast('Errore salvataggio: ' + (err.message || err), 'error');
      }
    } else {
      // Offline save
      try { localStorage.setItem('vera_mat_' + (clientId || 'local'), JSON.stringify(payload)); } catch(_) {}
      _matState.dirty = false;
      if (typeof toast === 'function') toast('Dati salvati localmente', 'success');
    }
  },

  /* ── LOAD ── */
  async load() {
    const clientId = window._veraDbClientId || null;

    if (window.veraAuth?.getSupabase && clientId) {
      try {
        const sb = window.veraAuth.getSupabase();
        const { data } = await sb.from('materiality_assessments').select('data_json').eq('client_id', clientId).single();
        if (data?.data_json) {
          const saved = JSON.parse(data.data_json);
          _matState.selected      = saved.impacts       || {};
          _matState.chosenStandard = saved.chosenStd    || null;
          _matState.activeModules  = saved.activeModules || [];
        }
      } catch(e) { console.warn('[mat.load]', e); }
    } else {
      try {
        const raw = localStorage.getItem('vera_mat_' + (clientId || 'local'));
        if (raw) {
          const saved = JSON.parse(raw);
          _matState.selected      = saved.impacts       || {};
          _matState.chosenStandard = saved.chosenStd    || null;
          _matState.activeModules  = saved.activeModules || [];
        }
      } catch(_) {}
    }
    _matState.loaded = true;
    matRenderScreen();
  },
};

/* ══════════════════════════════════════════════════════════
   ESPOSIZIONE GLOBALE
══════════════════════════════════════════════════════════ */
window.materialityModule = materialityModule;
window.ESRS_TOPICS       = ESRS_TOPICS;
window.GRI_STANDARDS     = GRI_STANDARDS;
window.VSME_MODULES      = VSME_MODULES;
window.IMPACT_LIBRARY    = IMPACT_LIBRARY;
/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG — Modulo AI Suggerimenti per Settore
   ║  Appendice a vera-materiality.js
   ╚══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   SECTORS — optgroup structure
══════════════════════════════════════════════════════════ */
const SECTORS = [
  {
    group: 'Manifatturiero',
    sectors: [
      { id: 'food_bev',       label: 'Alimentare e bevande',         ateco: 'C10-C11', icon: '🍽️', group: 'Manifatturiero' },
      { id: 'textile',        label: 'Tessile e moda',               ateco: 'C13-C15', icon: '👕', group: 'Manifatturiero' },
      { id: 'wood_furniture', label: 'Legno, carta e arredo',        ateco: 'C16-C18', icon: '🪑', group: 'Manifatturiero' },
      { id: 'chemical',       label: 'Chimica e farmaceutica',       ateco: 'C20-C21', icon: '⚗️', group: 'Manifatturiero' },
      { id: 'plastic_rubber', label: 'Plastica e gomma',             ateco: 'C22',     icon: '🔶', group: 'Manifatturiero' },
      { id: 'metal_steel',    label: 'Metallurgia e fonderie',       ateco: 'C24-C25', icon: '⚙️', group: 'Manifatturiero' },
      { id: 'machinery',      label: 'Meccanica e macchinari',       ateco: 'C28',     icon: '🔧', group: 'Manifatturiero' },
      { id: 'electronics',    label: 'Elettronica e ICT hardware',   ateco: 'C26-C27', icon: '💻', group: 'Manifatturiero' },
      { id: 'automotive',     label: 'Automotive e componentistica', ateco: 'C29-C30', icon: '🚗', group: 'Manifatturiero' },
      { id: 'ceramics',       label: 'Ceramica, vetro e costruzioni',ateco: 'C23',     icon: '🏺', group: 'Manifatturiero' },
    ]
  },
  {
    group: 'Energia e Ambiente',
    sectors: [
      { id: 'energy_fossil',  label: 'Energia fossile',              ateco: 'D35',     icon: '⛽', group: 'Energia e Ambiente' },
      { id: 'energy_renew',   label: 'Energie rinnovabili',          ateco: 'D35',     icon: '☀️', group: 'Energia e Ambiente' },
      { id: 'waste_mgmt',     label: 'Gestione rifiuti',             ateco: 'E38-E39', icon: '♻️', group: 'Energia e Ambiente' },
      { id: 'water_util',     label: 'Utilities idriche',            ateco: 'E36-E37', icon: '💧', group: 'Energia e Ambiente' },
    ]
  },
  {
    group: 'Costruzioni',
    sectors: [
      { id: 'construction',   label: 'Costruzioni e cantieri',       ateco: 'F41-F43', icon: '🏗️', group: 'Costruzioni' },
      { id: 'real_estate',    label: 'Real estate',                  ateco: 'L68',     icon: '🏢', group: 'Costruzioni' },
    ]
  },
  {
    group: 'Agricoltura',
    sectors: [
      { id: 'agriculture',    label: 'Agricoltura e zootecnia',      ateco: 'A01',     icon: '🌾', group: 'Agricoltura' },
      { id: 'fishing',        label: 'Pesca e acquacoltura',         ateco: 'A03',     icon: '🐟', group: 'Agricoltura' },
      { id: 'agri_process',   label: 'Trasformazione alimenti',      ateco: 'C10',     icon: '🥫', group: 'Agricoltura' },
      { id: 'wine_spirits',   label: 'Vino, olio e distillati',      ateco: 'C11',     icon: '🍷', group: 'Agricoltura' },
    ]
  },
  {
    group: 'Commercio e Logistica',
    sectors: [
      { id: 'retail',         label: 'Commercio al dettaglio',       ateco: 'G47',     icon: '🛒', group: 'Commercio e Logistica' },
      { id: 'wholesale',      label: "Commercio all'ingrosso",       ateco: 'G46',     icon: '📦', group: 'Commercio e Logistica' },
      { id: 'logistics',      label: 'Trasporti e logistica',        ateco: 'H49-H53', icon: '🚚', group: 'Commercio e Logistica' },
    ]
  },
  {
    group: 'Servizi alle Imprese',
    sectors: [
      { id: 'software_it',    label: 'Software e IT',                ateco: 'J62-J63', icon: '💾', group: 'Servizi alle Imprese' },
      { id: 'consulting',     label: 'Consulenza professionale',     ateco: 'M69-M70', icon: '📊', group: 'Servizi alle Imprese' },
      { id: 'finance',        label: 'Finanza e assicurazioni',      ateco: 'K64-K66', icon: '🏦', group: 'Servizi alle Imprese' },
      { id: 'media_comm',     label: 'Media e comunicazione',        ateco: 'J58-J60', icon: '📱', group: 'Servizi alle Imprese' },
    ]
  },
  {
    group: 'Turismo e Ristorazione',
    sectors: [
      { id: 'hotel',          label: 'Hotel e strutture ricettive',  ateco: 'I55',     icon: '🏨', group: 'Turismo e Ristorazione' },
      { id: 'restaurant',     label: 'Ristorazione e catering',      ateco: 'I56',     icon: '🍴', group: 'Turismo e Ristorazione' },
      { id: 'tourism',        label: 'Tour operator e agenzie',      ateco: 'N79',     icon: '✈️', group: 'Turismo e Ristorazione' },
    ]
  },
  {
    group: 'Salute e Sociale',
    sectors: [
      { id: 'healthcare',     label: 'Sanità e cliniche',            ateco: 'Q86',     icon: '🏥', group: 'Salute e Sociale' },
      { id: 'pharma_retail',  label: 'Farmacie',                     ateco: 'G47',     icon: '💊', group: 'Salute e Sociale' },
      { id: 'social_care',    label: 'Assistenza sociale',           ateco: 'Q87-Q88', icon: '🤝', group: 'Salute e Sociale' },
    ]
  },
];

/* ══════════════════════════════════════════════════════════
   SECTOR_SUGGESTIONS — ESG scoring per settore
══════════════════════════════════════════════════════════ */
const SECTOR_SUGGESTIONS = {

  food_bev: {
    note: 'Settore ad alto impatto su acqua e packaging. Filiera agricola con rischi di lavoro minorile e deforestazione.',
    topPriority: ['E3-1', 'E3-2', 'E5-5', 'S2-2', 'E4-5'],
    impacts: {
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-5': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E3-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 4, scope: 2, irremediability: 3, nature: 'negative' },
      'E3-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E4-5': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E4-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'S2-2': { active: true, scale: 2, scope: 3, irremediability: 3, nature: 'negative' },
      'S2-4': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  textile: {
    note: 'Settore ad altissimo impatto su inquinamento chimico e microplastiche. Grave rischio lavoro forzato e minorile in filiera.',
    topPriority: ['E2-7', 'E5-6', 'S2-2', 'E2-2', 'S2-1'],
    impacts: {
      'E1-3': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-2': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-5': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-7': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E3-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E4-5': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-6': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'S1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S2-2': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'S2-3': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S2-4': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  wood_furniture: {
    note: 'Rischi deforestazione e impatto su biodiversità forestale. Uso di solventi e vernici con emissioni COV.',
    topPriority: ['E4-5', 'E2-2', 'E1-4', 'E5-1', 'S2-1'],
    impacts: {
      'E1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-2': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-5': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E4-5': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E4-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'S2-2': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  chemical: {
    note: 'Settore con massimi rischi di inquinamento chimico e incidenti sul lavoro. Obblighi REACH/CLP critici.',
    topPriority: ['E2-1', 'E2-5', 'S1-3', 'E2-4', 'E1-1'],
    impacts: {
      'E1-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 4, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-2': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-3': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-4': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-5': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-6': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E3-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-4': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E4-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 4, scope: 2, irremediability: 3, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  plastic_rubber: {
    note: 'Settore con elevata generazione di microplastiche e rifiuti plastici. Alta dipendenza da materie prime fossili.',
    topPriority: ['E2-7', 'E5-5', 'E5-1', 'E5-3', 'E2-1'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-2': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-4': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-7': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E3-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E5-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  metal_steel: {
    note: 'Industria energivora con elevate emissioni GHG e rischi per la salute dei lavoratori.',
    topPriority: ['E1-1', 'E2-1', 'S1-3', 'E1-4', 'E2-4'],
    impacts: {
      'E1-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E1-2': { active: true, scale: 4, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 4, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E2-4': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 4, scope: 2, irremediability: 3, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  machinery: {
    note: 'Settore con impatti moderati su energia e rifiuti industriali. Priorità sicurezza lavoratori.',
    topPriority: ['S1-3', 'E1-1', 'E5-1', 'E2-2', 'E5-4'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-2': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-8': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  electronics: {
    note: 'Minerali critici con gravi violazioni diritti umani in miniera. Obsolescenza programmata e e-waste critici.',
    topPriority: ['E5-6', 'S2-2', 'S4-2', 'S2-1', 'E5-1'],
    impacts: {
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E2-5': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-6': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'S2-1': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S2-2': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'S4-2': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'G1-7': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  automotive: {
    note: 'Elevate emissioni Scope 3 da uso veicoli. Transizione elettrica porta rischi su minerali e filiera.',
    topPriority: ['E1-9', 'E1-3', 'E5-1', 'E2-1', 'S2-1'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E1-3': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E1-9': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-2': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  ceramics: {
    note: 'Settore energivoro con emissioni significative in atmosfera e consumo di risorse naturali.',
    topPriority: ['E2-1', 'E1-1', 'E4-1', 'E1-4', 'S1-3'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E4-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  energy_fossil: {
    note: 'Impatti climatici massimi. Core business dipendente da combustibili fossili in piena fase di transizione.',
    topPriority: ['E1-1', 'E1-3', 'E2-4', 'G1-1', 'E3-4'],
    impacts: {
      'E1-1': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E1-3': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E1-4': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E1-5': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E2-1': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-4': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E3-4': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'G1-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'G1-3': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
    }
  },

  energy_renew: {
    note: 'Impatti positivi su clima, ma rischi su biodiversità (eolico, fotovoltaico) e comunità locali.',
    topPriority: ['E1-2', 'E4-1', 'E4-2', 'S3-2', 'E4-3'],
    impacts: {
      'E1-2': { active: true, scale: 1, scope: 2, likelihood: 1, nature: 'positive' },
      'E1-5': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'E4-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E4-2': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E4-3': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-2': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-6': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  waste_mgmt: {
    note: 'Settore con rischio elevato di inquinamento e illegalità. Gestione rifiuti pericolosi centrale.',
    topPriority: ['E2-4', 'E2-3', 'G1-1', 'S1-3', 'E2-5'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E2-4': { active: true, scale: 4, scope: 3, irremediability: 4, nature: 'negative' },
      'E2-5': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-3': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-4': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 4, scope: 2, irremediability: 3, nature: 'negative' },
      'G1-1': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
    }
  },

  water_util: {
    note: 'Gestione risorsa idrica critica in scenario di stress idrico crescente.',
    topPriority: ['E3-1', 'E3-2', 'E3-5', 'E3-3', 'S3-2'],
    impacts: {
      'E3-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'E3-3': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-5': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E4-4': { active: true, scale: 2, scope: 2, irremediability: 3, nature: 'negative' },
      'S3-2': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  construction: {
    note: 'Massimo rischio infortuni sul lavoro. Alto consumo di suolo e generazione di macerie.',
    topPriority: ['S1-3', 'E4-1', 'E5-4', 'E5-1', 'S2-3'],
    impacts: {
      'E1-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E2-8': { active: true, scale: 3, scope: 3, irremediability: 1, nature: 'negative' },
      'E4-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 4, scope: 2, irremediability: 4, nature: 'negative' },
      'S1-5': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-3': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-4': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  real_estate: {
    note: 'Patrimonio edilizio principale driver di emissioni da riscaldamento. Rischi governance su permessi.',
    topPriority: ['E1-6', 'E4-1', 'G1-1', 'S3-1', 'G1-7'],
    impacts: {
      'E1-6': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'E2-6': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E4-1': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-4': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-7': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  agriculture: {
    note: 'Deforestazione e uso pesticidi critici. Forte impatto su biodiversità e acque. Lavoro stagionale vulnerabile.',
    topPriority: ['E4-6', 'E4-5', 'E3-1', 'E2-5', 'S2-1'],
    impacts: {
      'E1-3': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E3-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'E4-1': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E4-5': { active: true, scale: 3, scope: 3, irremediability: 4, nature: 'negative' },
      'E4-6': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E5-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-7': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S2-2': { active: true, scale: 2, scope: 3, irremediability: 3, nature: 'negative' },
      'S2-3': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-2': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
    }
  },

  fishing: {
    note: 'Sovrasfruttamento degli stock ittici. Grave rischio lavoro forzato in flotte.',
    topPriority: ['E3-4', 'E4-3', 'S2-2', 'E4-4', 'S2-3'],
    impacts: {
      'E3-4': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E4-3': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'E4-4': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'S2-2': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'S2-3': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
    }
  },

  agri_process: {
    note: 'Impatto su acque reflue e packaging. Dipendenza da filiera agricola con rischi sociali.',
    topPriority: ['E2-3', 'E5-4', 'E5-5', 'E4-6', 'S1-3'],
    impacts: {
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E2-3': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E4-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-4': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  wine_spirits: {
    note: 'Settore sensibile a stress idrico. Filiera vendemmia con rischi di lavoro stagionale non regolare.',
    topPriority: ['E3-1', 'E3-2', 'E4-6', 'S2-1', 'E5-5'],
    impacts: {
      'E3-1': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E4-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S2-1': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'S2-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  retail: {
    note: 'Packaging e fast-fashion principali impatti. Greenwashing e condizioni lavoro in filiera sotto esame.',
    topPriority: ['E5-5', 'S4-3', 'E5-6', 'S2-4', 'E1-3'],
    impacts: {
      'E1-3': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E1-5': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-4': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'S4-3': { active: true, scale: 3, scope: 4, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
    }
  },

  wholesale: {
    note: 'Impatti concentrati su logistica e catena di fornitura.',
    topPriority: ['E1-4', 'E5-5', 'S2-4', 'G1-5'],
    impacts: {
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S2-4': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-5': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  logistics: {
    note: 'Trasporti responsabili del 25% emissioni GHG UE. Orari e sicurezza autisti critici.',
    topPriority: ['E1-1', 'E1-3', 'S1-3', 'E2-1', 'E1-4'],
    impacts: {
      'E1-1': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E1-3': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E1-4': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E2-1': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S1-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  software_it: {
    note: 'Data center energivori. Privacy e sicurezza dati centrali. Rischi di burnout per i dipendenti.',
    topPriority: ['S4-2', 'E5-6', 'E1-2', 'G1-7', 'E1-5'],
    impacts: {
      'E1-2': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E1-5': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'E5-3': { active: true, scale: 2, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-6': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-8': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S4-2': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'G1-4': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-7': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  consulting: {
    note: 'Impatti relativamente limitati ma governance critica. Rischi di conflitti di interesse e burnout.',
    topPriority: ['G1-1', 'G1-2', 'S1-4', 'S4-2', 'S1-8'],
    impacts: {
      'E1-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-8': { active: true, scale: 2, scope: 2, irremediability: 1, nature: 'negative' },
      'S4-2': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  finance: {
    note: 'Governance e anti-corruzione critici. Impatto ESG indiretto enorme tramite portafoglio prestiti/investimenti.',
    topPriority: ['G1-3', 'S4-2', 'G1-1', 'G1-7', 'E1-3'],
    impacts: {
      'S4-2': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'S4-3': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-1': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'G1-2': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'G1-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'G1-6': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-7': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'E1-3': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
    }
  },

  media_comm: {
    note: 'Privacy dei dati utenti e correttezza informazione centrali. Impatti ambientali diretti limitati.',
    topPriority: ['S4-2', 'S4-3', 'S4-5', 'G1-2', 'G1-6'],
    impacts: {
      'S4-2': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S4-3': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S4-5': { active: true, scale: 3, scope: 4, irremediability: 3, nature: 'negative' },
      'S1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-6': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'G1-2': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  hotel: {
    note: 'Consumi energetici e idrici significativi. Personale stagionale con rischi su retribuzione e orari.',
    topPriority: ['E1-2', 'E3-2', 'S1-5', 'E5-4', 'S1-3'],
    impacts: {
      'E1-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-5': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S2-3': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  restaurant: {
    note: 'Spreco alimentare e consumo energetico principali impatti. Condizioni lavoro critiche in cucina.',
    topPriority: ['E5-7', 'E5-4', 'S1-5', 'E1-4', 'E3-2'],
    impacts: {
      'E1-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E3-2': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-4': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'E5-7': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-5': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  tourism: {
    note: 'Emissioni aeree dominanti nel lifecycle. Turismo di massa con impatti su ecosistemi e culture locali.',
    topPriority: ['E1-3', 'E4-3', 'S3-2', 'S4-3'],
    impacts: {
      'E1-3': { active: true, scale: 4, scope: 4, irremediability: 3, nature: 'negative' },
      'E4-3': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S3-2': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
      'S4-3': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  healthcare: {
    note: 'Rifiuti ospedalieri pericolosi critici. Privacy dati sanitari massima priorità regolamentare.',
    topPriority: ['S4-2', 'E5-3', 'E2-5', 'S1-4', 'E5-4'],
    impacts: {
      'E2-5': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'E5-3': { active: true, scale: 4, scope: 3, irremediability: 3, nature: 'negative' },
      'E5-4': { active: true, scale: 4, scope: 3, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-4': { active: true, scale: 3, scope: 2, irremediability: 3, nature: 'negative' },
      'S4-2': { active: true, scale: 4, scope: 4, irremediability: 4, nature: 'negative' },
      'G1-7': { active: true, scale: 3, scope: 3, irremediability: 2, nature: 'negative' },
    }
  },

  pharma_retail: {
    note: 'Sicurezza prodotti e privacy fondamentali. Scadenza farmaci genera rifiuti speciali.',
    topPriority: ['S4-1', 'S4-2', 'E5-6', 'G1-1'],
    impacts: {
      'E5-6': { active: true, scale: 3, scope: 3, irremediability: 3, nature: 'negative' },
      'S4-1': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'S4-2': { active: true, scale: 3, scope: 4, irremediability: 4, nature: 'negative' },
      'G1-1': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

  social_care: {
    note: 'Burnout operatori sanitari e sociali. Tutela persone vulnerabili e dignità centrale.',
    topPriority: ['S1-4', 'S1-1', 'S1-3', 'S3-3', 'S1-5'],
    impacts: {
      'S1-1': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-3': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S1-4': { active: true, scale: 4, scope: 2, irremediability: 3, nature: 'negative' },
      'S1-5': { active: true, scale: 3, scope: 2, irremediability: 2, nature: 'negative' },
      'S3-3': { active: true, scale: 2, scope: 3, irremediability: 2, nature: 'negative' },
      'G1-7': { active: true, scale: 2, scope: 2, irremediability: 2, nature: 'negative' },
    }
  },

};

/* ══════════════════════════════════════════════════════════
   _renderSectorBanner — HTML string
══════════════════════════════════════════════════════════ */
function _renderSectorBanner() {
  const chosenId = _matState.chosenSector || '';
  const aiLoading = !!_matState.aiLoading;
  const aiApplied = !!_matState.aiApplied;
  const aiCount   = _matState.aiCount || 0;

  // Build optgroups
  let optGroupsHtml = '<option value="">— Seleziona settore —</option>';
  SECTORS.forEach(function(grp) {
    optGroupsHtml += '<optgroup label="' + _esc(grp.group) + '">';
    grp.sectors.forEach(function(sec) {
      const sel = sec.id === chosenId ? ' selected' : '';
      optGroupsHtml += '<option value="' + _esc(sec.id) + '"' + sel + '>'
        + sec.icon + ' ' + _esc(sec.label) + ' (' + _esc(sec.ateco) + ')'
        + '</option>';
    });
    optGroupsHtml += '</optgroup>';
  });

  // Sector note and top priorities
  let noteHtml = '';
  if (chosenId && SECTOR_SUGGESTIONS[chosenId] && !aiApplied) {
    const sugg = SECTOR_SUGGESTIONS[chosenId];
    const sec  = SECTORS.flatMap(function(g){ return g.sectors; }).find(function(s){ return s.id === chosenId; });
    let priorityTags = '';
    if (sugg.topPriority && sugg.topPriority.length) {
      sugg.topPriority.forEach(function(pid) {
        priorityTags += '<span class="mat-top-priority-tag">' + _esc(pid) + '</span>';
      });
    }
    noteHtml = '<div class="mat-sector-note-box">'
      + '<div style="font-size:12px;font-weight:600;color:var(--text-2);margin-bottom:4px;">'
      + (sec ? sec.icon + ' ' + _esc(sec.label) : '') + ' — Profilo ESG</div>'
      + '<div>' + _esc(sugg.note) + '</div>'
      + (priorityTags ? '<div class="mat-top-priority-list" style="margin-top:8px;">'
          + '<span style="font-size:11px;color:var(--text-2);margin-right:4px;">Top priorità:</span>'
          + priorityTags + '</div>' : '')
      + '</div>';
  }

  // Success bar
  let successBar = '';
  if (aiApplied) {
    const sec = SECTORS.flatMap(function(g){ return g.sectors; }).find(function(s){ return s.id === chosenId; });
    const secLabel = sec ? (sec.icon + ' ' + sec.label) : chosenId;
    successBar = '<div class="mat-ai-success-bar">'
      + '<span style="font-size:15px;">✦</span>'
      + '<span>IA ha pre-valorizzato <strong>' + aiCount + ' impatti</strong> per ' + _esc(secLabel) + ' &middot; Puoi modificarli liberamente</span>'
      + '<button class="btn mat-ai-reset-btn" onclick="materialityModule.clearSuggestions()" style="margin-left:auto;font-size:11px;padding:4px 10px;">Resetta</button>'
      + '</div>';
  }

  // Apply button
  let btnContent = '✦ Applica suggerimenti AI';
  let btnClass   = 'btn mat-ai-btn';
  let btnDisabled = '';
  if (aiLoading) {
    btnContent = '<span class="mat-ai-loading-shimmer" style="display:inline-block;width:140px;height:14px;border-radius:4px;background:rgba(167,139,250,0.3);"></span>';
    btnDisabled = ' disabled';
  } else if (!chosenId) {
    btnDisabled = ' disabled';
  }

  return '<div class="mat-sector-banner" id="mat-sector-banner">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">'
    +   '<span style="font-size:16px;color:#a78bfa;">✦</span>'
    +   '<span style="font-weight:700;font-size:14px;color:var(--text);">Analisi AI per Settore</span>'
    +   '<span style="margin-left:auto;font-size:11px;color:var(--text-2);">Suggerimenti pre-compilazione basati su dati ESG di settore</span>'
    + '</div>'
    + '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
    +   '<select class="mat-sector-select" id="mat-sector-select" onchange="materialityModule.selectSector(this.value)">'
    +     optGroupsHtml
    +   '</select>'
    +   '<button class="' + btnClass + '" onclick="materialityModule.applySectorSuggestions(_matState.chosenSector)"' + btnDisabled + '>'
    +     btnContent
    +   '</button>'
    +   (aiApplied
      ? '<button class="btn" onclick="materialityModule.clearSuggestions()" style="font-size:12px;padding:6px 12px;color:var(--text-2);">Resetta</button>'
      : '')
    + '</div>'
    + noteHtml
    + successBar
    + '</div>';
}

/* ══════════════════════════════════════════════════════════
   _injectSectorBanner — aggiorna il banner senza full re-render
══════════════════════════════════════════════════════════ */
function _injectSectorBanner() {
  const slot = document.getElementById('mat-sector-slot');
  if (slot) {
    slot.innerHTML = _renderSectorBanner();
  }
}

/* ══════════════════════════════════════════════════════════
   Override matRenderScreen — inietta banner AI
══════════════════════════════════════════════════════════ */
const _origMatRenderScreen_v3 = matRenderScreen;
function matRenderScreen() {
  _origMatRenderScreen_v3();
  if (_matState.phase === 1) {
    const ph1 = document.getElementById('mat-phase-1');
    if (!ph1) return;
    const statsRow = ph1.querySelector('.mat-stats-row');
    if (statsRow) {
      const existing = document.getElementById('mat-sector-slot');
      if (existing) existing.remove();
      const slot = document.createElement('div');
      slot.id = 'mat-sector-slot';
      slot.innerHTML = _renderSectorBanner();
      statsRow.insertAdjacentElement('afterend', slot);
    }
  }
  _addAiBadges();
}
window.matRenderScreen = matRenderScreen;

/* ══════════════════════════════════════════════════════════
   _addAiBadges — aggiunge badge AI alle card già renderizzate
══════════════════════════════════════════════════════════ */
function _addAiBadges() {
  if (!_matState.aiSuggested || !_matState.aiSuggested.size) return;
  _matState.aiSuggested.forEach(function(impId) {
    const card = document.getElementById('mic-' + impId);
    if (!card) return;
    const badges = card.querySelector('.mat-impact-card-badges');
    if (badges && !badges.querySelector('.mat-ai-badge')) {
      const b = document.createElement('span');
      b.className = 'mat-ai-badge';
      b.textContent = '✦ AI';
      badges.prepend(b);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   Estensione materialityModule
══════════════════════════════════════════════════════════ */
Object.assign(materialityModule, {

  selectSector: function(sectorId) {
    _matState.chosenSector = sectorId;
    _injectSectorBanner();
  },

  applySectorSuggestions: function(sectorId) {
    if (!sectorId) {
      if (typeof toast === 'function') toast('Seleziona prima un settore', 'error');
      return;
    }
    _matState.aiLoading  = true;
    _matState.chosenSector = sectorId;
    _injectSectorBanner();

    setTimeout(function() {
      var sugg = SECTOR_SUGGESTIONS[sectorId];
      if (!sugg) {
        _matState.aiLoading = false;
        _injectSectorBanner();
        return;
      }
      var count = 0;
      Object.entries(sugg.impacts).forEach(function(entry) {
        var impId = entry[0];
        var vals  = entry[1];
        if (_matState.userModified && _matState.userModified.has(impId)) return;
        _matState.selected[impId] = Object.assign({}, vals);
        if (!_matState.aiSuggested) _matState.aiSuggested = new Set();
        _matState.aiSuggested.add(impId);
        count++;
      });
      _matState.aiLoading = false;
      _matState.aiApplied = true;
      _matState.aiCount   = count;
      _matState.dirty     = true;
      matRenderScreen();
      if (typeof toast === 'function') {
        var sec = SECTORS.flatMap(function(g){ return g.sectors; }).find(function(s){ return s.id === sectorId; });
        toast('✦ AI ha pre-valorizzato ' + count + ' impatti per ' + (sec ? sec.label : sectorId), 'success');
      }
    }, 1200);
  },

  clearSuggestions: function() {
    if (_matState.aiSuggested) {
      _matState.aiSuggested.forEach(function(id) {
        if (!_matState.userModified || !_matState.userModified.has(id)) {
          delete _matState.selected[id];
        }
      });
      _matState.aiSuggested = new Set();
    }
    _matState.aiApplied = false;
    _matState.aiCount   = 0;
    matRenderScreen();
    if (typeof toast === 'function') toast('Suggerimenti AI rimossi', '');
  },

});

/* ══════════════════════════════════════════════════════════
   CSS Injection
══════════════════════════════════════════════════════════ */
(function() {
  var css = [
    '.mat-sector-banner {',
    '  background: var(--surface);',
    '  border: 1px solid var(--border);',
    '  border-radius: var(--radius);',
    '  padding: 16px 18px;',
    '  margin-bottom: 16px;',
    '  position: relative;',
    '  overflow: hidden;',
    '  box-shadow: inset 3px 0 0 #a78bfa;',
    '}',
    '.mat-sector-banner::before {',
    '  content: "";',
    '  position: absolute;',
    '  inset: 0;',
    '  background: radial-gradient(ellipse 60% 100% at 0% 50%, oklch(0.68 0.165 290 / 0.06) 0%, transparent 60%);',
    '  pointer-events: none;',
    '}',
    '.mat-sector-select {',
    '  flex: 1;',
    '  min-width: 220px;',
    '  padding: 9px 12px;',
    '  background: var(--bg);',
    '  border: 1.5px solid var(--border);',
    '  border-radius: 8px;',
    '  color: var(--text);',
    '  font-family: inherit;',
    '  font-size: 14px;',
    '  cursor: pointer;',
    '  outline: none;',
    '  transition: border-color 150ms ease;',
    '}',
    '.mat-sector-select:focus {',
    '  border-color: #a78bfa;',
    '}',
    '.mat-ai-btn {',
    '  background: #a78bfa;',
    '  color: #0f0720;',
    '  font-weight: 700;',
    '  border: none;',
    '  white-space: nowrap;',
    '}',
    '.mat-ai-btn:hover:not(:disabled) {',
    '  background: #c4b5fd;',
    '  box-shadow: 0 0 20px oklch(0.68 0.165 290 / 0.4);',
    '}',
    '.mat-ai-btn:disabled {',
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '}',
    '.mat-ai-badge {',
    '  font-size: 9px;',
    '  font-weight: 800;',
    '  padding: 2px 6px;',
    '  border-radius: 4px;',
    '  background: oklch(0.18 0.05 290);',
    '  color: #a78bfa;',
    '  border: 1px solid oklch(0.68 0.165 290 / 0.3);',
    '  letter-spacing: 0.03em;',
    '  flex-shrink: 0;',
    '  display: inline-flex;',
    '  align-items: center;',
    '}',
    '.mat-ai-success-bar {',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 10px;',
    '  margin-top: 10px;',
    '  padding: 10px 14px;',
    '  background: oklch(0.18 0.05 290 / 0.4);',
    '  border: 1px solid oklch(0.68 0.165 290 / 0.3);',
    '  border-radius: 7px;',
    '  font-size: 13px;',
    '  color: #a78bfa;',
    '}',
    '.mat-ai-loading-shimmer {',
    '  animation: shimmer 1.5s linear infinite;',
    '}',
    '.mat-sector-note-box {',
    '  margin-top: 10px;',
    '  padding: 10px 14px;',
    '  background: var(--bg);',
    '  border: 1px solid var(--border);',
    '  border-radius: 7px;',
    '  font-size: 12.5px;',
    '  color: var(--text-2);',
    '}',
    '.mat-top-priority-list {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 6px;',
    '  margin-top: 8px;',
    '}',
    '.mat-top-priority-tag {',
    '  font-size: 11px;',
    '  font-weight: 600;',
    '  padding: 2px 8px;',
    '  border-radius: 4px;',
    '  background: oklch(0.18 0.05 290 / 0.5);',
    '  color: #c4b5fd;',
    '  border: 1px solid oklch(0.68 0.165 290 / 0.25);',
    '}',
  ].join('\n');

  var style = document.createElement('style');
  style.id  = 'vera-sector-ai-styles';
  if (!document.getElementById('vera-sector-ai-styles')) {
    style.textContent = css;
    document.head.appendChild(style);
  }
})();
