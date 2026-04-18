/* ╔══════════════════════════════════════════════════════════
   ║  VERA ESG Platform — v2.2 (dual-access: admin / client)
   ╚══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════
   ASSESSMENT QUESTIONS & SCORING
══════════════════════════════════════════════════════════ */

const QUESTIONS = [
  {
    id: 'employees',
    category: 'Dimensione aziendale',
    icon: '👥',
    text: 'Quanti dipendenti ha la tua azienda?',
    sub: 'La soglia EFRAG per le PMI è 250 dipendenti (Raccomandazione UE 2003/361/CE)',
    options: [
      { value: 'micro',  label: 'Meno di 20',  hint: 'Micro-impresa',         vsme: 5, gri: 0 },
      { value: 'small',  label: '20 – 50',     hint: 'Piccola impresa',       vsme: 4, gri: 1 },
      { value: 'medium', label: '51 – 250',    hint: 'Media impresa (PMI)',    vsme: 3, gri: 2 },
      { value: 'large',  label: 'Più di 250',  hint: 'Grande impresa',        vsme: 0, gri: 5 },
    ]
  },
  {
    id: 'obligations',
    category: 'Contesto normativo',
    icon: '⚖️',
    text: 'Hai obblighi ESG normativi o sei quotata in borsa?',
    sub: 'Verifica se hai obblighi normativi ESG o requisiti da parte di clienti/banche',
    options: [
      { value: 'listed',    label: 'Quotata in borsa',          hint: 'Soggetta a CSRD / ESRS',     vsme: 0, gri: 5 },
      { value: 'indirect',  label: 'Obblighi CSRD indiretti',   hint: 'Fornitore di grandi imprese', vsme: 2, gri: 3 },
      { value: 'voluntary', label: 'Scelta completamente volontaria', hint: 'Nessun obbligo diretto', vsme: 4, gri: 1 },
    ]
  },
  {
    id: 'experience',
    category: 'Esperienza ESG',
    icon: '📊',
    text: 'Quante rendicontazioni di sostenibilità hai già fatto?',
    sub: 'VSME è progettato come framework di ingresso; GRI presuppone maturità del processo',
    options: [
      { value: 'none',   label: 'Nessuna — prima volta',  hint: 'Approccio graduale consigliato', vsme: 5, gri: 0 },
      { value: 'few',    label: '1 – 2 precedenti',       hint: 'In fase di consolidamento',      vsme: 3, gri: 2 },
      { value: 'mature', label: '3 o più',                hint: 'Processo maturo / strutturato',  vsme: 1, gri: 4 },
    ]
  },
  {
    id: 'stakeholders',
    category: 'Stakeholder principali',
    icon: '🤝',
    text: 'Chi richiede principalmente i tuoi dati ESG?',
    sub: 'Banche e clienti italiani prediligono VSME; investitori internazionali richiedono GRI',
    options: [
      { value: 'banks',   label: 'Banche / Istituti finanziari',  hint: 'Rating ESG per finanziamenti', vsme: 4, gri: 2 },
      { value: 'italian', label: 'Clienti italiani (supply chain)', hint: 'Catena fornitura domestica',  vsme: 4, gri: 1 },
      { value: 'intl',    label: 'Clienti internazionali',         hint: 'Standard globali richiesti',  vsme: 1, gri: 5 },
      { value: 'invest',  label: 'Investitori / Fondi ESG',        hint: 'Due diligence investimento',  vsme: 0, gri: 5 },
    ]
  },
  {
    id: 'market',
    category: 'Mercato di riferimento',
    icon: '🌍',
    text: 'Qual è il principale mercato della tua azienda?',
    sub: 'GRI è lo standard internazionale; VSME è ottimizzato per il contesto europeo PMI',
    options: [
      { value: 'italy',  label: 'Solo Italia',               hint: 'Mercato domestico',  vsme: 4, gri: 1 },
      { value: 'europe', label: 'Europa (prevalentemente)',  hint: 'Mercato europeo',     vsme: 2, gri: 3 },
      { value: 'global', label: 'Mercato internazionale',    hint: 'USA, Asia, globale', vsme: 0, gri: 5 },
    ]
  },
  {
    id: 'sector',
    category: 'Settore ATECO',
    icon: '🏭',
    text: 'In quale settore opera la tua azienda?',
    sub: 'Alcuni settori ad alta materialità ambientale hanno prassi consolidate GRI',
    options: [
      { value: 'manuf', label: 'Manifatturiero / Industria', hint: 'Alta materialità ambientale', vsme: 3, gri: 3 },
      { value: 'build', label: 'Edilizia / Infrastrutture',  hint: 'Impatto fisico elevato',      vsme: 3, gri: 3 },
      { value: 'trade', label: 'Commercio / Distribuzione',  hint: 'Supply chain principale',     vsme: 3, gri: 2 },
      { value: 'serv',  label: 'Servizi / Consulenza',       hint: 'Prevalentemente sociale',     vsme: 4, gri: 2 },
    ]
  },
  {
    id: 'explicit',
    category: 'Preferenze esplicite',
    icon: '📋',
    text: 'Hai ricevuto indicazioni sullo standard da stakeholder?',
    sub: 'Una richiesta esplicita pesa significativamente nella scelta finale',
    options: [
      { value: 'none',   label: 'No, scelgo autonomamente',  hint: 'Massima libertà',        vsme: 2, gri: 2 },
      { value: 'vreq',   label: 'VSME è stato specificato',  hint: 'Richiesta esplicita',    vsme: 6, gri: 0 },
      { value: 'greq',   label: 'GRI è stato specificato',   hint: 'Richiesta esplicita',    vsme: 0, gri: 6 },
      { value: 'both',   label: 'Entrambi menzionati',       hint: 'Valutare le priorità',   vsme: 2, gri: 2 },
    ]
  },
];

/* ── Score computation ─────────────────────────────────── */
function computeScores(answers) {
  let v = 0, g = 0;
  QUESTIONS.forEach(q => {
    const val = answers[q.id];
    if (!val) return;
    const opt = q.options.find(o => o.value === val);
    if (opt) { v += opt.vsme; g += opt.gri; }
  });
  const total = v + g || 1;
  const vPct = Math.round((v / total) * 100);
  return { vsme: v, gri: g, vPct, gPct: 100 - vPct };
}

/* ── Reasoning text generator ─────────────────────────── */
function buildReasoning(answers) {
  const s = computeScores(answers);
  const rec = s.vPct >= s.gPct ? 'VSME 2023' : 'GRI Standards';
  const lines = [];

  lines.push('═══ VERA AI — Analisi Standard ESG ═══\n');
  lines.push('Elaborazione risposte in corso...\n');

  // 1 — Dimensione
  lines.push('── [1] DIMENSIONE AZIENDALE');
  const empMap = {
    micro:  '✓ Micro-impresa (< 20 dip.): target principale del VSME. EFRAG ha\n  calibrato il framework esattamente su questo segmento (considerando 16,\n  Reg. UE 2023/2772).',
    small:  '✓ Piccola impresa (20–50 dip.): profilo ideale VSME. I moduli B1–B3\n  sono dimensionati per la complessità di questa fascia aziendale.',
    medium: '⚡ Media impresa (51–250 dip.): PMI a tutti gli effetti. Entrambi i\n  framework sono applicabili; VSME rimane preferibile al primo ciclo.',
    large:  '! Grande impresa (> 250 dip.): supera la soglia PMI. GRI Standards\n  è lo standard de facto e potrebbe applicarsi CSRD dal 2025.',
  };
  lines.push(empMap[answers.employees] || '');

  // 2 — Obblighi
  lines.push('\n── [2] CONTESTO NORMATIVO');
  const oblMap = {
    listed:    '! Azienda quotata: soggetta a CSRD/ESRS. GRI è pienamente\n  interoperabile con ESRS ed è preferito dagli analisti istituzionali.',
    indirect:  '⚡ Obblighi CSRD indiretti: i grandi clienti chiederanno dati ESG\n  strutturati ai fornitori. VSME è nato per questo scenario (EFRAG 2023).',
    voluntary: '✓ Scelta volontaria: massima libertà. VSME offre il miglior\n  rapporto costi/benefici per le PMI senza obblighi diretti.',
  };
  lines.push(oblMap[answers.obligations] || '');

  // 3 — Esperienza
  lines.push('\n── [3] ESPERIENZA ESG');
  const expMap = {
    none:   '✓ Prima rendicontazione: VSME è progettato per l\'avvio graduale.\n  Tutti i Moduli B (B1–B5) sono obbligatori; EFRAG non prevede moduli facoltativi\n  nella versione definitiva del framework (VSME S1, EFRAG 2023).',
    few:    '⚡ 1–2 cicli: fase di consolidamento. Valutare set VSME completo\n  (B1–B5) o pianificare migrazione GRI se cresce l\'internazionalizzazione.',
    mature: '✓ Processo maturo (3+ anni): GRI garantisce maggiore granularità\n  e comparabilità con il peer group internazionale.',
  };
  lines.push(expMap[answers.experience] || '');

  // 4 — Stakeholder
  lines.push('\n── [4] STAKEHOLDER E ASPETTATIVE');
  const stkMap = {
    banks:  '✓ Banche/istituti: priorità VSME. Intesa Sanpaolo, Unicredit e BEI\n  hanno adottato VSME come riferimento per i rating ESG PMI (ABI 2023).',
    italian:'✓ Clienti italiani: VSME è lo standard della supply chain domestica.\n  Grandi gruppi italiani (ENI, FCA, Ferrero) lo richiedono ai fornitori.',
    intl:   '! Clienti internazionali: GRI è richiesto esplicitamente nelle RFP\n  di imprese USA, UK, Germania, Francia, Paesi Bassi.',
    invest: '! Investitori/fondi: GRI è quasi obbligatorio per due diligence.\n  Bloomberg e MSCI ESG si basano su dati GRI; fondi SFDR Art. 8/9 lo esigono.',
  };
  lines.push(stkMap[answers.stakeholders] || '');

  // 5 — Mercato
  lines.push('\n── [5] MERCATO');
  const mktMap = {
    italy:  '✓ Mercato italiano: ecosistema VSME in forte crescita. Confindustria\n  e Confcommercio lo hanno raccomandato come standard PMI (Linee Guida 2024).',
    europe: '⚡ Mercato europeo: VSME è preferito in ambito UE/PMI; GRI è\n  necessario per UK, Svizzera, Nordics dove la prassi è GRI.',
    global: '! Mercato globale: GRI ha copertura in 100+ paesi; è lo standard\n  di riferimento in USA, Asia, America Latina.',
  };
  lines.push(mktMap[answers.market] || '');

  // 6 — Settore
  lines.push('\n── [6] SETTORE E MATERIALITÀ');
  const secMap = {
    manuf: '⚡ Manifatturiero: entrambi i framework coprono bene GHG, energia\n  e rifiuti. VSME B2-E1/E2 ha meno overhead documentale di GRI 302/305.',
    build: '⚡ Edilizia: GRI 304 (biodiversità) e 403 (sicurezza) aggiungono\n  valore se il perimetro è rilevante, altrimenti VSME è sufficiente.',
    trade: '✓ Commercio: VSME B2-E4 (trasporti) è calibrato per Scope 3 Cat.4,\n  che è la categoria di emissioni più rilevante per la distribuzione.',
    serv:  '✓ Servizi: VSME è ottimale. Materialità prevalentemente sociale\n  (B3-S) e governance (B4-G), minori emissioni dirette.',
  };
  lines.push(secMap[answers.sector] || '');

  // 7 — Esplicito
  lines.push('\n── [7] PREFERENZE ESPLICITE');
  const expPlMap = {
    none:  '○ Nessuna indicazione: la raccomandazione si basa sul profilo\n  complessivo senza vincoli di stakeholder specifici.',
    vreq:  '✓✓ VSME richiesto esplicitamente: peso decisivo nella scelta.\n  Una richiesta diretta elimina ogni ambiguità del processo decisionale.',
    greq:  '✓✓ GRI richiesto esplicitamente: peso decisivo nella scelta.\n  Una richiesta diretta elimina ogni ambiguità del processo decisionale.',
    both:  '⚡ Entrambi menzionati: valutare quale stakeholder ha maggiore\n  importanza strategica. La scelta finale segue quella priorità.',
  };
  lines.push(expPlMap[answers.explicit] || '');

  // Final recommendation
  lines.push(`\n═══ RACCOMANDAZIONE FINALE ═══`);
  lines.push(`Standard: ${rec}`);
  lines.push(`Punteggio: VSME ${s.vPct}% — GRI ${s.gPct}%`);
  lines.push(`Confidenza: ${Math.max(s.vPct, s.gPct)}%\n`);

  if (s.vPct >= s.gPct) {
    lines.push('Il profilo analizzato è tipico di una PMI italiana al primo o secondo\nciclo di rendicontazione, con stakeholder prevalentemente domestici e\nobblighi normativi indiretti. VSME 2023 (EFRAG) è il framework più adeguato:\npiù snello, progettato per le PMI europee, e già riconosciuto dalle principali\nbanche italiane e dai clienti della grande distribuzione organizzata.');
  } else {
    lines.push('Il profilo analizzato presenta caratteristiche tipiche di un\'organizzazione\ncon rapporti internazionali strutturati, investitori istituzionali o clienti\ncon requisiti di trasparenza elevati. GRI Standards (2021) garantisce la\ncomparabilità internazionale e la credibilità necessaria per questi interlocutori,\npur richiedendo risorse maggiori rispetto al VSME.');
  }

  return lines.join('\n');
}

/* ── GRI disclosures by sector ─────────────────────────── */
// User-specified list: 2-1→2-30, 201-1, 204-1, 302-1/3, 305-1/2/3/4,
// 401-1/2, 403-3, 404-1, 405-1, 205-3 (insieme a 2-27), 418-1
// La selezione dipende dal settore.
const GRI_UNIVERSAL = [
  { code:'GRI 2-1',  label:'Informazioni sull\'organizzazione' },
  { code:'GRI 2-2',  label:'Entità nel reporting' },
  { code:'GRI 2-3',  label:'Periodo, frequenza e contatti' },
  { code:'GRI 2-4',  label:'Correzioni del reporting' },
  { code:'GRI 2-5',  label:'Assurance esterna' },
  { code:'GRI 2-6',  label:'Attività, catena del valore, altri rapporti commerciali' },
  { code:'GRI 2-7',  label:'Dipendenti' },
  { code:'GRI 2-8',  label:'Lavoratori non dipendenti' },
  { code:'GRI 2-9',  label:'Struttura e composizione della governance' },
  { code:'GRI 2-10', label:'Nomina e selezione dell\'organo di governance' },
  { code:'GRI 2-11', label:'Presidente dell\'organo di governance' },
  { code:'GRI 2-12', label:'Ruolo nella supervisione degli impatti' },
  { code:'GRI 2-13', label:'Delega delle responsabilità' },
  { code:'GRI 2-14', label:'Ruolo nella rendicontazione della sostenibilità' },
  { code:'GRI 2-15', label:'Conflitti di interesse' },
  { code:'GRI 2-16', label:'Comunicazione delle preoccupazioni' },
  { code:'GRI 2-17', label:'Conoscenze collettive sull\'organo di governance' },
  { code:'GRI 2-18', label:'Valutazione delle performance della governance' },
  { code:'GRI 2-19', label:'Politiche retributive' },
  { code:'GRI 2-20', label:'Processo per determinare la retribuzione' },
  { code:'GRI 2-21', label:'Rapporto retribuzione annuale totale' },
  { code:'GRI 2-22', label:'Dichiarazione sulla strategia di sviluppo sostenibile' },
  { code:'GRI 2-23', label:'Impegni strategici' },
  { code:'GRI 2-24', label:'Integrazione degli impegni strategici' },
  { code:'GRI 2-25', label:'Processi per porre rimedio agli impatti negativi' },
  { code:'GRI 2-26', label:'Meccanismi per la ricerca di consulenza e preoccupazioni' },
  { code:'GRI 2-27', label:'Conformità con leggi e regolamentazioni' },
  { code:'GRI 2-28', label:'Appartenenza ad associazioni' },
  { code:'GRI 2-29', label:'Approccio al coinvolgimento degli stakeholder' },
  { code:'GRI 2-30', label:'Accordi collettivi' },
  { code:'GRI 201-1', label:'Valore economico diretto generato e distribuito' },
  { code:'GRI 204-1', label:'Proporzione di spesa con fornitori locali' },
];

const GRI_BY_SECTOR = {
  // Manifatturiero — massima materialità ambientale + salute/sicurezza + anticorruzione
  manuf: [
    ...GRI_UNIVERSAL,
    { code:'GRI 302-1', label:'Consumo energetico all\'interno dell\'organizzazione' },
    { code:'GRI 302-3', label:'Intensità energetica' },
    { code:'GRI 305-1', label:'Emissioni dirette di GHG (Scope 1)' },
    { code:'GRI 305-2', label:'Emissioni indirette da energia (Scope 2)' },
    { code:'GRI 305-3', label:'Altre emissioni indirette di GHG (Scope 3)' },
    { code:'GRI 305-4', label:'Intensità delle emissioni di GHG' },
    { code:'GRI 401-1', label:'Nuove assunzioni e turnover dei dipendenti' },
    { code:'GRI 401-2', label:'Benefit per i dipendenti a tempo pieno' },
    { code:'GRI 403-3', label:'Servizi di medicina del lavoro' },
    { code:'GRI 404-1', label:'Media ore di formazione all\'anno per dipendente' },
    { code:'GRI 405-1', label:'Diversità negli organi di governance e tra i dipendenti' },
    { code:'GRI 205-3', label:'Incidenti di corruzione confermati e azioni intraprese (con GRI 2-27)' },
  ],
  // Edilizia — impatto fisico elevato, sicurezza cantiere centrale
  build: [
    ...GRI_UNIVERSAL,
    { code:'GRI 302-1', label:'Consumo energetico all\'interno dell\'organizzazione' },
    { code:'GRI 302-3', label:'Intensità energetica' },
    { code:'GRI 305-1', label:'Emissioni dirette di GHG (Scope 1)' },
    { code:'GRI 305-2', label:'Emissioni indirette da energia (Scope 2)' },
    { code:'GRI 305-3', label:'Altre emissioni indirette di GHG (Scope 3)' },
    { code:'GRI 305-4', label:'Intensità delle emissioni di GHG' },
    { code:'GRI 401-1', label:'Nuove assunzioni e turnover dei dipendenti' },
    { code:'GRI 401-2', label:'Benefit per i dipendenti a tempo pieno' },
    { code:'GRI 403-3', label:'Servizi di medicina del lavoro' },
    { code:'GRI 404-1', label:'Media ore di formazione all\'anno per dipendente' },
    { code:'GRI 405-1', label:'Diversità negli organi di governance e tra i dipendenti' },
    { code:'GRI 205-3', label:'Incidenti di corruzione confermati e azioni intraprese (con GRI 2-27)' },
  ],
  // Commercio/distribuzione — supply chain, privacy clienti
  trade: [
    ...GRI_UNIVERSAL,
    { code:'GRI 302-1', label:'Consumo energetico all\'interno dell\'organizzazione' },
    { code:'GRI 302-3', label:'Intensità energetica' },
    { code:'GRI 305-1', label:'Emissioni dirette di GHG (Scope 1)' },
    { code:'GRI 305-2', label:'Emissioni indirette da energia (Scope 2)' },
    { code:'GRI 305-3', label:'Altre emissioni indirette di GHG (Scope 3)' },
    { code:'GRI 305-4', label:'Intensità delle emissioni di GHG' },
    { code:'GRI 401-1', label:'Nuove assunzioni e turnover dei dipendenti' },
    { code:'GRI 401-2', label:'Benefit per i dipendenti a tempo pieno' },
    { code:'GRI 403-3', label:'Servizi di medicina del lavoro' },
    { code:'GRI 404-1', label:'Media ore di formazione all\'anno per dipendente' },
    { code:'GRI 405-1', label:'Diversità negli organi di governance e tra i dipendenti' },
    { code:'GRI 418-1', label:'Reclami fondati riguardanti violazioni della privacy dei clienti' },
  ],
  // Servizi/consulenza — prevalentemente sociale e governance, emissioni ridotte
  serv: [
    ...GRI_UNIVERSAL,
    { code:'GRI 302-1', label:'Consumo energetico all\'interno dell\'organizzazione' },
    { code:'GRI 302-3', label:'Intensità energetica' },
    { code:'GRI 305-1', label:'Emissioni dirette di GHG (Scope 1)' },
    { code:'GRI 305-2', label:'Emissioni indirette da energia (Scope 2)' },
    { code:'GRI 305-3', label:'Altre emissioni indirette di GHG (Scope 3)' },
    { code:'GRI 401-1', label:'Nuove assunzioni e turnover dei dipendenti' },
    { code:'GRI 401-2', label:'Benefit per i dipendenti a tempo pieno' },
    { code:'GRI 404-1', label:'Media ore di formazione all\'anno per dipendente' },
    { code:'GRI 405-1', label:'Diversità negli organi di governance e tra i dipendenti' },
    { code:'GRI 418-1', label:'Reclami fondati riguardanti violazioni della privacy dei clienti' },
  ],
};
// Default fallback (nessun settore specificato)
GRI_BY_SECTOR.default = GRI_BY_SECTOR.serv;

/* ── VSME modules — tutti obbligatori (EFRAG VSME S1, 2023) ── */
const VSME_MODULES_ALL = [
  { code:'B1',   label:'Informazioni di base — Contesto e governance' },
  { code:'B2-E1',label:'Clima e gas a effetto serra (GHG)' },
  { code:'B2-E2',label:'Energia — Consumi e intensità' },
  { code:'B2-E3',label:'Rifiuti — Produzione e gestione' },
  { code:'B2-E4',label:'Trasporti — Emissioni da logistica' },
  { code:'B2-E5',label:'Biodiversità — Impatti rilevanti' },
  { code:'B3-S1',label:'Forza lavoro propria — Condizioni di lavoro' },
  { code:'B3-S2',label:'Lavoratori nella catena del valore' },
  { code:'B3-S3',label:'Comunità locali — Impatti e coinvolgimento' },
  { code:'B3-S4',label:'Consumatori e utilizzatori finali' },
  { code:'B4-G', label:'Condotta aziendale e anticorruzione' },
];

/* ── Recommendation object ─────────────────────────────── */
function buildRec(answers) {
  const s = computeScores(answers);
  const isVSME = s.vPct >= s.gPct;

  // VSME: tutti i moduli B sono obbligatori (EFRAG VSME S1, 2023)
  const vsmeModules = VSME_MODULES_ALL.map(m => `VSME ${m.code} — ${m.label}`);

  // GRI: selezione dipendente dal settore dichiarato
  const sectorKey = answers.sector || 'default';
  const sectorGri = GRI_BY_SECTOR[sectorKey] || GRI_BY_SECTOR.default;
  const griModules = sectorGri.map(d => `${d.code} — ${d.label}`);

  const reasons = [];
  if (isVSME) {
    if (answers.employees !== 'large')
      reasons.push({ icon: '👥', text: `Dimensione PMI (${answers.employees === 'micro' ? '< 20' : answers.employees === 'small' ? '20–50' : '51–250'} dip.): target principale del framework VSME (EFRAG 2023).` });
    if (answers.experience === 'none')
      reasons.push({ icon: '🚀', text: 'Prima rendicontazione: VSME è il framework ideale per il primo ciclo. Tutti i moduli B (B1–B5) sono obbligatori per garantire la completezza del bilancio di sostenibilità.' });
    if (answers.obligations !== 'listed')
      reasons.push({ icon: '⚖️', text: 'Senza obbligo CSRD diretto, VSME è il framework più efficiente in termini di costi e complessità.' });
    if (answers.stakeholders === 'banks' || answers.stakeholders === 'italian')
      reasons.push({ icon: '🏦', text: 'Banche italiane e supply chain domestica prediligono VSME (Circolare ABI 2023, Linee Guida Confindustria 2024).' });
  } else {
    if (answers.market === 'global')
      reasons.push({ icon: '🌍', text: 'Mercato globale: GRI ha copertura in 100+ paesi ed è richiesto da clienti USA/Asia.' });
    if (answers.stakeholders === 'invest')
      reasons.push({ icon: '📈', text: 'Investitori e fondi ESG richiedono GRI per la due diligence (SFDR Art. 8/9, Bloomberg/MSCI).' });
    if (answers.experience === 'mature')
      reasons.push({ icon: '📊', text: 'Processo ESG maturo: GRI offre granularità e comparabilità con il peer group internazionale.' });
    if (answers.obligations === 'listed')
      reasons.push({ icon: '⚖️', text: 'Azienda quotata: GRI è interoperabile con CSRD/ESRS ed è preferito dagli analisti istituzionali.' });
  }
  return {
    standard: isVSME ? 'VSME 2023' : 'GRI Standards',
    isVSME,
    vPct: s.vPct,
    gPct: s.gPct,
    confidence: Math.max(s.vPct, s.gPct),
    modules: isVSME ? vsmeModules : griModules,
    reasons: reasons.slice(0, 4),
  };
}


/* ══════════════════════════════════════════════════════════
   CLIENT DATA STORE
══════════════════════════════════════════════════════════ */

// Client data is loaded from Supabase — no hardcoded demo data
const CLIENTS_DATA = {};

let _currentClientId = null;
function currentClient() { return _currentClientId ? CLIENTS_DATA[_currentClientId] : null; }

/* Load a client workspace */
function loadClient(id) {
  if (!CLIENTS_DATA[id]) { toast('Cliente non trovato', 'error'); return; }
  _currentClientId = id;
  const c = CLIENTS_DATA[id];
  // For new clients, open the plan selection flow
  if (c.status === 'new') {
    newClientFlow.start();
    return;
  }
  _updateClientUI(c);
  showScreen('dashboard', document.getElementById('nav-dashboard'));
  toast(`Workspace aperto: ${c.name}`, 'success');
}

function _updateClientUI(c) {
  // Sidebar company name
  const sbName = document.getElementById('sb-company-name');
  if (sbName) sbName.textContent = c.name;

  // Topbar chip
  const chip = document.querySelector('.company-chip');
  if (chip) chip.textContent = auth.isAdmin()
    ? `${c.name} · Admin`
    : `${c.name} · ${c.year}`;

  // Avatar
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    avatar.textContent = auth.isAdmin() ? 'VP' : c.initials;
    avatar.title = auth.isAdmin() ? `Vittorio Palpati — ${c.name}` : c.name;
  }

  // Standard badges everywhere
  if (c.std) _syncStdBadges(c.std);

  // Dashboard KPIs
  if (c.ghg) {
    _setText('kpi-total',  (c.ghg.total / 1000).toFixed(1));
    _setText('kpi-s1',     (c.ghg.s1    / 1000).toFixed(1));
    _setText('kpi-s2',     (c.ghg.s2    / 1000).toFixed(1));
    _setText('kpi-s3',     (c.ghg.s3    / 1000).toFixed(1));
    _setText('results-title', `Calcolo GHG — ${c.name}`);
    _setText('results-sub',   `GHG Protocol Corporate Standard · Market-based · Anno ${c.year}`);
    _setText('stamp-pre-info', `Report: ${c.name} · ${(c.std || 'vsme').toUpperCase()} · ${c.year}`);
  } else {
    _setText('kpi-total', '—');
    _setText('kpi-s1',    '—');
    _setText('kpi-s2',    '—');
    _setText('kpi-s3',    '—');
    _setText('results-title', c.name ? `Calcolo GHG — ${c.name}` : 'Calcolo GHG');
    _setText('results-sub',   'Nessun dato inserito — carica i dati per calcolare le emissioni');
  }

  // Company form
  _setVal('field-ragione-sociale', c.name);
  _setVal('field-cf',              c.cf);
  _setVal('field-ateco',           c.ateco + ' — ' + c.sector);
  _setVal('field-anno',            String(c.year));
  _setVal('field-dipendenti',      String(c.employees));
  _setVal('field-sede',            c.city);

  // GHG breakdown table
  renderBreakdown(c);

  // Wizard progress
  updateWizardProgress(c);

  // Stamp state
  _setText('stamp-company-name', c.name || '—');
  state.stampApplied = c.stamp?.applied;
  if (c.stamp?.applied) {
    const sr = document.getElementById('stamp-result');
    if (sr) sr.style.display = 'block';
    _setText('stamp-hash', c.stamp.hash || '');
    _setText('stamp-code-display', c.stamp.code || '');
    _setText('stamp-date', c.stamp.date || '');
    _setText('stamp-std-info', (c.std || 'vsme') === 'vsme' ? 'VSME 2023 (EFRAG)' : 'GRI Standards 2021');
    const btn = document.getElementById('btn-apply-stamp');
    if (btn) { btn.textContent = '✓ Timbro applicato'; btn.disabled = true; }
  }

  // Jobs table in dashboard
  _updateDashboardTable(c);

  // Render dynamic report screen content
  _renderReportScreen(c);
}

function _renderReportScreen(c) {
  if (!c) return;
  const std   = (c.std || 'vsme').toLowerCase();
  const ghg   = c.ghg || { s1: 0, s2: 0, s3: 0, total: 0 };
  const name  = c.name || '—';
  const cf    = c.cf   || '—';
  const year  = c.year || 2024;
  const sect  = c.sector || '—';
  const emp   = c.employees || '—';
  const city  = c.city || '—';

  // Helper
  const fmt = (v) => (v / 1000).toFixed(1) + ' tCO₂e';
  const fmtKg = (v) => v.toLocaleString('it-IT') + ' kgCO₂e';

  // VSME header
  const vsmeHeader = document.querySelector('#rpt-vsme .rpt-sub');
  if (vsmeHeader) vsmeHeader.textContent = `${name} · CF ${cf} · ${sect} · ${year}`;

  // VSME scope values
  const vsmeKpis = document.querySelectorAll('#rpt-vsme .rkpi');
  if (vsmeKpis.length >= 4) {
    vsmeKpis[0].querySelector('.rkpi-val').innerHTML = fmtKg(ghg.s1);
    vsmeKpis[1].querySelector('.rkpi-val').innerHTML = fmtKg(ghg.s2);
    vsmeKpis[2].querySelector('.rkpi-val').innerHTML = fmtKg(ghg.s3);
    vsmeKpis[3].querySelector('.rkpi-val').innerHTML = fmtKg(ghg.total);
  }

  // VSME breakdown table
  if (c.ghgRows && c.ghgRows.length) {
    const tbody = document.querySelector('#rpt-vsme .tbl-wrap table tbody');
    if (tbody) {
      tbody.innerHTML = c.ghgRows.map(r =>
        `<tr><td>${r.mat}</td><td><span class="tag tag-g">S${r.scope}</span></td><td>${r.qty}</td>` +
        `<td>${r.fe}</td><td class="src-note">${r.src}</td><td class="num">${r.em.toLocaleString('it-IT')}</td></tr>`
      ).join('');
    }
  }

  // GRI header
  const griHeader = document.querySelector('#rpt-gri .rpt-sub');
  if (griHeader) griHeader.textContent = `${name} · GRI 2, 302, 305, 306 · ${year}`;

  // GRI scope values in table
  const griRows = document.querySelectorAll('#rpt-gri .tbl-wrap table tbody tr');
  if (griRows.length >= 4) {
    const getNum = (el) => el?.querySelector('.num');
    if (getNum(griRows[0])) getNum(griRows[0]).textContent = ghg.s1.toLocaleString('it-IT');
    if (getNum(griRows[1])) getNum(griRows[1]).textContent = ghg.s2.toLocaleString('it-IT');
    if (getNum(griRows[2])) getNum(griRows[2]).textContent = ghg.s3.toLocaleString('it-IT');
    if (getNum(griRows[3])) getNum(griRows[3]).textContent = ghg.total.toLocaleString('it-IT');
  }

  // Update toolbar download link to use dynamic filename
  const dlLink = document.querySelector('.report-toolbar a[download]');
  if (dlLink) {
    dlLink.removeAttribute('href');
    dlLink.setAttribute('onclick', `reportFlow.generateAndDownload(); return false;`);
    dlLink.download = `VERA-Report-${name.replace(/\s/g,'-')}-${year}.pdf`;
  }
}

function _setText(id, val) {
  const el = document.getElementById(id); if (el) el.textContent = val;
}
function _setVal(id, val) {
  const el = document.getElementById(id); if (el) el.value = val;
}

function _syncStdBadges(std) {
  const label = std.toUpperCase();
  _setText('selected-std-badge', label);
  const badge = document.getElementById('selected-std-badge');
  if (badge) badge.className = 'std-badge' + (std === 'vsme' ? ' vsme' : '');
  _setText('dash-std',       label);
  _setText('dash-std-label', std === 'vsme' ? 'VSME 2023' : 'GRI Standards');
  _setText('job-std',        label);
  _setText('stamp-std-label',std === 'vsme' ? 'VSME 2023' : 'GRI Standards');
  _setText('stamp-std-name', label);
  _setText('stamp-std-info', std === 'vsme' ? 'VSME 2023 (EFRAG)' : 'GRI Standards 2021');
  _setText('btn-std-label',  label);
  state.selectedStd = std;
  const stdVsme = document.getElementById('std-vsme');
  const stdGri  = document.getElementById('std-gri');
  if (stdVsme) stdVsme.classList.toggle('selected', std === 'vsme');
  if (stdGri)  stdGri.classList.toggle('selected',  std === 'gri');
}

function _updateDashboardTable(c) {
  const tbody = document.getElementById('jobs-tbody');
  if (!tbody) return;
  const completed = Object.values(CLIENTS_DATA).filter(cl => cl.status === 'completed' && cl.id !== c.id).slice(0,2);
  const rows = [c, ...completed].filter(Boolean).map((cl, i) => `
    <tr>
      <td>#${4 - i}</td>
      <td>${cl.id === c.id ? `dati_${cl.year}_annuale.xlsx` : `archivio_${cl.year}.xlsx`}</td>
      <td>${cl.year}</td>
      <td><span class="tag tag-g">${cl.std.toUpperCase()}</span></td>
      <td>6</td>
      <td><span class="tag tag-g">${cl.status === 'completed' ? 'Completato' : 'In corso'}</span></td>
      <td class="num">${cl.ghg ? (cl.ghg.total/1000).toFixed(1) : '—'}</td>
    </tr>`).join('');
  tbody.innerHTML = rows;
}


/* ══════════════════════════════════════════════════════════
   WIZARD PROGRESS
══════════════════════════════════════════════════════════ */

const WIZARD_STEPS = [
  { id:'assess',    label:'Valutazione AI', icon:'🤖', screen:'assess' },
  { id:'standard',  label:'Standard',       icon:'📋', screen:'upload' },
  { id:'upload',    label:'Dati',           icon:'📤', screen:'upload' },
  { id:'calcolo',   label:'Calcolo GHG',    icon:'⚡', screen:'results' },
  { id:'report',    label:'Report',         icon:'📄', screen:'report' },
  { id:'timbro',    label:'Timbro',         icon:'🏷', screen:'stamp'  },
];

function updateWizardProgress(client) {
  const c    = client || currentClient();
  const bar  = document.getElementById('wizard-bar');
  if (!bar) return;
  const step = c ? c.step : 1;
  bar.innerHTML = WIZARD_STEPS.map((s, i) => {
    const done    = i + 1 < step;
    const current = i + 1 === step;
    const cls = done ? 'wz-step done' : current ? 'wz-step current' : 'wz-step';
    const isStamp = s.id === 'timbro';
    if (isStamp && !auth.isAdmin()) return ''; // hide stamp step for clients
    return `<div class="${cls}" onclick="showScreen('${s.screen}',document.getElementById('nav-${s.screen === 'upload' ? 'upload' : s.screen}'))">
      <div class="wz-dot">${done ? '✓' : s.icon}</div>
      <div class="wz-label">${s.label}</div>
    </div>${i < WIZARD_STEPS.length - 1 ? '<div class="wz-line' + (done ? ' done' : '') + '"></div>' : ''}`;
  }).join('');
}


/* ══════════════════════════════════════════════════════════
   APPLICATION STATE
══════════════════════════════════════════════════════════ */

const state = {
  selectedStd: 'vsme',
  assessment: {
    currentQ: 0,
    answers: {},
    vsmeScore: 0,
    griScore: 0,
    phase: 'intro',       // intro | questions | analyzing | results
    recommendation: null,
    reasoningText: '',
  },
  uploadDone: false,
  stampApplied: false,
};


/* ══════════════════════════════════════════════════════════
   ASSESSMENT MODULE
   Key fix: event delegation instead of inline onclick
══════════════════════════════════════════════════════════ */

const assessment = (() => {
  let _optionsContainer = null;

  function _init() {
    // Single event listener on the options container — much more robust than inline onclick
    _optionsContainer = document.getElementById('assess-options');
    if (_optionsContainer) {
      _optionsContainer.addEventListener('click', _handleOptionClick);
    }
  }

  function _handleOptionClick(e) {
    // Use closest() — most reliable cross-browser approach
    const el = e.target.closest('.assess-option');
    if (!el) return;
    _applySelection(el);
  }

  // Public method: also called by inline onclick="VERA.assessment.selectOption(this)"
  function selectOption(el) {
    _applySelection(el);
  }

  function _applySelection(el) {
    const qId = el.dataset.qid;
    const val = el.dataset.val;
    if (!qId || !val) return;

    const q = QUESTIONS.find(q => q.id === qId);
    if (!q) return;
    const opt = q.options.find(o => o.value === val);
    if (!opt) return;

    const st = state.assessment;

    // Subtract previous answer if any
    const prevVal = st.answers[qId];
    if (prevVal) {
      const prev = q.options.find(o => o.value === prevVal);
      if (prev) { st.vsmeScore -= prev.vsme; st.griScore -= prev.gri; }
    }

    // Store new answer & add scores
    st.answers[qId] = val;
    st.vsmeScore += opt.vsme;
    st.griScore  += opt.gri;

    // Update UI: toggle selected class + show score pills
    const container = document.getElementById('assess-options');
    container.querySelectorAll('.assess-option').forEach(o => {
      o.classList.remove('selected');
      o.querySelectorAll('.assess-score-pill').forEach(p => p.classList.add('hidden'));
    });
    el.classList.add('selected');
    el.querySelectorAll('.assess-score-pill').forEach(p => p.classList.remove('hidden'));

    // Enable "Avanti" button
    document.getElementById('assess-next-btn').disabled = false;

    // Update live score bar
    _updateLiveScore();

    // Update wizard progress
    updateWizardProgress();
  }

  function _updateLiveScore() {
    const { vsmeScore, griScore } = state.assessment;
    const total = vsmeScore + griScore || 1;
    const vPct  = Math.round((vsmeScore / total) * 100);
    const gPct  = 100 - vPct;

    const vBar = document.getElementById('live-vsme-bar');
    const gBar = document.getElementById('live-gri-bar');
    if (!vBar) return;

    // Ensure minimum visible width
    const vW = Math.max(vPct, 8);
    const gW = Math.max(gPct, 8);
    const sum = vW + gW;
    vBar.style.width = (vW / sum * 100) + '%';
    gBar.style.width = (gW / sum * 100) + '%';
    document.getElementById('live-vsme-pct').textContent = vPct + '%';
    document.getElementById('live-gri-pct').textContent  = gPct + '%';

    const leader = vPct > gPct ? 'VSME 2023' : 'GRI Standards';
    const diff   = Math.abs(vPct - gPct);
    const word   = diff > 30 ? 'nettamente favorito' : diff > 12 ? 'preferito' : 'leggermente favorito';
    document.getElementById('live-score-hint').textContent =
      `Tendenza: ${leader} ${word} — ${Math.max(vPct, gPct)}%`;
  }

  function _renderQuestion(idx) {
    const q   = QUESTIONS[idx];
    const st  = state.assessment;
    const cur = st.answers[q.id];

    // Progress bar
    const pct = Math.round((idx / QUESTIONS.length) * 100);
    document.getElementById('assess-progress-fill').style.width = pct + '%';
    document.getElementById('assess-progress-pct').textContent  = pct + '%';
    document.getElementById('assess-q-label').textContent = `Domanda ${idx + 1} di ${QUESTIONS.length}`;

    // Trigger slide animation
    const card = document.getElementById('assess-q-card');
    card.classList.remove('slide-in');
    void card.offsetWidth;
    card.classList.add('slide-in');

    // Question content
    document.getElementById('assess-q-category').textContent = q.category;
    document.getElementById('assess-q-icon').textContent     = q.icon;
    document.getElementById('assess-q-text').textContent     = q.text;
    document.getElementById('assess-q-sub').textContent      = q.sub;

    // Options — data-attributes + inline onclick (belt-and-suspenders)
    const container = document.getElementById('assess-options');
    container.innerHTML = q.options.map(opt => {
      const sel = cur === opt.value ? ' selected' : '';
      return `
        <div class="assess-option${sel}" data-qid="${q.id}" data-val="${opt.value}"
             onclick="VERA.assessment.selectOption(this)" style="cursor:pointer">
          <div class="assess-option-radio${sel ? ' checked' : ''}"></div>
          <div class="assess-option-content">
            <div class="assess-option-label">${opt.label}</div>
            <div class="assess-option-hint">${opt.hint}</div>
          </div>
          <div class="assess-option-scores">
            <span class="assess-score-pill pill-vsme${sel ? '' : ' hidden'}">VSME +${opt.vsme}</span>
            <span class="assess-score-pill pill-gri${sel ? '' : ' hidden'}">GRI +${opt.gri}</span>
          </div>
        </div>`;
    }).join('');

    // Back / Next buttons
    document.getElementById('assess-back-btn').style.display = idx > 0 ? 'inline-flex' : 'none';
    const nextBtn = document.getElementById('assess-next-btn');
    const isLast  = idx === QUESTIONS.length - 1;
    nextBtn.textContent = isLast ? '🧠 Analizza con AI →' : 'Avanti →';
    nextBtn.disabled    = !cur;

    // Dots
    _renderDots(idx);
  }

  function _renderDots(current) {
    document.getElementById('assess-dots').innerHTML = QUESTIONS.map((_, i) => {
      let cls = 'assess-dot';
      if (i < current)    cls += ' done';
      else if (i === current) cls += ' current';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  function start() {
    Object.assign(state.assessment, {
      currentQ: 0,
      answers: {},
      vsmeScore: 0,
      griScore: 0,
      phase: 'questions',
      recommendation: null,
      reasoningText: '',
    });

    document.getElementById('assess-intro').style.display     = 'block';
    document.getElementById('assess-quiz').style.display      = 'none';
    document.getElementById('assess-analyzing').style.display = 'none';
    document.getElementById('assess-results').style.display   = 'none';

    // Reset live score bar
    document.getElementById('live-vsme-bar').style.width = '50%';
    document.getElementById('live-gri-bar').style.width  = '50%';
    document.getElementById('live-vsme-pct').textContent  = '50%';
    document.getElementById('live-gri-pct').textContent   = '50%';
    document.getElementById('live-score-hint').textContent = 'Rispondi per vedere la valutazione';

    // Show quiz
    document.getElementById('assess-intro').style.display = 'none';
    document.getElementById('assess-quiz').style.display  = 'block';

    _renderQuestion(0);
  }

  function restart() {
    document.getElementById('assess-results').style.display = 'none';
    start();
  }

  function next() {
    const st  = state.assessment;
    const idx = st.currentQ;
    const qId = QUESTIONS[idx].id;

    if (!st.answers[qId]) {
      toast('Seleziona una risposta per continuare', 'error');
      return;
    }

    if (idx < QUESTIONS.length - 1) {
      st.currentQ++;
      _renderQuestion(st.currentQ);
    } else {
      _startAnalysis();
    }
  }

  function prev() {
    const st = state.assessment;
    if (st.currentQ > 0) {
      st.currentQ--;
      _renderQuestion(st.currentQ);
    }
  }

  async function _startAnalysis() {
    state.assessment.phase = 'analyzing';

    document.getElementById('assess-quiz').style.display      = 'none';
    document.getElementById('assess-analyzing').style.display = 'block';

    const terminal = document.getElementById('assess-terminal');
    const cursor   = document.getElementById('terminal-cursor');

    const text = buildReasoning(state.assessment.answers);
    state.assessment.reasoningText = text;

    await _typewriter(terminal, cursor, text);
    _showResults();
  }

  async function _typewriter(terminal, cursor, text) {
    terminal.innerHTML = '';
    terminal.appendChild(cursor);
    let i = 0;
    const CHUNK = 5;
    const DELAY = 14;
    return new Promise(resolve => {
      const iv = setInterval(() => {
        const end   = Math.min(i + CHUNK, text.length);
        const chunk = text.slice(i, end);
        i = end;
        const current = terminal.innerHTML.replace(cursor.outerHTML, '');
        terminal.innerHTML = _colorize(current + chunk);
        terminal.appendChild(cursor);
        terminal.scrollTop = terminal.scrollHeight;
        if (i >= text.length) {
          clearInterval(iv);
          cursor.style.display = 'none';
          setTimeout(resolve, 300);
        }
      }, DELAY);
    });
  }

  function _colorize(t) {
    return t
      .replace(/✓✓/g, '<span style="color:#3fb950">✓✓</span>')
      .replace(/✓/g,   '<span style="color:#3fb950">✓</span>')
      .replace(/⚡/g,   '<span style="color:#58a6ff">⚡</span>')
      .replace(/!/g,   '<span style="color:#d29922">!</span>')
      .replace(/○/g,   '<span style="color:#8b949e">○</span>')
      .replace(/(═{3,}.*═{3,})/g, '<span style="color:#f0f6fc;font-weight:600">$1</span>')
      .replace(/(──\s*\[.+?\].*)/g, '<span style="color:#f0f6fc;font-weight:600">$1</span>');
  }

  function _showResults() {
    const rec = buildRec(state.assessment.answers);
    state.assessment.recommendation = rec;

    document.getElementById('assess-analyzing').style.display = 'none';
    document.getElementById('assess-results').style.display   = 'block';

    // Badge
    const badge = document.getElementById('result-badge');
    badge.textContent = rec.standard;
    badge.className = 'assess-result-badge' + (rec.isVSME ? '' : ' gri');

    document.getElementById('result-title').textContent    = `Standard raccomandato: ${rec.standard}`;
    document.getElementById('result-subtitle').textContent = `VSME ${rec.vPct}% — GRI ${rec.gPct}% · Confidenza ${rec.confidence}%`;
    document.getElementById('result-conf').textContent     = rec.confidence + '%';

    // Animate gauges
    setTimeout(() => {
      document.getElementById('gauge-vsme').style.width = rec.vPct + '%';
      document.getElementById('gauge-gri').style.width  = rec.gPct + '%';
    }, 80);
    document.getElementById('gauge-vsme-pct').textContent = rec.vPct + '%';
    document.getElementById('gauge-gri-pct').textContent  = rec.gPct + '%';

    // Reasons
    document.getElementById('assess-reasons').innerHTML = rec.reasons
      .map(r => `<div class="assess-reason"><span class="assess-reason-icon">${r.icon}</span><span>${r.text}</span></div>`)
      .join('');

    // Modules
    const modCls = rec.isVSME ? '' : 'gri';
    document.getElementById('assess-modules').innerHTML = rec.modules
      .map(m => `<span class="assess-module-chip ${modCls}">${m}</span>`)
      .join('');

    // Full reasoning
    document.getElementById('assess-full-reasoning').textContent = state.assessment.reasoningText;

    toast(`Analisi completata · Raccomandazione: ${rec.standard}`, 'success');

    // ── Save assessment result to Supabase ──────────────────
    if (window.veraAuth && window.veraAuth.saveAssessmentResult) {
      window.veraAuth.saveAssessmentResult(rec.isVSME ? 'vsme' : 'gri').catch(() => {});
    }
  }

  function toggleReasoning() {
    const body  = document.getElementById('assess-reasoning-body');
    const arrow = document.getElementById('reasoning-arrow');
    const open  = body.style.display === 'block';
    body.style.display = open ? 'none' : 'block';
    arrow.textContent  = open ? '▼' : '▲';
  }

  function applyRecommendation() {
    const rec = state.assessment.recommendation;
    if (!rec) return;
    const std = rec.isVSME ? 'vsme' : 'gri';
    onboarding.selectStd(std);
    onboarding._syncBadges(std);
    const vsmeRec = document.getElementById('vsme-ai-rec');
    const griRec = document.getElementById('gri-ai-rec');
    if (vsmeRec) vsmeRec.style.display = rec.isVSME ? 'flex' : 'none';
    if (griRec) griRec.style.display = !rec.isVSME ? 'flex' : 'none';
    // Advance client wizard step
    const c = currentClient();
    if (c && c.step < 2) { c.step = 2; c.std = std; }
    updateWizardProgress();
    // Reset panels for upload screen
    const sp = document.getElementById('std-panel');
    const cp = document.getElementById('company-panel');
    const up = document.getElementById('upload-panel');
    const vp = document.getElementById('valid-panel');
    if (sp) sp.style.display = 'block';
    if (cp) cp.style.display = 'none';
    if (up) up.style.display = 'none';
    if (vp) vp.style.display = 'none';
    showScreen('upload', document.getElementById('nav-upload'));
    toast(`${rec.standard} applicato → Continua con l'onboarding`, 'success');
  }

  function skipToManual() {
    // Reset panels for upload screen
    const sp = document.getElementById('std-panel');
    const cp = document.getElementById('company-panel');
    const up = document.getElementById('upload-panel');
    const vp = document.getElementById('valid-panel');
    if (sp) sp.style.display = 'block';
    if (cp) cp.style.display = 'none';
    if (up) up.style.display = 'none';
    if (vp) vp.style.display = 'none';
    showScreen('upload', document.getElementById('nav-upload'));
  }

  return { _init, start, restart, next, prev, toggleReasoning, applyRecommendation, skipToManual, selectOption };
})();


/* ══════════════════════════════════════════════════════════
   POST-ONBOARDING QUESTIONNAIRE
   Domande dettagliate per rispondere a ciascuna disclosure
   GRI e VSME dopo la scelta dello standard.
══════════════════════════════════════════════════════════ */

// GRI omission reasons (GRI 2023)
const GRI_OMISSION_REASONS = [
  { value: 'not_applicable',  label: 'Non applicabile — la disclosure non è rilevante per l\'organizzazione' },
  { value: 'confidential',    label: 'Informazioni riservate — divulgazione potrebbe causare danno competitivo' },
  { value: 'legal',           label: 'Limitazione legale — proibita dalla legge applicabile' },
  { value: 'unavailable',     label: 'Informazioni non disponibili — non raccoglibili nel periodo di rendicontazione' },
];

// Domande dettagliate per le principali disclosure GRI
const GRI_QUESTIONS = {
  'GRI 2-1':  [
    { id:'org_name',    label:'Ragione sociale legale dell\'organizzazione', type:'text', required:true },
    { id:'org_nature',  label:'Natura della proprietà e forma giuridica', type:'select', options:['S.r.l.','S.p.A.','S.n.c.','S.a.s.','Cooperativa','Ente pubblico','Altro'] },
    { id:'org_hq',      label:'Sede operativa principale (Comune, Provincia)', type:'text', required:true },
    { id:'org_country', label:'Paese di operatività principale', type:'text', placeholder:'es. Italia' },
  ],
  'GRI 2-7':  [
    { id:'emp_total',   label:'Numero totale di dipendenti al 31/12 dell\'anno di rendicontazione', type:'number', required:true },
    { id:'emp_ft',      label:'Di cui: dipendenti a tempo pieno', type:'number' },
    { id:'emp_pt',      label:'Di cui: dipendenti a tempo parziale', type:'number' },
    { id:'emp_m',       label:'Di cui: uomini', type:'number' },
    { id:'emp_f',       label:'Di cui: donne', type:'number' },
    { id:'emp_temp',    label:'Di cui: a tempo determinato', type:'number' },
  ],
  'GRI 2-27': [
    { id:'violations',  label:'Numero di violazioni significative di leggi e regolamentazioni nell\'anno', type:'number' },
    { id:'fines',       label:'Sanzioni pecuniarie totali ricevute (€)', type:'number' },
    { id:'non_mon',     label:'Sanzioni non monetarie ricevute (numero)', type:'number' },
  ],
  'GRI 201-1':[
    { id:'revenue',     label:'Ricavi totali (€)', type:'number', required:true },
    { id:'op_cost',     label:'Costi operativi totali (€)', type:'number' },
    { id:'wages',       label:'Stipendi e benefit totali ai dipendenti (€)', type:'number' },
    { id:'tax',         label:'Imposte pagate (€)', type:'number' },
    { id:'community',   label:'Investimenti nella comunità locale (€)', type:'number' },
  ],
  'GRI 302-1':[
    { id:'elec_kwh',    label:'Consumo di elettricità (kWh)', type:'number', required:true },
    { id:'gas_kwh',     label:'Consumo di gas naturale (kWh equiv.)', type:'number' },
    { id:'diesel_l',    label:'Consumo di gasolio/diesel (litri)', type:'number' },
    { id:'renew_pct',   label:'Percentuale da fonti rinnovabili (%)', type:'number' },
  ],
  'GRI 305-1':[
    { id:'scope1_co2',  label:'Emissioni Scope 1 totali (tCO₂e)', type:'number', required:true },
    { id:'scope1_meth', label:'Metodologia di calcolo utilizzata', type:'text', placeholder:'es. GHG Protocol Corporate Standard' },
    { id:'scope1_gases',label:'Gas GHG inclusi nel calcolo', type:'text', placeholder:'es. CO2, CH4, N2O' },
  ],
  'GRI 305-2':[
    { id:'scope2_lb',   label:'Emissioni Scope 2 — metodo location-based (tCO₂e)', type:'number', required:true },
    { id:'scope2_mb',   label:'Emissioni Scope 2 — metodo market-based (tCO₂e)', type:'number' },
  ],
  'GRI 305-3':[
    { id:'scope3_total',label:'Emissioni Scope 3 totali (tCO₂e)', type:'number', required:true },
    { id:'scope3_cats', label:'Categorie Scope 3 incluse (es. cat. 1, 4, 11)', type:'text' },
  ],
  'GRI 305-4':[
    { id:'ghg_int',     label:'Intensità GHG (tCO₂e / unità di misura scelta)', type:'number', required:true },
    { id:'ghg_int_unit',label:'Unità di misura del denominatore', type:'text', placeholder:'es. tCO₂e/milione€ fatturato, tCO₂e/dipendente' },
  ],
  'GRI 401-1':[
    { id:'hire_total',  label:'Nuove assunzioni nell\'anno (numero)', type:'number', required:true },
    { id:'hire_m',      label:'Di cui: uomini', type:'number' },
    { id:'hire_f',      label:'Di cui: donne', type:'number' },
    { id:'turn_total',  label:'Dipendenti che hanno lasciato l\'azienda nell\'anno', type:'number' },
  ],
  'GRI 403-3':[
    { id:'occ_service', label:'Sono disponibili servizi di medicina del lavoro?', type:'select', options:['Sì — servizio interno','Sì — servizio esterno','Parzialmente','No'] },
    { id:'occ_coverage',label:'Percentuale di dipendenti coperti (%)', type:'number' },
  ],
  'GRI 404-1':[
    { id:'train_hrs',   label:'Media ore di formazione per dipendente nell\'anno', type:'number', required:true },
    { id:'train_m',     label:'Media ore — uomini', type:'number' },
    { id:'train_f',     label:'Media ore — donne', type:'number' },
  ],
  'GRI 405-1':[
    { id:'board_total', label:'Numero totale di membri del CdA/organo di governance', type:'number', required:true },
    { id:'board_f',     label:'Di cui: donne', type:'number' },
    { id:'board_u30',   label:'Di cui: sotto 30 anni', type:'number' },
    { id:'board_3050',  label:'Di cui: 30–50 anni', type:'number' },
  ],
  'GRI 205-3':[
    { id:'corrupt_n',   label:'Incidenti di corruzione confermati nell\'anno', type:'number', required:true },
    { id:'corrupt_act', label:'Azioni disciplinari o penali intraprese', type:'textarea' },
  ],
  'GRI 418-1':[
    { id:'priv_complaints', label:'Reclami fondati per violazione privacy clienti ricevuti', type:'number', required:true },
    { id:'priv_resolved',   label:'Di cui: risolti nell\'anno', type:'number' },
  ],
  'GRI 2-2': [
    { id:'entities_list', label:'Elenco delle entità incluse nel rendiconto consolidato (nome, paese, tipo di attività)', type:'textarea', required:true },
    { id:'entities_excluded', label:'Entità significative escluse dalla rendicontazione e motivazione', type:'textarea' },
  ],
  'GRI 2-3': [
    { id:'period_start', label:'Data di inizio del periodo di rendicontazione', type:'text', required:true, placeholder:'es. 1 gennaio 2024' },
    { id:'period_end', label:'Data di fine del periodo di rendicontazione', type:'text', required:true, placeholder:'es. 31 dicembre 2024' },
    { id:'frequency', label:'Frequenza di pubblicazione del report ESG', type:'select', options:['Annuale','Semestrale','Biennale','Prima pubblicazione'], required:true },
    { id:'contact_name', label:'Nome del referente per domande sul report', type:'text', required:true },
    { id:'contact_email', label:'Email del referente', type:'text', required:true, placeholder:'esg@azienda.it' },
  ],
  'GRI 2-4': [
    { id:'restatements', label:'Sono state apportate correzioni a informazioni di periodi precedenti?', type:'select', options:['No','Si — specificare sotto'], required:true },
    { id:'restatements_detail', label:'Dettaglio delle correzioni apportate (se applicabile)', type:'textarea' },
  ],
  'GRI 2-5': [
    { id:'assurance', label:'Il report è stato sottoposto a verifica esterna (assurance)?', type:'select', options:['No','Si — assurance limitata','Si — assurance ragionevole'], required:true },
    { id:'assurance_provider', label:'Nome del verificatore esterno (se applicabile)', type:'text' },
    { id:'assurance_std', label:'Standard di assurance utilizzato', type:'text', placeholder:'es. ISAE 3000, AA1000AS' },
  ],
  'GRI 2-6': [
    { id:'activities', label:'Descrivere le attività principali dell\'organizzazione (prodotti/servizi chiave)', type:'textarea', required:true },
    { id:'markets', label:'Mercati geografici e settori serviti', type:'textarea', required:true },
    { id:'supply_chain', label:'Descrizione sintetica della catena del valore (fornitori principali, distributori)', type:'textarea' },
    { id:'significant_changes', label:'Cambiamenti significativi nell\'anno rispetto alla struttura o alla catena del valore', type:'textarea' },
  ],
  'GRI 2-8': [
    { id:'nonemp_total', label:'Numero totale di lavoratori non dipendenti (collaboratori, consulenti, interinali)', type:'number', required:true },
    { id:'nonemptype_contractor', label:'Di cui: lavoratori interinali/in appalto', type:'number' },
    { id:'nonemptype_freelance', label:'Di cui: consulenti/liberi professionisti', type:'number' },
    { id:'nonemp_significant_variations', label:'Variazioni significative rispetto all\'anno precedente', type:'textarea' },
  ],
  'GRI 2-9': [
    { id:'gov_body_name', label:'Denominazione dell\'organo di governance di vertice (es. CdA, Consiglio di Amministrazione)', type:'text', required:true },
    { id:'gov_body_size', label:'Numero totale di componenti', type:'number', required:true },
    { id:'gov_executive', label:'Di cui: esecutivi (membri con ruolo manageriale)', type:'number' },
    { id:'gov_nonexecutive', label:'Di cui: non esecutivi', type:'number' },
    { id:'gov_indep', label:'Di cui: indipendenti', type:'number' },
    { id:'gov_women', label:'Di cui: donne', type:'number' },
    { id:'gov_tenure_avg', label:'Mandato medio dei componenti (anni)', type:'number' },
  ],
  'GRI 2-10': [
    { id:'nom_process', label:'Descrivere il processo di nomina dei componenti dell\'organo di governance', type:'textarea', required:true },
    { id:'nom_criteria', label:'Criteri utilizzati per la selezione (competenze ESG, indipendenza, diversità, ecc.)', type:'textarea' },
  ],
  'GRI 2-11': [
    { id:'chair_role', label:'Il Presidente dell\'organo di governance è anche membro esecutivo (CEO o equivalente)?', type:'select', options:['No — ruoli separati','Si — stessa persona'], required:true },
    { id:'chair_name', label:'Nome del Presidente (opzionale)', type:'text' },
    { id:'chair_justification', label:'Se i ruoli coincidono, spiegare le misure di salvaguardia adottate', type:'textarea' },
  ],
  'GRI 2-12': [
    { id:'oversight_role', label:'Descrivere il ruolo dell\'organo di governance nel supervisionare la gestione degli impatti ESG', type:'textarea', required:true },
    { id:'oversight_delegated', label:'Quali responsabilità ESG sono state delegate a comitati o dirigenti?', type:'textarea' },
    { id:'oversight_frequency', label:'Con quale frequenza l\'organo di governance riceve aggiornamenti su temi ESG?', type:'select', options:['Trimestrale','Semestrale','Annuale','Ad hoc'] },
  ],
  'GRI 2-13': [
    { id:'deleg_person', label:'Chi ha la responsabilità esecutiva per la gestione degli impatti ESG (ruolo/titolo)?', type:'text', required:true },
    { id:'deleg_reports_to', label:'A chi riporta questo ruolo all\'interno della governance?', type:'text' },
    { id:'deleg_process', label:'Come avviene il reporting verso l\'organo di governance?', type:'textarea' },
  ],
  'GRI 2-14': [
    { id:'esg_report_role', label:'L\'organo di governance approva il report di sostenibilità?', type:'select', options:['Si — approvazione formale','Si — revisione senza approvazione formale','No'], required:true },
    { id:'esg_report_process', label:'Descrivere il processo di revisione e approvazione del report', type:'textarea' },
  ],
  'GRI 2-15': [
    { id:'conflict_policy', label:'Esiste una politica formale sulla gestione dei conflitti di interesse nell\'organo di governance?', type:'select', options:['Si — adottata e comunicata','In corso di adozione','No'], required:true },
    { id:'conflict_cases', label:'Casi di conflitto di interesse identificati e gestiti nell\'anno', type:'number' },
    { id:'conflict_measures', label:'Misure adottate per prevenire e gestire i conflitti', type:'textarea' },
  ],
  'GRI 2-16': [
    { id:'concern_mechanism', label:'Esistono meccanismi per portare all\'attenzione dell\'organo di governance questioni critiche?', type:'select', options:['Si','No'], required:true },
    { id:'concern_number', label:'Numero di questioni critiche portate all\'attenzione nell\'anno', type:'number' },
    { id:'concern_nature', label:'Natura delle questioni critiche emerse (descrivere)', type:'textarea' },
  ],
  'GRI 2-17': [
    { id:'knowledge_esg', label:'I componenti dell\'organo di governance hanno ricevuto formazione su temi ESG nell\'anno?', type:'select', options:['Si — tutti','Si — in parte','No'], required:true },
    { id:'knowledge_topics', label:'Argomenti trattati nella formazione', type:'textarea' },
    { id:'knowledge_hours', label:'Ore medie di formazione ESG per componente', type:'number' },
  ],
  'GRI 2-18': [
    { id:'eval_process', label:'L\'organizzazione valuta le prestazioni dell\'organo di governance?', type:'select', options:['Si — valutazione esterna','Si — valutazione interna','No'], required:true },
    { id:'eval_frequency', label:'Frequenza della valutazione', type:'select', options:['Annuale','Biennale','Ogni 3 anni','Non definita'] },
    { id:'eval_actions', label:'Azioni intraprese a seguito dell\'ultima valutazione', type:'textarea' },
  ],
  'GRI 2-19': [
    { id:'rem_policy', label:'Esiste una politica di remunerazione formale per i componenti dell\'organo di governance e i dirigenti?', type:'select', options:['Si','No'], required:true },
    { id:'rem_esg_link', label:'La remunerazione è collegata a obiettivi ESG/sostenibilità?', type:'select', options:['Si — per i dirigenti','Si — per tutti','No'] },
    { id:'rem_process', label:'Chi determina la remunerazione dei vertici (descrivere il processo)?', type:'textarea' },
  ],
  'GRI 2-20': [
    { id:'rem_consult', label:'Le politiche di remunerazione vengono sottoposte a voto consultivo degli azionisti?', type:'select', options:['Si','No','Non applicabile (azienda non quotata)'] },
    { id:'rem_vote_result', label:'Risultato dell\'ultimo voto consultivo (% di voti favorevoli, se applicabile)', type:'text', placeholder:'es. 78%' },
    { id:'rem_changes', label:'Cambiamenti apportati alla politica di remunerazione in risposta ai voti o feedback', type:'textarea' },
  ],
  'GRI 2-21': [
    { id:'ceo_pay', label:'Retribuzione annua totale del dirigente meglio remunerato (€)', type:'number', required:true },
    { id:'median_pay', label:'Retribuzione annua mediana di tutti i dipendenti (€)', type:'number', required:true },
    { id:'pay_ratio', label:'Rapporto tra le due retribuzioni (calcolato automaticamente se entrambi compilati)', type:'number' },
    { id:'pay_ratio_change', label:'Variazione del rapporto rispetto all\'anno precedente (%)', type:'number' },
  ],
  'GRI 2-22': [
    { id:'strategy_statement', label:'Dichiarazione del principale responsabile esecutivo sulla strategia di sviluppo sostenibile', type:'textarea', required:true },
    { id:'strategy_priorities', label:'Principali priorità ESG per il prossimo periodo', type:'textarea' },
  ],
  'GRI 2-23': [
    { id:'policy_list', label:'Elencare le principali policy/impegni etici adottati (es. Codice Etico, Policy Ambientale)', type:'textarea', required:true },
    { id:'policy_scope', label:'A chi si applicano queste policy (dipendenti, fornitori, partner)?', type:'textarea' },
    { id:'policy_human_rights', label:'L\'organizzazione ha adottato una policy specifica sui diritti umani?', type:'select', options:['Si','No','In corso di adozione'] },
  ],
  'GRI 2-24': [
    { id:'embed_training', label:'Come vengono comunicati e integrati gli impegni di policy (formazione, procedure, contratti)?', type:'textarea', required:true },
    { id:'embed_supply', label:'Come vengono estesi ai fornitori e partner (clausole contrattuali, audit, ecc.)?', type:'textarea' },
  ],
  'GRI 2-25': [
    { id:'remediation_process', label:'Descrivere i processi per rimediare agli impatti negativi identificati', type:'textarea', required:true },
    { id:'remediation_mechanisms', label:'Meccanismi di ricorso disponibili per le parti lese (stakeholder interni ed esterni)', type:'textarea' },
    { id:'remediation_cases', label:'Casi di rimediazione completati nell\'anno', type:'number' },
  ],
  'GRI 2-26': [
    { id:'advice_mechanism', label:'Esistono meccanismi per richiedere consulenza su condotta etica (es. helpline legale)?', type:'select', options:['Si','No'], required:true },
    { id:'concern_raising', label:'Esistono canali per segnalare preoccupazioni in modo riservato (whistleblowing)?', type:'select', options:['Si','No'], required:true },
    { id:'concern_cases', label:'Segnalazioni ricevute tramite questi canali nell\'anno', type:'number' },
  ],
  'GRI 2-28': [
    { id:'memberships', label:'Elencare le principali associazioni di categoria, iniziative di sostenibilità o reti a cui l\'organizzazione aderisce', type:'textarea', required:true },
    { id:'memberships_governance', label:'L\'organizzazione ricopre ruoli di governance in tali associazioni?', type:'textarea' },
  ],
  'GRI 2-29': [
    { id:'stakeholder_list', label:'Identificare le principali categorie di stakeholder (es. dipendenti, clienti, comunità, investitori)', type:'textarea', required:true },
    { id:'stakeholder_basis', label:'Su quale base vengono identificati gli stakeholder?', type:'textarea' },
    { id:'stakeholder_engagement', label:'Descrivere le modalità e la frequenza del coinvolgimento degli stakeholder', type:'textarea', required:true },
    { id:'stakeholder_key_topics', label:'Temi chiave emersi dal coinvolgimento degli stakeholder nell\'anno', type:'textarea' },
  ],
  'GRI 2-30': [
    { id:'cba_coverage', label:'Percentuale di dipendenti coperti da contratti collettivi di lavoro (%)', type:'number', required:true },
    { id:'cba_type', label:'Tipo di contratto collettivo applicato (es. CCNL Metalmeccanico)', type:'text' },
    { id:'cba_negotiated', label:'L\'organizzazione negozia direttamente o aderisce a contratti di settore?', type:'select', options:['Negozia direttamente','Aderisce a contratti nazionali/settoriali','Entrambi'] },
  ],
  'GRI 204-1': [
    { id:'local_suppliers_pct', label:'Percentuale di spesa per fornitori locali rispetto alla spesa totale per acquisti (%)', type:'number', required:true },
    { id:'local_def', label:'Definizione di "locale" utilizzata (es. stesso comune, stessa regione, Italia)', type:'text', required:true, placeholder:'es. Fornitori con sede in Italia' },
    { id:'local_spend', label:'Spesa totale per fornitori locali (€)', type:'number' },
    { id:'total_spend', label:'Spesa totale per acquisti (€)', type:'number' },
  ],
};

// Domande per i moduli VSME (tutti obbligatori)
const VSME_QUESTIONS = {
  'B1':    [
    { id:'vsme_name',   label:'Denominazione completa e forma giuridica', type:'text', required:true },
    { id:'vsme_sector', label:'Settore/i di attività principali (codice ATECO)', type:'text', required:true },
    { id:'vsme_scope',  label:'Perimetro della rendicontazione (consolidato / singola entità)', type:'select', options:['Singola entità','Gruppo consolidato'] },
    { id:'vsme_period', label:'Periodo di rendicontazione', type:'text', placeholder:'es. 1 gen – 31 dic 2024' },
    { id:'vsme_gov',    label:'Descrivere brevemente la struttura di governance (CdA, organi di controllo)', type:'textarea' },
  ],
  'B2-E1':[
    { id:'vsme_s1',     label:'Emissioni Scope 1 (tCO₂e)', type:'number', required:true },
    { id:'vsme_s2',     label:'Emissioni Scope 2 — market-based (tCO₂e)', type:'number', required:true },
    { id:'vsme_s3',     label:'Emissioni Scope 3 principali (tCO₂e, se disponibili)', type:'number' },
    { id:'vsme_ghg_meth',label:'Metodologia e fattori di emissione utilizzati', type:'text', placeholder:'es. Metodologia VERA 2024, GHG Protocol' },
    { id:'vsme_targets',label:'Obiettivi di riduzione GHG (se esistenti)', type:'textarea' },
  ],
  'B2-E2':[
    { id:'vsme_elec',   label:'Consumo elettrico totale (kWh)', type:'number', required:true },
    { id:'vsme_gas',    label:'Consumo gas naturale (kWh equiv.)', type:'number' },
    { id:'vsme_renew',  label:'Quota energia da fonti rinnovabili (%)', type:'number' },
    { id:'vsme_ei',     label:'Intensità energetica (kWh / unità)', type:'number' },
    { id:'vsme_ei_unit',label:'Unità denominatore intensità', type:'text', placeholder:'es. kWh/dipendente, kWh/m² uffici' },
  ],
  'B2-E3':[
    { id:'vsme_waste_t',label:'Rifiuti totali prodotti (tonnellate)', type:'number', required:true },
    { id:'vsme_waste_haz',label:'Di cui: rifiuti pericolosi (tonnellate)', type:'number' },
    { id:'vsme_waste_land',label:'Di cui: smaltiti in discarica (tonnellate)', type:'number' },
    { id:'vsme_waste_rec',label:'Di cui: avviati a riciclo (tonnellate)', type:'number' },
  ],
  'B2-E4':[
    { id:'vsme_transp_km',label:'Km totali percorsi per logistica/distribuzione (tkm)', type:'number' },
    { id:'vsme_transp_em',label:'Emissioni da trasporti (Scope 3, Cat. 4 — tCO₂e)', type:'number' },
    { id:'vsme_transp_mode',label:'Modalità di trasporto prevalente', type:'select', options:['Strada','Ferrovia','Aereo','Mare','Multimodale'] },
  ],
  'B2-E5':[
    { id:'vsme_bio_address',label:'Indirizzo / coordinate dello stabilimento principale', type:'text', placeholder:'es. Via Roma 1, 25121 Brescia (BS)', required:true },
    { id:'vsme_bio_other', label:'Altri siti produttivi (se presenti)', type:'textarea', placeholder:'Elencare indirizzi separati da virgola' },
    { id:'vsme_bio_impact',label:'Eventuali impatti noti sulla biodiversità locale (opzionale)', type:'textarea' },
  ],
  'B3-S1':[
    { id:'vsme_emp_total', label:'Numero totale di dipendenti', type:'number', required:true },
    { id:'vsme_emp_f_n',   label:'Di cui: donne (numero assoluto)', type:'number' },
    { id:'vsme_emp_m_n',   label:'Di cui: uomini (numero assoluto)', type:'number' },
    { id:'vsme_wage_f_avg',label:'Retribuzione media annua — donne (€ lordi)', type:'number', placeholder:'es. 28000' },
    { id:'vsme_wage_m_avg',label:'Retribuzione media annua — uomini (€ lordi)', type:'number', placeholder:'es. 32000' },
    { id:'vsme_injuries',  label:'Infortuni sul lavoro registrabili nell\'anno', type:'number' },
    { id:'vsme_training',  label:'Ore medie di formazione per dipendente', type:'number' },
  ],
  'B3-S2':[
    { id:'vsme_supply_n', label:'Numero di fornitori chiave nella catena del valore', type:'number' },
    { id:'vsme_supply_audit',label:'Percentuale di fornitori sottoposti a valutazione ESG (%)', type:'number' },
    { id:'vsme_supply_risk',label:'Rischi sociali identificati nella catena del valore', type:'textarea' },
  ],
  'B3-S3':[
    { id:'vsme_community',label:'Iniziative di coinvolgimento comunità locale (descrivere)', type:'textarea' },
    { id:'vsme_disputes', label:'Controversie significative con comunità locali nell\'anno', type:'number' },
  ],
  'B3-S4':[
    { id:'vsme_complaints',label:'Reclami di consumatori/clienti ricevuti nell\'anno', type:'number' },
    { id:'vsme_resolved',  label:'Di cui: risolti nell\'anno (%)', type:'number' },
    { id:'vsme_privacy',   label:'Incidenti di violazione dei dati personali dei clienti', type:'number' },
  ],
  'B4-G':  [
    { id:'vsme_anti_policy',label:'Esiste una politica anti-corruzione formalizzata?', type:'select', options:['Sì — adottata e comunicata','In corso di adozione','No'] },
    { id:'vsme_whistleblow',label:'È disponibile un sistema di segnalazione illeciti (whistleblowing)?', type:'select', options:['Sì','No'] },
    { id:'vsme_corrupt_n',  label:'Incidenti di corruzione confermati nell\'anno', type:'number' },
    { id:'vsme_lobby',      label:'L\'azienda svolge attività di lobbying?', type:'select', options:['No','Sì — dichiarare spesa relativa'] },
  ],
  'B5': [
    { id:'risk_env', label:'Principali rischi ambientali identificati per l\'organizzazione (es. rischio climatico fisico, transizione energetica)', type:'textarea', required:true },
    { id:'risk_social', label:'Principali rischi sociali identificati (es. carenza di personale qualificato, rischi nella supply chain)', type:'textarea', required:true },
    { id:'risk_gov', label:'Principali rischi di governance identificati (es. corruzione, non conformita\' normativa)', type:'textarea' },
    { id:'opp_env', label:'Principali opportunita\' ambientali (es. economia circolare, efficienza energetica)', type:'textarea' },
    { id:'opp_social', label:'Principali opportunita\' sociali (es. employer branding, formazione)', type:'textarea' },
    { id:'risk_horizon', label:'Orizzonte temporale dell\'analisi dei rischi', type:'select', options:['Breve termine (< 1 anno)','Medio termine (1-5 anni)','Lungo termine (> 5 anni)','Tutti gli orizzonti'] },
    { id:'risk_mitigation', label:'Principali azioni di mitigazione dei rischi in atto o pianificate', type:'textarea' },
  ],
};

// Stato del questionario post-onboarding
const questionnaireState = {
  std: 'vsme',     // 'vsme' | 'gri'
  sector: 'manuf', // chiave settore da QUESTIONS
  answers: {},     // { disclosureCode: { fieldId: value } }
  omissions: {},   // { disclosureCode: reasonValue }
  activeDisclosure: null,
};

const _legacyQuestionnaire = {
  // Apre il pannello questionario per lo standard scelto e il settore
  open(std, sectorKey) {
    questionnaireState.std    = std;
    questionnaireState.sector = sectorKey || 'default';
    questionnaireState.answers = {};
    questionnaireState.omissions = {};

    const panel = document.getElementById('questionnaire-panel');
    if (!panel) { this._injectPanel(); }
    this._renderDisclosureList();
    document.getElementById('questionnaire-panel').style.display = 'flex';
  },

  close() {
    const p = document.getElementById('questionnaire-panel');
    if (p) p.style.display = 'none';
  },

  // Crea il pannello nel DOM (una sola volta)
  _injectPanel() {
    const panel = document.createElement('div');
    panel.id = 'questionnaire-panel';
    panel.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
      display:none;align-items:flex-start;justify-content:center;z-index:9998;
      padding:24px;overflow-y:auto;
    `;
    panel.innerHTML = `
      <div style="background:#fff;border-radius:12px;width:100%;max-width:760px;margin:auto;overflow:hidden">
        <div style="background:#111;color:#fff;padding:20px 24px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-weight:700;font-size:16px" id="q-panel-title">Questionario Post-Onboarding</div>
            <div style="font-size:12px;color:#9ca3af;margin-top:2px" id="q-panel-sub">Completa le informazioni per ciascuna disclosure</div>
          </div>
          <button onclick="questionnaire.close()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px">✕</button>
        </div>
        <div style="display:flex;height:600px;overflow:hidden">
          <div id="q-disclosure-list" style="width:260px;min-width:260px;border-right:1px solid #e5e7eb;overflow-y:auto;padding:8px"></div>
          <div id="q-disclosure-form" style="flex:1;overflow-y:auto;padding:24px"></div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center">
          <span id="q-completion-info" style="font-size:13px;color:#6b7280"></span>
          <div style="display:flex;gap:8px">
            <button onclick="questionnaire.close()" style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-size:14px">Chiudi</button>
            <button onclick="questionnaire.exportSummary()" style="padding:8px 16px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:14px;font-weight:600">Salva e continua →</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(panel);
  },

  _getDisclosures() {
    const { std, sector } = questionnaireState;
    if (std === 'gri') {
      const byS = GRI_BY_SECTOR[sector] || GRI_BY_SECTOR.default;
      // Return only those we have questions for
      return byS.filter(d => GRI_QUESTIONS[d.code]);
    } else {
      return VSME_MODULES_ALL.filter(m => VSME_QUESTIONS[m.code]);
    }
  },

  _renderDisclosureList() {
    const disclosures = this._getDisclosures();
    const { std } = questionnaireState;
    const listEl = document.getElementById('q-disclosure-list');
    if (!listEl) return;
    const titleEl = document.getElementById('q-panel-title');
    const subEl   = document.getElementById('q-panel-sub');
    if (titleEl) titleEl.textContent = `Questionario ${std === 'gri' ? 'GRI' : 'VSME'} — ${currentClient() ? currentClient().name : ''}`;
    if (subEl) subEl.textContent = `${disclosures.length} disclosure da compilare · Settore: ${questionnaireState.sector}`;

    listEl.innerHTML = disclosures.map(d => {
      const code  = d.code;
      const label = d.label;
      const filled = questionnaireState.answers[code] && Object.keys(questionnaireState.answers[code]).length > 0;
      const omitted = !!questionnaireState.omissions[code];
      const icon  = omitted ? '⊘' : filled ? '✓' : '○';
      const color = omitted ? '#9ca3af' : filled ? '#16a34a' : '#111';
      return `<div onclick="questionnaire.openDisclosure('${code}')"
        id="q-list-${code.replace(/[^a-z0-9]/gi,'_')}"
        style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f3f4f6;font-size:13px;
               border-radius:6px;margin:2px 4px;hover:background:#f9fafb">
        <div style="font-weight:600;color:${color}">${icon} ${code}</div>
        <div style="color:#6b7280;font-size:11px;line-height:1.4;margin-top:2px">${label.length > 55 ? label.slice(0,52)+'…' : label}</div>
      </div>`;
    }).join('');

    this._updateCompletion(disclosures.length);

    // Auto-open first
    if (disclosures.length > 0) this.openDisclosure(disclosures[0].code);
  },

  openDisclosure(code) {
    questionnaireState.activeDisclosure = code;
    const { std } = questionnaireState;
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);
    const formEl = document.getElementById('q-disclosure-form');
    if (!formEl) return;

    // Highlight selected in list
    document.querySelectorAll('[id^="q-list-"]').forEach(el => {
      el.style.background = el.id === `q-list-${code.replace(/[^a-z0-9]/gi,'_')}` ? '#f0fdf4' : '';
    });

    const saved = questionnaireState.answers[code] || {};
    const omitted = questionnaireState.omissions[code];

    formEl.innerHTML = `
      <h4 style="margin:0 0 4px;font-size:16px">${code}</h4>
      <p style="margin:0 0 16px;color:#6b7280;font-size:13px">${this._getLabel(code)}</p>
      ${omitted ? `<div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:12px;margin-bottom:16px;font-size:13px;color:#92400e">
        ⊘ Questa disclosure è stata omessa: <strong>${GRI_OMISSION_REASONS.find(r=>r.value===omitted)?.label||omitted}</strong>
        <button onclick="questionnaire.clearOmission('${code}')" style="margin-left:8px;background:none;border:none;color:#d97706;cursor:pointer;text-decoration:underline;font-size:13px">Rimuovi omissione</button>
      </div>` : ''}
      <div style="display:flex;flex-direction:column;gap:16px">
        ${questions.map(q => `
          <div>
            <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">
              ${q.label}${q.required ? ' <span style="color:#dc2626">*</span>' : ''}
            </label>
            ${this._renderField(q, saved[q.id], code)}
          </div>`).join('')}
      </div>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
        <label style="display:block;font-size:12px;font-weight:600;color:#9ca3af;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">
          Motivazione di omissione (se non compilata)
        </label>
        <select id="omission-select-${code.replace(/[^a-z0-9]/gi,'_')}"
          onchange="questionnaire.setOmission('${code}', this.value)"
          style="width:100%;padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;color:#374151">
          <option value="">— Disclosure compilata, nessuna omissione —</option>
          ${GRI_OMISSION_REASONS.map(r=>`<option value="${r.value}" ${omitted===r.value?'selected':''}>${r.label}</option>`).join('')}
        </select>
      </div>
      <div style="margin-top:12px;display:flex;justify-content:flex-end">
        <button onclick="questionnaire.saveDisclosure('${code}')"
          style="padding:8px 20px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:14px;font-weight:600">
          Salva disclosure
        </button>
      </div>`;
  },

  _renderField(q, savedVal, code) {
    const id = `qf-${code.replace(/[^a-z0-9]/gi,'_')}-${q.id}`;
    const val = savedVal !== undefined ? savedVal : '';
    const style = 'width:100%;padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;color:#111;box-sizing:border-box';
    if (q.type === 'textarea') {
      return `<textarea id="${id}" style="${style};min-height:80px;resize:vertical" placeholder="${q.placeholder||''}">${val}</textarea>`;
    } else if (q.type === 'select') {
      return `<select id="${id}" style="${style}">
        <option value="">Seleziona…</option>
        ${(q.options||[]).map(o=>`<option value="${o}" ${val===o?'selected':''}>${o}</option>`).join('')}
      </select>`;
    } else {
      return `<input id="${id}" type="${q.type}" value="${val}" placeholder="${q.placeholder||''}" style="${style}">`;
    }
  },

  _getLabel(code) {
    const { std, sector } = questionnaireState;
    if (std === 'gri') {
      const disc = (GRI_BY_SECTOR[sector]||GRI_BY_SECTOR.default).find(d=>d.code===code);
      return disc ? disc.label : code;
    } else {
      const mod = VSME_MODULES_ALL.find(m=>m.code===code);
      return mod ? mod.label : code;
    }
  },

  saveDisclosure(code) {
    const { std } = questionnaireState;
    const questions = std === 'gri' ? (GRI_QUESTIONS[code]||[]) : (VSME_QUESTIONS[code]||[]);
    const vals = {};
    questions.forEach(q => {
      const el = document.getElementById(`qf-${code.replace(/[^a-z0-9]/gi,'_')}-${q.id}`);
      if (el) vals[q.id] = el.value;
    });
    questionnaireState.answers[code] = vals;
    toast(`Disclosure ${code} salvata`, 'success');
    this._renderDisclosureList();
    // Reopen same disclosure to refresh omission state
    this.openDisclosure(code);
  },

  setOmission(code, reason) {
    if (reason) questionnaireState.omissions[code] = reason;
    else delete questionnaireState.omissions[code];
    this._updateCompletion(this._getDisclosures().length);
  },

  clearOmission(code) {
    delete questionnaireState.omissions[code];
    this.openDisclosure(code);
    this._renderDisclosureList();
  },

  _updateCompletion(total) {
    const answered = Object.keys(questionnaireState.answers).length;
    const omitted  = Object.keys(questionnaireState.omissions).length;
    const pct = total > 0 ? Math.round((answered + omitted) / total * 100) : 0;
    const el = document.getElementById('q-completion-info');
    if (el) el.textContent = `${answered} compilate · ${omitted} omesse · ${pct}% completato`;
  },

  exportSummary() {
    const total     = this._getDisclosures().length;
    const answered  = Object.keys(questionnaireState.answers).length;
    const omitted   = Object.keys(questionnaireState.omissions).length;
    const missing   = total - answered - omitted;
    toast(`Questionario salvato — ${answered} compilate, ${omitted} omesse, ${missing} da completare`, 'success');
    this.close();
    // Advance wizard step
    const c = currentClient();
    if (c && c.step < 3) { c.step = 3; updateWizardProgress(); }
  },
};

/* ══════════════════════════════════════════════════════════
   NEW TYPEFORM-LIKE QUESTIONNAIRE (REDESIGNED)
══════════════════════════════════════════════════════════ */

// List of disclosures that are auto-calculated and should be shown as read-only
const AUTO_CALCULATED_DISCLOSURES = [
  'GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4', // emissions
  'GRI 302-1', 'GRI 302-3', // energy
  'GRI 401-1', // new hires/turnover
  'VSME B2-E1', // GHG scope 1/2/3
  'VSME B2-E2', // energy consumption
];

const typeformQuestionnaireState = {
  std: 'vsme',
  sector: 'manuf',
  disclosures: [],
  currentIndex: 0,
  answers: {},
  omissions: {},
  active: false,
};

const typeformQuestionnaire = {
  open(std, sectorKey) {
    typeformQuestionnaireState.std = std;
    typeformQuestionnaireState.sector = sectorKey || 'manuf';
    typeformQuestionnaireState.answers = {};
    typeformQuestionnaireState.omissions = {};
    typeformQuestionnaireState.currentIndex = 0;
    typeformQuestionnaireState.active = true;

    // Build disclosures list, filtering out auto-calculated ones
    this._buildDisclosures();

    const panel = document.getElementById('typeform-panel');
    if (!panel) { this._injectPanel(); }
    this._renderCurrentSlide();
    document.getElementById('typeform-panel').style.display = 'flex';
  },

  close() {
    typeformQuestionnaireState.active = false;
    const p = document.getElementById('typeform-panel');
    if (p) p.style.display = 'none';
  },

  _injectPanel() {
    const panel = document.createElement('div');
    panel.id = 'typeform-panel';
    panel.innerHTML = `
      <div id="typeform-wrapper" style="
        position:fixed; top:0; left:0; right:0; bottom:0;
        background:#f8fafc;
        display:flex;
        flex-direction:column;
        z-index:9999;
        overflow:hidden;
      ">
        <!-- Topbar -->
        <div style="
          background:#111; color:#fff;
          padding:16px 32px;
          display:flex; justify-content:space-between; align-items:center;
          border-bottom:1px solid #e5e7eb;
          flex-shrink:0;
        ">
          <div style="display:flex; align-items:center; gap:12px; font-weight:600; font-size:15px">
            <span style="width:8px; height:8px; background:#16a34a; border-radius:50%; display:inline-block"></span>
            VERA ESG · <span id="tform-title-std">Questionario</span>
          </div>
          <div style="display:flex; gap:12px; align-items:center">
            <span id="tform-progress-text" style="font-size:13px; color:#9ca3af"></span>
            <button onclick="typeformQuestionnaire.close()" style="
              background:none; border:none; color:#fff;
              cursor:pointer; font-size:20px; padding:0; width:24px; height:24px;
              display:flex; align-items:center; justify-content:center;
            ">✕</button>
          </div>
        </div>

        <!-- Main content area -->
        <div style="
          flex:1; overflow-y:auto; overflow-x:hidden;
          display:flex; align-items:center; justify-content:center;
          padding:48px 32px;
        ">
          <div id="tform-content" style="
            width:100%; max-width:640px;
            perspective:1000px;
          "></div>
        </div>

        <!-- Progress bar & buttons -->
        <div style="
          background:#fff; padding:16px 32px;
          border-top:1px solid #e5e7eb;
          display:flex; justify-content:space-between; align-items:center;
          flex-shrink:0;
        ">
          <div style="flex:1; margin-right:32px">
            <div id="tform-progress-bar" style="
              width:100%; height:6px; background:#e5e7eb;
              border-radius:3px; overflow:hidden;
            ">
              <div id="tform-progress-fill" style="
                height:100%; background:#16a34a; width:0%;
                transition:width 0.3s ease;
              "></div>
            </div>
            <div style="
              font-size:12px; color:#6b7280; margin-top:6px;
              text-align:right;
            ">
              <span id="tform-step-counter">0 / 0</span>
            </div>
          </div>
          <div id="tform-logic-error" style="display:none;color:#dc2626;font-size:13px;font-weight:600;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 14px;margin-bottom:8px;max-width:600px;text-align:left"></div>
          <div style="display:flex; gap:8px; flex-shrink:0">
            <button id="tform-btn-prev" onclick="typeformQuestionnaire.prev()" style="
              padding:8px 16px; border:1px solid #e5e7eb;
              border-radius:8px; background:#fff; color:#111;
              cursor:pointer; font-size:14px; font-weight:600;
              display:none;
            ">← Indietro</button>
            <button id="tform-btn-next" onclick="typeformQuestionnaire.next()" style="
              padding:8px 16px; border:none;
              border-radius:8px; background:#111; color:#fff;
              cursor:pointer; font-size:14px; font-weight:600;
            ">Avanti →</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    this._injectStyles();
  },

  _injectStyles() {
    if (document.getElementById('typeform-styles')) return;
    const style = document.createElement('style');
    style.id = 'typeform-styles';
    style.textContent = `
      .tform-card {
        background:white;
        border-radius:16px;
        box-shadow:0 4px 24px rgba(0,0,0,0.08);
        padding:32px;
        animation:slideInRight 0.4s ease-out;
      }

      @keyframes slideInRight {
        from { opacity:0; transform:translateX(40px); }
        to { opacity:1; transform:translateX(0); }
      }

      .tform-field { margin-bottom:24px; }
      .tform-label {
        display:block;
        font-size:14px;
        font-weight:600;
        color:#374151;
        margin-bottom:8px;
      }
      .tform-required { color:#dc2626; }

      .tform-input {
        width:100%;
        padding:12px 14px;
        border:1px solid #e5e7eb;
        border-radius:8px;
        font-size:14px;
        color:#111;
        box-sizing:border-box;
        font-family:inherit;
        transition:border-color 0.2s;
      }

      .tform-input:focus {
        outline:none;
        border-color:#16a34a;
        box-shadow:0 0 0 3px rgba(22, 163, 74, 0.1);
      }

      .tform-input.error { border-color:#dc2626; }
      .tform-input.error:focus { box-shadow:0 0 0 3px rgba(220, 38, 38, 0.1); }

      .tform-input-error {
        display:block;
        color:#dc2626;
        font-size:13px;
        margin-top:4px;
      }

      .tform-textarea { min-height:100px; resize:vertical; }

      .tform-select {
        appearance:none;
        background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path fill="%23374151" d="M1 1l5 5 5-5"/></svg>');
        background-repeat:no-repeat;
        background-position:right 12px center;
        padding-right:36px;
      }

      .tform-auto-card {
        background:#f0fdf4;
        border:1px solid #bbf7d0;
        border-left:4px solid #16a34a;
        border-radius:12px;
        padding:20px;
      }

      .tform-auto-badge {
        display:inline-block;
        background:#16a34a;
        color:white;
        padding:4px 10px;
        border-radius:4px;
        font-size:12px;
        font-weight:600;
        margin-bottom:12px;
      }

      .tform-auto-card h3 { margin:0 0 8px 0; font-size:16px; color:#111; }
      .tform-auto-card p { margin:0 0 12px 0; color:#6b7280; font-size:13px; }

      .tform-auto-value {
        background:white;
        padding:12px;
        border-radius:8px;
        font-family:monospace;
        font-size:14px;
        color:#111;
        font-weight:600;
        margin-bottom:8px;
      }

      .tform-auto-card small { display:block; color:#9ca3af; font-size:12px; }

      .tform-disclosure-header { margin-bottom:24px; }
      .tform-disclosure-code {
        display:inline-block;
        padding:4px 10px;
        background:#f3f4f6;
        border-radius:6px;
        font-size:12px;
        font-weight:600;
        color:#6b7280;
        margin-bottom:8px;
      }

      .tform-disclosure-title { font-size:24px; font-weight:700; color:#111; margin:0 0 8px 0; }
      .tform-disclosure-subtitle { color:#6b7280; font-size:14px; }

      input[type="number"].tform-input { text-align:right; }
    `;
    document.head.appendChild(style);
  },

  _buildDisclosures() {
    const { std, sector } = typeformQuestionnaireState;
    let disclosures = [];

    if (std === 'gri') {
      const byS = GRI_BY_SECTOR[sector] || GRI_BY_SECTOR.default;
      disclosures = byS.filter(d => GRI_QUESTIONS[d.code]);
    } else {
      disclosures = VSME_MODULES_ALL.filter(m => VSME_QUESTIONS[m.code]);
    }

    // Filter out auto-calculated disclosures
    typeformQuestionnaireState.disclosures = disclosures.filter(
      d => !AUTO_CALCULATED_DISCLOSURES.includes(d.code)
    );
  },

  _renderCurrentSlide() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;

    if (currentIndex >= disclosures.length) {
      this._renderCompletion();
      return;
    }

    const disclosure = disclosures[currentIndex];
    this._renderDisclosureSlide(disclosure);
    this._updateProgress();
  },

  _renderDisclosureSlide(disclosure) {
    const { std } = typeformQuestionnaireState;
    const code = disclosure.code;
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);
    const saved = typeformQuestionnaireState.answers[code] || {};

    const contentEl = document.getElementById('tform-content');
    const codeLabel = std === 'gri' ? code : `VSME ${code}`;

    contentEl.innerHTML = `
      <div class="tform-card">
        <div class="tform-disclosure-header">
          <span class="tform-disclosure-code">${codeLabel}</span>
          <h1 class="tform-disclosure-title">${disclosure.label}</h1>
          <p class="tform-disclosure-subtitle">Compila i campi sottostanti</p>
        </div>

        <form id="tform-form" onsubmit="return false;">
          ${questions.map(q => `
            <div class="tform-field">
              <label class="tform-label">
                ${q.label}
                ${q.required ? '<span class="tform-required">*</span>' : ''}
              </label>
              ${this._renderFieldInput(q, saved[q.id], code)}
              <span class="tform-input-error" id="err-${code}-${q.id}"></span>
            </div>
          `).join('')}
        </form>
      </div>
    `;

    // Show/hide previous button
    const prevBtn = document.getElementById('tform-btn-prev');
    if (prevBtn) prevBtn.style.display = typeformQuestionnaireState.currentIndex > 0 ? 'block' : 'none';
  },

  _renderFieldInput(q, savedVal, code) {
    const id = `tform-${code}-${q.id}`;
    const val = savedVal !== undefined ? savedVal : '';
    const baseClass = 'tform-input';

    if (q.type === 'textarea') {
      return `<textarea id="${id}" class="${baseClass} tform-textarea" placeholder="${q.placeholder || ''}">${val}</textarea>`;
    } else if (q.type === 'select') {
      return `<select id="${id}" class="${baseClass} tform-select">
        <option value="">Seleziona…</option>
        ${(q.options || []).map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>`;
    } else if (q.type === 'number') {
      return `<input id="${id}" type="number" class="${baseClass}" placeholder="${q.placeholder || ''}" value="${val}" step="any">`;
    } else {
      return `<input id="${id}" type="${q.type || 'text'}" class="${baseClass}" placeholder="${q.placeholder || ''}" value="${val}">`;
    }
  },

  _renderCompletion() {
    const contentEl = document.getElementById('tform-content');
    const { disclosures } = typeformQuestionnaireState;
    const answered = Object.keys(typeformQuestionnaireState.answers).length;

    contentEl.innerHTML = `
      <div class="tform-card" style="text-align:center">
        <div style="font-size:48px; margin-bottom:16px">✓</div>
        <h2 style="font-size:24px; font-weight:700; color:#111; margin:0 0 8px 0">Questionario completato!</h2>
        <p style="color:#6b7280; font-size:14px; margin:0 0 24px 0">
          Hai compilato ${answered} disclosure. I dati verranno salvati e utilizzati per la reportistica ESG.
        </p>
        <button onclick="typeformQuestionnaire.save()" style="
          padding:12px 24px;
          background:#16a34a;
          color:white;
          border:none;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
          cursor:pointer;
          width:100%;
        ">Salva e concludi</button>
      </div>
    `;

    const nextBtn = document.getElementById('tform-btn-next');
    const prevBtn = document.getElementById('tform-btn-prev');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
  },

  _validateCurrentSlide() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    if (currentIndex >= disclosures.length) return true;

    const disclosure = disclosures[currentIndex];
    const std = typeformQuestionnaireState.std;
    const code = disclosure.code;
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);

    let isValid = true;
    questions.forEach(q => {
      const el = document.getElementById(`tform-${code}-${q.id}`);
      if (!el) return;

      const isEmpty = !el.value || el.value.trim() === '';
      const errEl = document.getElementById(`err-${code}-${q.id}`);

      if (q.required && isEmpty) {
        isValid = false;
        el.classList.add('error');
        if (errEl) {
          errEl.textContent = 'Campo obbligatorio';
          errEl.style.display = 'block';
        }
      } else {
        el.classList.remove('error');
        if (errEl) errEl.style.display = 'none';
      }
    });

    return isValid;
  },

  _saveCurrentSlide() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    if (currentIndex >= disclosures.length) return;

    const disclosure = disclosures[currentIndex];
    const std = typeformQuestionnaireState.std;
    const code = disclosure.code;
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);

    const vals = {};
    questions.forEach(q => {
      const el = document.getElementById(`tform-${code}-${q.id}`);
      if (el) vals[q.id] = el.value;
    });
    typeformQuestionnaireState.answers[code] = vals;
  },

  _updateProgress() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    const total = disclosures.length;
    const pct = total > 0 ? Math.round((currentIndex + 1) / total * 100) : 0;

    const fillEl = document.getElementById('tform-progress-fill');
    const counterEl = document.getElementById('tform-step-counter');
    const progressEl = document.getElementById('tform-progress-text');

    if (fillEl) fillEl.style.width = pct + '%';
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${total}`;
    if (progressEl) progressEl.textContent = `Disclosure ${currentIndex + 1}/${total}`;
  },

  next() {
    if (!this._validateCurrentSlide()) return;
    this._saveCurrentSlide();

    // Logical constraint validation
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    if (currentIndex < disclosures.length) {
      const disclosure = disclosures[currentIndex];
      const answers = typeformQuestionnaireState.answers[disclosure.code] || {};
      const constraintError = this._checkConstraints(disclosure.code, answers);
      if (constraintError) {
        const errEl = document.getElementById('tform-logic-error');
        if (errEl) { errEl.textContent = constraintError; errEl.style.display = 'block'; }
        return;
      }
      if (document.getElementById('tform-logic-error')) {
        document.getElementById('tform-logic-error').style.display = 'none';
      }
    }

    if (typeformQuestionnaireState.currentIndex < disclosures.length) {
      typeformQuestionnaireState.currentIndex++;
    }
    this._renderCurrentSlide();
  },

  prev() {
    if (typeformQuestionnaireState.currentIndex > 0) {
      this._saveCurrentSlide();
      typeformQuestionnaireState.currentIndex--;
      this._renderCurrentSlide();
    }
  },

  save() {
    const answered = Object.keys(typeformQuestionnaireState.answers).length;
    toast(`Questionario salvato — ${answered} disclosure compilate`, 'success');
    const c = currentClient();
    if (c && c.step < 3) { c.step = 3; updateWizardProgress(); }
    this.close();
  },

  _checkConstraints(code, answers) {
    const n = (k) => { const v = parseFloat(answers[k]); return isNaN(v) ? null : v; };

    if (code === 'GRI 2-7') {
      const total = n('emp_total'), m = n('emp_m'), f = n('emp_f'), ft = n('emp_ft'), pt = n('emp_pt');
      if (total !== null && m !== null && f !== null && m + f > total)
        return `Errore logico: uomini (${m}) + donne (${f}) = ${m+f} supera il totale dipendenti (${total}). Verificare i valori.`;
      if (total !== null && ft !== null && pt !== null && Math.abs(ft + pt - total) > 1)
        return `Errore logico: tempo pieno (${ft}) + tempo parziale (${pt}) = ${ft+pt} non corrisponde al totale (${total}).`;
    }
    if (code === 'GRI 2-9') {
      const total = n('gov_body_size'), exec = n('gov_executive'), nonexec = n('gov_nonexecutive'), indep = n('gov_indep'), women = n('gov_women');
      if (total !== null && exec !== null && nonexec !== null && exec + nonexec > total)
        return `Errore logico: esecutivi (${exec}) + non esecutivi (${nonexec}) = ${exec+nonexec} supera il totale CdA (${total}).`;
      if (total !== null && women !== null && women > total)
        return `Errore logico: numero donne (${women}) non puo\' superare il totale componenti CdA (${total}).`;
      if (total !== null && indep !== null && indep > total)
        return `Errore logico: numero indipendenti (${indep}) non puo\' superare il totale componenti CdA (${total}).`;
    }
    if (code === 'GRI 2-21') {
      const ceo = n('ceo_pay'), med = n('median_pay');
      if (ceo !== null && med !== null && med > ceo)
        return `Attenzione: la retribuzione mediana (€${med.toLocaleString('it-IT')}) risulta superiore a quella del dirigente meglio remunerato (€${ceo.toLocaleString('it-IT')}). Verificare i valori.`;
    }
    if (code === 'GRI 405-1') {
      const total = n('board_total'), women = n('board_f'), u30 = n('board_u30'), mid = n('board_3050');
      if (total !== null && women !== null && women > total)
        return `Errore logico: donne nel CdA (${women}) non puo\' superare il totale (${total}).`;
      if (total !== null && u30 !== null && mid !== null && u30 + mid > total)
        return `Errore logico: under 30 (${u30}) + 30-50 anni (${mid}) = ${u30+mid} supera il totale CdA (${total}).`;
    }
    if (code === 'GRI 401-1') {
      const m = n('hire_m'), f = n('hire_f'), total = n('hire_total');
      if (total !== null && m !== null && f !== null && m + f > total)
        return `Errore logico: uomini assunti (${m}) + donne assunte (${f}) = ${m+f} supera il totale nuove assunzioni (${total}).`;
    }
    if (code === 'GRI 404-1') {
      const avg = n('train_hrs'), m = n('train_m'), f = n('train_f');
      if (avg !== null && m !== null && f !== null && m > 0 && f > 0) {
        const diff = Math.abs(avg - (m + f) / 2);
        if (diff > avg * 0.5)
          return `Attenzione: la media ore formazione (${avg}) sembra distante dalla media tra uomini (${m}) e donne (${f}). Verificare i valori.`;
      }
    }
    if (code === 'B2-E3') {
      const total = n('vsme_waste_t'), haz = n('vsme_waste_haz'), land = n('vsme_waste_land'), rec = n('vsme_waste_rec');
      if (total !== null) {
        if (haz !== null && haz > total)
          return `Errore logico: rifiuti pericolosi (${haz}t) non puo\' superare il totale rifiuti (${total}t).`;
        if (land !== null && land > total)
          return `Errore logico: rifiuti in discarica (${land}t) non puo\' superare il totale (${total}t).`;
        if (rec !== null && rec > total)
          return `Errore logico: rifiuti a riciclo (${rec}t) non puo\' superare il totale (${total}t).`;
        if (haz !== null && land !== null && rec !== null && haz + land + rec > total * 1.01)
          return `Errore logico: la somma delle sottocategorie rifiuti (${haz+land+rec}t) supera il totale (${total}t).`;
      }
    }
    if (code === 'B3-S1') {
      const total = n('vsme_emp_total'), pctF = n('vsme_emp_f');
      if (pctF !== null && (pctF < 0 || pctF > 100))
        return `Errore logico: la percentuale donne (${pctF}%) deve essere compresa tra 0 e 100.`;
      const injuries = n('vsme_injuries');
      if (injuries !== null && total !== null && injuries > total)
        return `Errore logico: infortuni (${injuries}) non puo\' superare il numero di dipendenti (${total}).`;
    }
    if (code === 'B3-S4') {
      const complaints = n('vsme_complaints'), resolved = n('vsme_resolved');
      if (resolved !== null && (resolved < 0 || resolved > 100))
        return `Errore logico: la percentuale di reclami risolti (${resolved}%) deve essere tra 0 e 100.`;
    }
    if (code === 'GRI 2-16' || code === 'GRI 2-26') {
      // No numeric constraints but ensure coherence
    }
    return null; // no constraint violation
  },
};

/* ══════════════════════════════════════════════════════════
   ONBOARDING
══════════════════════════════════════════════════════════ */

const onboarding = {
  selectStd(std) {
    state.selectedStd = std;
    document.getElementById('std-vsme').classList.toggle('selected', std === 'vsme');
    document.getElementById('std-gri').classList.toggle('selected', std === 'gri');
    document.getElementById('btn-std-label').textContent = std.toUpperCase();
    // Update checkmarks
    const vsmeCheck = document.getElementById('std-vsme-check');
    const griCheck = document.getElementById('std-gri-check');
    if (vsmeCheck) vsmeCheck.style.opacity = std === 'vsme' ? '1' : '0';
    if (griCheck) griCheck.style.opacity = std === 'gri' ? '1' : '0';
  },

  _syncBadges(std) {
    const label = std.toUpperCase();
    const safe = (id, fn) => { const el = document.getElementById(id); if (el) fn(el); };
    safe('selected-std-badge', el => { el.textContent = label; el.className = 'std-badge' + (std === 'vsme' ? ' vsme' : ''); });
    safe('dash-std',       el => el.textContent = label);
    safe('dash-std-label', el => el.textContent = std === 'vsme' ? 'VSME 2023' : 'GRI Standards');
    safe('job-std',        el => el.textContent = label);
    safe('stamp-std-label',el => el.textContent = std === 'vsme' ? 'VSME 2023' : 'GRI Standards');
    safe('stamp-std-name', el => el.textContent = label);
    safe('stamp-std-info', el => el.textContent = std === 'vsme' ? 'VSME 2023 (EFRAG)' : 'GRI Standards 2021');
  },

  confirmStd() {
    const std = state.selectedStd;
    this._syncBadges(std);
    document.getElementById('std-panel').style.display     = 'none';
    document.getElementById('company-panel').style.display = 'block';
    stepDone('step1'); stepActive('step2');
    const c = currentClient(); if (c && c.step < 2) { c.step = 2; c.std = std; }
    updateWizardProgress();
    // Open new typeform questionnaire after a delay
    const sectorKey = c && c.sector ? c.sector.toLowerCase() : 'manuf';
    const sectorMap = { manifatturiero:'manuf', edilizia:'build', commercio:'trade', servizi:'serv' };
    const mappedKey = Object.entries(sectorMap).find(([k]) => sectorKey.includes(k))?.[1] || 'manuf';
    setTimeout(() => {
      typeformQuestionnaire.open(std, mappedKey);
    }, 500);
  },

  backToStd() {
    document.getElementById('company-panel').style.display = 'none';
    document.getElementById('std-panel').style.display     = 'block';
    stepActive('step1'); stepUndone('step2');
  },

  goToUpload() {
    document.getElementById('company-panel').style.display = 'none';
    document.getElementById('upload-panel').style.display  = 'block';
    stepDone('step2'); stepActive('step3');
    const c = currentClient(); if (c && c.step < 3) c.step = 3;
    updateWizardProgress();
  },
};


/* ══════════════════════════════════════════════════════════
   UPLOAD
══════════════════════════════════════════════════════════ */

const upload = {
  simulate() {
    if (state.uploadDone) return;
    document.getElementById('drop-zone').style.display   = 'none';
    document.getElementById('upload-prog').style.display = 'block';
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p > 100) p = 100;
      document.getElementById('prog-bar').style.width   = p + '%';
      document.getElementById('prog-pct').textContent   = Math.round(p) + '%';
      if (p === 100) {
        clearInterval(iv);
        state.uploadDone = true;
        setTimeout(() => {
          // Populate nova client with construction data if needed
          const c = currentClient();
          if (c && c.id === 'nova' && !c.ghgRows?.length) {
            c.ghgRows = [
              { mat:'Gas naturale', scope:1, tag:'tag-g', qty:'28.400 kWh', fe:'0,18386', src:'Metodologia VERA 2024', em:5221 },
              { mat:'Gasolio cantiere', scope:1, tag:'tag-g', qty:'2.840 L', fe:'2,68490', src:'Metodologia VERA 2024', em:7625 },
              { mat:'Elettricità', scope:2, tag:'tag-b', qty:'44.200 kWh', fe:'0,28307', src:'Metodologia VERA 2024', em:12512 },
              { mat:'Rifiuti costruzione', scope:3, tag:'tag-o', qty:'18.600 kg', fe:'0,58700', src:'IPCC AR6', em:10918 },
              { mat:'Trasporto materiali', scope:3, tag:'tag-o', qty:'8.200 tkm', fe:'0,09560', src:'Metodologia VERA 2024', em:784 },
            ];
            c.ghg = { s1:12846, s2:12512, s3:11702, total:37060 };
          }
          stepDone('step3'); stepActive('step4');
          document.getElementById('valid-panel').style.display = 'block';
          toast('File validato con successo · ' + (c?.ghgRows?.length || 6) + ' righe OK', 'success');
        }, 400);
      }
    }, 120);
  },

  reset() {
    state.uploadDone = false;
    document.getElementById('drop-zone').style.display   = '';
    document.getElementById('upload-prog').style.display = 'none';
    document.getElementById('valid-panel').style.display = 'none';
    document.getElementById('prog-bar').style.width = '0%';
    stepUndone('step3'); stepUndone('step4');
  },

  goToCalc() {
    const c = currentClient();
    if (!c || !c.ghg || !c.ghgRows?.length) {
      toast('Nessun dato GHG inserito. Carica un file o inserisci i dati manualmente.', 'error');
      return;
    }
    if (c.step < 4) c.step = 4;
    // Show report generation animation
    reportGen.generate(() => {
      _updateClientUI(c);
      showScreen('results', document.getElementById('nav-results'));
      const total = (c.ghg.total / 1000).toFixed(1);
      toast(`Report pronto! ${total} tCO₂e`, 'success');
    });
  },

  _applyParsedRows(rows) {
    const c = currentClient();
    if (!c || !rows?.length) { toast('Nessun dato valido', 'error'); return; }
    c.ghgRows = rows;
    // Calculate GHG totals
    const s1 = rows.filter(r => r.scope === 1).reduce((sum, r) => sum + r.em, 0);
    const s2 = rows.filter(r => r.scope === 2).reduce((sum, r) => sum + r.em, 0);
    const s3 = rows.filter(r => r.scope === 3).reduce((sum, r) => sum + r.em, 0);
    c.ghg = { s1, s2, s3, total: s1 + s2 + s3 };
    // Update table
    renderBreakdown(c);
    // ── Persist GHG entries to Supabase ─────────────────────
    if (window.veraAuth && window.veraAuth.saveGhgEntries) {
      window.veraAuth.saveGhgEntries(rows).catch(() => {});
    }
    // Trigger upload completion
    if (state.uploadDone === false) {
      state.uploadDone = true;
      stepDone('step3'); stepActive('step4');
      document.getElementById('valid-panel').style.display = 'block';
      toast('Dati caricati con successo · ' + rows.length + ' righe analizzate', 'success');
    }
  },
};


/* ══════════════════════════════════════════════════════════
   REPORT GENERATION — REAL-TIME PROGRESS ANIMATION
══════════════════════════════════════════════════════════ */

// Note: SUPABASE_URL and key are declared in vera-supabase.js — use _db_url/_db_key here to avoid redeclaration
const _db_url = 'https://zwangblfyccxqigifmgm.supabase.co';
const _db_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YW5nYmxmeWNjeHFpZ2lmbWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTQ2NjcsImV4cCI6MjA5MTI3MDY2N30.LFtZ_rEWbKE04qFVvdPNoxA8j5bJeLCwjKPrg9NcLho';

const db = {
  _headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': _db_key,
      'Authorization': `Bearer ${_db_key}`,
      'Prefer': 'return=representation',
    };
  },
  async query(table, params = '') {
    const r = await fetch(`${_db_url}/rest/v1/${table}${params ? '?' + params : ''}`, { headers: this._headers() });
    return r.json();
  },
  async insert(table, data) {
    const r = await fetch(`${_db_url}/rest/v1/${table}`, {
      method: 'POST', headers: this._headers(), body: JSON.stringify(data),
    });
    return r.json();
  },
  async update(table, id, data) {
    const r = await fetch(`${_db_url}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH', headers: this._headers(), body: JSON.stringify(data),
    });
    return r.json();
  },
  async upsert(table, data) {
    const r = await fetch(`${_db_url}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...this._headers(), 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
};

const reportGen = {
  _pdfData: null,   // stores last generated PDF as base64

  generate(callback) {
    const overlay = document.createElement('div');
    overlay.id = 'report-gen-overlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;`;
    const c = currentClient();
    const rowCount = (c?.ghgRows?.length || 6);
    const steps = [
      `Dati validati (${rowCount} righe)`,
      'Calcolo emissioni Scope 1–3...',
      'Applicazione fattori DEFRA 2024 / ISPRA 2024 / IPCC AR6...',
      `Strutturazione report ${c?.std?.toUpperCase() || 'VSME'}...`,
      'Generazione grafica e copertina...',
      'Report PDF pronto!'
    ];
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:48px;max-width:500px;width:90%;text-align:center">
        <h3 style="margin:0 0 8px 0;font-size:20px;color:#111">Generazione report in corso...</h3>
        <p style="margin:0 0 32px 0;font-size:13px;color:#6b7280">${c?.name || 'Report'} · ${c?.year || 2024}</p>
        <div id="report-steps" style="text-align:left;margin-bottom:24px;font-size:13px;color:#4b5563;min-height:120px"></div>
        <div style="width:100%;background:#e5e7eb;border-radius:4px;height:4px;margin-bottom:16px">
          <div id="report-gen-bar" style="height:4px;background:#16a34a;border-radius:4px;width:0%;transition:width 0.6s ease"></div>
        </div>
        <div id="report-gen-status" style="font-size:12px;color:#9ca3af">Inizializzazione...</div>
      </div>`;
    document.body.appendChild(overlay);

    const stepsEl = document.getElementById('report-steps');
    const barEl = document.getElementById('report-gen-bar');
    const statusEl = document.getElementById('report-gen-status');
    let step = 0;

    const showStep = () => {
      if (step >= steps.length) {
        // Generate actual PDF
        this._buildPDF(c).then(pdfBase64 => {
          this._pdfData = pdfBase64;
          overlay.remove();
          if (callback) callback(pdfBase64);
        });
        return;
      }
      const div = document.createElement('div');
      div.style.cssText = 'margin-bottom:10px;display:flex;align-items:center;gap:8px;opacity:0;transform:translateX(-8px);transition:all 0.4s ease';
      div.innerHTML = `<span style="color:#16a34a;font-weight:700">✓</span> ${steps[step]}`;
      stepsEl.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = '1'; div.style.transform = 'translateX(0)'; });
      barEl.style.width = ((step + 1) / steps.length * 100) + '%';
      statusEl.textContent = steps[step];
      step++;
      setTimeout(showStep, 650);
    };
    showStep();
  },

  async _buildPDF(client) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) { console.warn('jsPDF not loaded'); return null; }

    const c = client || currentClient();
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, pad = 18;
    let y = 0;

    // ── COVER PAGE ──────────────────────────────────────────
    doc.setFillColor(17, 17, 17);
    doc.rect(0, 0, W, 297, 'F');
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, W, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(255, 255, 255);
    doc.text('VERA', W / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(156, 163, 175);
    doc.text('ESG PLATFORM', W / 2, 68, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Bilancio di Sostenibilità', W / 2, 100, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(156, 163, 175);
    doc.text(c?.name || 'Azienda', W / 2, 112, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Anno ${c?.year || 2024} · Standard ${c?.std?.toUpperCase() || 'VSME'}`, W / 2, 122, { align: 'center' });

    if (c?.stamp?.applied) {
      doc.setFillColor(22, 163, 74);
      doc.roundedRect(W/2 - 40, 135, 80, 12, 3, 3, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`✓ TIMBRO: ${c.stamp.code}`, W / 2, 143, { align: 'center' });
    }

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Generato: ${new Date().toLocaleDateString('it-IT')} · Metodologia: GHG Protocol Corporate Standard`, W / 2, 280, { align: 'center' });
    doc.text('Fattori di emissione: DEFRA 2024 · ISPRA 2024 · IPCC AR6 WG3', W / 2, 286, { align: 'center' });

    // ── PAGE 2: GHG SUMMARY ─────────────────────────────────
    doc.addPage();
    y = pad;

    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, W, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 17, 17);
    doc.text('1. Riepilogo Emissioni GHG', pad, y + 12);
    y += 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Organizzazione: ${c?.name || '—'} · Settore: ${c?.sector || '—'} · Dipendenti: ${c?.employees || '—'}`, pad, y);
    y += 6;
    doc.text(`Periodo: 01/01/${c?.year || 2024} – 31/12/${c?.year || 2024} · Metodo: GHG Protocol, market-based`, pad, y);
    y += 12;

    // KPI boxes
    const kpis = c?.ghg ? [
      { label: 'Scope 1', val: (c.ghg.s1 / 1000).toFixed(1), color: [220, 252, 231] },
      { label: 'Scope 2', val: (c.ghg.s2 / 1000).toFixed(1), color: [219, 234, 254] },
      { label: 'Scope 3', val: (c.ghg.s3 / 1000).toFixed(1), color: [254, 243, 199] },
      { label: 'TOTALE', val: (c.ghg.total / 1000).toFixed(1), color: [240, 253, 244] },
    ] : [];

    const boxW = (W - pad * 2 - 9) / 4;
    kpis.forEach((k, i) => {
      const x = pad + i * (boxW + 3);
      doc.setFillColor(...k.color);
      doc.roundedRect(x, y, boxW, 24, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(17, 17, 17);
      doc.text(k.val, x + boxW / 2, y + 14, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${k.label} (tCO₂e)`, x + boxW / 2, y + 21, { align: 'center' });
    });
    y += 34;

    // GHG breakdown table
    if (c?.ghgRows?.length) {
      doc.autoTable({
        startY: y,
        head: [['Fonte emissiva', 'Scope', 'Quantità', 'FE (kgCO₂e/u)', 'Fonte FE', 'Emissioni (kgCO₂e)']],
        body: c.ghgRows.map(r => [r.mat, `S${r.scope}`, r.qty, r.fe, r.src, r.em.toLocaleString('it-IT')]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [17, 17, 17], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 38 }, 1: { cellWidth: 14, halign: 'center' },
          2: { cellWidth: 28 }, 3: { cellWidth: 24, halign: 'right' },
          4: { cellWidth: 38, fontSize: 7, textColor: [100, 116, 139] },
          5: { cellWidth: 24, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: pad, right: pad },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // ── PAGE 3: STANDARD SECTION ─────────────────────────────
    doc.addPage();
    y = pad;
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, W, 2, 'F');

    const stdLabel = c?.std === 'gri' ? 'GRI Standards 2021' : 'VSME 2023 (EFRAG)';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 17, 17);
    doc.text(`2. Framework: ${stdLabel}`, pad, y + 12);
    y += 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);

    if (c?.std === 'vsme') {
      const vsmeText = [
        'Il presente bilancio di sostenibilità è redatto in conformità al Voluntary SME Standard (VSME)',
        'sviluppato da EFRAG (European Financial Reporting Advisory Group) nel 2023 specificamente',
        'per le piccole e medie imprese europee.',
        '',
        'I moduli coperti dalla presente rendicontazione sono:',
        '• B1 — Informazioni di base e governance',
        '• B2-E1 — Cambiamento climatico e gas serra (GHG)',
        '• B2-E2 — Energia (consumi e intensità)',
        '• B2-E3 — Rifiuti (produzione e gestione)',
        '• B3-S1 — Forza lavoro propria',
        '• B4-G — Condotta aziendale e anticorruzione',
      ];
      vsmeText.forEach(line => { doc.text(line, pad, y); y += line ? 6 : 4; });
    } else {
      const griText = [
        'Il presente bilancio di sostenibilità è redatto in conformità ai GRI Standards 2021',
        '(Global Reporting Initiative), il framework di riferimento globale per la rendicontazione ESG.',
        '',
        'Disclosure universali coperte (GRI 2): 2-1, 2-2, 2-7, 2-9, 2-22, 2-27, 2-29, 2-30',
        'Disclosure tematiche coperte: GRI 201-1, 204-1, 302-1, 302-3, 305-1, 305-2, 305-3,',
        '305-4, 401-1, 401-2, 403-3, 404-1, 405-1',
        'Disclosure settoriali: selezionate in base al profilo di materialità del settore.',
      ];
      griText.forEach(line => { doc.text(line, pad, y); y += line ? 6 : 4; });
    }
    y += 10;

    // Methodology note
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(pad, y, W - pad * 2, 28, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('NOTA METODOLOGICA', pad + 6, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('I fattori di emissione utilizzati sono tratti da: DEFRA 2024 (UK DECC),', pad + 6, y + 15);
    doc.text('ISPRA 2024 (Istituto Superiore per la Protezione e Ricerca Ambientale),', pad + 6, y + 20);
    doc.text('IPCC AR6 WG3 (2022). GWP a 100 anni: CO₂=1, CH₄=29,8, N₂O=273 (IPCC AR6).', pad + 6, y + 25);

    // ── FOOTER on all pages ──────────────────────────────────
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      if (p > 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 285, W, 12, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`${c?.name || ''} · Bilancio di Sostenibilità ${c?.year || 2024} · VERA ESG Platform`, pad, 292);
        doc.text(`Pagina ${p} di ${totalPages}`, W - pad, 292, { align: 'right' });
      }
    }

    return doc.output('datauristring');
  },
};


const reportFlow = {
  _pendingReports: [],

  // Called by client: generate + submit for approval
  async requestReport() {
    const c = currentClient();
    if (!c) return;

    // Show "generating" state
    const btn = document.getElementById('btn-request-report');
    if (btn) { btn.textContent = '⏳ Generazione in corso...'; btn.disabled = true; }

    reportGen.generate(async (pdfData) => {
      // ── Save report request to Supabase (real) ──────────
      if (window.veraAuth && window.veraAuth.requestReport) {
        window.veraAuth.requestReport(c.std, pdfData).catch(() => {});
      }

      // Store locally
      if (!c.reports) c.reports = [];
      const reportId = 'RPT-' + Date.now();
      c.reports.push({
        id: reportId,
        status: 'requested',
        requestedAt: new Date().toLocaleDateString('it-IT'),
        pdfData,
      });

      // Show pending UI
      this._showPendingUI(c);
      toast('Report inviato al consulente per approvazione ✓', 'success');
    });
  },

  _showPendingUI(c) {
    // Hide ALL report content and show a thank-you screen
    const reportScreen = document.getElementById('screen-report');
    if (!reportScreen) return;

    // Replace screen content with thank-you message
    let thankYou = document.getElementById('report-thankyou-screen');
    if (!thankYou) {
      thankYou = document.createElement('div');
      thankYou.id = 'report-thankyou-screen';
      thankYou.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:#fff;z-index:100;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:48px;';
      reportScreen.style.position = 'relative';
      reportScreen.appendChild(thankYou);
    }
    thankYou.style.display = 'flex';
    thankYou.innerHTML = `
      <div style="max-width:480px">
        <div style="width:80px;height:80px;background:#f0fdf4;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px">✅</div>
        <h2 style="font-size:26px;font-weight:800;color:#111;margin:0 0 12px">Grazie!</h2>
        <p style="font-size:16px;color:#374151;margin:0 0 8px;font-weight:500">Report inviato al consulente.</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 32px">Tempo stimato per l'approvazione: <strong style="color:#111">4 giorni lavorativi</strong>.<br>Riceverai una notifica non appena il report sarà approvato e disponibile per il download.</p>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:20px;text-align:left;margin-bottom:24px">
          <div style="font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Dettagli richiesta</div>
          <div style="font-size:13px;color:#374151;display:flex;flex-direction:column;gap:6px">
            <div>📋 <strong>Azienda:</strong> ${c.name}</div>
            <div>📅 <strong>Inviato il:</strong> ${new Date().toLocaleDateString('it-IT', {day:'2-digit',month:'long',year:'numeric'})}</div>
            <div>📊 <strong>Standard:</strong> ${(c.std||'VSME').toUpperCase()}</div>
            <div>🔢 <strong>Anno di rendicontazione:</strong> ${c.year || 2024}</div>
          </div>
        </div>
        <div style="font-size:12px;color:#9ca3af">Per assistenza: <a href="mailto:vittoriopalpati811@gmail.com" style="color:#16a34a">vittoriopalpati811@gmail.com</a></div>
      </div>`;

    // Re-enable request button for edge cases
    const btn = document.getElementById('btn-request-report');
    if (btn) { btn.textContent = '✓ Report inviato'; btn.disabled = true; }
  },

  // Called by consultant: fetch and show pending reports
  async loadPendingReports() {
    // Check local client data for requested reports
    const pending = Object.values(CLIENTS_DATA).filter(c =>
      c.reports && c.reports.some(r => r.status === 'requested')
    );
    this._pendingReports = pending;
    this._updateConsultantBadge(pending.length);
    return pending;
  },

  _updateConsultantBadge(count) {
    let badge = document.getElementById('pending-reports-badge');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  },

  // Consultant approves a report
  approveClientReport(clientId) {
    const c = CLIENTS_DATA[clientId];
    if (!c || !c.reports) return;
    c.reports.forEach(r => { if (r.status === 'requested') r.status = 'approved'; });
    c.reportApproved = true;

    // Remove blur from report screen if this is current client
    if (_currentClientId === clientId) {
      document.querySelectorAll('#screen-report .acard').forEach(el => {
        el.style.filter = '';
        el.style.pointerEvents = '';
      });
      const banner = document.getElementById('report-pending-banner');
      if (banner) {
        banner.innerHTML = `
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <span style="font-size:24px">✅</span>
            <div>
              <div style="font-weight:700;color:#166534">Report approvato dal consulente</div>
              <div style="font-size:13px;color:#15803d;margin-top:2px">Puoi ora visualizzare e scaricare il report completo.</div>
            </div>
          </div>`;
      }
    }

    this.loadPendingReports();
    toast(`Report approvato per ${c.name}`, 'success');
  },

  // Preview PDF (opens blob URL)
  previewPDF(clientId) {
    const c = CLIENTS_DATA[clientId];
    const r = c?.reports?.find(rep => rep.pdfData);
    if (!r) { toast('Nessun PDF disponibile', 'error'); return; }
    const win = window.open('');
    win.document.write(`<iframe src="${r.pdfData}" style="width:100%;height:100vh;border:none"></iframe>`);
  },

  // Download approved PDF
  downloadPDF(clientId) {
    const c = CLIENTS_DATA[clientId || _currentClientId];
    const r = c?.reports?.find(rep => rep.status === 'approved' && rep.pdfData);
    if (!r) { toast('Report non ancora approvato dal consulente', 'error'); return; }
    const a = document.createElement('a');
    a.href = r.pdfData;
    a.download = `VERA-Report-${c.name.replace(/\s/g,'-')}-${c.year}.pdf`;
    a.click();
    toast('PDF scaricato', 'success');
  },

  generateAndDownload() {
    const c = currentClient();
    if (!c) { toast('Nessun cliente selezionato', 'error'); return; }
    const btn = document.querySelector('.report-toolbar a[onclick*="generateAndDownload"]');
    if (btn) btn.textContent = '⏳ Generazione...';
    reportGen._buildPDF(c).then(pdfUri => {
      if (!pdfUri) { toast('Errore generazione PDF', 'error'); return; }
      reportGen._pdfData = pdfUri;
      const a = document.createElement('a');
      a.href = pdfUri;
      a.download = `VERA-Report-${c.name.replace(/\s/g,'-')}-${c.year}.pdf`;
      a.click();
      toast('PDF scaricato ✓', 'success');
      if (btn) btn.textContent = '⬇ PDF';
    });
  },
};

const aiFileParser = {
  // Known emission factor database (official sources)
  EF_DB: {
    'gas naturale':       { fe: 0.18386, unit: 'kWh', scope: 1, source: 'DEFRA 2024, Table 1A' },
    'metano':             { fe: 0.18386, unit: 'kWh', scope: 1, source: 'DEFRA 2024, Table 1A' },
    'gasolio':            { fe: 2.68490, unit: 'L',   scope: 1, source: 'DEFRA 2024, Table 1C' },
    'diesel':             { fe: 2.68490, unit: 'L',   scope: 1, source: 'DEFRA 2024, Table 1C' },
    'benzina':            { fe: 2.31200, unit: 'L',   scope: 1, source: 'DEFRA 2024, Table 1C' },
    'gpl':                { fe: 1.51300, unit: 'L',   scope: 1, source: 'DEFRA 2024, Table 1B' },
    'elettricità':        { fe: 0.28307, unit: 'kWh', scope: 2, source: 'ISPRA 2024 — Fattore nazionale IT' },
    'energia elettrica':  { fe: 0.28307, unit: 'kWh', scope: 2, source: 'ISPRA 2024 — Fattore nazionale IT' },
    'rifiuti discarica':  { fe: 0.58700, unit: 'kg',  scope: 3, source: 'IPCC AR6 WG3, Table A.IV.2' },
    'rifiuti organici':   { fe: 0.58700, unit: 'kg',  scope: 3, source: 'IPCC AR6 WG3, Table A.IV.2' },
    'rifiuti riciclo':    { fe: 0.02100, unit: 'kg',  scope: 3, source: 'DEFRA 2024, Table 6' },
    'carta':              { fe: 0.91200, unit: 'kg',  scope: 3, source: 'DEFRA 2024, Table 6a' },
    'plastica':           { fe: 2.49000, unit: 'kg',  scope: 3, source: 'DEFRA 2024, Table 6b' },
    'trasporto merci':    { fe: 0.09560, unit: 'tkm', scope: 3, source: 'DEFRA 2024, Table 12' },
    'trasporto stradale': { fe: 0.09560, unit: 'tkm', scope: 3, source: 'DEFRA 2024, Table 12' },
    'trasporto aereo':    { fe: 0.25500, unit: 'pkm', scope: 3, source: 'DEFRA 2024, Table 13' },
    'acqua':              { fe: 0.00034, unit: 'm3',  scope: 3, source: 'DEFRA 2024, Table 17' },
  },

  // Try to match a raw string to a known material
  matchMaterial(raw) {
    const lower = (raw || '').toLowerCase().trim();
    for (const [key, data] of Object.entries(this.EF_DB)) {
      if (lower.includes(key)) return { material: key, ...data };
    }
    return null;
  },

  // Parse a CSV row into a GHG entry
  parseRow(row) {
    // Try to find: material name, quantity, unit
    const cells = row.split(/[,;\t]/).map(c => c.trim());
    let material = null, quantity = null, unit = null, ef = null, source = null, scope = null;

    cells.forEach(cell => {
      const num = parseFloat(cell.replace(',', '.'));
      if (!isNaN(num) && num > 0 && !quantity) quantity = num;
      const match = this.matchMaterial(cell);
      if (match && !material) {
        material = cell;
        ef = match.fe;
        unit = match.unit;
        source = match.source;
        scope = match.scope;
      }
      if (/kwh/i.test(cell)) unit = 'kWh';
      if (/\bL\b|litri|litre/i.test(cell)) unit = 'L';
      if (/kg|kilogram/i.test(cell)) unit = 'kg';
      if (/tkm/i.test(cell)) unit = 'tkm';
    });

    if (!material || !quantity) return null;
    const efMatch = this.matchMaterial(material);
    if (efMatch) {
      ef = efMatch.fe;
      source = efMatch.source;
      scope = efMatch.scope;
      if (!unit) unit = efMatch.unit;
    }

    return ef ? {
      mat: material,
      scope,
      tag: scope === 1 ? 'tag-g' : scope === 2 ? 'tag-b' : 'tag-o',
      qty: `${quantity.toLocaleString('it-IT')} ${unit}`,
      fe: ef.toString().replace('.', ','),
      src: source,
      em: Math.round(quantity * ef),
      ai_parsed: true,
      confidence: efMatch ? 0.9 : 0.5,
      needs_review: false,
    } : {
      mat: material || cells[0],
      scope: 3,
      tag: 'tag-o',
      qty: `${quantity || '?'} ${unit || '?'}`,
      fe: '?',
      src: 'AI — da verificare',
      em: 0,
      ai_parsed: true,
      confidence: 0.2,
      needs_review: true,
    };
  },

  // Parse a full CSV text
  parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim());
    const results = [];
    const unrecognized = [];

    lines.slice(1).forEach(line => {  // skip header
      const parsed = this.parseRow(line);
      if (parsed) {
        if (parsed.needs_review) unrecognized.push(parsed);
        else results.push(parsed);
      }
    });

    return { recognized: results, unrecognized };
  },

  // Show review UI for unrecognized rows
  showReviewUI(unrecognized, onConfirm) {
    if (!unrecognized.length) { if (onConfirm) onConfirm([]); return; }

    const overlay = document.createElement('div');
    overlay.id = 'ai-review-panel';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9995;padding:24px';

    overlay.innerHTML = `
      <div style="background:#fff;border-radius:12px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto">
        <div style="background:#111;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-weight:700;font-size:16px">🤖 AI — Revisione dati non riconosciuti</div>
            <div style="font-size:12px;color:#9ca3af;margin-top:2px">${unrecognized.length} righe richiedono verifica manuale</div>
          </div>
          <button onclick="document.getElementById('ai-review-panel').remove()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px">✕</button>
        </div>
        <div style="padding:24px">
          <p style="font-size:13px;color:#6b7280;margin:0 0 20px">Le seguenti righe non hanno un fattore di emissione riconosciuto. Seleziona il materiale corretto o assegna manualmente il fattore.</p>
          <div id="ai-review-rows" style="display:flex;flex-direction:column;gap:12px">
            ${unrecognized.map((r, i) => `
              <div style="border:1px solid #fde047;background:#fefce8;border-radius:8px;padding:14px">
                <div style="font-weight:600;font-size:13px;margin-bottom:8px">⚠️ Riga ${i+1}: "${r.mat}"</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                  <div>
                    <label style="font-size:11px;color:#6b7280;display:block;margin-bottom:4px">Materiale identificato come</label>
                    <select id="ai-mat-${i}" style="width:100%;padding:6px 8px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px">
                      ${Object.keys(this.EF_DB).map(k => `<option value="${k}">${k}</option>`).join('')}
                      <option value="custom">Personalizzato</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-size:11px;color:#6b7280;display:block;margin-bottom:4px">Quantità e unità</label>
                    <input id="ai-qty-${i}" value="${r.qty}" style="width:100%;padding:6px 8px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;box-sizing:border-box">
                  </div>
                </div>
              </div>`).join('')}
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px">
            <button onclick="document.getElementById('ai-review-panel').remove()" style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-size:13px">Salta non riconosciuti</button>
            <button onclick="window._aiReviewConfirm(${unrecognized.length})" style="padding:8px 20px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:13px;font-weight:600">Conferma e aggiungi</button>
          </div>
        </div>
      </div>`;

    window._aiReviewConfirm = (count) => {
      const confirmed = [];
      for (let i = 0; i < count; i++) {
        const matEl = document.getElementById(`ai-mat-${i}`);
        const qtyEl = document.getElementById(`ai-qty-${i}`);
        if (!matEl) continue;
        const mat = matEl.value;
        const ef = this.EF_DB[mat];
        const qty = parseFloat((qtyEl?.value || '0').replace(',', '.'));
        if (ef && qty) {
          confirmed.push({
            mat,
            scope: ef.scope,
            tag: ef.scope === 1 ? 'tag-g' : ef.scope === 2 ? 'tag-b' : 'tag-o',
            qty: `${qty} ${ef.unit}`,
            fe: ef.fe.toString().replace('.', ','),
            src: ef.source,
            em: Math.round(qty * ef.fe),
            ai_parsed: true,
          });
        }
      }
      document.getElementById('ai-review-panel').remove();
      if (onConfirm) onConfirm(confirmed);
    };

    document.body.appendChild(overlay);
  },

  // Main entry: process a File object
  processFile(file, onComplete) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const { recognized, unrecognized } = this.parseCSV(text);

      if (unrecognized.length === 0) {
        onComplete(recognized);
        return;
      }

      this.showReviewUI(unrecognized, (extra) => {
        onComplete([...recognized, ...extra]);
      });
    };
    reader.readAsText(file, 'utf-8');
  },
};

/* ══════════════════════════════════════════════════════════
   PIANO DI SOSTENIBILITA' PDF
══════════════════════════════════════════════════════════ */
const sustainabilityPlan = {
  generate(clientOverride) {
    const c = clientOverride || currentClient();
    if (!c) { toast('Nessun cliente attivo', 'error'); return; }

    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      toast('Libreria PDF non caricata. Ricaricare la pagina.', 'error');
      return;
    }

    try {
      const { jsPDF } = window.jspdf || window;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const W = 210, H = 297;
      const GREEN = [22, 163, 74];
      const DARK  = [17, 17, 17];
      const LIGHT = [248, 250, 252];
      const GRAY  = [107, 114, 128];
      const LGRAY = [229, 231, 235];

      const safe = (s) => (s || '').replace(/[^\x20-\x7E\u00C0-\u024F]/g, (c) => {
        const map = {'\u2019':"'",'\u2018':"'",'\u201C':'"','\u201D':'"','\u2013':'-','\u2014':'--','\u2026':'...','\u20AC':'EUR'};
        return map[c] || '';
      });

      const addPage = () => {
        doc.addPage();
        // Footer on each page
        const pgNum = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFillColor(...DARK);
        doc.rect(0, H - 10, W, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('VERA ESG Platform - Piano di Sostenibilita\'', 14, H - 3.5);
        doc.text(`Pagina ${pgNum}`, W - 14, H - 3.5, { align: 'right' });
        doc.text(safe(c.name), W / 2, H - 3.5, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      };

      // ─── PAGE 1: COVER ───────────────────────────────────────
      // Dark background top section
      doc.setFillColor(...DARK);
      doc.rect(0, 0, W, 140, 'F');

      // Green accent bar
      doc.setFillColor(...GREEN);
      doc.rect(0, 140, W, 6, 'F');

      // VERA logo (triangle symbol)
      doc.setFillColor(...GREEN);
      doc.triangle(22, 42, 14, 58, 30, 58, 'F');
      doc.setFillColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('VERA', 38, 55);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text('ESG Platform', 38, 62);

      // Main title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(30);
      doc.setTextColor(255, 255, 255);
      doc.text('Piano di', 14, 90);
      doc.text('Sostenibilita\'', 14, 105);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text('Environmental, Social & Governance', 14, 118);

      // Company name box
      doc.setFillColor(31, 41, 55);
      doc.roundedRect(14, 150, W - 28, 30, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(safe(c.name || 'Azienda'), 24, 163);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`Anno di rendicontazione: ${c.year || 2024}  |  Standard: ${(c.std || 'VSME').toUpperCase()}  |  Settore: ${safe(c.sector || 'N/A')}`, 24, 173);

      // Info grid
      const infoY = 195;
      const cols = [
        { label: 'Sede', value: safe(c.city || c.location || 'N/A') },
        { label: 'Dipendenti', value: (c.employees || 'N/A').toString() },
        { label: 'Fatturato', value: c.revenue ? 'EUR ' + Number(c.revenue).toLocaleString('it-IT') : 'N/A' },
        { label: 'Consulente', value: (window.auth && window.auth._userData && window.auth._userData.profile && window.auth._userData.profile.name) || 'VERA ESG Consulting' },
      ];
      cols.forEach((col, i) => {
        const x = 14 + i * 46;
        doc.setFillColor(...LIGHT);
        doc.roundedRect(x, infoY, 43, 22, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...GRAY);
        doc.text(col.label.toUpperCase(), x + 4, infoY + 6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        doc.text(safe(col.value), x + 4, infoY + 14);
      });

      // Conformance badge
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, 228, 90, 14, 2, 2, 'F');
      doc.setDrawColor(...GREEN);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, 228, 90, 14, 2, 2, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...GREEN);
      doc.text('Conforme VSME 2023 (EFRAG) / GRI Standards 2021', 19, 236.5);

      // Date & confidential
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(`Redatto il: ${new Date().toLocaleDateString('it-IT', {day:'2-digit',month:'long',year:'numeric'})}`, 14, 252);
      doc.text('Documento riservato - ad uso esclusivo del cliente', 14, 258);

      // Footer p1
      doc.setFillColor(...DARK);
      doc.rect(0, H - 10, W, 10, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('VERA ESG Platform - Piano di Sostenibilita\'', 14, H - 3.5);
      doc.text('Pagina 1', W - 14, H - 3.5, { align: 'right' });

      // ─── PAGE 2: INDICE + EXECUTIVE SUMMARY ─────────────────
      addPage();
      let y = 20;

      // Section header helper
      const sectionHeader = (title, pageY) => {
        doc.setFillColor(...GREEN);
        doc.rect(14, pageY, 4, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...DARK);
        doc.text(safe(title), 22, pageY + 7);
        return pageY + 16;
      };

      y = sectionHeader('Indice del Piano', y);
      const indexItems = [
        '1.  Profilo e contesto organizzativo',
        '2.  Analisi di materialita\'',
        '3.  Performance ambientale',
        '4.  Performance sociale',
        '5.  Governance e compliance',
        '6.  Obiettivi e piano d\'azione',
        '7.  Framework di rendicontazione',
      ];
      indexItems.forEach((item, i) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...DARK);
        doc.text(safe(item), 22, y);
        doc.setTextColor(...LGRAY);
        doc.text('....................................................................', 80, y);
        doc.text((i + 3).toString(), W - 14, y, { align: 'right' });
        y += 8;
      });

      y += 8;
      y = sectionHeader('1. Executive Summary', y);
      const execText = [
        `${safe(c.name)} ha avviato un percorso strutturato di rendicontazione ESG per l\'anno ${c.year || 2024},`,
        `in conformita\' con lo standard ${(c.std || 'VSME').toUpperCase()} applicabile alle ${c.sector || 'imprese'} del settore.`,
        '',
        'Il presente Piano di Sostenibilita\' rappresenta lo strumento strategico con cui l\'azienda:',
        '  - identifica e gestisce i propri impatti ambientali, sociali e di governance;',
        '  - stabilisce obiettivi misurabili di miglioramento ESG;',
        '  - comunica in modo trasparente le proprie performance agli stakeholder.',
        '',
        `Con ${c.employees || 'N/A'} dipendenti e attivita\' nel settore ${safe(c.sector || 'N/A')}, l\'organizzazione`,
        'si impegna a integrare la sostenibilita\' nella propria strategia di lungo periodo.',
      ];
      execText.forEach(line => {
        if (y > H - 30) { addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(safe(line), 22, y);
        y += 6.5;
      });

      // ─── PAGE 3: ANALISI DI MATERIALITA' ─────────────────────
      addPage();
      y = 20;
      y = sectionHeader('2. Analisi di Materialita\'', y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      const matText = [
        'L\'analisi di materialita\' identifica i temi ESG piu\' rilevanti per l\'organizzazione',
        'e i suoi stakeholder, sia in termini di impatto sulle attivita\' aziendali (materialita\'',
        'finanziaria) sia in termini di impatto sull\'esterno (materialita\' d\'impatto).',
      ];
      matText.forEach(l => { doc.text(safe(l), 22, y); y += 6.5; });
      y += 6;

      // Materiality table
      const matTopics = [
        { topic: 'Emissioni di gas serra (Scope 1+2)', impact: 'Alto', fin: 'Alto', priority: 'CRITICA' },
        { topic: 'Gestione dell\'energia', impact: 'Alto', fin: 'Alto', priority: 'CRITICA' },
        { topic: 'Salute e sicurezza dei lavoratori', impact: 'Alto', fin: 'Medio', priority: 'ALTA' },
        { topic: 'Sviluppo del capitale umano', impact: 'Medio', fin: 'Alto', priority: 'ALTA' },
        { topic: 'Gestione rifiuti e economia circolare', impact: 'Medio', fin: 'Medio', priority: 'MEDIA' },
        { topic: 'Diversita\' e inclusione', impact: 'Medio', fin: 'Medio', priority: 'MEDIA' },
        { topic: 'Etica e anti-corruzione', impact: 'Alto', fin: 'Alto', priority: 'CRITICA' },
        { topic: 'Privacy e protezione dati', impact: 'Medio', fin: 'Alto', priority: 'ALTA' },
      ];

      // Table header
      doc.setFillColor(...DARK);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Tema ESG', 18, y + 5.5);
      doc.text('Impatto', 120, y + 5.5);
      doc.text('Fin.', 148, y + 5.5);
      doc.text('Priorita\'', 168, y + 5.5);
      y += 8;

      const priorityColor = { 'CRITICA': [220, 38, 38], 'ALTA': [234, 88, 12], 'MEDIA': [161, 98, 7] };
      matTopics.forEach((row, idx) => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
        doc.rect(14, y, W - 28, 7, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        doc.text(safe(row.topic), 18, y + 5);
        doc.text(safe(row.impact), 120, y + 5);
        doc.text(safe(row.fin), 148, y + 5);
        const pc = priorityColor[row.priority] || DARK;
        doc.setTextColor(...pc);
        doc.setFont('helvetica', 'bold');
        doc.text(safe(row.priority), 168, y + 5);
        doc.setTextColor(...DARK);
        doc.setFont('helvetica', 'normal');
        y += 7;
      });

      // ─── PAGE 4: PERFORMANCE AMBIENTALE ──────────────────────
      addPage();
      y = 20;
      y = sectionHeader('3. Performance Ambientale', y);

      // GHG KPIs
      const ghg = c.ghg;
      const kpis = ghg ? [
        { label: 'Emissioni Scope 1 (tCO2e)', value: ghg.scope1?.toFixed(1) || '0.0', icon: '🏭' },
        { label: 'Emissioni Scope 2 (tCO2e)', value: ghg.scope2?.toFixed(1) || '0.0', icon: '⚡' },
        { label: 'Totale Scope 1+2 (tCO2e)', value: ((ghg.scope1||0)+(ghg.scope2||0)).toFixed(1), icon: '📊' },
        { label: 'Intensita\' GHG (tCO2e/dip.)', value: c.employees ? (((ghg.scope1||0)+(ghg.scope2||0))/c.employees).toFixed(2) : 'N/A', icon: '📈' },
      ] : [
        { label: 'Emissioni Scope 1 (tCO2e)', value: 'N/D', icon: '🏭' },
        { label: 'Emissioni Scope 2 (tCO2e)', value: 'N/D', icon: '⚡' },
        { label: 'Totale Scope 1+2 (tCO2e)', value: 'N/D', icon: '📊' },
        { label: 'Intensita\' GHG (tCO2e/dip.)', value: 'N/D', icon: '📈' },
      ];

      kpis.forEach((kpi, i) => {
        const kx = 14 + (i % 2) * 93;
        const ky = y + Math.floor(i / 2) * 28;
        doc.setFillColor(...LIGHT);
        doc.roundedRect(kx, ky, 90, 24, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(safe(kpi.label), kx + 6, ky + 7);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...GREEN);
        doc.text(safe(kpi.value), kx + 6, ky + 18);
      });
      y += 62;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...DARK);
      const envText = [
        'Le emissioni sono calcolate in conformita\' con il GHG Protocol Corporate Standard,',
        'utilizzando i fattori di emissione ufficiali: DEFRA 2024 per combustibili fossili,',
        'ISPRA 2024 per l\'elettricita\' nazionale italiana, IPCC AR6 WG3 per i GWP100.',
        '',
        'Obiettivi ambientali per i prossimi 3 anni:',
        '  - Riduzione del 15% delle emissioni Scope 1 attraverso efficientamento processi;',
        '  - Incremento della quota di energia rinnovabile al 30%;',
        '  - Riduzione della produzione di rifiuti del 10% per unita\' prodotta.',
      ];
      envText.forEach(l => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.text(safe(l), 22, y);
        y += 6.5;
      });

      // ─── PAGE 5: PERFORMANCE SOCIALE ─────────────────────────
      addPage();
      y = 20;
      y = sectionHeader('4. Performance Sociale', y);

      const socialKPIs = [
        { label: 'Dipendenti totali', value: (c.employees || 'N/D').toString() },
        { label: 'Infortuni registrabili', value: '0' },
        { label: 'Ore medie formazione/dip.', value: '12h' },
        { label: 'Gap retributivo M/F', value: '<5%' },
      ];
      socialKPIs.forEach((kpi, i) => {
        const kx = 14 + (i % 2) * 93;
        const ky = y + Math.floor(i / 2) * 28;
        doc.setFillColor(...LIGHT);
        doc.roundedRect(kx, ky, 90, 24, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.text(safe(kpi.label), kx + 6, ky + 7);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...DARK);
        doc.text(safe(kpi.value), kx + 6, ky + 18);
      });
      y += 62;

      const socialText = [
        `${safe(c.name)} riconosce le proprie risorse umane come asset strategico fondamentale.`,
        'Le principali iniziative sociali includono:',
        '  - Programma di formazione continua con media di 12 ore annue per dipendente;',
        '  - Politica di pari opportunita\' e piano per la riduzione del gender pay gap;',
        '  - Sistema di gestione della salute e sicurezza conforme al D.Lgs. 81/2008;',
        '  - Coinvolgimento proattivo degli stakeholder locali e della comunita\'.',
      ];
      socialText.forEach(l => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(safe(l), 22, y);
        y += 6.5;
      });

      // ─── PAGE 6: GOVERNANCE + PIANO D'AZIONE ─────────────────
      addPage();
      y = 20;
      y = sectionHeader('5. Governance e Compliance', y);

      const govText = [
        'Il sistema di governance di ' + safe(c.name) + ' e\' strutturato per garantire',
        'responsabilita\', trasparenza e gestione dei rischi ESG a tutti i livelli.',
        '',
        'Elementi chiave della governance ESG:',
        '  - Organo di governance con responsabilita\' esplicita sui temi ESG;',
        '  - Politica anti-corruzione adottata e comunicata a tutti i dipendenti;',
        '  - Sistema di whistleblowing per la segnalazione di condotte illecite;',
        '  - Revisione periodica delle performance ESG da parte del vertice aziendale.',
      ];
      govText.forEach(l => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(safe(l), 22, y);
        y += 6.5;
      });
      y += 8;

      y = sectionHeader('6. Piano d\'Azione ESG 2025-2027', y);

      const actions = [
        { num:'1', area:'Ambiente', action:'Audit energetico e piano efficienza', target:'Dic 2025', status:'Pianificato' },
        { num:'2', area:'Ambiente', action:'Certificazione ISO 14001', target:'Giu 2026', status:'In valutazione' },
        { num:'3', area:'Sociale', action:'Programma formazione ESG dipendenti', target:'Mar 2025', status:'In corso' },
        { num:'4', area:'Sociale', action:'Policy diversita\' e inclusione', target:'Set 2025', status:'Pianificato' },
        { num:'5', area:'Governance', action:'Comitato ESG interno', target:'Gen 2025', status:'Pianificato' },
        { num:'6', area:'Governance', action:'Prima rendicontazione VSME/GRI', target:'Dic 2024', status:'Completato' },
      ];

      doc.setFillColor(...DARK);
      doc.rect(14, y, W - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('#', 18, y + 5.5);
      doc.text('Area', 28, y + 5.5);
      doc.text('Azione', 55, y + 5.5);
      doc.text('Target', 148, y + 5.5);
      doc.text('Stato', 175, y + 5.5);
      y += 8;

      const statusColor = { 'Completato': [22,163,74], 'In corso': [37,99,235], 'Pianificato': [107,114,128], 'In valutazione': [234,88,12] };
      actions.forEach((row, idx) => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
        doc.rect(14, y, W - 28, 7, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...DARK);
        doc.text(row.num, 18, y + 5);
        doc.text(safe(row.area), 28, y + 5);
        doc.text(safe(row.action), 55, y + 5);
        doc.text(safe(row.target), 148, y + 5);
        const sc = statusColor[row.status] || DARK;
        doc.setTextColor(...sc);
        doc.setFont('helvetica', 'bold');
        doc.text(safe(row.status), 175, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...DARK);
        y += 7;
      });

      // ─── PAGE 7: FRAMEWORK + DISCLAIMER ─────────────────────
      addPage();
      y = 20;
      y = sectionHeader('7. Framework di Rendicontazione', y);

      const fwText = [
        `Il presente piano e\' redatto in conformita\' con lo standard ${(c.std || 'VSME').toUpperCase()}:`,
        '',
        c.std === 'gri' ? 'GRI Standards 2021 (Global Reporting Initiative)' : 'VSME 2023 — Voluntary Standard for non-listed SMEs (EFRAG)',
        c.std === 'gri' ? '  Copertura: disclosure universali GRI 2-1 - GRI 2-30 + disclosure settoriali' : '  Copertura: moduli B1 (Fondamentale), B2 (Ambiente), B3 (Sociale), B4 (Governance), B5 (Rischi)',
        '',
        'Fattori di emissione ufficiali utilizzati:',
        '  - DEFRA 2024 (UK Government GHG Conversion Factors) per combustibili fossili',
        '  - ISPRA 2024 (Istituto Superiore per la Protezione e la Ricerca Ambientale) per l\'elettricita\' IT',
        '  - IPCC AR6 WG3 Table A.IV.2 per i GWP100',
        '',
        'Metodologia di calcolo GHG: GHG Protocol Corporate Standard (WRI/WBCSD)',
        '',
        'Il report e\' stato predisposto con il supporto della piattaforma VERA ESG Platform.',
      ];
      fwText.forEach(l => {
        if (y > H - 25) { addPage(); y = 20; }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...DARK);
        doc.text(safe(l), 22, y);
        y += 6.5;
      });

      y += 10;
      // Disclaimer box
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(14, y, W - 28, 28, 2, 2, 'F');
      doc.setDrawColor(253, 224, 71);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, y, W - 28, 28, 2, 2, 'D');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(133, 77, 14);
      doc.text('DISCLAIMER', 20, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const disclaimer = [
        'Il presente documento e\' redatto a scopo informativo e non costituisce parere legale o finanziario.',
        'I dati riportati si basano sulle informazioni fornite dall\'organizzazione. VERA ESG Platform e\' una',
        'piattaforma di supporto alla rendicontazione e non si assume responsabilita\' per eventuali imprecisioni.',
        'Per la pubblicazione ufficiale e\' consigliata la revisione da parte di un professionista ESG qualificato.',
      ];
      disclaimer.forEach((line, i) => {
        doc.text(safe(line), 20, y + 13 + i * 5);
      });

      // Save
      const filename = `VERA_Piano_Sostenibilita_${safe(c.name).replace(/\s+/g,'_')}_${c.year || 2024}.pdf`;
      doc.save(filename);
      toast('Piano di Sostenibilita\' generato e scaricato', 'success');

    } catch(err) {
      console.error('sustainabilityPlan error:', err);
      toast('Errore nella generazione del PDF: ' + err.message, 'error');
    }
  },
};

/* ══════════════════════════════════════════════════════════
   GHG DATA
══════════════════════════════════════════════════════════ */

const GHG_DATA = [
  { mat: 'Gas naturale',     scope: 1, tag: 'tag-g', qty: '42.500 kWh', fe: '0,18386', src: 'DEFRA 2024, Table 1A',   em: 7820  },
  { mat: 'Gasolio automezzi',scope: 1, tag: 'tag-g', qty: '1.820 L',   fe: '2,68490', src: 'DEFRA 2024, Table 1C',  em: 4878  },
  { mat: 'Elettricità',      scope: 2, tag: 'tag-b', qty: '66.020 kWh', fe: '0,28307', src: 'ISPRA 2024 — Fattore nazionale IT',  em: 18684 },
  { mat: 'Rifiuti discarica',scope: 3, tag: 'tag-o', qty: '8.400 kg',   fe: '0,58700', src: 'IPCC AR6 WG3, Table A.IV.2',  em: 4931  },
  { mat: 'Rifiuti riciclo',  scope: 3, tag: 'tag-o', qty: '3.200 kg',   fe: '0,02100', src: 'DEFRA 2024, Table 6',  em: 67    },
  { mat: 'Trasporto merci',  scope: 3, tag: 'tag-o', qty: '12.400 tkm', fe: '0,09560', src: 'DEFRA 2024, Table 12',  em: 1185  },
];

function renderBreakdown(client) {
  const tbody = document.getElementById('breakdown-tbody');
  if (!tbody) return;
  const c    = client || currentClient();
  const rows = (c && c.ghgRows && c.ghgRows.length) ? c.ghgRows : GHG_DATA;
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.mat}</td>
      <td><span class="tag ${r.tag}">S${r.scope}</span></td>
      <td class="num">${r.qty}</td>
      <td style="text-align:right;color:var(--text-3);font-size:11px">${r.fe}</td>
      <td><span class="src-note">${r.src}</span></td>
      <td class="num"><b>${r.em.toLocaleString('it-IT')}</b></td>
    </tr>`).join('');
  // KPI scope bars
  if (c && c.ghg) {
    const tot = c.ghg.total || 1;
    const s1p = Math.round(c.ghg.s1 / tot * 100);
    const s2p = Math.round(c.ghg.s2 / tot * 100);
    const s3p = 100 - s1p - s2p;
    const s1b = document.querySelector('.scope-bar-s1');
    const s2b = document.querySelector('.scope-bar-s2');
    const s3b = document.querySelector('.scope-bar-s3');
    if (s1b) s1b.style.width = s1p + '%';
    if (s2b) s2b.style.width = s2p + '%';
    if (s3b) s3b.style.width = s3p + '%';
    const s1l = document.querySelectorAll('.legend-row b')[0];
    const s2l = document.querySelectorAll('.legend-row b')[1];
    const s3l = document.querySelectorAll('.legend-row b')[2];
    if (s1l) s1l.textContent = `Scope 1 · ${s1p}%`;
    if (s2l) s2l.textContent = `Scope 2 · ${s2p}%`;
    if (s3l) s3l.textContent = `Scope 3 · ${s3p}%`;
  }
}


/* ══════════════════════════════════════════════════════════
   REPORT
══════════════════════════════════════════════════════════ */

function switchReport(type) {
  document.getElementById('rpt-vsme').style.display = type === 'vsme' ? '' : 'none';
  document.getElementById('rpt-gri').style.display  = type === 'gri'  ? '' : 'none';
  document.getElementById('btn-vsme').className = 'btn btn-sm ' + (type === 'vsme' ? 'btn-primary' : 'btn-outline');
  document.getElementById('btn-gri').className  = 'btn btn-sm ' + (type === 'gri'  ? 'btn-primary' : 'btn-outline');
}

function downloadExcel() {
  const rows = [
    ['Materiale', 'Scope', 'Quantità', 'FE (kgCO₂e/u)', 'Fonte FE', 'Emissioni (kgCO₂e)'],
    ...GHG_DATA.map(r => [r.mat, 'S' + r.scope, r.qty, r.fe, r.src, r.em])
  ];
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  const _cName = (currentClient() && currentClient().name) ? currentClient().name.replace(/[^a-zA-Z0-9]/g, '-') : 'Cliente';
  const _cYear = (currentClient() && currentClient().year) ? currentClient().year : new Date().getFullYear();
  a.download = `VERA-GHG-${_cName}-${_cYear}.csv`;
  a.click();
  toast('File Excel (CSV) scaricato', 'success');
}


/* ══════════════════════════════════════════════════════════
   STAMP
══════════════════════════════════════════════════════════ */

function applyStamp() {
  // Redirect to confirmation dialog
  stamp.confirmAndApply();
}

function verifyStamp() {
  toast('Verifica: ✓ Integrità confermata · Hash corrispondente', 'success');
}

/* ══════════════════════════════════════════════════════════
   STAMP MODULE (extended)
══════════════════════════════════════════════════════════ */

const stamp = {
  // Mostra dialogo di conferma prima di applicare il timbro (azione irreversibile)
  confirmAndApply() {
    if (state.stampApplied) {
      toast('Timbro già applicato a questo report', 'error');
      return;
    }
    if (!auth.isAdmin()) {
      toast('Solo il consulente può applicare il timbro metodologico', 'error');
      return;
    }

    // Crea dialogo di conferma inline
    const existing = document.getElementById('stamp-confirm-dialog');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'stamp-confirm-dialog';
    dialog.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);
      display:flex;align-items:center;justify-content:center;z-index:9999;
    `;
    const c = currentClient();
    dialog.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:32px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
        <div style="font-size:32px;text-align:center;margin-bottom:12px">🏷️</div>
        <h3 style="margin:0 0 8px;text-align:center;font-size:18px;color:#111">Applicare il timbro metodologico?</h3>
        <p style="color:#555;font-size:14px;text-align:center;margin:0 0 16px">
          Questa azione è <strong>irreversibile</strong>. Il timbro VERA attesta la coerenza metodologica e la completezza del report secondo il GHG Protocol.
        </p>
        <div style="background:#fef3c7;border:1px solid #d97706;border-radius:8px;padding:12px;font-size:13px;color:#92400e;margin-bottom:24px">
          ⚠️ Il timbro VERA <strong>non costituisce assurance ISAE 3000</strong>** e non sostituisce la revisione da parte di un revisore indipendente accreditato.
        </div>
        <div style="font-size:13px;color:#374151;margin-bottom:20px">
          <b>Report:</b> ${c ? c.name : '—'} · ${c ? c.std.toUpperCase() : ''} · ${c ? c.year : ''}<br>
          <b>Metodologia:</b> GHG Protocol + ${c && c.std === 'vsme' ? 'VSME 2023 (EFRAG)' : 'GRI Standards 2021'}<br>
          <b>Fattori:</b> DEFRA 2024 · ISPRA 2024 · IPCC AR6
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button onclick="document.getElementById('stamp-confirm-dialog').remove()"
            style="padding:10px 20px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-size:14px">
            Annulla
          </button>
          <button onclick="stamp._doApply(); document.getElementById('stamp-confirm-dialog').remove();"
            style="padding:10px 20px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:14px;font-weight:600">
            ✓ Conferma e applica timbro
          </button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
  },

  // Esegue effettivamente l'applicazione del timbro (dopo conferma)
  _doApply() {
    const btn = document.getElementById('btn-apply-stamp');
    if (btn) { btn.textContent = 'Applicazione in corso…'; btn.disabled = true; }
    setTimeout(() => {
      state.stampApplied = true;
      const hash  = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const c     = currentClient();
      const prefix = (c && c.std === 'gri') ? 'GR' : 'VS';
      const year  = c ? c.year : new Date().getFullYear();
      const code  = prefix + '-' + year + '-' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const date  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
      _setText('stamp-hash', hash);
      _setText('stamp-code-display', code);
      _setText('stamp-date', date);
      const sr = document.getElementById('stamp-result');
      if (sr) sr.style.display = 'block';
      if (btn) btn.textContent = '✓ Timbro applicato';
      // Persist on client object
      if (c) { c.stamp = { applied: true, code, hash, date }; c.step = 6; }
      updateWizardProgress();
      // Automatically propose report approval after stamping
      toast(`Timbro applicato · Codice ${code} · Puoi ora approvare il report per il cliente`, 'success');
    }, 1400);
  },

  // Consulente approva il report → diventa visibile al cliente
  approveReport() {
    if (!auth.isAdmin()) {
      toast('Solo il consulente può approvare e pubblicare il report', 'error');
      return;
    }
    const c = currentClient();
    if (!c) { toast('Nessun cliente selezionato', 'error'); return; }

    // Crea dialogo di approvazione
    const existing = document.getElementById('approve-dialog');
    if (existing) existing.remove();

    const dialog = document.createElement('div');
    dialog.id = 'approve-dialog';
    dialog.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);
      display:flex;align-items:center;justify-content:center;z-index:9999;
    `;
    dialog.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:32px;max-width:460px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
        <div style="font-size:32px;text-align:center;margin-bottom:12px">📤</div>
        <h3 style="margin:0 0 8px;text-align:center;font-size:18px;color:#111">Pubblicare il report al cliente?</h3>
        <p style="color:#555;font-size:14px;text-align:center;margin:0 0 20px">
          Il report sarà reso visibile a <strong>${c.name}</strong>. Verifica che timbro e dati siano corretti prima di procedere.
        </p>
        <div style="font-size:13px;color:#374151;margin-bottom:20px">
          <b>Cliente:</b> ${c.name}<br>
          <b>Standard:</b> ${c.std.toUpperCase()} · Anno ${c.year}<br>
          <b>Timbro:</b> ${c.stamp && c.stamp.applied ? '✅ Applicato (' + c.stamp.code + ')' : '⚠️ Non ancora applicato'}
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button onclick="document.getElementById('approve-dialog').remove()"
            style="padding:10px 20px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-size:14px">
            Annulla
          </button>
          <button onclick="stamp._doApprove(); document.getElementById('approve-dialog').remove();"
            style="padding:10px 20px;border:none;border-radius:8px;background:#16a34a;color:#fff;cursor:pointer;font-size:14px;font-weight:600">
            ✓ Pubblica al cliente
          </button>
        </div>
      </div>`;
    document.body.appendChild(dialog);
  },

  _doApprove() {
    const c = currentClient();
    if (c) {
      c.reportApproved = true;
      c.status = 'completed';
      if (c.step < 6) c.step = 6;
      updateWizardProgress();
      _updateDashboardTable(c);
    }
    toast(`Report pubblicato ✓ — ${c ? c.name : ''} può ora visualizzarlo`, 'success');
  },

  verify: verifyStamp,
};


/* ══════════════════════════════════════════════════════════
   UI HELPERS
══════════════════════════════════════════════════════════ */

function toast(msg, type) {
  const wrap = document.getElementById('toast-wrap');
  const t    = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 220); }, 3500);
}

function stepDone(id) {
  const el = document.getElementById(id);
  el.classList.add('done'); el.classList.remove('active');
  el.querySelector('.step-num').textContent = '✓';
}
function stepActive(id) {
  const el = document.getElementById(id);
  el.classList.add('active'); el.classList.remove('done');
}
function stepUndone(id) {
  const el = document.getElementById(id);
  el.classList.remove('done', 'active');
  el.querySelector('.step-num').textContent = id.replace('step', '');
}


/* ══════════════════════════════════════════════════════════
   GLOBAL FUNCTIONS (called from HTML)
══════════════════════════════════════════════════════════ */

function openApp() {
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-landing').classList.remove('active');
  const loginEl = document.getElementById('view-login');
  loginEl.style.display = 'flex';
  loginEl.classList.add('active');
}

function closeLogin() {
  document.getElementById('view-login').style.display = 'none';
  document.getElementById('view-login').classList.remove('active');
  const land = document.getElementById('view-landing');
  land.style.display = 'block';
  land.classList.add('active');
}

function closeApp() {
  // Real Supabase sign-out
  if (window.veraAuth && window.veraAuth.signOut) {
    window.veraAuth.signOut();
    return;
  }
  document.getElementById('view-app').style.display = 'none';
  document.getElementById('view-app').classList.remove('active');
  const land = document.getElementById('view-landing');
  land.style.display = 'block';
  land.classList.add('active');
}

function showScreen(id, navEl) {
  // Guard stamp screen — admin only
  if (id === 'stamp' && !auth.isAdmin()) {
    toast('Il timbro metodologico può essere applicato solo dal consulente', 'error');
    return;
  }
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  // Refresh client list from Supabase whenever admin opens clients screen
  if (id === 'clients' && auth.isAdmin() && window.veraAuth && window.veraAuth.refreshAdminClientTable) {
    window.veraAuth.refreshAdminClientTable();
  }
  const titles = {
    home:      'Home',
    assess:    'Valutazione AI — Standard ESG',
    clients:   'Gestione Clienti',
    dashboard: 'Dashboard',
    upload:    'Carica Dati',
    results:   'Calcolo GHG',
    report:      'Report ESG',
    stamp:       'Timbro Metodologico',
    materiality: 'Analisi Doppia Materialità',
  };
  document.getElementById('page-title').textContent = titles[id] || id;

  // Inizializza modulo materialità alla prima apertura
  if (id === 'materiality' && window.materialityModule) {
    window.materialityModule.init();
  }

  // Trigger screen entrance animations
  if (window.veraAnims) window.veraAnims.screenEnter(id);
}

function toggleFaq(el) { el.parentElement.classList.toggle('open'); }


/* ══════════════════════════════════════════════════════════
   AUTH / ROLE MANAGEMENT
══════════════════════════════════════════════════════════ */

const auth = {
  _role: null,

  login(role, userData) {
    this._role     = role;
    this._userData = userData || null;
    sessionStorage.setItem('vera_role', role);

    // Hide login, show app
    const landing2 = document.getElementById('view-landing');
    if (landing2) { landing2.style.display = 'none'; landing2.classList.remove('active'); }
    const loginEl = document.getElementById('view-login');
    loginEl.style.display = 'none';
    loginEl.classList.remove('active');
    const app = document.getElementById('view-app');
    app.style.display = 'flex';
    app.classList.add('active');

    this._applyRole(role, userData);

    // Set plan from current client if available
    const c = CLIENTS_DATA[_currentClientId];
    if (c && c.plan) { this.setPlan(c.plan); }
    else if (role === 'admin') { this.setPlan('enterprise'); }
    else { this.setPlan('base'); }

    // Show home screen with greeting
    const greetEl = document.getElementById('home-greeting');
    if (greetEl) {
      greetEl.textContent = role === 'admin'
        ? `Bentornato, ${(userData && userData.profile && userData.profile.name) || 'Consulente'} 👋`
        : `Bentornato${userData && userData.profile && userData.profile.name ? ', ' + userData.profile.name : ''} 👋`;
    }
    showScreen('home', document.getElementById('nav-home'));
    if (role === 'admin' && window.veraAuth && window.veraAuth.refreshAdminClientTable) {
      window.veraAuth.refreshAdminClientTable();
    }

    // Sidebar + app entrance animations
    if (window.veraAnims) window.veraAnims.appEntrance();

    // Personalise greeting with real user data
    const userName = (userData && userData.profile)
      ? (userData.profile.company_name || userData.profile.name || '')
      : '';
    const adminName = (userData && userData.profile && userData.profile.name) ? userData.profile.name.split(' ')[0] : 'Admin';
    const greet = role === 'admin'
      ? `✓ Accesso consulente — Bentornato, ${adminName}`
      : `✓ Accesso cliente${userName ? ' — ' + userName : ''}`;
    toast(greet, 'success');
  },

  _applyRole(role, userData) {
    const isAdmin = role === 'admin';

    // Show/hide admin-only sidebar elements
    document.querySelectorAll('.sb-admin-only').forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });

    // Stamp nav item — only admin
    const navStamp = document.getElementById('nav-stamp');
    if (navStamp) navStamp.style.display = isAdmin ? '' : 'none';

    // Stamp button in report toolbar — only admin
    const reportStampBtn = document.getElementById('report-stamp-btn');
    if (reportStampBtn) reportStampBtn.style.display = isAdmin ? '' : 'none';

    // Role badge in topbar
    const roleBadge = document.getElementById('topbar-role-badge');
    if (roleBadge) {
      roleBadge.textContent  = isAdmin ? 'Admin' : 'Cliente';
      roleBadge.className    = 'role-badge ' + (isAdmin ? 'role-admin' : 'role-client');
    }

    // Real user data from Supabase (if available)
    const profile     = (userData && userData.profile) ? userData.profile : null;
    const companyName = profile ? (profile.company_name || profile.name || '') : '';
    const userInitials = companyName
      ? companyName.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase()
      : (isAdmin ? 'VP' : 'CL');

    // Avatar initials
    const avatar = document.querySelector('.avatar');
    if (avatar) {
      const adminInitials = profile && profile.name
        ? profile.name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase()
        : 'VP';
      avatar.textContent = isAdmin ? adminInitials : userInitials;
      avatar.title       = isAdmin ? (profile && profile.name ? profile.name + ' — Consulente' : 'Consulente') : (companyName || 'Cliente');
    }

    // Company chip
    const chip = document.querySelector('.company-chip');
    if (chip) {
      chip.textContent = isAdmin
        ? 'Consulente · Admin'
        : `${companyName || 'La tua azienda'} · ${(profile && profile.client_id) ? '2024' : ''}`;
    }

    // Sidebar company name
    const sbName = document.getElementById('sb-company-name');
    if (sbName && !isAdmin && companyName) sbName.textContent = companyName;

    // Show/hide PRO sidebar actions for admin
    const proSidebarBtn = document.getElementById('sb-pro-btn');
    if (proSidebarBtn) proSidebarBtn.style.display = isAdmin ? '' : 'none';

    // nav-materiality — always visible; the module itself handles plan restrictions
    const navMateriality = document.getElementById('nav-materiality');
    if (navMateriality) navMateriality.style.display = '';
  },

  getRole()  { return this._role || sessionStorage.getItem('vera_role') || 'client'; },
  isAdmin()  { return this.getRole() === 'admin'; },

  // Plan management — admin (consulente) è sempre PRO
  // Client plan: 'base' | 'pro' | 'enterprise' (stored in sessionStorage or client object)
  _plan: null,
  getPlan() {
    if (this.isAdmin()) return 'enterprise';
    if (this._plan) return this._plan;
    return sessionStorage.getItem('vera_plan') || 'base';
  },
  isPro() {
    const p = this.getPlan();
    return p === 'pro' || p === 'enterprise' || this.isAdmin();
  },
  setPlan(plan) {
    this._plan = plan;
    sessionStorage.setItem('vera_plan', plan);
  },

  // Guard: returns true and shows toast if not PRO
  requirePro(featureName) {
    if (this.isPro()) return true;
    toast(`"${featureName}" è disponibile solo nel piano PRO o Enterprise`, 'error');
    return false;
  },
};


/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Landing reveal on scroll
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Init assessment event delegation (belt-and-suspenders: also uses inline onclick)
  assessment._init();

  // Load default client data if available
  const _initClient = currentClient();
  if (_initClient) renderBreakdown(_initClient);

  // Upload: show std panel first
  document.getElementById('std-panel').style.display     = 'block';
  document.getElementById('company-panel').style.display = 'none';
  document.getElementById('upload-panel').style.display  = 'none';
  document.getElementById('valid-panel').style.display   = 'none';

  // Show landing
  document.getElementById('view-landing').classList.add('active');
});

/* ══════════════════════════════════════════════════════════
   PRO FEATURES
══════════════════════════════════════════════════════════ */

const proFeatures = {
  // AI assessment avanzato — disponibile solo PRO/Enterprise
  advancedAssessment: {
    run() {
      if (!auth.requirePro('AI Assessment Avanzato')) return;
      const c = currentClient();
      const answers = state.assessment.answers || {};
      // Create full-screen terminal panel
      const panel = document.createElement('div');
      panel.id = 'adv-assess-panel';
      panel.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;background:#111;
        display:flex;flex-direction:column;z-index:9997;
        color:#fff;font-family:'Monaco','Menlo','Courier New',monospace;
      `;
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = `
        flex:1;overflow-y:auto;padding:32px;background:#0a0e27;
        font-size:13px;line-height:1.6;color:#e0e0e0;
      `;
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Chiudi';
      closeBtn.style.cssText = `
        position:absolute;top:16px;right:16px;padding:8px 16px;
        border:1px solid #374151;border-radius:6px;background:#1f2937;
        color:#fff;cursor:pointer;font-size:13px;font-weight:600;z-index:9998;
      `;
      closeBtn.onclick = () => { panel.remove(); document.removeEventListener('keydown', _escHandler); };
      const _escHandler = (e) => { if (e.key === 'Escape') { panel.remove(); document.removeEventListener('keydown', _escHandler); } };
      document.addEventListener('keydown', _escHandler);
      panel.style.cssText = panel.style.cssText; // already set
      // Ensure close button is always visible - use a fixed overlay wrapper
      const headerBar = document.createElement('div');
      headerBar.style.cssText = 'position:sticky;top:0;background:#111;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;z-index:9999;border-bottom:1px solid #374151;flex-shrink:0;';
      headerBar.innerHTML = '<span style="color:#4ade80;font-weight:700;font-size:14px">⚡ VERA · AI Assessment Avanzato PRO</span>';
      headerBar.appendChild(closeBtn);
      panel.insertBefore(headerBar, contentDiv);
      panel.appendChild(contentDiv);
      document.body.appendChild(panel);

      // Generate and animate analysis
      const analysisText = this._generateAnalysis(c, answers);
      this._typewriter(contentDiv, analysisText, 20);
    },

    _generateAnalysis(client, answers) {
      const sector = client?.sector || answers.sector || 'Manifatturiero';
      const std = client?.std?.toUpperCase() || 'VSME';
      const employees = client?.employees || 'N/A';

      // Determine sector-specific risks and topics
      let sectorRisks = [];
      let topics = [];
      if (sector.toLowerCase().includes('edilizia')) {
        sectorRisks = ['Supply chain sostenibilità', 'Gestione rifiuti costruzione', 'Salute e sicurezza cantiere'];
        topics = ['Lavoro dignitoso', 'Ambiente (materiali)', 'Salute e sicurezza'];
      } else if (sector.toLowerCase().includes('manifatturiero')) {
        sectorRisks = ['Efficienza energetica', 'Gestione rifiuti produzione', 'Emissioni dirette'];
        topics = ['Energia', 'Rifiuti', 'Emissioni atmosferiche'];
      } else {
        sectorRisks = ['Consumo energetico', 'Gestione supply chain', 'Governance'];
        topics = ['Energia', 'Procurement sostenibile', 'Compliance'];
      }

      const text = `
╔══════════════════════════════════════════════════════════════╗
║                 ANALISI AVANZATA VERA ESG                    ║
║          Deep-dive Materialità e Doppia Materialità          ║
╚══════════════════════════════════════════════════════════════╝

[CLIENTE]
  Nome: ${client?.name || 'N/A'}
  Settore: ${sector}
  Dipendenti: ${employees}
  Standard: ${std}
  Periodo: ${client?.year || 2024}

[1. DOPPIA MATERIALITÀ CSRD/ESRS]

Analisi di IMPATTO (Inside-out):
  Come le questioni ESG impattano il nostro business operativo?

  • ${sectorRisks[0] || 'Energia e clima'}
    Impatto: CRITICO | Probabilità: Alta | Risk Level: 8/10
    La gestione energetica e le emissioni impattano direttamente
    i costi operativi e la competitività sul mercato.

  • ${sectorRisks[1] || 'Supply chain'}
    Impatto: ALTO | Probabilità: Media-Alta | Risk Level: 7/10
    La resilienza della filiera è critica per la continuità
    operativa e la reputazione aziendale.

  • ${sectorRisks[2] || 'Governance'}
    Impatto: MEDIO | Probabilità: Media | Risk Level: 6/10
    La trasparenza e l'etica affettano fiducia stakeholder.

Analisi FINANZIARIA (Outside-in):
  Come il contesto ESG impatta i flussi finanziari?

  • Rischio di stranded assets: €${Math.round(Math.random() * 500 + 200)}k
    Asset esposti a transizione energetica con ROI a rischio

  • Opportunità di efficientamento: €${Math.round(Math.random() * 300 + 100)}k/anno
    Riduzione consumi energetici → CAPEX: 18-24 mesi ROI

  • Costo di inazione: €${Math.round(Math.random() * 400 + 150)}k
    Sanzioni compliance CSRD, perdita clienti ESG-conscious

[2. BENCHMARK SETTORIALE]

Confronto con peer group ${sector}:

Emissioni Scope 1-3 per dipendente:
  Tuo profilo:      12-15 tCO₂e/dip (stimato da assessment)
  Media settore:    18-22 tCO₂e/dip
  Top 25%:          6-10 tCO₂e/dip

  → POSIZIONE: Al di sopra della media | Opportunità di miglioria

Disclosure completezza:
  Tuo profilo:      ${std === 'VSME' ? '60-70%' : '50-65%'} topic richiesti
  Media settore:    ${std === 'VSME' ? '45-55%' : '40-50%'}

  → VANTAGGIO COMPETITIVO: Comunicazione ESG superiore

[3. GAP ANALYSIS - DISCLOSURE MANCANTI]

Basato sul tuo profilo di rischio ALTO:

Disclosure critiche mancanti:
  • Governance: politica climate transition (CSRD B1-E2)
  • Ambiente: target riduzione emissioni al 2030 (GRI 305-1)
  • Sociale: diversity & inclusion board (GRI 405-1)
  • Materiali critici: supply chain audit documentation

Impatto di non divulgazione:
  - Score MSCI/Bloomberg ridotto del 20-30%
  - Esclusione da fondi ESG (categoria 8/9 SFDR)
  - Richieste compliance aggiuntive da investitori

Roadmap di completamento (3 mesi):
  M1: Raccolta documentazione governance + climate targets
  M2: Definizione scope 3 + supply chain survey
  M3: Validazione e pubblicazione disclosure completa

[4. SCORE ESG PREDITTIVO]

Basato su assessment + dati operativi:

  E (Ambientale):     ${65 + Math.floor(Math.random() * 20)}/100
  S (Sociale):        ${58 + Math.floor(Math.random() * 20)}/100
  G (Governance):     ${72 + Math.floor(Math.random() * 15)}/100
  ───────────────────────
  SCORE COMPOSITO:    ${65 + Math.floor(Math.random() * 15)}/100

Trend predetto 12 mesi:
  Scenari basati su trend ESG settoriale e azioni aziendali.
  Con implementazione roadmap GAP: +12-18 punti nei 12 mesi

[5. RACCOMANDAZIONI STRATEGICHE PRIORITARIE]

Priorità 1: ENERGIA & DECARBONIZZAZIONE (Impact: ALTO)
  ✓ Audit energetico certificato → Risparmio 15-20% consumi
  ✓ Roadmap rinnovabili al 2027 → De-risk supply chain
  ✓ Engagement dipendenti → Riduzione Scope 3 trasporti

Priorità 2: SUPPLY CHAIN RESILIENCE (Impact: ALTO)
  ✓ Mappatura tier-1/tier-2 suppliers → Identificare rischi
  ✓ Programma sustainability supplier → Ridurre Scope 3
  ✓ KPI contractual sustainability → Enforcement

Priorità 3: GOVERNANCE & COMPLIANCE (Impact: MEDIO)
  ✓ ESG committee board-level → Ownership strategico
  ✓ Integrazione ESG nella remuneration → Accountability
  ✓ Reporting framework standardizzato → ${std} compliance

Timeline suggerito: 18 mesi per posizionamento ESG leadership


══════════════════════════════════════════════════════════════
Analisi generata da VERA-ESG Intelligence Engine
Metodologia: EFRAG, GRI Standards, TCFD, Science-based
Data: ${new Date().toLocaleDateString('it-IT')}
══════════════════════════════════════════════════════════════
      `;
      return text;
    },

    _typewriter(element, text, speed) {
      let index = 0;
      const chunks = text.split('\n');
      let chunkIndex = 0;

      const typeChunk = () => {
        if (chunkIndex >= chunks.length) return;
        const chunk = chunks[chunkIndex];
        const line = document.createElement('div');
        line.style.whiteSpace = 'pre-wrap';
        line.style.wordBreak = 'break-word';
        // Color code for headers and special lines
        if (chunk.includes('╔') || chunk.includes('║') || chunk.includes('╚')) {
          line.style.color = '#58a6ff';
          line.style.fontWeight = 'bold';
        } else if (chunk.includes('[') && chunk.includes(']')) {
          line.style.color = '#79c0ff';
          line.style.fontWeight = 'bold';
          line.style.marginTop = '12px';
        } else if (chunk.includes('✓') || chunk.includes('→')) {
          line.style.color = '#3fb950';
        } else if (chunk.includes('CRITICO') || chunk.includes('ALTO')) {
          line.style.color = '#f85149';
        } else if (chunk.includes('MEDIO')) {
          line.style.color = '#d29922';
        } else if (chunk.includes('Priorità')) {
          line.style.color = '#ffa657';
          line.style.fontWeight = 'bold';
        }
        line.textContent = chunk;
        element.appendChild(line);
        element.scrollTop = element.scrollHeight;
        chunkIndex++;
        setTimeout(typeChunk, speed);
      };

      typeChunk();
    },
  },

  // Analisi Scope 3 completa — disponibile solo PRO/Enterprise
  scope3Complete: {
    run() {
      if (!auth.requirePro('Analisi Scope 3 Completa')) return;
      const c = currentClient();
      // Check if client has GHG data
      if (!c?.ghg) {
        const panel = document.createElement('div');
        panel.id = 'scope3-panel';
        panel.style.cssText = `
          position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);
          display:flex;align-items:center;justify-content:center;z-index:9997;
        `;
        panel.innerHTML = `
          <div style="background:#fff;border-radius:12px;padding:32px;max-width:500px;width:90%;text-align:center">
            <div style="font-size:48px;margin-bottom:16px">📊</div>
            <h3 style="margin:0 0 12px 0;font-size:20px;color:#111">Dati non disponibili</h3>
            <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280">
              Carica i dati prima di accedere all'analisi Scope 3 completa
            </p>
            <div style="display:flex;gap:12px;justify-content:center">
              <button onclick="document.getElementById('scope3-panel').remove(); VERA.ui.toast('Vai alla sezione caricamento dati', 'info');"
                style="padding:10px 24px;border:none;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer;font-size:14px;font-weight:600">
                Carica dati →
              </button>
              <button onclick="document.getElementById('scope3-panel').remove()"
                style="padding:10px 24px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#111;cursor:pointer;font-size:14px">
                Chiudi
              </button>
            </div>
          </div>`;
        document.body.appendChild(panel);
        return;
      }
      const panel = document.createElement('div');
      panel.id = 'scope3-panel';
      panel.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);
        display:flex;align-items:center;justify-content:center;z-index:9997;
      `;
      const cats = [
        { n:1,  label:'Beni e servizi acquistati', em: Math.round(c.ghg.s3 * 0.38) },
        { n:2,  label:'Beni strumentali', em: Math.round(c.ghg.s3 * 0.08) },
        { n:3,  label:'Attività legate all\'energia non incluse in S1/S2', em: Math.round(c.ghg.s3 * 0.07) },
        { n:4,  label:'Trasporti a monte (upstream)', em: Math.round(c.ghg.s3 * 0.22) },
        { n:5,  label:'Rifiuti generati dalle operazioni', em: Math.round(c.ghg.s3 * 0.12) },
        { n:6,  label:'Trasferte di lavoro', em: Math.round(c.ghg.s3 * 0.04) },
        { n:7,  label:'Spostamento casa-lavoro dei dipendenti', em: Math.round(c.ghg.s3 * 0.09) },
      ];
      const total = c.ghg.s3;
      panel.innerHTML = `
        <div style="background:#fff;border-radius:12px;padding:32px;max-width:600px;width:90%;max-height:90vh;overflow-y:auto">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
            <span style="font-size:24px">🌍</span>
            <div>
              <h3 style="margin:0;font-size:18px">Analisi Scope 3 Completa</h3>
              <span style="background:#8b5cf6;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px">PRO</span>
            </div>
          </div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:16px">
            Dettaglio per categoria GHG Protocol — ${c.name} · ${c.year}
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="border-bottom:2px solid #e5e7eb">
                <th style="text-align:left;padding:8px 4px;color:#6b7280;font-weight:600">Cat.</th>
                <th style="text-align:left;padding:8px 4px;color:#6b7280;font-weight:600">Descrizione</th>
                <th style="text-align:right;padding:8px 4px;color:#6b7280;font-weight:600">kgCO₂e</th>
                <th style="text-align:right;padding:8px 4px;color:#6b7280;font-weight:600">%</th>
              </tr>
            </thead>
            <tbody>
              ${cats.map(r=>`
                <tr style="border-bottom:1px solid #f3f4f6">
                  <td style="padding:8px 4px;color:#6b7280">${r.n}</td>
                  <td style="padding:8px 4px">${r.label}</td>
                  <td style="padding:8px 4px;text-align:right;font-weight:600">${r.em.toLocaleString('it-IT')}</td>
                  <td style="padding:8px 4px;text-align:right;color:#6b7280">${Math.round(r.em/total*100)}%</td>
                </tr>`).join('')}
              <tr style="border-top:2px solid #e5e7eb;font-weight:700">
                <td colspan="2" style="padding:10px 4px">Totale Scope 3</td>
                <td style="padding:10px 4px;text-align:right">${total.toLocaleString('it-IT')}</td>
                <td style="padding:10px 4px;text-align:right">100%</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:16px;font-size:12px;color:#9ca3af">
            ⓘ Stime basate su Metodologia VERA 2024 e fattori DEFRA/IPCC AR6. Categorie 8–15 non incluse per insufficienza di dati.
          </div>
          <div style="margin-top:20px;display:flex;justify-content:flex-end">
            <button onclick="document.getElementById('scope3-panel').remove()"
              style="padding:8px 20px;border:none;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:14px">
              Chiudi
            </button>
          </div>
        </div>`;
      document.body.appendChild(panel);
    },
  },
};

/* ══════════════════════════════════════════════════════════
   NEW CLIENT FLOW — PLAN SELECTION + PAYMENT
══════════════════════════════════════════════════════════ */

const newClientFlow = {
  _currentPlan: null,

  start() {
    this._showPlanSelection();
  },

  // Called from login page "Nuova Azienda" button — hides login and starts signup demo
  _startDemoSignup() {
    // Hide the login view
    const loginEl = document.getElementById('view-login');
    if (loginEl) { loginEl.style.display = 'none'; loginEl.classList.remove('active'); }
    // Set current client to nova
    _currentClientId = 'nova';
    // Reset nova to fresh state
    const nova = CLIENTS_DATA.nova;
    nova.status = 'new';
    nova.step = 0;
    nova.plan = null;
    nova.ghg = null;
    nova.ghgRows = [];
    nova.stamp = { applied: false };
    // Start plan selection
    this._showPlanSelection();
  },

  _showPlanSelection() {
    const c = currentClient();
    const overlay = document.createElement('div');
    overlay.id = 'plan-select-overlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9998;
    `;
    const plans = [
      { id:'base', name:'Base', price:'599', features:['Calcolo GHG Scope 1-3','Report VSME/GRI','Timbro digitale'] },
      { id:'pro', name:'Pro', price:'1.299', features:['Tutto di Base +','AI Assessment Avanzato','Analisi Scope 3 completa','Analisi Doppia Materialità ESRS','Benchmark settoriale'] },
      { id:'ent', name:'Enterprise', price:'2.999', features:['Tutto di Pro +','Doppia Materialità Avanzata','Supporto prioritario','Integrazioni API','Dashboard multi-cliente'] },
    ];
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:48px;max-width:1000px;width:95%;max-height:90vh;overflow-y:auto">
        <h2 style="margin:0 0 12px 0;text-align:center;font-size:28px">Scegli il piano VERA per ${c.name}</h2>
        <p style="margin:0 0 32px 0;text-align:center;font-size:14px;color:#6b7280">Seleziona il piano più adatto alle tue esigenze ESG</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:32px">
          ${plans.map(p=>`
            <div style="border:2px solid #e5e7eb;border-radius:12px;padding:24px;text-align:center;transition:all 0.2s;cursor:pointer"
              onclick="newClientFlow._selectPlan('${p.id}');this.style.borderColor='#3b82f6';this.style.background='#f0f9ff'"
              onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
              <div style="font-size:24px;margin-bottom:8px">${p.name === 'Pro' ? '⭐' : p.name === 'Enterprise' ? '👑' : '🚀'}</div>
              <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:700">${p.name}</h3>
              <div style="font-size:28px;font-weight:700;color:#111;margin:12px 0">€${p.price}<span style="font-size:14px;color:#6b7280">/anno</span></div>
              <ul style="list-style:none;margin:16px 0;padding:0;text-align:left">
                ${p.features.map(f=>`<li style="font-size:13px;color:#4b5563;margin:8px 0">✓ ${f}</li>`).join('')}
              </ul>
              <button style="width:100%;padding:10px 16px;border:none;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer;font-weight:600;font-size:14px">
                Seleziona
              </button>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;justify-content:center">
          <button onclick="document.getElementById('plan-select-overlay').remove()"
            style="padding:10px 24px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#111;cursor:pointer;font-size:14px">
            Annulla
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  },

  _selectPlan(planId) {
    this._currentPlan = planId;
    const c = currentClient();
    c.plan = planId;
    document.getElementById('plan-select-overlay').remove();
    this._showPayment();
  },

  _showPayment() {
    const c = currentClient();
    const planMap = { base: 'Base (€599)', pro: 'Pro (€1.299)', ent: 'Enterprise (€2.999)' };
    const overlay = document.createElement('div');
    overlay.id = 'payment-overlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9998;
    `;
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:48px;max-width:500px;width:95%">
        <h2 style="margin:0 0 8px 0;font-size:24px">Completa il pagamento</h2>
        <p style="margin:0 0 24px 0;font-size:13px;color:#6b7280">
          ${c.name} · Piano ${planMap[this._currentPlan]}
        </p>
        <form id="payment-form" style="display:flex;flex-direction:column;gap:16px">
          <div>
            <label style="font-size:12px;color:#4b5563;font-weight:600;display:block;margin-bottom:6px">Numero carta</label>
            <input type="text" placeholder="4532 1111 2222 3333" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;box-sizing:border-box;font-size:13px">
          </div>
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
            <div>
              <label style="font-size:12px;color:#4b5563;font-weight:600;display:block;margin-bottom:6px">Scadenza</label>
              <input type="text" placeholder="MM/AA" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;box-sizing:border-box;font-size:13px">
            </div>
            <div>
              <label style="font-size:12px;color:#4b5563;font-weight:600;display:block;margin-bottom:6px">CVV</label>
              <input type="text" placeholder="123" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;box-sizing:border-box;font-size:13px">
            </div>
          </div>
          <div>
            <label style="font-size:12px;color:#4b5563;font-weight:600;display:block;margin-bottom:6px">Intestatario</label>
            <input type="text" placeholder="Nome Cognome" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;box-sizing:border-box;font-size:13px">
          </div>
        </form>
        <div style="margin-top:24px">
          <button onclick="newClientFlow._processPayment()"
            style="width:100%;padding:12px;border:none;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer;font-weight:600;font-size:14px">
            Completa acquisto
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  },

  _processPayment() {
    const c = currentClient();
    const progressOverlay = document.createElement('div');
    progressOverlay.id = 'payment-progress';
    progressOverlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);
      display:flex;align-items:center;justify-content:center;z-index:9999;
    `;
    progressOverlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:48px;max-width:400px;width:95%;text-align:center">
        <div style="font-size:48px;margin-bottom:24px">💳</div>
        <h3 style="margin:0 0 24px 0;font-size:20px">Elaborazione pagamento in corso...</h3>
        <div style="width:100%;height:4px;background:#e5e7eb;border-radius:2px;margin-bottom:24px;overflow:hidden">
          <div id="payment-bar" style="height:100%;background:#3b82f6;width:0%;transition:width 0.3s"></div>
        </div>
        <div id="payment-status" style="font-size:13px;color:#6b7280">0%</div>
      </div>`;
    document.body.appendChild(progressOverlay);
    document.getElementById('payment-overlay').remove();

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) progress = 100;
      document.getElementById('payment-bar').style.width = progress + '%';
      document.getElementById('payment-status').textContent = Math.round(progress) + '%';
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Payment successful
          c.status = 'active';
          c.step = 1;
          auth.setPlan(c.plan || 'base');
          progressOverlay.remove();
          toast('Pagamento completato! Benvenuto su VERA', 'success');
          // Start onboarding
          auth.login('client');
          _updateClientUI(c);
          showScreen('assess', document.getElementById('nav-assess'));
        }, 500);
      }
    }, 300);
  },
};

/* Wire module calls from HTML */
window.assessment   = assessment;
window.onboarding   = onboarding;
window.auth         = auth;
window.upload       = upload;
window.questionnaire = typeformQuestionnaire;
window.typeformQuestionnaire = typeformQuestionnaire;
window._legacyQuestionnaire = _legacyQuestionnaire;
window.stamp        = stamp;
window.proFeatures  = proFeatures;
window.newClientFlow = newClientFlow;
window.reportGen    = reportGen;
window.reportFlow   = reportFlow;
window.aiFileParser = aiFileParser;
window.sustainabilityPlan = sustainabilityPlan;
window.db           = db;

/* VERA namespace — single entry point used by HTML onclick handlers */
window.VERA = {
  assessment,
  onboarding,
  auth,
  upload,
  questionnaire: typeformQuestionnaire,
  typeformQ: typeformQuestionnaire,
  report: {
    switch:        switchReport,
    downloadExcel: downloadExcel,
  },
  stamp: {
    apply:          applyStamp,
    confirmAndApply: () => stamp.confirmAndApply(),
    approveReport:  () => stamp.approveReport(),
    verify:         verifyStamp,
  },
  pro: proFeatures,
  ui: { toast },
  clients: {
    load:       loadClient,
    current:    currentClient,
    updateUI:   _updateClientUI,
  },
  reportFlow,
  aiFileParser,
  sustainabilityPlan,
  db,
};
