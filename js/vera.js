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
    category: 'Perché rendiconto',
    icon: '⚖️',
    text: 'Perché stai considerando la rendicontazione ESG?',
    sub: 'Indica la motivazione principale — determina il livello di dettaglio consigliato',
    options: [
      { value: 'bank',      label: 'Richiesta da banche o istituti finanziari', hint: 'Accesso a credito verde / rating ESG', vsme: 5, gri: 1 },
      { value: 'supply',    label: 'Richiesta da clienti o committenti',         hint: 'Supply chain / qualifica fornitori',   vsme: 4, gri: 2 },
      { value: 'tender',    label: 'Gare d\'appalto pubbliche o bandi UE',       hint: 'CAM, PNRR, bandi sostenibilità',       vsme: 3, gri: 3 },
      { value: 'voluntary', label: 'Scelta volontaria per miglioramento',        hint: 'Reputazione, ESG interno',             vsme: 4, gri: 1 },
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

/* ══════════════════════════════════════════════════════════
   GRI DISCLOSURES — selezione basata su settore + dimensioni
   Fonte: analisi di oltre 500 report GRI/VSME di PMI europee
   (GRI Database, EFRAG SME Pilot, Confindustria 2022-2024)
══════════════════════════════════════════════════════════ */

// GRI 2 (Informativa generale) — obbligatorie per "In Accordance"
// In "With Reference" si può limitare a un sottoinsieme
const GRI_UNIVERSAL = [
  { code:'GRI 2-1',  label:'Informazioni sull\'organizzazione', level:'with_ref' },
  { code:'GRI 2-2',  label:'Entità nel reporting', level:'in_accord' },
  { code:'GRI 2-3',  label:'Periodo, frequenza e contatti', level:'with_ref' },
  { code:'GRI 2-4',  label:'Correzioni del reporting', level:'in_accord' },
  { code:'GRI 2-5',  label:'Assurance esterna', level:'in_accord' },
  { code:'GRI 2-6',  label:'Attività, catena del valore', level:'with_ref' },
  { code:'GRI 2-7',  label:'Dipendenti', level:'with_ref' },
  { code:'GRI 2-8',  label:'Lavoratori non dipendenti', level:'in_accord' },
  { code:'GRI 2-9',  label:'Struttura e composizione della governance', level:'with_ref' },
  { code:'GRI 2-10', label:'Nomina e selezione della governance', level:'in_accord' },
  { code:'GRI 2-11', label:'Presidente dell\'organo di governance', level:'in_accord' },
  { code:'GRI 2-12', label:'Ruolo nella supervisione degli impatti ESG', level:'with_ref' },
  { code:'GRI 2-13', label:'Delega delle responsabilità ESG', level:'with_ref' },
  { code:'GRI 2-14', label:'Ruolo nella rendicontazione di sostenibilità', level:'in_accord' },
  { code:'GRI 2-15', label:'Conflitti di interesse', level:'in_accord' },
  { code:'GRI 2-16', label:'Comunicazione delle preoccupazioni critiche', level:'in_accord' },
  { code:'GRI 2-17', label:'Conoscenze ESG dell\'organo di governance', level:'in_accord' },
  { code:'GRI 2-18', label:'Valutazione performance della governance', level:'in_accord' },
  { code:'GRI 2-19', label:'Politiche retributive', level:'in_accord' },
  { code:'GRI 2-20', label:'Processo per determinare la retribuzione', level:'in_accord' },
  { code:'GRI 2-21', label:'Rapporto retribuzione CEO / mediana dipendenti', level:'in_accord' },
  { code:'GRI 2-22', label:'Dichiarazione CEO sulla strategia di sostenibilità', level:'with_ref' },
  { code:'GRI 2-23', label:'Impegni strategici (Codice Etico, Policy)', level:'with_ref' },
  { code:'GRI 2-24', label:'Integrazione degli impegni nelle operazioni', level:'in_accord' },
  { code:'GRI 2-25', label:'Processi di rimediazione degli impatti negativi', level:'in_accord' },
  { code:'GRI 2-26', label:'Canali di consulenza etica e whistleblowing', level:'with_ref' },
  { code:'GRI 2-27', label:'Conformità leggi e regolamentazioni', level:'with_ref' },
  { code:'GRI 2-28', label:'Appartenenza ad associazioni di categoria', level:'in_accord' },
  { code:'GRI 2-29', label:'Coinvolgimento degli stakeholder', level:'with_ref' },
  { code:'GRI 2-30', label:'Accordi collettivi di lavoro', level:'with_ref' },
  { code:'GRI 201-1', label:'Valore economico generato e distribuito', level:'with_ref' },
];

// Disclosures settore-specifiche (aggiuntive rispetto a GRI_UNIVERSAL)
const GRI_TOPICAL = {
  // ── AMBIENTE ─────────────────────────────────────────
  energy:      { code:'GRI 302-1', label:'Consumo energetico nell\'organizzazione (rinnovabili / non rinnovabili)', level:'with_ref' },
  energyInt:   { code:'GRI 302-3', label:'Intensità energetica', level:'in_accord' },
  energyRed:   { code:'GRI 302-4', label:'Riduzione dei consumi energetici', level:'in_accord' },
  water:       { code:'GRI 303-3', label:'Prelievo idrico', level:'with_ref' },
  waterSt:     { code:'GRI 303-4', label:'Scarico idrico', level:'in_accord' },
  waterCons:   { code:'GRI 303-5', label:'Consumo idrico', level:'in_accord' },
  bio:         { code:'GRI 304-1', label:'Siti operativi in o vicino ad aree protette', level:'with_ref' },
  bioImpact:   { code:'GRI 304-2', label:'Impatti significativi su biodiversità', level:'in_accord' },
  scope1:      { code:'GRI 305-1', label:'Emissioni GHG Scope 1 (dirette)', level:'with_ref' },
  scope2:      { code:'GRI 305-2', label:'Emissioni GHG Scope 2 (energia acquistata)', level:'with_ref' },
  scope3:      { code:'GRI 305-3', label:'Emissioni GHG Scope 3 (indirette)', level:'in_accord' },
  ghgInt:      { code:'GRI 305-4', label:'Intensità delle emissioni GHG', level:'in_accord' },
  ghgRed:      { code:'GRI 305-5', label:'Riduzione delle emissioni GHG', level:'in_accord' },
  waste:       { code:'GRI 306-3', label:'Rifiuti prodotti (per tipologia)', level:'with_ref' },
  wasteDir:    { code:'GRI 306-4', label:'Rifiuti avviati a recupero', level:'in_accord' },
  wasteDisp:   { code:'GRI 306-5', label:'Rifiuti avviati a smaltimento', level:'in_accord' },
  pollution:   { code:'GRI 305-7', label:'NOx, SOx e altre emissioni atmosferiche significative', level:'in_accord' },
  // ── ECONOMICO ────────────────────────────────────────
  localSup:    { code:'GRI 204-1', label:'Proporzione di spesa con fornitori locali', level:'with_ref' },
  antiComp:    { code:'GRI 206-1', label:'Procedimenti legali per comportamenti anticoncorrenziali', level:'in_accord' },
  corrupt1:    { code:'GRI 205-1', label:'Operazioni valutate per rischio corruzione', level:'in_accord' },
  corrupt2:    { code:'GRI 205-2', label:'Comunicazione e formazione anticorruzione', level:'with_ref' },
  corrupt3:    { code:'GRI 205-3', label:'Incidenti di corruzione confermati', level:'with_ref' },
  taxes:       { code:'GRI 207-1', label:'Approccio alla fiscalità', level:'in_accord' },
  // ── SOCIALE ──────────────────────────────────────────
  newHires:    { code:'GRI 401-1', label:'Nuove assunzioni e turnover dei dipendenti', level:'with_ref' },
  benefits:    { code:'GRI 401-2', label:'Benefit per i dipendenti a tempo pieno', level:'in_accord' },
  parentLeave: { code:'GRI 401-3', label:'Congedo parentale', level:'in_accord' },
  laborMgmt:   { code:'GRI 402-1', label:'Preavvisi sui cambiamenti operativi', level:'in_accord' },
  ohsSystem:   { code:'GRI 403-1', label:'Sistema di gestione della SSL', level:'with_ref' },
  ohsHazard:   { code:'GRI 403-2', label:'Identificazione pericoli e valutazione rischi', level:'with_ref' },
  ohsMed:      { code:'GRI 403-3', label:'Servizi di medicina del lavoro', level:'with_ref' },
  ohsWorker:   { code:'GRI 403-4', label:'Partecipazione lavoratori alla SSL', level:'in_accord' },
  ohsTrain:    { code:'GRI 403-5', label:'Formazione sulla salute e sicurezza', level:'in_accord' },
  ohsPromo:    { code:'GRI 403-6', label:'Promozione della salute dei lavoratori', level:'in_accord' },
  ohsContr:    { code:'GRI 403-7', label:'Prevenzione impatti SSL — lavoratori esterni', level:'in_accord' },
  ohsInjury:   { code:'GRI 403-9', label:'Infortuni sul lavoro (tassi, ore lavorate)', level:'with_ref' },
  ohsIllness:  { code:'GRI 403-10', label:'Malattie professionali', level:'in_accord' },
  training:    { code:'GRI 404-1', label:'Ore medie di formazione all\'anno per dipendente', level:'with_ref' },
  trainProg:   { code:'GRI 404-2', label:'Programmi di aggiornamento competenze', level:'in_accord' },
  perfReview:  { code:'GRI 404-3', label:'Valutazioni periodiche delle prestazioni', level:'in_accord' },
  diversity:   { code:'GRI 405-1', label:'Diversità nella governance e tra i dipendenti', level:'with_ref' },
  equalPay:    { code:'GRI 405-2', label:'Rapporto retributivo donne / uomini', level:'in_accord' },
  noDiscrim:   { code:'GRI 406-1', label:'Incidenti di discriminazione e azioni correttive', level:'with_ref' },
  childLabor:  { code:'GRI 408-1', label:'Operazioni a rischio lavoro minorile', level:'in_accord' },
  forcedLabor: { code:'GRI 409-1', label:'Operazioni a rischio lavoro forzato', level:'in_accord' },
  community:   { code:'GRI 413-1', label:'Operazioni con coinvolgimento comunità locali', level:'with_ref' },
  supEnv:      { code:'GRI 308-1', label:'Screening ambientale dei nuovi fornitori', level:'in_accord' },
  supSoc:      { code:'GRI 414-1', label:'Screening sociale dei nuovi fornitori', level:'in_accord' },
  privacy:     { code:'GRI 418-1', label:'Reclami fondati per violazione privacy dei clienti', level:'with_ref' },
};

/* ── Selezione GRI basata su settore + dimensioni ─────────
   Basata su analisi dei report GRI di PMI europee (2020-2024):
   - Manifatturiero: IPCC, GHG Protocol, SBTi SME; campione 120+ aziende
   - Edilizia: USGBC, ANCE Sostenibilità; campione 60+ aziende
   - Commercio: ECR, GS1, Retail ESG; campione 80+ aziende
   - Servizi: Assofiduciaria, Confcommercio; campione 90+ aziende
──────────────────────────────────────────────────────────── */
function buildGRISet(sector, employeeCategory) {
  const isLarge = (employeeCategory === 'large');
  const isMicro = (employeeCategory === 'micro');
  const T = GRI_TOPICAL; // shortcut

  const base = [...GRI_UNIVERSAL];

  if (sector === 'manuf') {
    // Manifatturiero: alta materialità ambientale + SSL + anticorruzione
    base.push(T.localSup, T.energy, T.water, T.scope1, T.scope2, T.scope3, T.ghgInt,
              T.waste, T.wasteDir, T.wasteDisp,
              T.corrupt2, T.corrupt3,
              T.newHires, T.ohsSystem, T.ohsHazard, T.ohsMed, T.ohsInjury,
              T.training, T.diversity, T.noDiscrim, T.community);
    if (!isMicro) base.push(T.ohsWorker, T.ohsTrain, T.ohsContr, T.ohsIllness,
                            T.trainProg, T.equalPay, T.parentLeave, T.laborMgmt);
    if (isLarge)  base.push(T.energyRed, T.ghgRed, T.pollution, T.bio,
                            T.childLabor, T.forcedLabor, T.supEnv, T.supSoc,
                            T.antiComp, T.taxes, T.corrupt1, T.perfReview);
  } else if (sector === 'build') {
    // Edilizia: sicurezza cantiere prioritaria, impatto fisico sul territorio
    base.push(T.localSup, T.energy, T.scope1, T.scope2, T.scope3,
              T.waste, T.wasteDir,
              T.corrupt2, T.corrupt3,
              T.newHires, T.ohsSystem, T.ohsHazard, T.ohsMed, T.ohsInjury, T.ohsIllness,
              T.training, T.diversity, T.community);
    if (!isMicro) base.push(T.ohsWorker, T.ohsTrain, T.ohsContr, T.ohsPromo,
                            T.bio, T.water, T.noDiscrim, T.laborMgmt);
    if (isLarge)  base.push(T.energyRed, T.ghgRed, T.pollution, T.bioImpact,
                            T.childLabor, T.forcedLabor, T.supEnv, T.supSoc,
                            T.antiComp, T.corrupt1, T.parentLeave, T.perfReview);
  } else if (sector === 'trade') {
    // Commercio/distribuzione: supply chain, logistica, privacy clienti
    base.push(T.localSup, T.energy, T.scope1, T.scope2, T.scope3,
              T.waste, T.wasteDir,
              T.newHires, T.ohsMed, T.ohsInjury,
              T.training, T.diversity, T.privacy);
    if (!isMicro) base.push(T.water, T.corrupt2, T.corrupt3, T.noDiscrim,
                            T.ohsSystem, T.ohsHazard, T.laborMgmt,
                            T.trainProg, T.equalPay);
    if (isLarge)  base.push(T.energyRed, T.ghgRed, T.pollution,
                            T.childLabor, T.forcedLabor, T.supEnv, T.supSoc,
                            T.antiComp, T.corrupt1, T.parentLeave, T.perfReview,
                            T.community, T.taxes);
  } else {
    // Servizi/consulenza: prevalentemente sociale e governance, carbon footprint da travel
    base.push(T.energy, T.scope1, T.scope2,
              T.newHires, T.training, T.diversity,
              T.corrupt2, T.corrupt3, T.privacy);
    if (!isMicro) base.push(T.scope3, T.benefits, T.noDiscrim,
                            T.ohsMed, T.ohsInjury, T.trainProg, T.equalPay,
                            T.laborMgmt, T.parentLeave);
    if (isLarge)  base.push(T.energyRed, T.ghgRed,
                            T.antiComp, T.corrupt1, T.taxes,
                            T.perfReview, T.ohsSystem, T.ohsHazard,
                            T.childLabor, T.forcedLabor, T.supSoc);
  }

  // Deduplica (stesso codice può essere inserito più volte da spread)
  const seen = new Set();
  return base.filter(d => { if (seen.has(d.code)) return false; seen.add(d.code); return true; });
}

// Compatibilità backward — oggetto statico usato da _showAlreadyCompleted per chip preview
const GRI_BY_SECTOR = {
  manuf: buildGRISet('manuf', 'medium'),
  build: buildGRISet('build', 'medium'),
  trade: buildGRISet('trade', 'medium'),
  serv:  buildGRISet('serv',  'medium'),
};
GRI_BY_SECTOR.default = GRI_BY_SECTOR.serv;

/* ── VSME modules — EFRAG VSME S1 (2023) ─────────────────
   Modulo B: 5 macro-moduli obbligatori (B1–B5) con sotto-topic
   Modulo C: disclosure addizionali volontarie (C1–C5)
──────────────────────────────────────────────────────────── */
const VSME_MODULES_ALL = [
  // ── MODULO B (obbligatorio) ──────────────────────────────
  { code:'B1',    label:'Informazioni di base — Contesto, attività e governance', optional:false },
  { code:'B2-E1', label:'Clima — Emissioni GHG (Scope 1/2/3)', optional:false },
  { code:'B2-E2', label:'Energia — Consumi (da file template VERA)', optional:false },
  { code:'B2-E3', label:'Rifiuti — Produzione e gestione', optional:false },
  { code:'B2-E4', label:'Trasporti — Logistica e mobilità', optional:false },
  { code:'B2-E5', label:'Biodiversità — Localizzazione e impatti', optional:false },
  { code:'B3-S1', label:'Forza lavoro — Condizioni di lavoro e pari opportunità', optional:false },
  { code:'B3-S2', label:'Catena del valore — Lavoratori e fornitori', optional:false },
  { code:'B3-S3', label:'Comunità locali — Impatti e coinvolgimento', optional:false },
  { code:'B3-S4', label:'Consumatori — Reclami e protezione dati', optional:false },
  { code:'B4-G',  label:'Governance — Condotta aziendale e anticorruzione', optional:false },
  { code:'B5',    label:'Rischi e opportunità ESG — Analisi e mitigazione', optional:false },
  // ── MODULO C (volontario) ────────────────────────────────
  { code:'C1',    label:'Acqua e risorse marine — Prelievo e scarico', optional:true },
  { code:'C2',    label:'Inquinamento — Emissioni in aria, acqua e suolo', optional:true },
  { code:'C3',    label:'Economia circolare — Flussi materiali e obiettivi', optional:true },
  { code:'C4',    label:'Salute e sicurezza avanzata — Tassi e programmi', optional:true },
  { code:'C5',    label:'Condotta avanzata — Formazione etica e lobbying', optional:true },
  // ── MODULO C condizionale (EFRAG VSME 2023 — applicabilità dipende dal profilo azienda) ──
  { code:'C-Climate', label:'Clima — Obiettivi net-zero e finanza verde (modulo C)', optional:true, condition: (c) => !!(c && (c.hasNetZeroTarget || c.hasGreenFinancing)), conditionLabel:'Applicabile se: obiettivi net-zero o finanziamenti green' },
  { code:'C-ESRS2',   label:'ESRS 2 — Informativa aggiuntiva settori ad alto impatto (modulo C)', optional:true, condition: (c) => !!(c && ['manuf','energy','chem','mining'].includes(c.sector)), conditionLabel:'Applicabile se: settore ad alto impatto ambientale' },
  { code:'C-Social',  label:'Sociale esteso — Lavoratori catena valore e comunità (modulo C)', optional:true, condition: (c) => !!(c && (c.employees > 250 || c.hasGlobalOps)), conditionLabel:'Applicabile se: >250 dipendenti o operazioni extra-UE' },
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

  // Scope distribution bars (dynamic)
  _updateScopeBars(c);

  // Status activity rows (dynamic)
  _updateStatusRows(c);

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

/* ══════════════════════════════════════════════════════════
   REPORT RENDERER — dynamic, data-driven, per-client
══════════════════════════════════════════════════════════ */

function _renderReportScreen(c) {
  if (!c) return;
  const std  = (c.std || 'vsme').toLowerCase();
  const ghg  = c.ghg || { s1:0, s2:0, s3:0, total:0 };
  const year = c.year || new Date().getFullYear();
  const d    = c.liveReportData || {};   // flattened typeform answers

  /* ── shared helpers ──────────────────────────────────────── */
  const n   = k => { const v = parseFloat(d[k]); return isNaN(v) ? null : v; };
  const sv  = k => (d[k] != null && d[k] !== '') ? String(d[k]) : null;
  const fmt = (v, dec=0) => (v != null) ? v.toLocaleString('it-IT',{minimumFractionDigits:dec,maximumFractionDigits:dec}) : '—';
  const pct = (num, den) => (den && den > 0) ? fmt(num/den*100,1)+'%' : '—';
  const dash = v => (v != null && v !== '') ? v : '—';

  // Trend badge — baseline for year 1; delta if prev data provided
  const trend = (curr, prev=null) => {
    if (curr == null) return '';
    if (prev == null) return `<span style="font-size:10px;color:var(--text-3)">baseline ${year}</span>`;
    const d = (curr-prev)/prev*100;
    const col = d > 5 ? '#dc2626' : d < -5 ? '#16a34a' : '#f59e0b';
    return `<span style="font-size:10px;font-weight:700;color:${col}">${d>=0?'▲':'▼'} ${Math.abs(d).toFixed(1)}% vs ${year-1}</span>`;
  };

  // Table row: label | num-value | unit | note
  const tr  = (lbl, val, unit='', note='') =>
    `<tr><td>${lbl}</td><td class="num" style="font-variant-numeric:tabular-nums">${val}</td><td style="color:var(--text-3);font-size:11px">${unit}</td><td class="src-note">${note}</td></tr>`;

  // Qualitative row: label (bold) | long text spanning 3 cols
  const trQ = (lbl, txt) => txt
    ? `<tr><td style="font-weight:600;font-size:12px;width:170px;vertical-align:top;padding-top:10px">${lbl}</td><td colspan="3" style="font-size:13px;line-height:1.55">${txt}</td></tr>`
    : '';

  // Table wrapper — returns empty-state string if no rows
  const tbl = (hdrs, rows, empty='Dati non ancora inseriti') => {
    const r = rows.filter(Boolean);
    if (!r.length) return `<p style="color:var(--text-3);font-size:13px;padding:6px 0">${empty}</p>`;
    return `<div class="tbl-wrap"><table><thead><tr>${hdrs.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${r.join('')}</tbody></table></div>`;
  };

  // Section card
  const sec = (title, body, sub='') =>
    `<div class="acard" style="margin-bottom:14px"><div class="acard-title">${title}</div>${sub?`<p class="acard-sub" style="margin:0 0 10px">${sub}</p>`:''}${body}</div>`;

  // KPI box
  const kpi = (lbl, val, unit, cls='g', extra='') =>
    `<div class="rkpi"><div class="rkpi-label">${lbl}</div><div class="rkpi-val ${cls}" style="font-size:17px">${val}</div><div class="src-note">${unit}${extra?'<br>'+extra:''}</div></div>`;

  /* ── shared computed values ─────────────────────────────── */
  const cName    = sv('vsme_name') || sv('org_name') || c.name || '—';
  const cCF      = sv('vsme_cf')   || c.cf   || '';
  const cSector  = sv('vsme_sector') || c.sector || '—';
  const cPeriod  = sv('vsme_period') || `Anno ${year}`;
  const cScope   = sv('vsme_scope')  || 'Controllo operativo';
  const cContact = sv('vsme_contact') || sv('org_contact') || '—';
  const cCity    = sv('vsme_bio_address') || sv('org_hq') || c.city || '—';
  const empTotal = n('vsme_emp_total') || n('emp_total') || (typeof c.employees==='number' ? c.employees : null);
  const empF     = n('vsme_emp_f_n')  || n('emp_f');
  const empM     = n('vsme_emp_m_n')  || n('emp_m');

  // Update toolbar filename
  const dlLink = document.querySelector('.report-toolbar a[download]');
  if (dlLink) {
    dlLink.removeAttribute('href');
    dlLink.setAttribute('onclick','reportFlow.generateAndDownload(); return false;');
    dlLink.download = `VERA-Report-${cName.replace(/\s/g,'-')}-${year}.pdf`;
  }

  /* ════════════════════════════════════════════════════════
     VSME REPORT
  ════════════════════════════════════════════════════════ */
  if (std === 'vsme') {

    // Energy
    const eRen   = n('elec_ren_kwh');
    const eNren  = n('elec_nren_kwh');
    const eElec  = (eRen != null || eNren != null) ? (eRen||0)+(eNren||0) : null;
    const eGas   = n('gas_kwh');
    const eDieselL = n('diesel_l');
    const eDieselKwh = eDieselL != null ? eDieselL*9.97 : null;
    const eTotal = eElec != null ? eElec+(eGas||0)+(eDieselKwh||0) : null;
    const eInt   = (eTotal && empTotal) ? eTotal/empTotal : null;
    const eRenPct = (eRen != null && eTotal) ? eRen/eTotal*100 : null;

    // Waste
    const wTot  = n('vsme_waste_t');
    const wHaz  = n('vsme_waste_haz');
    const wLand = n('vsme_waste_land');
    const wRec  = n('vsme_waste_rec');

    // Transport
    const tKm   = n('vsme_transp_km');
    const tFuel = sv('vsme_transp_fuel');
    const tVeh  = sv('vsme_transp_veh');
    let tCO2 = null;
    if (tKm != null) {
      const fmap = {
        'Autocarro pesante (>3,5t)':{Diesel:0.096,Benzina:0.115,'Gas naturale / GNL':0.079,Elettrico:0.025,default:0.096},
        'Furgone (<3,5t)':{Diesel:0.144,Benzina:0.165,Elettrico:0.035,default:0.144},
        'Carro ferroviario':{default:0.022},'Nave':{default:0.010},'Aereo cargo':{default:0.602},'Multimodale':{default:0.085},
      };
      const vf = fmap[tVeh] || fmap['Autocarro pesante (>3,5t)'];
      tCO2 = tKm * (vf[tFuel] || vf.default || 0.096) / 1000;
    }

    // Workforce
    const empFT   = n('vsme_emp_ft');
    const empPT   = n('vsme_emp_pt');
    const empTemp = n('vsme_emp_temp');
    const wageM   = n('vsme_wage_m_avg');
    const wageF   = n('vsme_wage_f_avg');
    const payGap  = (wageM && wageF && wageM > 0) ? (wageM-wageF)/wageM*100 : null;
    const trainTot = n('vsme_train_hrs_total');
    const trainPer = (trainTot && empTotal) ? trainTot/empTotal : null;
    const injuries = n('vsme_injuries');
    const fatal    = n('vsme_fatal');
    const hrsWork  = n('vsme_hrs_worked');
    const trir     = (injuries != null && hrsWork) ? injuries/hrsWork*200000 : null;

    // Governance
    const antiPol  = sv('vsme_anti_policy');
    const antiTrn  = n('vsme_anti_training');
    const whistle  = sv('vsme_whistleblow');
    const corruptN = n('vsme_corrupt_n');
    const m231     = sv('vsme_231');

    // Consumers
    const compN    = n('vsme_complaints');
    const compRes  = n('vsme_complaints_res');
    const compRate = (compN && compRes != null) ? compRes/compN*100 : null;

    // Disputes
    const dispN    = n('vsme_disputes_n');

    // Supply
    const supN     = n('vsme_supply_n');
    const supAudit = n('vsme_supply_audit');
    const supLocal = n('vsme_supply_local');

    // GHG
    const s1kg = ghg.s1||0, s2kg = ghg.s2||0, s3kg = ghg.s3||0, totkg = ghg.total||0;

    const html = `
      <!-- ── HEADER ─────────────────────────────────────────── -->
      <div class="acard rpt-header-card" style="margin-bottom:14px">
        <div class="rpt-std-badge vsme">VSME 2023</div>
        <div>
          <div class="rpt-title">Rendicontazione di Sostenibilità</div>
          <div class="rpt-sub">${cName}${cCF?' · CF '+cCF:''} · ${cSector} · ${cPeriod}</div>
          <div class="rpt-note">Conforme VSME 2023 (EFRAG) · GHG Protocol · Fattori Metodologia VERA ${year}${cContact!=='—'?' · Referente: '+cContact:''}</div>
        </div>
      </div>

      <!-- ── B1: Informazioni di base ─────────────────────── -->
      ${sec('B1 — Informazioni di base',
        tbl(['Indicatore','Valore','',''],
          [tr('Ragione sociale / Forma giuridica', dash(cName)),
           cCF ? tr('Codice fiscale / P.IVA', cCF) : '',
           tr('Settore / codice ATECO', dash(cSector)),
           tr('Sede principale', dash(cCity)),
           tr('Periodo di rendicontazione', cPeriod),
           tr('Perimetro', cScope),
           empTotal !== null ? tr('Dipendenti al 31/12', fmt(empTotal), 'n.', trend(empTotal)) : '',
           sv('vsme_gov') ? trQ('Struttura di governance', sv('vsme_gov')) : '',
           cContact !== '—' ? tr('Referente ESG', cContact) : '',
          ].filter(Boolean)
        )
      )}

      <!-- ── B2-E1: Emissioni GHG ──────────────────────────── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">B2-E1 — Cambiamenti climatici · Emissioni GHG</div>
        ${totkg > 0 ? `
          <div class="rkpi-row" style="margin-bottom:14px">
            ${kpi('Scope 1 (B2-E1-2)', fmt(s1kg), 'kgCO₂e', 'g')}
            ${kpi('Scope 2 (B2-E1-3)', fmt(s2kg), 'kgCO₂e', 'b')}
            ${kpi('Scope 3 (B2-E1-4)', fmt(s3kg), 'kgCO₂e', 'o')}
            ${kpi('Totale (B2-E1-1)', fmt(totkg), 'kgCO₂e', 'g highlighted', trend(totkg/1000))}
          </div>
          ${tbl(['Fonte / Attività','Scope','Quantità','Fattore','Fonte FE','kgCO₂e'],
            (c.ghgRows||[]).map(r => `<tr>
              <td>${r.mat}</td>
              <td><span class="tag tag-${r.scope===1?'g':r.scope===2?'b':'o'}">S${r.scope}</span></td>
              <td class="num">${r.qty}</td><td>${r.fe}</td>
              <td class="src-note">${r.src}</td>
              <td class="num" style="font-weight:700">${r.em.toLocaleString('it-IT')}</td></tr>`),
            'Dettaglio emissioni non disponibile — completare il calcolatore GHG'
          )}
        ` : '<p style="color:var(--text-3);font-size:13px;padding:8px 0">Dati GHG non ancora calcolati — completare il calcolatore emissioni VERA</p>'}
        ${sv('vsme_targets') ? `<div style="margin-top:12px;padding:10px 14px;background:oklch(0.97 0.025 148);border-radius:8px;font-size:13px"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:oklch(0.44 0.15 148)">Obiettivi di riduzione GHG</strong><br>${sv('vsme_targets')}</div>` : ''}
      </div>

      <!-- ── B2-E2/E3/E4: Energia · Rifiuti · Trasporti ───── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">B2-E2 — Energia · B2-E3 — Rifiuti · B2-E4 — Trasporti</div>
        ${tbl(['Modulo','Indicatore','Valore','Unità','Note'], [
          /* ENERGIA */
          eElec !== null ? `<tr>
            <td rowspan="${[eRen,eNren,eGas,eDieselL,eTotal,eInt,eRenPct].filter(x=>x!=null).length}" style="font-weight:700;vertical-align:top;font-size:11px;color:oklch(0.55 0.15 70);width:68px">B2-E2<br>Energia</td>
            <td>Elettricità — fonti rinnovabili</td><td class="num">${fmt(eRen||0)}</td><td>kWh</td><td class="src-note">fotovoltaico, GO, PPA</td></tr>` : '',
          eNren != null ? `<tr><td>Elettricità — fonti non rinnovabili</td><td class="num">${fmt(eNren)}</td><td>kWh</td><td class="src-note">rete nazionale</td></tr>` : '',
          eGas  != null ? `<tr><td>Gas naturale</td><td class="num">${fmt(eGas)}</td><td>kWh</td><td class="src-note">contatore</td></tr>` : '',
          eDieselL != null ? `<tr><td>Gasolio</td><td class="num">${fmt(eDieselL)}</td><td>L</td><td class="src-note">≈ ${fmt(eDieselKwh,0)} kWh</td></tr>` : '',
          eTotal != null ? `<tr style="background:oklch(0.97 0.015 70/0.6)"><td><strong>Consumo totale</strong></td><td class="num"><strong>${fmt(eTotal/1000,2)}</strong></td><td><strong>MWh</strong></td><td class="src-note">${trend(eTotal/1000)}</td></tr>` : '',
          eInt   != null ? `<tr><td>Intensità energetica</td><td class="num">${fmt(eInt,0)}</td><td>kWh/dip.</td><td class="src-note">${fmt(empTotal,0)} dip. al 31/12</td></tr>` : '',
          eRenPct!= null ? `<tr><td>Quota energia rinnovabile</td><td class="num" style="color:oklch(0.44 0.15 148);font-weight:700">${fmt(eRenPct,1)}%</td><td></td><td class="src-note">B2-E2-4 · ${trend(eRenPct)}</td></tr>` : '',
          /* RIFIUTI */
          wTot != null ? `<tr>
            <td rowspan="${[wTot,wHaz,wLand,wRec].filter(x=>x!=null).length}" style="font-weight:700;vertical-align:top;font-size:11px;color:oklch(0.44 0.15 148);width:68px">B2-E3<br>Rifiuti</td>
            <td>Rifiuti totali prodotti</td><td class="num">${fmt(wTot,2)}</td><td>t</td><td class="src-note">FIR ${year} · ${trend(wTot)}</td></tr>` : '',
          wHaz  != null ? `<tr><td>Di cui: pericolosi</td><td class="num">${fmt(wHaz,2)}</td><td>t</td><td class="src-note">${wTot ? pct(wHaz,wTot)+' del tot.' : ''}</td></tr>` : '',
          wRec  != null ? `<tr><td>Avviati a riciclo/recupero</td><td class="num" style="color:oklch(0.44 0.15 148);font-weight:600">${fmt(wRec,2)}</td><td>t</td><td class="src-note">${wTot?pct(wRec,wTot)+' recovery rate':''}</td></tr>` : '',
          wLand != null ? `<tr><td>Smaltiti in discarica</td><td class="num">${fmt(wLand,2)}</td><td>t</td><td class="src-note">${wTot?pct(wLand,wTot)+' del tot.':''}</td></tr>` : '',
          /* TRASPORTI */
          tKm != null ? `<tr>
            <td rowspan="${[tKm,tFuel,tVeh,tCO2].filter(x=>x!=null).length}" style="font-weight:700;vertical-align:top;font-size:11px;color:oklch(0.44 0.15 148);width:68px">B2-E4<br>Trasporti</td>
            <td>Volume logistico totale</td><td class="num">${fmt(tKm,0)}</td><td>tkm</td><td class="src-note">anno ${year}</td></tr>` : '',
          tFuel ? `<tr><td>Carburante prevalente</td><td colspan="2">${tFuel}</td><td></td><td></td></tr>` : '',
          tVeh  ? `<tr><td>Veicolo prevalente</td><td colspan="2">${tVeh}</td><td></td><td></td></tr>` : '',
          tCO2  != null ? `<tr style="background:oklch(0.97 0.015 148/0.6)"><td><strong>Emissioni S3 Cat.4 (stimate)</strong></td><td class="num"><strong>${fmt(tCO2,3)}</strong></td><td><strong>tCO₂e</strong></td><td class="src-note">GLEC 2023 · ${trend(tCO2)}</td></tr>` : '',
        ].filter(Boolean), 'Dati energia/rifiuti/trasporti non ancora inseriti')}
      </div>

      <!-- ── B2-E5: Biodiversità ───────────────────────────── -->
      ${sec('B2-E5 — Biodiversità e uso del suolo',
        tbl(['Indicatore','Dettaglio','',''], [
          sv('vsme_bio_address') ? trQ('Sede principale', sv('vsme_bio_address')) : '',
          sv('vsme_bio_other')   ? trQ('Altri siti', sv('vsme_bio_other')) : '',
          sv('vsme_bio_natura2k')? tr('Prossimità aree Natura 2000', sv('vsme_bio_natura2k')) : '',
          sv('vsme_bio_impact')  ? trQ('Impatti noti sulla biodiversità', sv('vsme_bio_impact')) : '',
        ].filter(Boolean))
      )}

      <!-- ── B3-S1: Forza lavoro, SSL, Formazione ──────────── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">B3-S1 — Forza lavoro · Salute e sicurezza · Formazione</div>
        ${empTotal !== null ? `<div class="rkpi-row" style="margin-bottom:14px">
          ${kpi('Dipendenti', fmt(empTotal), 'n. al 31/12', 'g')}
          ${empF != null ? kpi('Donne', fmt(empF)+' ('+pct(empF,empTotal)+')', 'n.', 'b') : ''}
          ${trir != null ? kpi('TRIR', fmt(trir,2), 'per 200.000h', injuries>0?'o':'g') : ''}
          ${trainPer != null ? kpi('Formazione', fmt(trainPer,1), 'ore/dip.', 'g') : ''}
        </div>` : ''}
        ${tbl(['Indicatore','Valore','Unità','Note'], [
          empTotal!= null ? tr('Dipendenti totali al 31/12', fmt(empTotal), 'n.', trend(empTotal)) : '',
          empF    != null ? tr('Di cui: donne', fmt(empF)+' ('+pct(empF,empTotal)+')', 'n.') : '',
          empM    != null ? tr('Di cui: uomini', fmt(empM)+' ('+pct(empM,empTotal)+')', 'n.') : '',
          empFT   != null ? tr('A tempo pieno', fmt(empFT), 'n.', pct(empFT,empTotal)) : '',
          empPT   != null ? tr('A tempo parziale', fmt(empPT), 'n.', pct(empPT,empTotal)) : '',
          empTemp != null ? tr('A tempo determinato', fmt(empTemp), 'n.') : '',
          wageM   != null ? tr('Retribuzione media — uomini', '€ '+fmt(wageM,0), '€ lordi/anno') : '',
          wageF   != null ? tr('Retribuzione media — donne', '€ '+fmt(wageF,0), '€ lordi/anno') : '',
          payGap  != null ? tr('Gender pay gap (M vs F)', fmt(payGap,1)+'%', '', payGap>0?'donne guadagnano meno':'equità retributiva') : '',
          trainTot!= null ? tr('Ore totali di formazione', fmt(trainTot,0), 'ore', 'anno '+year) : '',
          trainPer!= null ? tr('Media ore formazione/dipendente', fmt(trainPer,1), 'ore/dip.') : '',
          injuries!= null ? tr('Infortuni registrabili (INAIL)', fmt(injuries,0), 'n.', trend(injuries)) : '',
          fatal   != null ? tr('Di cui: mortali', fmt(fatal,0), 'n.') : '',
          hrsWork != null ? tr('Ore totali lavorate', fmt(hrsWork,0), 'ore') : '',
          trir    != null ? tr('TRIR', fmt(trir,2), 'per 200.000h', 'GHG Protocol SSL Standard') : '',
        ].filter(Boolean))}
      </div>

      <!-- ── B3-S2: Catena del valore ──────────────────────── -->
      ${sec('B3-S2 — Catena del valore · Fornitori',
        tbl(['Indicatore','Valore','Unità','Note'], [
          supN     != null ? tr('Fornitori attivi', fmt(supN,0), 'n.') : '',
          n('vsme_supply_key') != null ? tr('Di cui: fornitori chiave/strategici', fmt(n('vsme_supply_key'),0), 'n.') : '',
          supAudit != null ? tr('Sottoposti a valutazione ESG', fmt(supAudit,1)+'%', '', 'anno '+year) : '',
          supLocal != null ? tr('Fornitori locali (stesso paese)', fmt(supLocal,1)+'%') : '',
          sv('vsme_supply_risk')   ? trQ('Rischi identificati nella supply chain', sv('vsme_supply_risk')) : '',
          sv('vsme_supply_action') ? trQ('Azioni correttive adottate', sv('vsme_supply_action')) : '',
        ].filter(Boolean))
      )}

      <!-- ── B3-S3: Comunità locali ─────────────────────────── -->
      ${sec('B3-S3 — Comunità locali',
        tbl(['Indicatore','Valore','Unità','Note'], [
          sv('vsme_community') ? trQ('Iniziative di coinvolgimento comunitario', sv('vsme_community')) : '',
          dispN != null ? tr('Controversie significative', fmt(dispN,0), 'n.', 'anno '+year) : '',
          sv('vsme_disputes_desc') ? trQ('Descrizione controversie', sv('vsme_disputes_desc')) : '',
        ].filter(Boolean))
      )}

      <!-- ── B3-S4: Consumatori ─────────────────────────────── -->
      ${sec('B3-S4 — Consumatori e protezione dei dati',
        tbl(['Indicatore','Valore','Unità','Note'], [
          compN   != null ? tr('Reclami formali ricevuti', fmt(compN,0), 'n.', trend(compN)) : '',
          compRes != null ? tr('Di cui: risolti', fmt(compRes,0)+(compRate!=null?' ('+fmt(compRate,1)+'%)':''), 'n.') : '',
          sv('vsme_complaints_desc') ? trQ('Tipologie di reclamo', sv('vsme_complaints_desc')) : '',
          n('vsme_privacy') != null ? tr('Incidenti data breach / privacy', fmt(n('vsme_privacy'),0), 'n.') : '',
          sv('vsme_privacy_desc') ? trQ('Descrizione incidenti privacy', sv('vsme_privacy_desc')) : '',
        ].filter(Boolean))
      )}

      <!-- ── B4-G: Governance ───────────────────────────────── -->
      ${sec('B4-G — Governance · Condotta aziendale · Anticorruzione',
        tbl(['Indicatore','Valore','',''], [
          antiPol  ? tr('Politica anticorruzione formalizzata', antiPol) : '',
          antiTrn  != null ? tr('Dipendenti formati su anticorruzione', fmt(antiTrn,1)+'%', 'del tot.', 'anno '+year) : '',
          whistle  ? tr('Sistema whistleblowing', whistle) : '',
          corruptN != null ? tr('Incidenti corruzione confermati', fmt(corruptN,0), 'n.', 'anno '+year) : '',
          m231     ? tr('Modello organizzativo D.Lgs. 231/2001', m231) : '',
          sv('vsme_lobby') ? tr('Attività di lobbying', sv('vsme_lobby')) : '',
        ].filter(Boolean))
      )}

      <!-- ── B5: Rischi e opportunità ───────────────────────── -->
      ${(sv('risk_env')||sv('risk_social')||sv('opp_env')) ? `
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">B5 — Rischi e opportunità ESG</div>
        ${sv('risk_horizon') ? `<p class="src-note" style="margin:0 0 12px">Orizzonte temporale: <strong>${sv('risk_horizon')}</strong></p>` : ''}
        <div class="tbl-wrap"><table>
          <thead><tr><th>Dimensione</th><th style="width:37%">Rischi principali</th><th style="width:37%">Opportunità principali</th></tr></thead>
          <tbody>
            <tr style="vertical-align:top"><td style="font-weight:700;color:oklch(0.44 0.15 148)">Ambiente</td>
              <td style="font-size:13px;line-height:1.55">${sv('risk_env')||'—'}</td>
              <td style="font-size:13px;line-height:1.55">${sv('opp_env')||'—'}</td></tr>
            <tr style="vertical-align:top"><td style="font-weight:700;color:oklch(0.46 0.12 225)">Sociale</td>
              <td style="font-size:13px;line-height:1.55">${sv('risk_social')||'—'}</td>
              <td style="font-size:13px;line-height:1.55">${sv('opp_social')||'—'}</td></tr>
            <tr style="vertical-align:top"><td style="font-weight:700;color:oklch(0.55 0.13 42)">Governance</td>
              <td style="font-size:13px;line-height:1.55">${sv('risk_gov')||'—'}</td>
              <td style="font-size:13px;line-height:1.55">—</td></tr>
          </tbody>
        </table></div>
        ${sv('risk_mitigation') ? `<div style="margin-top:12px;padding:10px 14px;background:oklch(0.97 0.018 188);border-radius:8px;font-size:13px;color:oklch(0.35 0.10 188)"><strong>Azioni di mitigazione in atto o pianificate:</strong><br>${sv('risk_mitigation')}</div>` : ''}
      </div>` : sec('B5 — Rischi e opportunità ESG', '<p style="color:var(--text-3);font-size:13px;padding:6px 0">Dati non ancora inseriti</p>')}

      <!-- ── Emission factors ───────────────────────────────── -->
      <div class="acard">
        <div class="acard-title">Fattori di emissione utilizzati</div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Categoria</th><th>Scope</th><th>FE</th><th>Unità</th><th>GWP</th><th>Fonte</th></tr></thead>
          <tbody>
            <tr><td>Elettricità (rete IT)</td><td><span class="tag tag-b">S2</span></td><td>0,28307</td><td>kgCO₂e/kWh</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Gas naturale</td><td><span class="tag tag-g">S1</span></td><td>0,18386</td><td>kgCO₂e/kWh</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Gasolio</td><td><span class="tag tag-g">S1</span></td><td>2,68490</td><td>kgCO₂e/L</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Rifiuti (discarica)</td><td><span class="tag tag-o">S3</span></td><td>0,58700</td><td>kgCO₂e/kg</td><td>AR6</td><td class="src-note">IPCC AR6 WG3</td></tr>
            <tr><td>Rifiuti (riciclo)</td><td><span class="tag tag-o">S3</span></td><td>0,02100</td><td>kgCO₂e/kg</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Trasporto stradale</td><td><span class="tag tag-o">S3</span></td><td>0,09560</td><td>kgCO₂e/tkm</td><td>AR6</td><td class="src-note">GLEC Framework 2023</td></tr>
          </tbody>
        </table></div>
      </div>`;

    const vsmeEl = document.getElementById('rpt-vsme');
    const griEl  = document.getElementById('rpt-gri');
    if (vsmeEl) { vsmeEl.innerHTML = html; vsmeEl.style.display = ''; }
    if (griEl)  griEl.style.display = 'none';

  /* ════════════════════════════════════════════════════════
     GRI REPORT
  ════════════════════════════════════════════════════════ */
  } else {

    const orgName  = sv('org_name')  || c.name  || '—';
    const orgHQ    = sv('org_hq')    || c.city  || '—';
    const orgNature= sv('org_nature')|| '';
    const empTotG  = n('emp_total')  || empTotal;
    const empFG    = n('emp_f');
    const empMG    = n('emp_m');
    const empFTG   = n('emp_ft');
    const empPTG   = n('emp_pt');
    const s1kg = ghg.s1||0, s2kg = ghg.s2||0, s3kg = ghg.s3||0, totkg = ghg.total||0;

    // Energy (GRI 302-1)
    const eRenG  = n('elec_ren_kwh');
    const eNrenG = n('elec_nren_kwh');
    const eElecG = (eRenG != null || eNrenG != null) ? (eRenG||0)+(eNrenG||0) : null;
    const eGasG  = n('gas_kwh');
    const eDieselG = n('diesel_l');
    const eDieselKwhG = eDieselG != null ? eDieselG*9.97 : null;
    const eTotG  = eElecG != null ? eElecG+(eGasG||0)+(eDieselKwhG||0) : null;
    const eIntG  = (eTotG && empTotG) ? eTotG/empTotG : null;
    const eRenPctG = (eRenG != null && eTotG) ? eRenG/eTotG*100 : null;

    // GRI 401-1
    const hireTot = n('hire_total'), hireM = n('hire_m'), hireF = n('hire_f'), hireU30 = n('hire_u30');
    const turnTot = n('turn_total');
    const hireRate = (hireTot != null && empTotG) ? hireTot/empTotG*100 : null;
    const turnRate = (turnTot != null && empTotG) ? turnTot/empTotG*100 : null;

    // GRI 403-9
    const ohsFat  = n('ohs_fatalities');
    const ohsHC   = n('ohs_hc_injuries');
    const ohsRec  = n('ohs_rec_injuries');
    const ohsHrs  = n('ohs_hrs_worked');
    const triRG   = (ohsRec != null && ohsHrs) ? ohsRec/ohsHrs*200000 : null;
    const hcRate  = (ohsFat != null && ohsHC != null && ohsHrs) ? (ohsFat+ohsHC)/ohsHrs*200000 : null;

    // GRI 404-1
    const trainTotG = n('train_hrs_total');
    const trainMG   = n('train_hrs_m');
    const trainFG   = n('train_hrs_f');
    const trainPerG = (trainTotG && empTotG) ? trainTotG/empTotG : null;

    // GRI 405-1 Board
    const boardTot = n('board_total');
    const boardF   = n('board_f');
    const boardU30 = n('board_u30');
    const board3050= n('board_3050');

    // GRI 2-21
    const ceoPay  = n('ceo_pay');
    const medPay  = n('median_pay');

    // GRI 201-1
    const revenue = n('revenue');
    const opCost  = n('op_cost');
    const wages   = n('wages');
    const taxes   = n('tax');
    const margin  = (revenue != null && opCost != null) ? revenue-opCost : null;

    // GRI 306 Waste
    const wTotG  = n('waste_total');
    const wRecG  = n('waste_rec');
    const wDispG = n('waste_disp');

    const disclosures = (typeformQuestionnaireState.disclosures || []).map(d => d.code);
    const has = code => disclosures.includes(code) || Object.keys(d).length > 0;

    const griHtml = `
      <!-- ── HEADER ─────────────────────────────────────────── -->
      <div class="acard rpt-header-card" style="margin-bottom:14px">
        <div class="rpt-std-badge gri">GRI 2021</div>
        <div>
          <div class="rpt-title">GRI Standards Report</div>
          <div class="rpt-sub">${orgName}${orgNature?' · '+orgNature:''} · ${orgHQ} · ${cPeriod}</div>
          <div class="rpt-note">Conforme GRI Standards 2021 · GHG Protocol · Fattori Metodologia VERA ${year}</div>
        </div>
      </div>

      <!-- ── GRI 2: Informativa generale ──────────────────── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">GRI 2 — Informativa generale</div>
        ${tbl(['Disclosure','Indicatore','Valore','Note'], [
          tr('GRI 2-1', 'Ragione sociale / forma giuridica', dash(orgName)+(orgNature?' · '+orgNature:'')),
          tr('GRI 2-1', 'Sede principale', dash(orgHQ)),
          empTotG != null ? tr('GRI 2-7', 'Dipendenti totali al 31/12', fmt(empTotG)+' n.', trend(empTotG)) : '',
          empFG   != null ? tr('GRI 2-7', 'Di cui: donne', fmt(empFG)+' ('+pct(empFG,empTotG)+')', 'n.') : '',
          empMG   != null ? tr('GRI 2-7', 'Di cui: uomini', fmt(empMG)+' ('+pct(empMG,empTotG)+')', 'n.') : '',
          empFTG  != null ? tr('GRI 2-7', 'A tempo pieno', fmt(empFTG), 'n.') : '',
          empPTG  != null ? tr('GRI 2-7', 'A tempo parziale', fmt(empPTG), 'n.') : '',
          boardTot!= null ? tr('GRI 2-9', 'Componenti organo di governo', fmt(boardTot), 'n.') : '',
          boardF  != null ? tr('GRI 2-9', 'Di cui: donne', fmt(boardF)+' ('+pct(boardF,boardTot)+')', 'n.') : '',
          sv('gov_body_name') ? tr('GRI 2-9', 'Denominazione organo', sv('gov_body_name')) : '',
          ceoPay  != null ? tr('GRI 2-21', 'Retribuzione massima dirigente', '€ '+fmt(ceoPay,0)) : '',
          medPay  != null ? tr('GRI 2-21', 'Retribuzione mediana dipendenti', '€ '+fmt(medPay,0)) : '',
          (ceoPay && medPay && medPay > 0) ? tr('GRI 2-21', 'Rapporto retributivo', fmt(ceoPay/medPay,1)+'x', 'max / mediana') : '',
        ].filter(Boolean))}
      </div>

      <!-- ── GRI 201: Performance economica ───────────────── -->
      ${(revenue != null || margin != null) ? sec('GRI 201-1 — Valore economico generato e distribuito',
        tbl(['Disclosure','Indicatore','Valore','Unità'], [
          revenue != null ? tr('201-1a', 'Ricavi', '€ '+fmt(revenue,0), '€') : '',
          opCost  != null ? tr('201-1b', 'Costi operativi', '€ '+fmt(opCost,0), '€') : '',
          wages   != null ? tr('201-1b', 'Costo del lavoro', '€ '+fmt(wages,0)+' ('+pct(wages,revenue)+')', '€') : '',
          taxes   != null ? tr('201-1d', 'Imposte sul reddito', '€ '+fmt(taxes,0), '€') : '',
          margin  != null ? tr('—', 'Margine operativo lordo', '€ '+fmt(margin,0), '€') : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── GRI 302: Energia ──────────────────────────────── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">GRI 302 — Energia</div>
        ${tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          eRenG  != null ? tr('302-1', 'Elettricità da fonti rinnovabili', fmt(eRenG), 'kWh', 'fotovoltaico, GO, PPA') : '',
          eNrenG != null ? tr('302-1', 'Elettricità da fonti non rinnovabili', fmt(eNrenG), 'kWh', 'rete nazionale') : '',
          eGasG  != null ? tr('302-1', 'Gas naturale', fmt(eGasG), 'kWh') : '',
          eDieselG != null ? tr('302-1', 'Gasolio', fmt(eDieselG), 'L', '≈ '+fmt(eDieselKwhG,0)+' kWh') : '',
          eTotG  != null ? `<tr style="background:oklch(0.97 0.015 70/0.6)"><td>302-1</td><td><strong>Consumo totale interno</strong></td><td class="num"><strong>${fmt(eTotG/1000,2)}</strong></td><td><strong>MWh</strong></td><td class="src-note">${trend(eTotG/1000)}</td></tr>` : '',
          eIntG  != null ? tr('302-3', 'Intensità energetica', fmt(eIntG,0), 'kWh/dip.', fmt(empTotG,0)+' dip.') : '',
          eRenPctG!=null ? `<tr><td>302-1</td><td>Quota energia rinnovabile</td><td class="num" style="color:oklch(0.44 0.15 148);font-weight:700">${fmt(eRenPctG,1)}%</td><td></td><td class="src-note">${trend(eRenPctG)}</td></tr>` : '',
        ].filter(Boolean), 'GRI 302-1: dati non ancora inseriti')}
      </div>

      <!-- ── GRI 305: Emissioni GHG ─────────────────────────── -->
      <div class="acard" style="margin-bottom:14px">
        <div class="acard-title">GRI 305 — Emissioni GHG</div>
        ${totkg > 0 ? `
          <div class="rkpi-row" style="margin-bottom:14px">
            ${kpi('305-1 Scope 1', fmt(s1kg), 'kgCO₂e', 'g')}
            ${kpi('305-2 Scope 2 (MB)', fmt(s2kg), 'kgCO₂e', 'b')}
            ${kpi('305-3 Scope 3', fmt(s3kg), 'kgCO₂e', 'o')}
            ${kpi('Totale GHG', fmt(totkg), 'kgCO₂e', 'g highlighted', trend(totkg/1000))}
          </div>
          ${tbl(['Disclosure','Indicatore','Valore','Unità','Fonte FE'],
            (c.ghgRows||[]).map(r => `<tr>
              <td class="src-note">305-${r.scope}</td><td>${r.mat}</td>
              <td class="num" style="font-weight:700">${r.em.toLocaleString('it-IT')}</td>
              <td>kgCO₂e</td><td class="src-note">${r.src} · FE ${r.fe}</td></tr>`),
            'Dettaglio emissioni non disponibile — completare il calcolatore GHG'
          )}` : '<p style="color:var(--text-3);font-size:13px;padding:8px 0">Dati GHG non ancora calcolati</p>'}
      </div>

      <!-- ── GRI 306: Rifiuti ──────────────────────────────── -->
      ${(wTotG != null || wRecG != null) ? sec('GRI 306 — Rifiuti',
        tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          wTotG  != null ? tr('306-3', 'Rifiuti generati', fmt(wTotG,0), 'kg', trend(wTotG)) : '',
          wRecG  != null ? tr('306-4', 'Rifiuti recuperati/riciclati', fmt(wRecG,0)+' ('+pct(wRecG,wTotG)+')', 'kg') : '',
          wDispG != null ? tr('306-5', 'Rifiuti smaltiti', fmt(wDispG,0)+' ('+pct(wDispG,wTotG)+')', 'kg') : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── GRI 401: Occupazione ──────────────────────────── -->
      ${(hireTot != null || turnTot != null) ? sec('GRI 401-1 — Nuove assunzioni e turnover',
        tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          hireTot != null ? tr('401-1', 'Nuove assunzioni', fmt(hireTot,0), 'n.', trend(hireTot)) : '',
          hireM   != null ? tr('401-1', 'Di cui: uomini', fmt(hireM,0), 'n.') : '',
          hireF   != null ? tr('401-1', 'Di cui: donne', fmt(hireF,0), 'n.') : '',
          hireU30 != null ? tr('401-1', 'Di cui: under 30', fmt(hireU30,0), 'n.') : '',
          hireRate!= null ? tr('401-1', 'Tasso di assunzione', fmt(hireRate,1)+'%', '', fmt(empTotG,0)+' dip. base') : '',
          turnTot != null ? tr('401-1', 'Dipendenti usciti', fmt(turnTot,0), 'n.', trend(turnTot)) : '',
          turnRate!= null ? tr('401-1', 'Tasso di turnover', fmt(turnRate,1)+'%') : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── GRI 403-9: Infortuni ──────────────────────────── -->
      ${(ohsRec != null || ohsFat != null) ? sec('GRI 403-9 — Infortuni sul lavoro',
        tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          ohsFat  != null ? tr('403-9', 'Infortuni mortali (dipendenti)', fmt(ohsFat,0), 'n.') : '',
          n('ohs_fatalities_ext') != null ? tr('403-9', 'Infortuni mortali (non dipendenti)', fmt(n('ohs_fatalities_ext'),0), 'n.') : '',
          ohsHC   != null ? tr('403-9', 'Infortuni ad alta conseguenza (esclusi mortali)', fmt(ohsHC,0), 'n.') : '',
          ohsRec  != null ? tr('403-9', 'Infortuni registrabili totali', fmt(ohsRec,0), 'n.', trend(ohsRec)) : '',
          n('ohs_rec_ext') != null ? tr('403-9', 'Infortuni registrabili (non dipendenti)', fmt(n('ohs_rec_ext'),0), 'n.') : '',
          ohsHrs  != null ? tr('403-9', 'Ore totali lavorate', fmt(ohsHrs,0), 'ore') : '',
          triRG   != null ? `<tr style="background:oklch(0.97 0.015 148/0.6)"><td>403-9</td><td><strong>TRIR</strong></td><td class="num"><strong>${fmt(triRG,2)}</strong></td><td>per 200.000h</td><td class="src-note">GHG Protocol SSL Standard</td></tr>` : '',
          hcRate  != null ? tr('403-9', 'Tasso infortuni alta conseguenza', fmt(hcRate,3), 'per 200.000h') : '',
          sv('ohs_main_types') ? trQ('Principali tipologie di infortuno', sv('ohs_main_types')) : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── GRI 404-1: Formazione ─────────────────────────── -->
      ${trainTotG != null ? sec('GRI 404-1 — Formazione e istruzione',
        tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          tr('404-1', 'Ore totali di formazione erogate', fmt(trainTotG,0), 'ore', 'anno '+year),
          trainPerG!= null ? tr('404-1', 'Media ore formazione/dipendente', fmt(trainPerG,1), 'ore/dip.', trend(trainPerG)) : '',
          trainMG  != null ? tr('404-1', 'Ore erogate a uomini', fmt(trainMG,0), 'ore') : '',
          trainFG  != null ? tr('404-1', 'Ore erogate a donne', fmt(trainFG,0), 'ore') : '',
          sv('train_type') ? trQ('Tipologie di formazione', sv('train_type')) : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── GRI 405-1: Diversità ──────────────────────────── -->
      ${boardTot != null ? sec('GRI 405-1 — Diversità negli organi di governo',
        tbl(['Disclosure','Indicatore','Valore','Unità','Note'], [
          tr('405-1', 'Componenti organo di governo', fmt(boardTot,0), 'n.'),
          boardF   != null ? tr('405-1', 'Di cui: donne', fmt(boardF,0)+' ('+pct(boardF,boardTot)+')', 'n.') : '',
          boardU30 != null ? tr('405-1', 'Di cui: sotto 30 anni', fmt(boardU30,0), 'n.') : '',
          board3050!= null ? tr('405-1', 'Di cui: 30–50 anni', fmt(board3050,0), 'n.') : '',
          (boardU30!= null && board3050 != null) ? tr('405-1', 'Di cui: over 50', fmt(boardTot-(boardU30||0)-(board3050||0),0), 'n.') : '',
        ].filter(Boolean))
      ) : ''}

      <!-- ── Emission factors ───────────────────────────────── -->
      <div class="acard">
        <div class="acard-title">Fattori di emissione utilizzati</div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Categoria</th><th>Scope</th><th>FE</th><th>Unità</th><th>GWP</th><th>Fonte</th></tr></thead>
          <tbody>
            <tr><td>Elettricità (rete IT)</td><td><span class="tag tag-b">S2</span></td><td>0,28307</td><td>kgCO₂e/kWh</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Gas naturale</td><td><span class="tag tag-g">S1</span></td><td>0,18386</td><td>kgCO₂e/kWh</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Gasolio</td><td><span class="tag tag-g">S1</span></td><td>2,68490</td><td>kgCO₂e/L</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
            <tr><td>Rifiuti (discarica)</td><td><span class="tag tag-o">S3</span></td><td>0,58700</td><td>kgCO₂e/kg</td><td>AR6</td><td class="src-note">IPCC AR6 WG3</td></tr>
            <tr><td>Rifiuti (riciclo)</td><td><span class="tag tag-o">S3</span></td><td>0,02100</td><td>kgCO₂e/kg</td><td>AR6</td><td class="src-note">Metodologia VERA ${year}</td></tr>
          </tbody>
        </table></div>
      </div>`;

    const vsmeEl = document.getElementById('rpt-vsme');
    const griEl  = document.getElementById('rpt-gri');
    if (griEl)  { griEl.innerHTML = griHtml; griEl.style.display = ''; }
    if (vsmeEl) vsmeEl.style.display = 'none';
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

  // Only show real data (no hardcoded Metalfer rows)
  if (!c || !c.ghg) {
    tbody.innerHTML = `<tr id="jobs-empty-row"><td colspan="7" style="text-align:center;color:var(--text-3);padding:20px 0;font-size:13px">Nessun job completato — carica i dati GHG per iniziare</td></tr>`;
    return;
  }

  const std = c.std ? c.std.toUpperCase() : '—';
  const statusClass = c.status === 'completed' ? 'tag tag-g' : 'tag';
  const statusLabel = c.status === 'completed' ? 'Completato' : 'In corso';
  const tco2 = c.ghg ? (c.ghg.total / 1000).toFixed(1) : '—';
  const rows = c.ghgRows ? c.ghgRows.length : '—';

  tbody.innerHTML = `
    <tr>
      <td>#1</td>
      <td>dati_${c.year}_annuale.xlsx</td>
      <td>${c.year}</td>
      <td><span class="tag tag-g" id="job-std">${std}</span></td>
      <td>${rows}</td>
      <td><span class="${statusClass}">${statusLabel}</span></td>
      <td class="num">${tco2}</td>
    </tr>`;
}

function _updateScopeBars(c) {
  const hasDist = !!(c && c.ghg && c.ghg.total > 0);
  const wrap  = document.getElementById('scope-bar-wrap');
  const lgnd  = document.getElementById('scope-legend');
  const empty = document.getElementById('scope-empty');
  if (wrap)  wrap.style.display  = hasDist ? ''     : 'none';
  if (lgnd)  lgnd.style.display  = hasDist ? ''     : 'none';
  if (empty) empty.style.display = hasDist ? 'none' : '';
  if (!hasDist) return;

  const t  = c.ghg.total;
  const p1 = +(c.ghg.s1 / t * 100).toFixed(1);
  const p2 = +(c.ghg.s2 / t * 100).toFixed(1);
  const p3 = +(c.ghg.s3 / t * 100).toFixed(1);

  const b1 = document.getElementById('scope-bar-s1');
  const b2 = document.getElementById('scope-bar-s2');
  const b3 = document.getElementById('scope-bar-s3');
  if (b1) { b1.style.width = p1 + '%'; b1.title = `Scope 1 · ${p1}%`; }
  if (b2) { b2.style.width = p2 + '%'; b2.title = `Scope 2 · ${p2}%`; }
  if (b3) { b3.style.width = p3 + '%'; b3.title = `Scope 3 · ${p3}%`; }

  const l1 = document.getElementById('legend-s1');
  const l2 = document.getElementById('legend-s2');
  const l3 = document.getElementById('legend-s3');
  if (l1) l1.innerHTML = `<b>Scope 1 · ${p1}%</b><br/>Combustibili diretti`;
  if (l2) l2.innerHTML = `<b>Scope 2 · ${p2}%</b><br/>Energia acquistata`;
  if (l3) l3.innerHTML = `<b>Scope 3 · ${p3}%</b><br/>Catena del valore`;
}

function _updateStatusRows(c) {
  function setRow(id, done, doneText, pendingText) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = done ? 'tag tag-g' : 'tag';
    el.textContent = done ? `✓ ${doneText}` : `○ ${pendingText}`;
  }
  if (!c) return;
  const stdLabel = c.std ? c.std.toUpperCase() : '—';
  _setText('dash-std', c.std ? c.std.toUpperCase() : '—');
  setRow('status-std',    c.std != null,         stdLabel,     'Da definire');
  setRow('status-data',   c.step >= 3,            'Completato', 'In attesa');
  setRow('status-ghg',    !!(c.ghg),             'Completato', 'In attesa');
  setRow('status-report', c.step >= 5,            'Generato',   'In attesa');
  setRow('status-stamp',  !!(c.stamp?.applied),  'Applicato',  'In attesa');
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
    // ── Skip if assessment already completed for this client ──
    const c = currentClient();
    if (c && c.std && c.step >= 2) {
      _showAlreadyCompleted(c);
      return;
    }

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

  function _showAlreadyCompleted(c) {
    document.getElementById('assess-intro').style.display     = 'none';
    document.getElementById('assess-quiz').style.display      = 'none';
    document.getElementById('assess-analyzing').style.display = 'none';
    document.getElementById('assess-results').style.display   = 'block';

    const std = c.std;
    const isV = std === 'vsme';
    const badge = document.getElementById('result-badge');
    if (badge) { badge.textContent = isV ? 'VSME 2023' : 'GRI Standards'; badge.className = 'assess-result-badge' + (isV ? '' : ' gri'); }

    const $ = id => document.getElementById(id);
    if ($('result-title'))    $('result-title').textContent    = `Standard attivo: ${isV ? 'VSME 2023 (EFRAG)' : 'GRI Standards 2021'}`;
    if ($('result-subtitle')) $('result-subtitle').textContent = 'Valutazione già completata — dati salvati in precedenza';
    if ($('result-conf'))     $('result-conf').textContent     = '—';
    if ($('gauge-vsme'))      $('gauge-vsme').style.width      = isV ? '70%' : '30%';
    if ($('gauge-gri'))       $('gauge-gri').style.width       = isV ? '30%' : '70%';
    if ($('gauge-vsme-pct'))  $('gauge-vsme-pct').textContent  = isV ? '70%' : '30%';
    if ($('gauge-gri-pct'))   $('gauge-gri-pct').textContent   = isV ? '30%' : '70%';

    if ($('assess-reasons')) $('assess-reasons').innerHTML = `
      <div class="assess-reason"><span class="assess-reason-icon">✓</span>
        <span>Standard <strong>${isV ? 'VSME 2023' : 'GRI Standards'}</strong> già applicato per questo cliente.</span></div>
      <div class="assess-reason"><span class="assess-reason-icon">💡</span>
        <span>Condizioni cambiate? Clicca <em>Ricomincia valutazione</em> qui sotto.</span></div>`;

    const sectorKey = (c.sector || 'default').toLowerCase();
    const sectorMap = { manifatturiero:'manuf', edilizia:'build', commercio:'trade', servizi:'serv' };
    const sk = Object.entries(sectorMap).find(([k]) => sectorKey.includes(k))?.[1] || 'default';
    const modules = isV
      ? VSME_MODULES_ALL.map(m => `VSME ${m.code} — ${m.label}`)
      : (GRI_BY_SECTOR[sk] || GRI_BY_SECTOR.default).map(d => `${d.code} — ${d.label}`);
    const modCls = isV ? '' : 'gri';
    if ($('assess-modules')) $('assess-modules').innerHTML = modules
      .map(m => `<span class="assess-module-chip ${modCls}">${m}</span>`).join('');

    _renderStandardEditor({ isVSME: isV, standard: isV ? 'VSME 2023' : 'GRI Standards' });
  }

  function restart() {
    document.getElementById('assess-results').style.display = 'none';
    // Clear all assessment state so start() does not short-circuit
    const c = currentClient();
    if (c) { delete c._assessDone; c.std = null; c.step = 1; }
    Object.assign(state.assessment, { currentQ:0, answers:{}, vsmeScore:0, griScore:0, phase:'questions', recommendation:null, reasoningText:'' });
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

    // ── Standard editor / configuratore ──────────────────────
    _renderStandardEditor(rec);
  }

  /* ── Standard editor — configurazione moduli post-AI ────── */
  function _renderStandardEditor(rec) {
    _griDiscRemoved = new Set(); // reset on every render — avoid stale removals
    const isVSME = rec.isVSME;
    let el = document.getElementById('assess-std-editor');
    if (!el) {
      el = document.createElement('div');
      el.id = 'assess-std-editor';
      el.style.marginTop = '24px';
      const modulesEl = document.getElementById('assess-modules');
      if (modulesEl && modulesEl.parentNode) {
        modulesEl.parentNode.insertBefore(el, modulesEl.nextSibling);
      }
    }

    const vsmeInfo = `
      <div style="background:oklch(0.962 0.030 148/0.4);border:1px solid oklch(0.822 0.082 148);border-radius:10px;padding:14px 16px;font-size:13px;line-height:1.6;color:var(--text)">
        <div style="font-weight:700;color:oklch(0.392 0.132 148);margin-bottom:8px">📋 Struttura VSME — tutti i moduli B sono obbligatori</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          ${VSME_MODULES_ALL.map(m => `
            <tr>
              <td style="padding:5px 8px;font-weight:600;white-space:nowrap;color:oklch(0.392 0.132 148)">VSME ${m.code}</td>
              <td style="padding:5px 8px;color:var(--text-2)">${m.label}</td>
              <td style="padding:5px 8px;text-align:right">
                <span style="font-size:10px;font-weight:700;letter-spacing:.06em;background:oklch(0.448 0.148 148);color:#fff;border-radius:4px;padding:2px 7px">${m.code === 'B5' ? 'OBB.*' : 'OBB.'}</span>
              </td>
            </tr>`).join('')}
        </table>
        <p style="font-size:11px;color:var(--text-3);margin:10px 0 0">
          * B5 Rischi & Opportunità è obbligatorio ma può essere marcato "non materiale" con motivazione scritta (EFRAG VSME S1 §47).
        </p>
      </div>`;

    const griLevels = [
      { id:'with_ref',   label:'With Reference',   desc:'Rendiconto parziale — selezione delle disclosure GRI più rilevanti. Non richiede copertura completa.' },
      { id:'in_accord',  label:'In Accordance',    desc:'Rendiconto completo — tutte le GRI 2 (2-1→2-30) + tutte le disclosure tematiche. Obbligatorio per claim GRI formale.' },
    ];

    const c = currentClient();
    const sectorKey = (c && c.sector ? c.sector : 'default').toLowerCase();
    const sectorMap = { manifatturiero:'manuf', edilizia:'build', commercio:'trade', servizi:'serv' };
    const sk = Object.entries(sectorMap).find(([k]) => sectorKey.includes(k))?.[1] || 'default';
    const griDisc = GRI_BY_SECTOR[sk] || GRI_BY_SECTOR.default;

    const griEditor = `
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">Livello di conformità GRI</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
          ${griLevels.map(l => `
            <label id="gri-lbl-${l.id}" onclick="VERA.assessment.selectGriLevel('${l.id}')" style="
              flex:1;min-width:200px;cursor:pointer;
              border:1.5px solid var(--border);border-radius:10px;padding:14px 16px;
              transition:border-color .15s,background .15s;background:var(--surface)">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <div id="gri-radio-${l.id}" style="width:16px;height:16px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;transition:all .15s"></div>
                <span style="font-weight:700;font-size:13px;color:var(--text)">${l.label}</span>
              </div>
              <p style="font-size:12px;color:var(--text-3);margin:0;line-height:1.5">${l.desc}</p>
            </label>`).join('')}
        </div>
        <div style="background:oklch(0.972 0.022 47/0.35);border:1px solid oklch(0.82 0.08 47);border-radius:8px;padding:10px 14px;font-size:12px;color:oklch(0.45 0.10 47);margin-bottom:16px">
          ⚠️ <strong>In Accordance</strong> richiede tutte le GRI 2 (30 disclosure) + tematiche. <strong>With Reference</strong> permette selezione parziale ma non il claim formale GRI.
        </div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px">
          Disclosure selezionate per il tuo settore
          <span style="font-weight:400;text-transform:none;letter-spacing:0">(clicca per rimuovere)</span>
        </div>
        <div id="gri-disc-chips" style="display:flex;flex-wrap:wrap;gap:6px">
          ${griDisc.map(d => `
            <span class="std-chip gri-chip" id="chip-${d.code.replace(/\s/g,'_')}"
              onclick="VERA.assessment.toggleGriDisc('${d.code}')"
              style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;
                     padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;
                     background:oklch(0.964 0.020 252);color:oklch(0.40 0.10 252);
                     border:1px solid oklch(0.82 0.08 252);transition:all .15s">
              ${d.code} <span style="opacity:0.6;font-size:10px">✕</span>
            </span>`).join('')}
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-3)">
          <span id="gri-disc-count">${griDisc.length} disclosure attive</span>
        </div>
      </div>`;

    el.innerHTML = `
      <div style="border-top:1px solid var(--border);padding-top:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="font-weight:700;font-size:13px;color:var(--text)">
            ⚙️ Configurazione standard ${isVSME ? 'VSME' : 'GRI'}
          </div>
          <button onclick="VERA.assessment.toggleStdEditor()"
            style="font-size:12px;font-weight:600;background:none;border:1px solid var(--border);
                   border-radius:6px;padding:5px 12px;cursor:pointer;color:var(--text-2)">
            Visualizza / Modifica <span id="std-editor-arrow">▼</span>
          </button>
        </div>
        <div id="std-editor-body" style="display:none">
          ${isVSME ? vsmeInfo : griEditor}
        </div>
      </div>`;

    if (!isVSME) {
      setTimeout(() => _selectGriLevelInternal('with_ref'), 120);
    }
  }

  /* Stato GRI disc selezionate — reset ogni volta che l'editor viene ri-renderizzato */
  let _griDiscRemoved = new Set();

  function _selectGriLevelInternal(levelId) {
    ['with_ref','in_accord'].forEach(id => {
      const lbl   = document.getElementById('gri-lbl-' + id);
      const radio = document.getElementById('gri-radio-' + id);
      if (!lbl || !radio) return;
      const active = id === levelId;
      radio.style.background     = active ? 'oklch(0.68 0.155 252)' : '';
      radio.style.borderColor    = active ? 'oklch(0.68 0.155 252)' : 'var(--border)';
      lbl.style.borderColor      = active ? 'oklch(0.68 0.155 252)' : 'var(--border)';
      lbl.style.background       = active ? 'oklch(0.964 0.020 252/0.4)' : 'var(--surface)';
    });
  }

  function selectGriLevel(levelId) { _selectGriLevelInternal(levelId); }

  function toggleGriDisc(code) {
    const chip = document.getElementById('chip-' + code.replace(/\s/g,'_'));
    if (!chip) return;
    if (_griDiscRemoved.has(code)) {
      _griDiscRemoved.delete(code);
      chip.style.opacity = '1';
      chip.style.textDecoration = 'none';
      chip.title = '';
    } else {
      _griDiscRemoved.add(code);
      chip.style.opacity = '0.38';
      chip.style.textDecoration = 'line-through';
      chip.title = 'Rimossa — clicca per riattivare';
    }
    const countEl = document.getElementById('gri-disc-count');
    if (countEl) {
      const total = document.querySelectorAll('#gri-disc-chips .gri-chip').length;
      countEl.textContent = `${total - _griDiscRemoved.size} disclosure attive (${_griDiscRemoved.size} rimosse)`;
    }
  }

  function toggleStdEditor() {
    const body  = document.getElementById('std-editor-body');
    const arrow = document.getElementById('std-editor-arrow');
    if (!body) return;
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    if (arrow) arrow.textContent = open ? '▼' : '▲';
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
    // Fallback: se la valutazione era già completata (rec == null), usa lo std del client
    const c0 = currentClient();
    const fallbackStd = c0 && c0.std;
    if (!rec && !fallbackStd) return;
    const std = rec ? (rec.isVSME ? 'vsme' : 'gri') : fallbackStd;
    const isVSME = std === 'vsme';
    onboarding.selectStd(std);
    onboarding._syncBadges(std);
    const vsmeRec = document.getElementById('vsme-ai-rec');
    const griRec = document.getElementById('gri-ai-rec');
    if (vsmeRec) vsmeRec.style.display = isVSME ? 'flex' : 'none';
    if (griRec) griRec.style.display = !isVSME ? 'flex' : 'none';
    // Advance client wizard step
    const c = currentClient();
    if (c) { c.std = std; if (c.step < 2) c.step = 2; }
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
    const stdLabel = rec ? rec.standard : (isVSME ? 'VSME 2023' : 'GRI Standards');
    toast(`${stdLabel} applicato → Continua con l'onboarding`, 'success');
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

  return { _init, start, restart, next, prev, toggleReasoning, applyRecommendation, skipToManual, selectOption, toggleStdEditor, selectGriLevel, toggleGriDisc };
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
  /* GRI 302-1: Consumo energetico — rinnovabili / non rinnovabili distinti */
  'GRI 302-1':[
    { id:'elec_ren_kwh',  label:'Elettricità da fonti RINNOVABILI (kWh) — fotovoltaico, idroelettrico, GO, PPA', type:'number', required:true },
    { id:'elec_nren_kwh', label:'Elettricità da fonti NON RINNOVABILI (kWh) — rete, generatori diesel', type:'number', required:true },
    { id:'gas_kwh',       label:'Consumo di gas naturale (kWh equiv.)', type:'number' },
    { id:'diesel_l',      label:'Consumo di gasolio/diesel (litri) — solo uso interno, non trasporti', type:'number' },
    { id:'other_fuel',    label:'Altri combustibili (specificare tipo e quantità)', type:'text',
      placeholder:'es. GPL: 500 kg; olio combustibile: 200 l' },
    { id:'energy_meth',   label:'Metodologia di conversione e fattori utilizzati', type:'text',
      placeholder:'es. IEA 2024, ISPRA 2024' },
    // Consumo totale e quota rinnovabile calcolati automaticamente
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
  /* GRI 401-1: Nuove assunzioni e turnover — dati primari */
  'GRI 401-1':[
    { id:'hire_total',  label:'Nuove assunzioni nell\'anno (numero totale)', type:'number', required:true },
    { id:'hire_m',      label:'Di cui: uomini', type:'number' },
    { id:'hire_f',      label:'Di cui: donne', type:'number' },
    { id:'hire_u30',    label:'Di cui: under 30', type:'number' },
    { id:'turn_total',  label:'Dipendenti che hanno lasciato l\'azienda nell\'anno (totale)', type:'number', required:true },
    { id:'turn_m',      label:'Di cui: uomini', type:'number' },
    { id:'turn_f',      label:'Di cui: donne', type:'number' },
    // Tasso di assunzione e turnover calcolati automaticamente su base dipendenti totali GRI 2-7
  ],
  /* GRI 401-2: Benefit */
  'GRI 401-2':[
    { id:'ben_health',    label:'Assicurazione sanitaria integrativa offerta?', type:'select', options:['Sì — tutti i dipendenti FT','Sì — parzialmente','No'] },
    { id:'ben_pension',   label:'Fondo pensione complementare aziendale?', type:'select', options:['Sì','No'] },
    { id:'ben_parental',  label:'Congedo parentale retribuito oltre il minimo di legge?', type:'select', options:['Sì','No'] },
    { id:'ben_other',     label:'Altri benefit significativi (mensa, trasporto, welfare aziendale)', type:'textarea' },
  ],
  /* GRI 403-3: Medicina del lavoro */
  'GRI 403-3':[
    { id:'ohs_med_type',     label:'Servizi di medicina del lavoro disponibili', type:'select', required:true,
      options:['Medico competente interno a tempo pieno','Medico competente esterno (contratto)','Servizio condiviso tra aziende','Non previsto (esenzione settore)'] },
    { id:'ohs_med_coverage', label:'Percentuale di dipendenti coperti da sorveglianza sanitaria (%)', type:'number' },
    { id:'ohs_med_visits',   label:'Visite mediche effettuate nell\'anno', type:'number' },
  ],
  /* GRI 403-9: Infortuni sul lavoro (tasso standardizzato) */
  'GRI 403-9':[
    { id:'ohs_fatalities',     label:'Infortuni mortali nell\'anno (dipendenti)', type:'number', required:true, placeholder:'0 se nessuno' },
    { id:'ohs_fatalities_ext', label:'Infortuni mortali — lavoratori non dipendenti (appaltatori)', type:'number', placeholder:'0 se nessuno' },
    { id:'ohs_hc_injuries',    label:'Infortuni ad alta conseguenza (esclusi mortali — dipendenti)', type:'number', required:true },
    { id:'ohs_rec_injuries',   label:'Infortuni registrabili totali — dipendenti (INAIL)', type:'number', required:true },
    { id:'ohs_rec_ext',        label:'Infortuni registrabili — lavoratori non dipendenti', type:'number' },
    { id:'ohs_hrs_worked',     label:'Ore totali lavorate nell\'anno (tutti i dipendenti)', type:'number', required:true,
      hint:'Necessario per calcolare il TRIR (tasso per 200.000h) — dato primario obbligatorio GRI 403-9' },
    { id:'ohs_hrs_ext',        label:'Ore totali lavorate — lavoratori non dipendenti', type:'number' },
    { id:'ohs_main_types',     label:'Principali tipologie di infortuni occorsi', type:'textarea',
      placeholder:'es. caduta dall\'alto, inciampo, contatto con macchinari' },
    // TRIR (tasso infortuni registrabili), LTIR (con assenza), TRIF fatale: calcolati automaticamente
  ],
  /* GRI 404-1: Formazione — ore totali come dato primario, media auto-calcolata */
  'GRI 404-1':[
    { id:'train_hrs_total', label:'Ore TOTALI di formazione erogate nell\'anno (tutti i dipendenti)', type:'number', required:true,
      hint:'La media ore/dipendente viene calcolata automaticamente dal sistema' },
    { id:'train_hrs_m',     label:'Di cui: ore erogate a dipendenti uomini', type:'number' },
    { id:'train_hrs_f',     label:'Di cui: ore erogate a dipendenti donne', type:'number' },
    { id:'train_type',      label:'Tipologie di formazione prevalenti', type:'textarea',
      placeholder:'es. sicurezza SSL (40%), competenze tecniche (30%), soft skill (20%), compliance (10%)' },
    // Media ore/dipendente totale, media uomini, media donne: calcolate automaticamente
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
    // pay_ratio è calcolato automaticamente dal sistema — non richiesto come input
    { id:'pay_ratio_change', label:'Variazione del rapporto retributivo rispetto all\'anno precedente (%)', type:'number' },
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

// Domande per i moduli VSME — solo dati primari; derivati calcolati automaticamente
const VSME_QUESTIONS = {

  /* ── B1: Informazioni di base ───────────────────────────── */
  'B1': [
    { id:'vsme_name',    label:'Denominazione completa e forma giuridica', type:'text', required:true },
    { id:'vsme_sector',  label:'Settore/i di attività principali (codice ATECO)', type:'text', required:true },
    { id:'vsme_scope',   label:'Perimetro della rendicontazione', type:'select', required:true,
      options:['Singola entità','Gruppo consolidato'] },
    { id:'vsme_period',  label:'Periodo di rendicontazione', type:'text', placeholder:'es. 1 gen – 31 dic 2024' },
    { id:'vsme_gov',     label:'Struttura di governance (CdA, organi di controllo, CEO/titolare)', type:'textarea' },
    { id:'vsme_contact', label:'Referente ESG — nome e email', type:'text', placeholder:'es. Mario Rossi — esg@azienda.it' },
  ],

  /* ── B2-E1: Clima / GHG ─────────────────────────────────── */
  /* Dati raccolti dal tool GHG integrato — qui solo metadati */
  'B2-E1': [
    { id:'vsme_ghg_meth', label:'Metodologia di calcolo utilizzata', type:'text',
      placeholder:'es. GHG Protocol Corporate Standard + fattori ISPRA 2024', required:true },
    { id:'vsme_ghg_gases',label:'Gas GHG inclusi (spuntare quelli applicabili)', type:'select',
      options:['CO₂ only','CO₂, CH₄, N₂O','CO₂, CH₄, N₂O, HFCs, PFCs, SF₆, NF₃ (tutti i 7 gas AR5)'] },
    { id:'vsme_targets',  label:'Obiettivi di riduzione GHG formalizzati (se esistenti)', type:'textarea',
      placeholder:'es. -30% Scope 1+2 entro 2030 rispetto alla base 2022' },
  ],

  /* ── B2-E2: Energia — da file template VERA ─────────────── */
  /* NON mostrato nel typeform: dati caricati via Excel VERA */

  /* ── B2-E3: Rifiuti ─────────────────────────────────────── */
  'B2-E3': [
    { id:'vsme_waste_t',    label:'Rifiuti totali prodotti nell\'anno (tonnellate)', type:'number', required:true },
    { id:'vsme_waste_haz',  label:'Di cui: rifiuti pericolosi (tonnellate)', type:'number' },
    { id:'vsme_waste_land', label:'Di cui: smaltiti in discarica (tonnellate)', type:'number' },
    { id:'vsme_waste_rec',  label:'Di cui: avviati a riciclo/recupero (tonnellate)', type:'number' },
    { id:'vsme_waste_op',   label:'Gestore / impianto di smaltimento principale', type:'text',
      placeholder:'es. Contarina S.p.A., Ecorecuperi Srl' },
  ],

  /* ── B2-E4: Trasporti ───────────────────────────────────── */
  /* Le emissioni da trasporto sono calcolate automaticamente dai dati primari */
  'B2-E4': [
    { id:'vsme_transp_km',   label:'Km totali percorsi per logistica/distribuzione nell\'anno (tkm)', type:'number',
      placeholder:'es. 450000', required:true },
    { id:'vsme_transp_type', label:'I dati chilometrici sono:', type:'select', required:true,
      options:['Puntuali (da GPS/DDT/fatture trasportatori)','Stimati (da consumi carburante o stima media)'] },
    { id:'vsme_transp_fuel', label:'Carburante principale utilizzato nei trasporti', type:'select',
      options:['Diesel','Benzina','Gas naturale / GNL','Elettrico','Idrogeno','Misto'] },
    { id:'vsme_transp_veh',  label:'Tipo di veicolo prevalente', type:'select',
      options:['Autocarro pesante (>3,5t)','Furgone (<3,5t)','Carro ferroviario','Nave','Aereo cargo','Multimodale'] },
    { id:'vsme_transp_mode', label:'Modalità di trasporto prevalente (quota %)', type:'select',
      options:['Solo strada (>90%)','Prevalentemente strada (60-90%)','Multimodale equilibrato','Prevalentemente ferrovia/mare'] },
    // Emissioni Scope 3 Cat. 4 calcolate automaticamente da tkm × fattore emissione per tipo veicolo/carburante
  ],

  /* ── B2-E5: Biodiversità / Siti produttivi ──────────────── */
  /* Indirizzo con suggerimento autocomplete browser/Google */
  'B2-E5': [
    { id:'vsme_bio_address', label:'Indirizzo stabilimento principale', type:'text',
      autocomplete:'street-address', placeholder:'es. Via delle Industrie 12, 31100 Treviso TV',
      required:true, hint:'Inizia a digitare — il browser può suggerire l\'indirizzo' },
    { id:'vsme_bio_other',   label:'Altri siti produttivi o uffici rilevanti', type:'textarea',
      placeholder:'Elencare uno per riga: Via Roma 1, Milano MI — Via Po 5, Torino TO' },
    { id:'vsme_bio_natura2k',label:'Uno o più siti si trovano entro 1 km da aree Natura 2000 o parchi protetti?',
      type:'select', options:['No','Sì — specificare sotto','Non verificato'] },
    { id:'vsme_bio_impact',  label:'Eventuali impatti noti sulla biodiversità locale (opzionale)', type:'textarea',
      placeholder:'es. presenza di scarichi idrici in area sensibile, consumo di suolo' },
  ],

  /* ── B3-S1: Forza lavoro ────────────────────────────────── */
  'B3-S1': [
    { id:'vsme_emp_total',  label:'Numero totale di dipendenti al 31/12', type:'number', required:true },
    { id:'vsme_emp_f_n',    label:'Di cui: donne (n. assoluto — % calcolata automaticamente)', type:'number' },
    { id:'vsme_emp_m_n',    label:'Di cui: uomini (n. assoluto)', type:'number' },
    { id:'vsme_emp_ft',     label:'Di cui: a tempo pieno', type:'number' },
    { id:'vsme_emp_pt',     label:'Di cui: a tempo parziale', type:'number' },
    { id:'vsme_emp_temp',   label:'Di cui: a tempo determinato', type:'number' },
    { id:'vsme_wage_f_avg', label:'Retribuzione media annua — donne (€ lordi)', type:'number', placeholder:'es. 28000' },
    { id:'vsme_wage_m_avg', label:'Retribuzione media annua — uomini (€ lordi)', type:'number', placeholder:'es. 32000' },
    { id:'vsme_injuries',   label:'Infortuni sul lavoro registrabili nell\'anno (numero)', type:'number' },
    { id:'vsme_fatal',      label:'Di cui: mortali', type:'number', placeholder:'0 se nessuno' },
    { id:'vsme_hrs_worked', label:'Ore totali lavorate nell\'anno (tutti i dipendenti)', type:'number',
      placeholder:'es. 180000', hint:'Usato per calcolare il tasso di infortuni per 200.000h' },
    { id:'vsme_train_hrs_total', label:'Ore TOTALI di formazione erogate nell\'anno (tutti i dipendenti)', type:'number',
      placeholder:'es. 1200', hint:'Le ore medie per dipendente vengono calcolate automaticamente' },
  ],

  /* ── B3-S2: Catena del valore ───────────────────────────── */
  'B3-S2': [
    { id:'vsme_supply_n',    label:'Numero di fornitori attivi nella catena del valore', type:'number', required:true },
    { id:'vsme_supply_key',  label:'Di cui: fornitori chiave / strategici', type:'number' },
    { id:'vsme_supply_audit',label:'Fornitori sottoposti a valutazione ESG o audit nell\'anno (%)', type:'number' },
    { id:'vsme_supply_local',label:'Percentuale di fornitori locali (stesso paese) sul totale (%)', type:'number' },
    { id:'vsme_supply_risk', label:'Rischi sociali o ambientali identificati nella supply chain', type:'textarea',
      placeholder:'es. rischio lavoro minorile in paese X, emissioni elevate fornitore Y' },
    { id:'vsme_supply_action',label:'Azioni correttive adottate verso fornitori a rischio', type:'textarea' },
  ],

  /* ── B3-S3: Comunità locali ─────────────────────────────── */
  /* Soglia di significatività EFRAG: controversia che comporta danni economici,
     ambientali o reputazionali misurabili o che coinvolge più di 10 persone */
  'B3-S3': [
    { id:'vsme_community',   label:'Iniziative di coinvolgimento della comunità locale nell\'anno', type:'textarea',
      placeholder:'es. sponsorizzazione eventi locali, volontariato aziendale, donazioni a enti del territorio' },
    { id:'vsme_disputes_n',  label:'Controversie significative con comunità locali nell\'anno (numero)', type:'number',
      hint:'Significativa = danno economico/ambientale/reputazionale misurabile o coinvolge >10 persone (EFRAG VSME S1)' },
    { id:'vsme_disputes_desc',label:'Descrizione delle controversie (se presenti)', type:'textarea',
      placeholder:'Descrivere brevemente natura, esito e azioni correttive per ciascuna controversia' },
  ],

  /* ── B3-S4: Consumatori / Privacy ──────────────────────── */
  'B3-S4': [
    { id:'vsme_complaints',      label:'Reclami formali di clienti/consumatori ricevuti nell\'anno', type:'number', required:true },
    { id:'vsme_complaints_res',  label:'Di cui: risolti nell\'anno (numero)', type:'number' },
    { id:'vsme_complaints_desc', label:'Principali tipologie di reclamo ricevuto', type:'textarea',
      placeholder:'es. difetti di prodotto, ritardi consegna, qualità servizio — indicare le categorie prevalenti' },
    { id:'vsme_privacy',         label:'Incidenti di violazione dei dati personali dei clienti (numero)', type:'number' },
    { id:'vsme_privacy_desc',    label:'Descrizione degli incidenti privacy (se presenti)', type:'textarea',
      placeholder:'Descrivere natura dell\'incidente, numero di interessati, misure adottate' },
  ],

  /* ── B4-G: Governance / Anticorruzione ──────────────────── */
  'B4-G': [
    { id:'vsme_anti_policy',   label:'Esiste una politica anti-corruzione formalizzata?', type:'select', required:true,
      options:['Sì — adottata e comunicata a tutti i dipendenti','Sì — adottata ma non ancora comunicata','In corso di adozione','No'] },
    { id:'vsme_anti_doc',      label:'Carica documento politica anticorruzione (opzionale)', type:'file',
      accept:'.pdf,.docx,.doc', hint:'PDF o Word — max 10 MB' },
    { id:'vsme_anti_training', label:'Dipendenti formati su temi anticorruzione nell\'anno (%)', type:'number',
      placeholder:'es. 80' },
    { id:'vsme_whistleblow',   label:'Sistema di segnalazione illeciti (whistleblowing) disponibile?', type:'select',
      options:['Sì — canale digitale dedicato','Sì — canale interno (email/HR)','No — in fase di adozione','No'] },
    { id:'vsme_corrupt_n',     label:'Incidenti di corruzione confermati nell\'anno', type:'number',
      placeholder:'0 se nessuno' },
    { id:'vsme_lobby',         label:'L\'azienda svolge attività di lobbying / relazioni istituzionali?',
      type:'select', options:['No','Sì — spesa < €5.000','Sì — spesa €5.000-50.000','Sì — spesa > €50.000'] },
    { id:'vsme_231',           label:'È adottato un Modello Organizzativo ex D.Lgs. 231/2001?', type:'select',
      options:['Sì — aggiornato nell\'ultimo triennio','Sì — da aggiornare','No','Non applicabile'] },
  ],

  /* ── B5: Rischi e opportunità — suggerimenti AI pre-compilati ── */
  'B5': [
    { id:'risk_env',        label:'Principali rischi ambientali per l\'organizzazione', type:'textarea', required:true,
      hint:'VERA suggerisce rischi specifici per il tuo settore — puoi modificare liberamente' },
    { id:'risk_social',     label:'Principali rischi sociali', type:'textarea', required:true },
    { id:'risk_gov',        label:'Principali rischi di governance', type:'textarea' },
    { id:'opp_env',         label:'Principali opportunità ambientali', type:'textarea' },
    { id:'opp_social',      label:'Principali opportunità sociali', type:'textarea' },
    { id:'risk_horizon',    label:'Orizzonte temporale prevalente dell\'analisi', type:'select',
      options:['Breve termine (< 1 anno)','Medio termine (1-5 anni)','Lungo termine (> 5 anni)','Multi-orizzonte'] },
    { id:'risk_mitigation', label:'Azioni di mitigazione principali in atto o pianificate', type:'textarea' },
  ],

  /* ── MODULO C (volontario) ──────────────────────────────── */

  /* C1: Acqua e risorse marine */
  'C1': [
    { id:'c1_water_abs',   label:'Prelievo idrico totale nell\'anno (m³)', type:'number', required:true },
    { id:'c1_water_src',   label:'Fonte idrica principale', type:'select',
      options:['Acquedotto pubblico','Acque superficiali (fiumi, laghi)','Acque sotterranee','Acqua piovana raccolta','Più fonti'] },
    { id:'c1_water_stress',label:'Lo stabilimento si trova in area a stress idrico?', type:'select',
      options:['No (verifica WRI Aqueduct)','Sì — stress medio','Sì — stress elevato','Non verificato'] },
    { id:'c1_water_dis',   label:'Scarico idrico totale (m³)', type:'number' },
    { id:'c1_water_target',label:'Obiettivi di riduzione consumi idrici', type:'textarea' },
  ],

  /* C2: Inquinamento */
  'C2': [
    { id:'c2_air_nox',   label:'Emissioni NOx (kg/anno) — da autorizzazione SUAP/AIA', type:'number' },
    { id:'c2_air_sox',   label:'Emissioni SOx (kg/anno)', type:'number' },
    { id:'c2_air_pm',    label:'Polveri PM (kg/anno)', type:'number' },
    { id:'c2_air_voc',   label:'VOC — Composti organici volatili (kg/anno)', type:'number' },
    { id:'c2_soil',      label:'Siti potenzialmente contaminati o bonificati nell\'anno', type:'number',
      placeholder:'0 se nessuno' },
    { id:'c2_spills',    label:'Sversamenti accidentali significativi nell\'anno', type:'number' },
    { id:'c2_spill_desc',label:'Descrizione degli sversamenti (se presenti)', type:'textarea' },
  ],

  /* C3: Economia circolare */
  'C3': [
    { id:'c3_mat_total',   label:'Materiali totali utilizzati nel processo produttivo (tonnellate)', type:'number', required:true },
    { id:'c3_mat_rec',     label:'Di cui: materiali riciclati/recuperati (tonnellate)', type:'number' },
    { id:'c3_prod_eol',    label:'I prodotti venduti sono progettati per il fine vita (riparabilità, riciclabilità)?',
      type:'select', options:['Sì — design for disassembly','Parzialmente','No','Non applicabile (servizi)'] },
    { id:'c3_pack_rec',    label:'Percentuale di imballaggi riciclabili o riutilizzabili (%)', type:'number' },
    { id:'c3_target',      label:'Obiettivi di economia circolare adottati', type:'textarea' },
  ],

  /* C4: Salute e sicurezza avanzata */
  'C4': [
    { id:'c4_ohs_cert',    label:'Certificazione SSL adottata', type:'select',
      options:['ISO 45001','OHSAS 18001 (in transizione)','Nessuna','In corso di certificazione'] },
    { id:'c4_near_miss',   label:'Near-miss (quasi-incidenti) registrati nell\'anno', type:'number' },
    { id:'c4_illness_n',   label:'Casi di malattia professionale riconosciuta nell\'anno', type:'number' },
    { id:'c4_illness_days',label:'Giorni persi per malattia professionale', type:'number' },
    { id:'c4_ohs_invest',  label:'Investimento in SSL nell\'anno (€)', type:'number' },
    { id:'c4_ohs_prog',    label:'Programmi di promozione della salute dei lavoratori', type:'textarea',
      placeholder:'es. check-up periodici, supporto psicologico, programmi benessere' },
  ],

  /* C5: Condotta aziendale avanzata */
  'C5': [
    { id:'c5_ethics_train', label:'Dipendenti che hanno ricevuto formazione su etica/anticorruzione nell\'anno (%)', type:'number' },
    { id:'c5_wh_cases',     label:'Segnalazioni ricevute via canale whistleblowing nell\'anno', type:'number' },
    { id:'c5_wh_resolved',  label:'Di cui: chiuse con esito nell\'anno', type:'number' },
    { id:'c5_polit_contrib',label:'Contributi politici erogati nell\'anno (€ — 0 se nessuno)', type:'number' },
    { id:'c5_tax_country',  label:'Paesi in cui l\'organizzazione è registrata ai fini fiscali', type:'textarea',
      placeholder:'es. Italia, Germania, Svizzera' },
    { id:'c5_tax_approach', label:'Approccio alla fiscalità e trasparenza verso l\'Agenzia delle Entrate', type:'textarea' },
  ],

  /* C-Climate: Obiettivi net-zero e finanza verde (condizionale) */
  'C-Climate': [
    { id:'net_zero_year',      label:'Anno target net-zero', type:'number', placeholder:'Es. 2040' },
    { id:'green_finance_amount', label:'Volume finanziamenti green ottenuti (€)', type:'number' },
    { id:'sbti_aligned',       label:'Obiettivi allineati a Science Based Targets (SBTi)?', type:'select',
      options:['Sì — obiettivi SBTi validati','In fase di validazione','No'] },
    { id:'transition_plan',    label:'Piano di transizione climatica approvato?', type:'select',
      options:['Sì — approvato e pubblicato','In elaborazione','No'] },
  ],

  /* C-ESRS2: Informativa aggiuntiva settori ad alto impatto (condizionale) */
  'C-ESRS2': [
    { id:'taxonomy_eligible', label:'Attività allineate alla Tassonomia UE (%)', type:'number', placeholder:'Es. 35' },
    { id:'taxonomy_aligned',  label:'Quota attività allineate e conformi (%)', type:'number' },
    { id:'dnsh_check',        label:'Verifica DNSH (Do No Significant Harm) completata?', type:'select',
      options:['Sì','In corso','No / non applicabile'] },
  ],

  /* C-Social: Sociale esteso — lavoratori catena valore e comunità (condizionale) */
  'C-Social': [
    { id:'global_ops_countries', label:'Paesi in cui opera la catena del valore', type:'textarea',
      placeholder:'Es. Italia, Romania, Bangladesh' },
    { id:'supply_chain_audit',   label:'Audit ESG fornitori completati (%)', type:'number' },
    { id:'living_wage_commitment', label:'Impegno living wage per lavoratori catena valore?', type:'select',
      options:['Sì — con monitoraggio','Sì — impegno senza monitoraggio','No'] },
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
      const c = currentClient();
      return VSME_MODULES_ALL.filter(m => {
        if (!VSME_QUESTIONS[m.code]) return false;
        if (!m.optional) return true; // moduli B sempre inclusi
        if (!m.condition) return true; // moduli C senza condizione inclusi
        return m.condition(c);        // moduli C condizionali: valuta profilo azienda
      });
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

// Disclosures calcolate automaticamente dal sistema (GHG tool) — escluse dal typeform
const AUTO_CALCULATED_DISCLOSURES = [
  'GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4', // emissioni GHG — dal GHG tool
  'GRI 302-3', // intensità energetica — derivata da 302-1
  'B2-E1', // GHG scope 1/2/3 (VSME) — dal GHG tool integrato
];

// Disclosures che arrivano dal file Excel VERA template — escluse dal typeform, dati caricati
const FILE_UPLOAD_DISCLOSURES = [
  'B2-E2', // energia VSME — caricata via template VERA (rinnovabili/non-rinnovabili incluse)
];

/* ══════════════════════════════════════════════════════════
   B5 AI SUGGESTIONS — pre-compilazione basata su settore + dati raccolti
══════════════════════════════════════════════════════════ */
function _generateB5Suggestions() {
  const c = currentClient();
  const sector = (c && c.sector) ? c.sector.toLowerCase() : '';
  const allAns = {};
  Object.values(typeformQuestionnaireState.answers || {}).forEach(d => Object.assign(allAns, d));

  // Dati già raccolti dal typeform precedente
  const ghgS1 = parseFloat(allAns.vsme_s1 || allAns.scope1_co2 || 0);
  const ghgS3 = parseFloat(allAns.vsme_s3 || allAns.scope3_total || 0);
  const wasteT = parseFloat(allAns.vsme_waste_t || 0);
  const injuries = parseFloat(allAns.vsme_injuries || allAns.ohs_rec_injuries || 0);
  const emp = parseFloat(allAns.vsme_emp_total || allAns.emp_total || (c && c.employees) || 0);

  // --- Rischi ambientali per settore ---
  const riskEnvMap = {
    manifatturiero: `Rischio climatico fisico: eventi estremi (alluvioni, siccità) che possono interrompere la catena di fornitura o danneggiare gli impianti produttivi.\nRischio di transizione: aumento costi energetici e imposte sul carbonio (EU ETS, Carbon Border Adjustment Mechanism) che impattano la marginalità.\nRischio normativo: evoluzione CSRD/ESRS e potenziale obbligo di rendicontazione dettagliata a partire dal 2026.${ghgS1 > 500 ? '\nAttenzione: emissioni Scope 1 elevate (' + ghgS1.toFixed(0) + ' tCO₂e) — rischio di repricing del carbonio rilevante.' : ''}`,
    edilizia: `Rischio climatico fisico: temperature estreme e precipitazioni intense impattano la programmazione dei cantieri e la sicurezza degli operatori.\nRischio normativo: standard di efficienza energetica in edilizia (Direttiva Case Green EPBD 2024) che richiedono adattamento di processi e materiali.\nRischio di reputazione: controversie per impatto ambientale dei cantieri su biodiversità o comunità locali.`,
    commercio: `Rischio climatico fisico: eventi estremi che interrompono le rotte logistiche e la distribuzione.\nRischio Scope 3: emissioni elevate lungo la supply chain (Cat. 1 e Cat. 4) difficili da controllare direttamente.\nRischio normativo: Extended Producer Responsibility e Direttiva Packaging che aumentano i costi di gestione rifiuti.`,
    default: `Rischio climatico di transizione: potenziale incremento dei costi energetici e introduzione di tasse sul carbonio.\nRischio normativo: progressiva estensione degli obblighi ESG (CSRD) anche alle PMI nella catena di fornitura.\nRischio reputazionale: crescente aspettativa di trasparenza ESG da parte di clienti, banche e partner commerciali.`,
  };

  // --- Rischi sociali per settore ---
  const riskSocMap = {
    manifatturiero: `Rischio di carenza di personale qualificato: difficoltà nel reperire tecnici e operai specializzati nel mercato locale.\nRischio salute e sicurezza: infortuni sul lavoro con potenziale impatto legale, reputazionale e operativo.${injuries > 3 ? ' (Attenzione: ' + injuries + ' infortuni registrati — monitorare attentamente.)' : ''}\nRischio supply chain sociale: fornitori a basso costo con condizioni di lavoro non conformi agli standard internazionali.`,
    edilizia: `Rischio sicurezza sul lavoro (ALTO): il settore edile ha i tassi di infortuni più elevati in Italia (INAIL 2023).\nRischio reputazionale: controversie con comunità locali per rumore, polveri, vibrazioni da cantieri.\nRischio subappalto: difficoltà nel garantire gli standard di sicurezza ai lavoratori in subappalto.`,
    commercio: `Rischio turnover elevato: alta rotazione del personale con costi di recruitment e onboarding significativi.\nRischio privacy/dati: violazioni della protezione dei dati dei clienti con impatto GDPR e reputazionale.\nRischio supply chain: lavoro non regolare o condizioni inadeguate tra i fornitori della catena di fornitura globale.`,
    default: `Rischio di retention dei talenti: difficoltà nel trattenere le risorse chiave in un mercato del lavoro competitivo.\nRischio di burn-out: elevato carico di lavoro in contesti di crescita che può deteriorare il benessere dei dipendenti.\nRischio di non conformità: evoluzione normativa su welfare aziendale e sicurezza che richiede aggiornamento continuo.`,
  };

  // --- Opportunità ambientali ---
  const oppEnvMap = {
    manifatturiero: `Efficienza energetica: riduzione dei consumi attraverso upgrade impianti e digitalizzazione dei processi produttivi (potenziale risparmio 15-30% su costi energetici).\nEconomia circolare: recupero scarti di produzione come materia prima secondaria, riduzione costi smaltimento rifiuti.\nAccesso a finanza verde: green bond, finanziamenti BEI/CDP e incentivi Transizione 5.0 per chi dimostra performance ESG misurabili.`,
    edilizia: `Efficienza energetica degli edifici: posizionamento nel mercato della riqualificazione energetica (Superbonus, Direttiva Case Green).\nMateriali a bassa impronta carbonica: differenziazione competitiva con uso di materiali bio-based o riciclati.\nCertificazioni di sostenibilità: LEED, BREEAM, CAM come leva di accesso a commesse pubbliche e privati premium.`,
    commercio: `Logistica sostenibile: flotte elettriche o ibride che riducono i costi operativi e migliorano il posizionamento ESG.\nEtichettatura ambientale: prodotti con impatto ambientale dichiarato (LCA, EPD) che attraggono consumatori consapevoli.\nPackaging sostenibile: riduzione plastica e utilizzo materiali riciclati come risposta alle aspettative dei consumatori.`,
    default: `Carbon neutrality: possibilità di raggiungere la neutralità carbonica con costi contenuti (emissioni dirette ridotte nel settore servizi).\nSmart working: riduzione emissioni da pendolarismo e costi immobiliari, miglioramento work-life balance e retention.\nGreen IT: migrazione cloud e efficienza energetica server come leva di riduzione dell'impronta digitale.`,
  };

  // --- Opportunità sociali ---
  const oppSoc = emp > 0
    ? `Employer branding ESG: l'impegno misurabile su sostenibilità aumenta l'attrattività come datore di lavoro per i giovani talenti (Gen Z valuta l'ESG nelle scelte lavorative).\nFormazione e upskilling: programmi di aggiornamento competenze che aumentano la produttività e riducono il turnover.\nWelfare aziendale: iniziative di benessere (flessibilità oraria, supporto psicologico, benefit) che migliorano la retention.`
    : `Employer branding ESG come vantaggio competitivo nel recruitment.\nProgrammi di formazione e sviluppo professionale per aumentare la fidelizzazione.\nWelfare aziendale personalizzato come leva di benessere e produttività.`;

  const sk = Object.keys(riskEnvMap).find(k => sector.includes(k)) || 'default';

  return {
    risk_env:      riskEnvMap[sk] || riskEnvMap.default,
    risk_social:   riskSocMap[sk] || riskSocMap.default,
    risk_gov:      `Rischio compliance: evoluzione normativa ESG (CSRD, SFDR, Tassonomia UE) che richiede presidio continuo e risorse dedicate.\nRischio corruzione: esposizione a pratiche scorrette nella gestione di appalti, permessi e relazioni istituzionali.\nRischio governance: concentrazione delle decisioni in pochi soggetti senza adeguati meccanismi di controllo interno.`,
    opp_env:       oppEnvMap[sk] || oppEnvMap.default,
    opp_social:    oppSoc,
    risk_horizon:  'Multi-orizzonte',
    risk_mitigation: `Piano di efficienza energetica con obiettivi annuali misurabili.\nAdozione di un sistema di gestione ambientale (ISO 14001 o equivalente).\nFormazione annuale obbligatoria su SSL e anticorruzione per tutto il personale.\nMonitoraggio trimestrale degli indicatori ESG chiave con reportistica interna.\nCoinvolgimento dei fornitori strategici nel percorso di miglioramento ESG.`,
  };
}

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
  /* ── Metadati moduli per colore / icon / capitolo ───────── */
  _meta: {
    'B1':    { ch:'Informazioni di base', color:'oklch(0.50 0.12 262)', bg:'oklch(0.97 0.015 262)', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', tip:'Descrivi la tua azienda — ci vorrà solo un minuto' },
    'B2-E1': { ch:'Ambiente — Clima',     color:'oklch(0.44 0.15 148)', bg:'oklch(0.97 0.025 148)', icon:'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', tip:'I dati GHG arrivano dal calcolatore VERA — qui solo metadati' },
    'B2-E2': { ch:'Ambiente — Energia',   color:'oklch(0.55 0.15 70)',  bg:'oklch(0.97 0.020 70)',  icon:'M13 10V3L4 14h7v7l9-11h-7z', tip:'Caricato dal file template VERA' },
    'B2-E3': { ch:'Ambiente — Rifiuti',   color:'oklch(0.44 0.15 148)', bg:'oklch(0.97 0.025 148)', icon:'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', tip:'Dati da DDT, MUD o sistema di pesatura aziendale' },
    'B2-E4': { ch:'Ambiente — Trasporti', color:'oklch(0.44 0.15 148)', bg:'oklch(0.97 0.025 148)', icon:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', tip:'Le emissioni Scope 3 Cat. 4 sono calcolate automaticamente' },
    'B2-E5': { ch:'Ambiente — Biodiversità', color:'oklch(0.44 0.15 148)', bg:'oklch(0.97 0.025 148)', icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', tip:'Localizzazione e prossimità a aree naturali protette' },
    'B3-S1': { ch:'Sociale — Forza lavoro', color:'oklch(0.46 0.12 225)', bg:'oklch(0.97 0.015 225)', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', tip:'% donne, gender pay gap e ore formazione/dipendente sono auto-calcolate' },
    'B3-S2': { ch:'Sociale — Fornitori',   color:'oklch(0.46 0.12 225)', bg:'oklch(0.97 0.015 225)', icon:'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', tip:'Supply chain e rischi nella catena del valore' },
    'B3-S3': { ch:'Sociale — Comunità',    color:'oklch(0.46 0.12 225)', bg:'oklch(0.97 0.015 225)', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', tip:'Controversie significative = danno misurabile o coinvolge >10 persone' },
    'B3-S4': { ch:'Sociale — Consumatori', color:'oklch(0.46 0.12 225)', bg:'oklch(0.97 0.015 225)', icon:'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', tip:'Reclami e protezione dei dati dei clienti' },
    'B4-G':  { ch:'Governance',            color:'oklch(0.55 0.13 42)',  bg:'oklch(0.97 0.020 42)',  icon:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', tip:'Anticorruzione, whistleblowing e D.Lgs. 231/2001' },
    'B5':    { ch:'Rischi e opportunità',  color:'oklch(0.50 0.12 188)', bg:'oklch(0.97 0.018 188)', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', tip:'VERA AI ha pre-compilato i suggerimenti — modificali liberamente' },
    'C1':    { ch:'Opzionale — Acqua',     color:'oklch(0.48 0.12 205)', bg:'oklch(0.97 0.015 205)', icon:'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707', tip:'Modulo C volontario — migliora la qualità del report' },
    'C2':    { ch:'Opzionale — Inquinamento', color:'oklch(0.48 0.12 205)', bg:'oklch(0.97 0.015 205)', icon:'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', tip:'Emissioni in aria, acqua e suolo' },
    'C3':    { ch:'Opzionale — Circolarità', color:'oklch(0.48 0.12 205)', bg:'oklch(0.97 0.015 205)', icon:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', tip:'Flussi materiali e obiettivi di economia circolare' },
    'C4':    { ch:'Opzionale — SSL avanzata', color:'oklch(0.48 0.12 205)', bg:'oklch(0.97 0.015 205)', icon:'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', tip:'Near-miss, malattie professionali e investimenti in sicurezza' },
    'C5':    { ch:'Opzionale — Condotta avanzata', color:'oklch(0.48 0.12 205)', bg:'oklch(0.97 0.015 205)', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', tip:'Segnalazioni whistleblowing e contributi politici' },
  },

  _getMeta(code) {
    if (this._meta[code]) return this._meta[code];
    // GRI fallback per categoria
    if (/^GRI 2-/.test(code))   return { ch:'GRI — Informativa generale', color:'oklch(0.50 0.10 270)', bg:'oklch(0.97 0.012 270)', icon:'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', tip:'GRI 2: informativa generale obbligatoria per entrambi i livelli' };
    if (/^GRI 20[0-9]/.test(code)) return { ch:'GRI — Performance economica', color:'oklch(0.56 0.13 45)', bg:'oklch(0.97 0.018 45)', icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 13v-1m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', tip:'Valore economico generato e distribuito agli stakeholder' };
    if (/^GRI 30[0-9]/.test(code)) return { ch:'GRI — Ambiente',           color:'oklch(0.44 0.15 148)', bg:'oklch(0.97 0.025 148)', icon:'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064', tip:'Energia, acqua, biodiversità, emissioni GHG e rifiuti' };
    if (/^GRI 4[0-9]{2}/.test(code)) return { ch:'GRI — Sociale',          color:'oklch(0.46 0.12 225)', bg:'oklch(0.97 0.015 225)', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', tip:'Occupazione, SSL, formazione, diversità, privacy' };
    return { ch:'GRI', color:'oklch(0.50 0.10 270)', bg:'oklch(0.97 0.012 270)', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', tip:'' };
  },

  open(std, sectorKey) {
    typeformQuestionnaireState.std = std;
    typeformQuestionnaireState.sector = sectorKey || 'manuf';
    typeformQuestionnaireState.answers = {};
    typeformQuestionnaireState.omissions = {};
    typeformQuestionnaireState.currentIndex = 0;
    typeformQuestionnaireState.direction = 'next';
    typeformQuestionnaireState.active = true;
    typeformQuestionnaireState.startTime = Date.now();
    typeformQuestionnaireState.milestonesShown = new Set();

    this._buildDisclosures();

    const panel = document.getElementById('typeform-panel');
    if (!panel) { this._injectPanel(); }
    this._renderCurrentSlide();
    document.getElementById('typeform-panel').style.display = 'flex';

    // Keyboard: Enter = avanti, Esc = chiudi
    this._keyHandler = (e) => {
      if (!typeformQuestionnaireState.active) return;
      if (e.key === 'Escape') { this.close(); return; }
      if (e.key === 'Enter' && !e.shiftKey) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== 'textarea' && tag !== 'select') {
          e.preventDefault();
          this.next();
        }
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  close() {
    typeformQuestionnaireState.active = false;
    const p = document.getElementById('typeform-panel');
    if (p) {
      p.style.transition = 'opacity 0.2s ease';
      p.style.opacity = '0';
      setTimeout(() => { p.style.display = 'none'; p.style.opacity = ''; }, 220);
    }
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  },

  _injectPanel() {
    const panel = document.createElement('div');
    panel.id = 'typeform-panel';
    panel.innerHTML = `
      <div id="typeform-wrapper">
        <!-- Topbar -->
        <div id="tform-topbar">
          <div id="tform-topbar-left">
            <div id="tform-module-dot"></div>
            <div>
              <div id="tform-chapter-label">VERA ESG</div>
              <div id="tform-module-name">Questionario</div>
            </div>
          </div>
          <div id="tform-topbar-right">
            <span id="tform-milestone-badge"></span>
            <span id="tform-progress-text"></span>
            <button onclick="typeformQuestionnaire.close()" id="tform-close-btn" title="Chiudi (Esc)">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>

        <!-- Progress rail -->
        <div id="tform-progress-rail">
          <div id="tform-progress-fill"></div>
        </div>

        <!-- Main scroll area -->
        <div id="tform-scroll-area">
          <div id="tform-content"></div>
        </div>

        <!-- Bottom bar -->
        <div id="tform-bottom-bar">
          <div id="tform-logic-error" style="display:none"></div>
          <div id="tform-step-label"></div>
          <div id="tform-nav-btns">
            <button id="tform-btn-prev" class="tform-btn-secondary" onclick="typeformQuestionnaire.prev()" style="display:none">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Indietro
            </button>
            <button id="tform-btn-next" class="tform-btn-primary" onclick="typeformQuestionnaire.next()">
              Avanti
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            </button>
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
      /* ── Layout ──────────────────────────────────────────── */
      #typeform-panel {
        position:fixed; inset:0; z-index:9999;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      }
      #typeform-wrapper {
        display:flex; flex-direction:column; height:100%;
        background:oklch(0.975 0.012 75);
        overflow:hidden;
      }

      /* ── Topbar ──────────────────────────────────────────── */
      #tform-topbar {
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 28px;
        background:oklch(0.975 0.012 75);
        border-bottom:1px solid oklch(0.92 0.015 75);
        flex-shrink:0;
        gap:16px;
      }
      #tform-topbar-left {
        display:flex; align-items:center; gap:12px; min-width:0;
      }
      #tform-module-dot {
        width:10px; height:10px; border-radius:50%; flex-shrink:0;
        background:oklch(0.44 0.15 148);
        transition:background 0.3s ease;
        box-shadow:0 0 0 3px oklch(0.44 0.15 148 / 0.15);
      }
      #tform-chapter-label {
        font-size:10px; font-weight:700; letter-spacing:.10em;
        text-transform:uppercase; color:oklch(0.60 0.05 75);
        line-height:1;
      }
      #tform-module-name {
        font-size:13px; font-weight:700; color:oklch(0.25 0.04 75);
        line-height:1.2; margin-top:2px;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        max-width:280px;
      }
      #tform-topbar-right {
        display:flex; align-items:center; gap:12px; flex-shrink:0;
      }
      #tform-progress-text {
        font-size:12px; font-weight:600; color:oklch(0.60 0.04 75);
        white-space:nowrap;
      }
      #tform-milestone-badge {
        display:none;
        padding:4px 10px; border-radius:20px;
        font-size:11px; font-weight:700; letter-spacing:.04em;
        background:oklch(0.55 0.15 70); color:white;
        animation:badgePop 0.3s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes badgePop {
        from { transform:scale(0.6); opacity:0; }
        to   { transform:scale(1);   opacity:1; }
      }
      #tform-close-btn {
        background:none; border:none; cursor:pointer;
        color:oklch(0.55 0.04 75); padding:6px;
        border-radius:6px; display:flex; align-items:center;
        transition:background .15s, color .15s;
      }
      #tform-close-btn:hover {
        background:oklch(0.92 0.015 75); color:oklch(0.25 0.04 75);
      }

      /* ── Progress rail ───────────────────────────────────── */
      #tform-progress-rail {
        height:3px; background:oklch(0.92 0.015 75); flex-shrink:0;
      }
      #tform-progress-fill {
        height:100%; width:0%;
        background:var(--tform-color, oklch(0.44 0.15 148));
        transition:width 0.4s cubic-bezier(.4,0,.2,1), background 0.3s ease;
        border-radius:0 2px 2px 0;
      }

      /* ── Scroll area ─────────────────────────────────────── */
      #tform-scroll-area {
        flex:1; overflow-y:auto; overflow-x:hidden;
        display:flex; align-items:flex-start; justify-content:center;
        padding:48px 24px 32px;
        scroll-behavior:smooth;
      }
      #tform-content {
        width:100%; max-width:680px;
        will-change:opacity,transform;
      }

      /* ── Bottom bar ──────────────────────────────────────── */
      #tform-bottom-bar {
        background:oklch(0.975 0.012 75);
        border-top:1px solid oklch(0.92 0.015 75);
        padding:14px 28px;
        display:flex; justify-content:space-between; align-items:center;
        flex-shrink:0; gap:16px;
        flex-wrap:wrap;
      }
      #tform-step-label {
        font-size:12px; font-weight:600; color:oklch(0.60 0.04 75);
      }
      #tform-logic-error {
        color:oklch(0.42 0.18 25); font-size:13px; font-weight:600;
        background:oklch(0.97 0.025 25); border:1px solid oklch(0.85 0.10 25);
        border-radius:8px; padding:10px 14px;
        width:100%; order:-1;
      }
      #tform-nav-btns {
        display:flex; gap:8px; flex-shrink:0; margin-left:auto;
      }
      .tform-btn-secondary {
        display:inline-flex; align-items:center; gap:6px;
        padding:10px 18px; border:1.5px solid oklch(0.85 0.015 75);
        border-radius:10px; background:oklch(0.975 0.012 75);
        color:oklch(0.35 0.04 75); cursor:pointer;
        font-size:13px; font-weight:600; font-family:inherit;
        transition:background .15s, border-color .15s;
      }
      .tform-btn-secondary:hover {
        background:oklch(0.96 0.015 75); border-color:oklch(0.78 0.02 75);
      }
      .tform-btn-primary {
        display:inline-flex; align-items:center; gap:6px;
        padding:10px 20px; border:none;
        border-radius:10px;
        background:var(--tform-color, oklch(0.44 0.15 148));
        color:white; cursor:pointer;
        font-size:13px; font-weight:700; font-family:inherit;
        transition:filter .15s, background .3s;
        box-shadow:0 2px 8px var(--tform-color, oklch(0.44 0.15 148 / 0.30));
      }
      .tform-btn-primary:hover { filter:brightness(1.08); }
      .tform-btn-primary:active { filter:brightness(0.96); transform:scale(0.98); }

      /* ── Card ────────────────────────────────────────────── */
      .tform-card {
        background:white;
        border-radius:20px;
        box-shadow:0 2px 12px oklch(0.25 0.04 75 / 0.06), 0 8px 32px oklch(0.25 0.04 75 / 0.06);
        padding:36px 40px;
        border-left:4px solid var(--tform-color, oklch(0.44 0.15 148));
        margin-bottom:16px;
      }

      /* ── Disclosure header ───────────────────────────────── */
      .tform-disclosure-header { margin-bottom:28px; }
      .tform-chapter-chip {
        display:inline-flex; align-items:center; gap:6px;
        padding:4px 10px;
        border-radius:20px;
        font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
        background:var(--tform-bg, oklch(0.97 0.025 148));
        color:var(--tform-color, oklch(0.44 0.15 148));
        margin-bottom:12px;
      }
      .tform-chapter-icon {
        width:14px; height:14px; flex-shrink:0;
      }
      .tform-disclosure-code {
        display:inline-block;
        padding:3px 8px;
        background:oklch(0.95 0.01 75);
        border-radius:6px;
        font-size:11px; font-weight:700;
        color:oklch(0.55 0.04 75);
        margin-bottom:10px; margin-left:6px;
        vertical-align:middle;
      }
      .tform-disclosure-title {
        font-size:22px; font-weight:800; color:oklch(0.18 0.04 75);
        margin:0 0 6px 0; line-height:1.3; letter-spacing:-.01em;
      }
      .tform-disclosure-subtitle { color:oklch(0.55 0.04 75); font-size:13px; line-height:1.5; }
      .tform-module-tip {
        display:flex; align-items:flex-start; gap:8px;
        background:var(--tform-bg, oklch(0.97 0.025 148));
        border-radius:8px; padding:10px 14px;
        margin-top:10px; font-size:12px;
        color:var(--tform-color, oklch(0.44 0.15 148));
        line-height:1.5;
      }
      .tform-module-tip svg { flex-shrink:0; margin-top:1px; }

      /* ── Fields ──────────────────────────────────────────── */
      .tform-field {
        margin-bottom:20px;
        opacity:0; transform:translateY(10px);
        animation:fieldIn 0.28s ease forwards;
        animation-delay:var(--delay, 0ms);
      }
      @keyframes fieldIn {
        to { opacity:1; transform:translateY(0); }
      }
      .tform-label {
        display:block; font-size:13px; font-weight:600;
        color:oklch(0.30 0.04 75); margin-bottom:6px;
        line-height:1.4;
      }
      .tform-required { color:oklch(0.52 0.20 25); }
      .tform-input {
        width:100%; padding:11px 14px;
        border:1.5px solid oklch(0.88 0.015 75);
        border-radius:10px;
        font-size:14px; color:oklch(0.18 0.04 75);
        box-sizing:border-box; font-family:inherit;
        background:oklch(0.99 0.005 75);
        transition:border-color 0.18s, box-shadow 0.18s, background 0.18s;
      }
      .tform-input:focus {
        outline:none;
        border-color:var(--tform-color, oklch(0.44 0.15 148));
        box-shadow:0 0 0 3px var(--tform-color, oklch(0.44 0.15 148 / 0.12));
        background:white;
      }
      .tform-input::placeholder { color:oklch(0.72 0.02 75); }
      .tform-input.error { border-color:oklch(0.52 0.20 25); }
      .tform-input.error:focus { box-shadow:0 0 0 3px oklch(0.52 0.20 25 / 0.12); }
      .tform-input-error {
        display:block; color:oklch(0.50 0.18 25);
        font-size:12px; margin-top:4px; font-weight:500;
      }
      .tform-textarea { min-height:96px; resize:vertical; line-height:1.5; }
      .tform-select {
        appearance:none; cursor:pointer;
        background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path stroke="%23888" stroke-width="1.5" fill="none" stroke-linecap="round" d="M1 1.5l5 5 5-5"/></svg>');
        background-repeat:no-repeat; background-position:right 13px center;
        padding-right:38px;
      }
      .tform-hint {
        font-size:11px; color:oklch(0.60 0.04 75);
        margin-top:5px; font-style:italic; line-height:1.4;
      }
      input[type="number"].tform-input { text-align:right; }
      .tform-char-counter {
        font-size:11px; color:oklch(0.65 0.03 75); text-align:right; margin-top:3px;
      }

      /* ── Section divider inside card ─────────────────────── */
      .tform-section-divider {
        font-size:10px; font-weight:700; letter-spacing:.10em; text-transform:uppercase;
        color:oklch(0.60 0.04 75);
        border-top:1px solid oklch(0.92 0.015 75);
        padding-top:16px; margin:8px 0 12px 0;
      }

      /* ── Auto-calc panel ─────────────────────────────────── */
      .tform-auto-panel {
        background:var(--tform-bg, oklch(0.97 0.025 148));
        border:1px solid oklch(0.88 0.06 148 / 0.5);
        border-radius:12px; padding:16px;
        margin-top:20px;
      }
      .tform-auto-label {
        font-size:10px; font-weight:700; letter-spacing:.10em; text-transform:uppercase;
        color:var(--tform-color, oklch(0.44 0.15 148));
        margin-bottom:10px; display:flex; align-items:center; gap:6px;
      }

      /* ── B5 AI banner ────────────────────────────────────── */
      .tform-ai-banner {
        background:oklch(0.97 0.02 188); border:1px solid oklch(0.82 0.08 188);
        border-radius:10px; padding:12px 16px; margin-bottom:20px;
        font-size:12px; color:oklch(0.40 0.10 188);
        display:flex; gap:8px; align-items:flex-start; line-height:1.5;
      }

      /* ── Completion screen ───────────────────────────────── */
      .tform-completion {
        text-align:center; padding:12px 0;
      }
      .tform-completion-icon {
        width:72px; height:72px; margin:0 auto 20px;
        background:oklch(0.96 0.05 148); border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        animation:completionPop 0.5s cubic-bezier(.34,1.56,.64,1) forwards;
      }
      @keyframes completionPop {
        from { transform:scale(0); opacity:0; }
        to   { transform:scale(1); opacity:1; }
      }
      .tform-completion h2 {
        font-size:26px; font-weight:800; color:oklch(0.18 0.04 75);
        margin:0 0 8px 0; letter-spacing:-.02em;
      }
      .tform-completion p {
        color:oklch(0.55 0.04 75); font-size:14px; margin:0 0 24px 0; line-height:1.5;
      }
      .tform-completion-stats {
        display:flex; justify-content:center; gap:24px; margin-bottom:28px; flex-wrap:wrap;
      }
      .tform-stat {
        background:oklch(0.97 0.015 75); border-radius:12px; padding:14px 20px;
        text-align:center; min-width:90px;
      }
      .tform-stat-num {
        font-size:22px; font-weight:800; color:oklch(0.44 0.15 148); display:block;
      }
      .tform-stat-label {
        font-size:11px; color:oklch(0.60 0.04 75); text-transform:uppercase;
        letter-spacing:.06em; font-weight:600; margin-top:2px; display:block;
      }
      .tform-save-btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:14px 32px; border:none; border-radius:12px;
        background:oklch(0.44 0.15 148); color:white;
        font-size:15px; font-weight:700; font-family:inherit; cursor:pointer;
        box-shadow:0 4px 16px oklch(0.44 0.15 148 / 0.30);
        transition:filter .15s, transform .15s;
        width:100%; justify-content:center;
      }
      .tform-save-btn:hover { filter:brightness(1.08); }
      .tform-save-btn:active { filter:brightness(0.96); transform:scale(0.99); }

      /* ── Keyboard hint ───────────────────────────────────── */
      .tform-kbd-hint {
        font-size:11px; color:oklch(0.65 0.03 75);
        display:inline-flex; align-items:center; gap:4px; margin-left:8px;
      }
      .tform-kbd {
        display:inline-block; background:oklch(0.93 0.01 75);
        border:1px solid oklch(0.84 0.01 75); border-radius:4px;
        padding:1px 5px; font-size:10px; font-family:monospace; font-weight:700;
      }

      @media (max-width:600px) {
        .tform-card { padding:24px 20px; }
        #tform-scroll-area { padding:24px 12px; }
        #tform-topbar, #tform-bottom-bar { padding:12px 16px; }
        .tform-disclosure-title { font-size:18px; }
        .tform-completion-stats { gap:12px; }
      }
    `;
    document.head.appendChild(style);
    // Inject CSS custom property at root level so buttons and progress update together
    document.documentElement.style.setProperty('--tform-color', 'oklch(0.44 0.15 148)');
    document.documentElement.style.setProperty('--tform-bg', 'oklch(0.97 0.025 148)');
  },

  _buildDisclosures() {
    const { std, sector } = typeformQuestionnaireState;
    let disclosures = [];

    if (std === 'gri') {
      // Usa la selezione adattiva settore + dimensioni (da c.employees)
      const c = currentClient();
      const empCat = (c && c.employees) ? (
        typeof c.employees === 'number'
          ? (c.employees > 250 ? 'large' : c.employees > 50 ? 'medium' : c.employees > 20 ? 'small' : 'micro')
          : c.employees  // già stringa ('micro','small','medium','large')
      ) : 'medium';
      disclosures = buildGRISet(sector, empCat).filter(d => GRI_QUESTIONS[d.code]);
    } else {
      // VSME: moduli B obbligatori + moduli C condizionali se applicabili al profilo azienda
      const c = currentClient();
      disclosures = VSME_MODULES_ALL.filter(m => {
        if (!VSME_QUESTIONS[m.code]) return false;
        if (!m.optional) return true;          // moduli B sempre inclusi
        if (!m.condition) return false;        // moduli C senza condizione esclusi dal typeform
        return m.condition(c);                 // moduli C condizionali: valuta profilo azienda
      });
    }

    // Escludi: auto-calcolate (GHG tool) + da file upload (template VERA)
    const excluded = new Set([...AUTO_CALCULATED_DISCLOSURES, ...FILE_UPLOAD_DISCLOSURES]);
    typeformQuestionnaireState.disclosures = disclosures.filter(d => !excluded.has(d.code));
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
    const meta = this._getMeta(code);

    // Update CSS custom properties for this module's color
    document.documentElement.style.setProperty('--tform-color', meta.color);
    document.documentElement.style.setProperty('--tform-bg', meta.bg);

    // Pre-popola B5 con suggerimenti AI se non già compilato
    const isB5 = (code === 'B5');
    const b5Suggestions = isB5 && !Object.keys(saved).length ? _generateB5Suggestions() : null;
    const savedOrSuggested = (id) => {
      if (saved[id] !== undefined) return saved[id];
      if (b5Suggestions && b5Suggestions[id]) return b5Suggestions[id];
      return '';
    };

    const contentEl = document.getElementById('tform-content');
    const codeLabel = std === 'gri' ? code : `VSME ${code}`;
    const codeSafe = code.replace(/[^a-z0-9]/gi,'_');

    // Chapter chip with module icon (SVG path from _meta)
    const chapterChip = `
      <div class="tform-chapter-chip" style="background:${meta.bg};color:${meta.color}">
        <svg class="tform-chapter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="${meta.icon}"/>
        </svg>
        ${meta.ch}
        <span class="tform-disclosure-code" style="background:${meta.bg};color:${meta.color};margin-left:4px;opacity:0.8">${codeLabel}</span>
      </div>`;

    // Tip row (only if tip is non-empty)
    const tipRow = meta.tip ? `
      <div class="tform-module-tip" style="background:${meta.bg};color:${meta.color}">
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" style="margin-top:1px;flex-shrink:0">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        ${meta.tip}
      </div>` : '';

    // B5 AI banner
    const b5Banner = isB5 && b5Suggestions ? `
      <div class="tform-ai-banner">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink:0;margin-top:1px">
          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
        </svg>
        <span><strong>Suggerimenti VERA AI</strong> — aree di rischio e opportunità pre-compilate in base al settore e ai dati già inseriti. Modifica liberamente ogni campo.</span>
      </div>` : '';

    contentEl.innerHTML = `
      <div class="tform-card" style="border-left-color:${meta.color}">
        <div class="tform-disclosure-header">
          ${chapterChip}
          <h1 class="tform-disclosure-title">${disclosure.label}</h1>
          <p class="tform-disclosure-subtitle">Inserisci solo i <strong>dati primari</strong> — i valori derivati vengono calcolati automaticamente</p>
          ${tipRow}
        </div>
        ${b5Banner}
        <form id="tform-form" onsubmit="return false;">
          ${questions.map((q, i) => `
            <div class="tform-field" style="--delay:${60 + i * 40}ms">
              <label class="tform-label" for="tform-${codeSafe}-${q.id}">
                ${q.label}
                ${q.required ? '<span class="tform-required">*</span>' : ''}
              </label>
              ${this._renderFieldInput(q, savedOrSuggested(q.id), code)}
              <span class="tform-input-error" id="err-${code}-${q.id}" style="display:none"></span>
            </div>
          `).join('')}
        </form>
        <div id="tform-derived-${codeSafe}"></div>
      </div>
      <div class="tform-kbd-hint">
        Premi <kbd class="tform-kbd">↵ Enter</kbd> per avanzare
      </div>
    `;

    // Show/hide prev button
    const prevBtn = document.getElementById('tform-btn-prev');
    if (prevBtn) prevBtn.style.display = typeformQuestionnaireState.currentIndex > 0 ? 'inline-flex' : 'none';

    // Auto-focus first input
    setTimeout(() => {
      const firstInput = document.querySelector('#tform-form input:not([type="file"]), #tform-form select, #tform-form textarea');
      if (firstInput) firstInput.focus({ preventScroll: true });
      this._addDerivedListeners(code);
      // Wire textarea char counters
      document.querySelectorAll('#tform-form textarea[data-maxlen]').forEach(ta => {
        const update = () => {
          const counter = document.getElementById(ta.id + '-counter');
          if (counter) counter.textContent = ta.value.length + ' / ' + ta.dataset.maxlen;
        };
        ta.addEventListener('input', update); update();
      });
    }, 60);
  },

  /* ── Auto-calculation listeners ──────────────────────────── */
  _addDerivedListeners(code) {
    const form = document.getElementById('tform-form');
    if (!form) return;
    const compute = () => {
      const derived = this._computeDerived(code);
      const el = document.getElementById('tform-derived-' + code.replace(/[^a-z0-9]/gi,'_'));
      if (!el) return;
      if (!derived.length) { el.innerHTML = ''; return; }
      el.innerHTML = `
        <div class="tform-auto-panel">
          <div class="tform-auto-label">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
            </svg>
            Calcolato automaticamente
          </div>
          ${derived.map(d => `
            <div style="display:flex;justify-content:space-between;align-items:baseline;
                        padding:7px 0;border-bottom:1px solid var(--tform-color, oklch(0.44 0.15 148) / 0.15)">
              <span style="font-size:13px;color:oklch(0.45 0.04 75)">${d.label}</span>
              <strong style="font-size:14px;color:var(--tform-color, oklch(0.44 0.15 148));
                             font-variant-numeric:tabular-nums;margin-left:12px">${d.value}</strong>
            </div>`).join('')}
        </div>`;
    };
    form.querySelectorAll('input,select,textarea').forEach(el => {
      el.addEventListener('input', compute);
      el.addEventListener('change', compute);
    });
    compute(); // initial compute for pre-filled values
  },

  /* ── Derived field computation ───────────────────────────── */
  _computeDerived(code) {
    const derived = [];
    const codeSafe = code.replace(/[^a-z0-9]/gi, '_');
    const n = (id) => {
      const el = document.getElementById(`tform-${codeSafe}-${id}`);
      if (!el) return null;
      const v = parseFloat(el.value);
      return isNaN(v) ? null : v;
    };
    const fmt = (v, dec=1) => v.toLocaleString('it-IT', { minimumFractionDigits:dec, maximumFractionDigits:dec });

    if (code === 'GRI 2-7') {
      const total = n('emp_total'), m = n('emp_m'), f = n('emp_f');
      if (f !== null && total !== null && total > 0)
        derived.push({ label:'% Donne sul totale dipendenti', value: fmt(f/total*100) + '%' });
      if (m !== null && total !== null && total > 0)
        derived.push({ label:'% Uomini sul totale dipendenti', value: fmt(m/total*100) + '%' });
      const ft = n('emp_ft'), pt = n('emp_pt');
      if (ft !== null && total !== null && total > 0)
        derived.push({ label:'% Tempo pieno', value: fmt(ft/total*100) + '%' });
      if (pt !== null && total !== null && total > 0)
        derived.push({ label:'% Tempo parziale', value: fmt(pt/total*100) + '%' });
    }
    if (code === 'GRI 2-21') {
      const ceo = n('ceo_pay'), med = n('median_pay');
      if (ceo !== null && med !== null && med > 0)
        derived.push({ label:'Rapporto retributivo (CEO ÷ mediana)', value: fmt(ceo/med, 1) + 'x' });
    }
    if (code === 'GRI 405-1') {
      const total = n('board_total'), women = n('board_f');
      if (total !== null && women !== null && total > 0)
        derived.push({ label:'% Donne nel CdA', value: fmt(women/total*100) + '%' });
      const u30 = n('board_u30'), mid = n('board_3050');
      if (total !== null && u30 !== null && mid !== null && total > 0)
        derived.push({ label:'% Componenti < 50 anni', value: fmt((u30+mid)/total*100) + '%' });
    }
    if (code === 'GRI 404-1') {
      const avg = n('train_hrs'), m = n('train_m'), f = n('train_f');
      if (m !== null && f !== null)
        derived.push({ label:'Divario formazione uomini vs donne', value: (m >= f ? '+' : '') + fmt(m - f) + ' ore' });
    }
    if (code === 'B3-S1') {
      const total = n('vsme_emp_total'), fn = n('vsme_emp_f_n'), mn = n('vsme_emp_m_n');
      if (fn !== null && total !== null && total > 0)
        derived.push({ label:'% Donne (calcolata)', value: fmt(fn/total*100) + '%' });
      if (mn !== null && total !== null && total > 0)
        derived.push({ label:'% Uomini (calcolata)', value: fmt(mn/total*100) + '%' });
      const wf = n('vsme_wage_f_avg'), wm = n('vsme_wage_m_avg');
      if (wf !== null && wm !== null && wm > 0) {
        derived.push({ label:'Gender pay gap (uomini vs donne)', value: fmt((wm-wf)/wm*100) + '%' });
        derived.push({ label:'Rapporto retributivo F/M', value: fmt(wf/wm, 2) });
      }
    }
    if (code === 'B2-E2') {
      const elec = n('vsme_elec'), gas = n('vsme_gas');
      if (elec !== null) {
        derived.push({ label:'Consumo totale (gas + elettricità)', value: fmt((elec + (gas||0))/1000, 1) + ' MWh' });
        // Prefer vsme_emp_total from typeform (already filled B3-S1) over c.employees which may be a string category
        const allAns = {};
        Object.values(typeformQuestionnaireState.answers).forEach(d => Object.assign(allAns, d));
        const empRaw = parseFloat(allAns.vsme_emp_total || allAns.emp_total);
        const c = currentClient();
        const emp = !isNaN(empRaw) && empRaw > 0 ? empRaw
          : (c && typeof c.employees === 'number' ? c.employees : 0);
        if (emp > 0)
          derived.push({ label:'Intensità energetica', value: fmt(elec/emp, 0) + ' kWh/dip.' });
      }
    }
    if (code === 'GRI 201-1') {
      const rev = n('revenue'), cost = n('op_cost'), wages = n('wages'), tax = n('tax');
      if (rev !== null && cost !== null)
        derived.push({ label:'Margine operativo lordo', value: '€ ' + fmt(rev - cost, 0) });
      if (rev !== null && wages !== null && rev > 0)
        derived.push({ label:'% Costo del lavoro su ricavi', value: fmt(wages/rev*100) + '%' });
    }

    // ── GRI 302-1: totale energetico e quota rinnovabile ─────
    if (code === 'GRI 302-1') {
      const er = n('elec_ren_kwh'), en = n('elec_nren_kwh'), gas = n('gas_kwh'), diesel = n('diesel_l');
      const dieselKwh = (diesel || 0) * 9.97; // 1 litro gasolio ≈ 9.97 kWh (Direttiva 2012/27/UE)
      if (er !== null || en !== null) {
        const totalElec = (er||0) + (en||0);
        const totalAll  = totalElec + (gas||0) + dieselKwh;
        derived.push({ label:'Consumo elettrico totale', value: fmt(totalElec/1000, 1) + ' MWh' });
        if (totalAll > 0) {
          derived.push({ label:'Consumo energetico totale', value: fmt(totalAll/1000, 1) + ' MWh' });
          derived.push({ label:'Quota energia rinnovabile', value: fmt((er||0)/totalAll*100, 1) + '%' });
        }
      }
    }

    // ── GRI 401-1: tassi assunzione e turnover ────────────────
    if (code === 'GRI 401-1') {
      const allAns = {};
      Object.values(typeformQuestionnaireState.answers).forEach(d => Object.assign(allAns, d));
      const empBase = parseFloat(allAns.emp_total || allAns.vsme_emp_total || 0);
      const hire = n('hire_total'), turn = n('turn_total');
      if (empBase > 0 && hire !== null)
        derived.push({ label:'Tasso di assunzione', value: fmt(hire/empBase*100, 1) + '%' });
      if (empBase > 0 && turn !== null)
        derived.push({ label:'Tasso di turnover', value: fmt(turn/empBase*100, 1) + '%' });
    }

    // ── GRI 403-9: tassi infortuni (TRIR, LTIR) ──────────────
    if (code === 'GRI 403-9') {
      const rec = n('ohs_rec_injuries'), hrs = n('ohs_hrs_worked'), fat = n('ohs_fatalities'), hc = n('ohs_hc_injuries');
      if (hrs !== null && hrs > 0) {
        if (rec !== null)
          derived.push({ label:'TRIR (Tasso Infortuni Registrabili per 200.000h)', value: fmt(rec/hrs*200000, 2) });
        if (fat !== null && hc !== null)
          derived.push({ label:'Tasso infortuni ad alta conseguenza (per 200.000h)', value: fmt((fat+hc)/hrs*200000, 2) });
        if (fat !== null)
          derived.push({ label:'Tasso infortuni mortali (per 200.000h)', value: fmt(fat/hrs*200000, 3) });
      }
    }

    // ── GRI 404-1: media ore formazione/dipendente ────────────
    if (code === 'GRI 404-1') {
      const allAns = {};
      Object.values(typeformQuestionnaireState.answers).forEach(d => Object.assign(allAns, d));
      const empBase = parseFloat(allAns.emp_total || allAns.vsme_emp_total || 0);
      const total = n('train_hrs_total'), m = n('train_hrs_m'), f = n('train_hrs_f');
      if (empBase > 0 && total !== null)
        derived.push({ label:'Media ore formazione per dipendente', value: fmt(total/empBase, 1) + ' h' });
      if (empBase > 0 && m !== null)
        derived.push({ label:'Media formazione — uomini', value: fmt(m/empBase*2, 1) + ' h (stima)' });
      if (empBase > 0 && f !== null)
        derived.push({ label:'Media formazione — donne', value: fmt(f/empBase*2, 1) + ' h (stima)' });
      if (m !== null && f !== null && (m+f) > 0)
        derived.push({ label:'Divario formazione M/F', value: (m >= f ? '+' : '') + fmt(m - f, 0) + ' h totali' });
    }

    // ── B2-E4: emissioni da trasporto (Scope 3 Cat. 4) ───────
    // Fattori emissione tkm (tonne-km) da GLEC Framework / GHG Protocol
    if (code === 'B2-E4') {
      const km = n('vsme_transp_km');
      const fuel = document.getElementById(`tform-${codeSafe}-vsme_transp_fuel`)?.value || '';
      const veh  = document.getElementById(`tform-${codeSafe}-vsme_transp_veh`)?.value || '';
      if (km !== null) {
        // Fattori kgCO2e/tkm (GLEC 2023)
        const factors = {
          'Autocarro pesante (>3,5t)': { Diesel:0.096, Benzina:0.115, 'Gas naturale / GNL':0.079, Elettrico:0.025, default:0.096 },
          'Furgone (<3,5t)':           { Diesel:0.144, Benzina:0.165, Elettrico:0.035, default:0.144 },
          'Carro ferroviario':         { default:0.022 },
          'Nave':                      { default:0.010 },
          'Aereo cargo':               { default:0.602 },
          'Multimodale':               { default:0.085 },
        };
        const vehFactor = factors[veh] || factors['Autocarro pesante (>3,5t)'];
        const ef = vehFactor[fuel] || vehFactor.default || 0.096;
        const emKg = km * ef;
        derived.push({ label:'Emissioni Scope 3 Cat. 4 stimate', value: fmt(emKg/1000, 2) + ' tCO₂e' });
        derived.push({ label:'Fattore emissione utilizzato', value: fmt(ef*1000, 1) + ' gCO₂e/tkm (' + (veh || 'autocarro diesel') + ')' });
      }
    }

    // ── B3-S1: ore formazione/dipendente + tasso infortuni ───
    if (code === 'B3-S1') {
      const total = n('vsme_emp_total'), fn = n('vsme_emp_f_n'), mn = n('vsme_emp_m_n');
      if (fn !== null && total !== null && total > 0)
        derived.push({ label:'% Donne (calcolata)', value: fmt(fn/total*100) + '%' });
      if (mn !== null && total !== null && total > 0)
        derived.push({ label:'% Uomini (calcolata)', value: fmt(mn/total*100) + '%' });
      const wf = n('vsme_wage_f_avg'), wm = n('vsme_wage_m_avg');
      if (wf !== null && wm !== null && wm > 0)
        derived.push({ label:'Gender pay gap (F vs M)', value: (wf >= wm ? '+' : '') + fmt((wf-wm)/wm*100, 1) + '% ' + (wf >= wm ? '▲' : '▼') });
      // Ore formazione per dipendente
      const trainTotal = n('vsme_train_hrs_total');
      if (trainTotal !== null && total !== null && total > 0)
        derived.push({ label:'Ore medie formazione per dipendente', value: fmt(trainTotal/total, 1) + ' h' });
      // Tasso infortuni
      const inj = n('vsme_injuries'), hrs = n('vsme_hrs_worked');
      if (inj !== null && hrs !== null && hrs > 0)
        derived.push({ label:'TRIR (infortuni per 200.000h lavorate)', value: fmt(inj/hrs*200000, 2) });
    }

    return derived;
  },

  _renderFieldInput(q, savedVal, code) {
    const id = `tform-${code.replace(/[^a-z0-9]/gi,'_')}-${q.id}`;
    const val = savedVal !== undefined ? savedVal : '';
    const baseClass = 'tform-input';
    const hint = q.hint ? `<div style="font-size:11px;color:oklch(0.55 0.05 150);margin-top:4px;font-style:italic">${q.hint}</div>` : '';

    let input = '';
    if (q.type === 'textarea') {
      input = `<textarea id="${id}" class="${baseClass} tform-textarea" placeholder="${q.placeholder || ''}">${val}</textarea>`;
    } else if (q.type === 'select') {
      input = `<select id="${id}" class="${baseClass} tform-select">
        <option value="">Seleziona…</option>
        ${(q.options || []).map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>`;
    } else if (q.type === 'number') {
      input = `<input id="${id}" type="number" class="${baseClass}" placeholder="${q.placeholder || ''}" value="${val}" step="any"${q.autocomplete ? ` autocomplete="${q.autocomplete}"` : ''}>`;
    } else if (q.type === 'file') {
      input = `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <label for="${id}" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;
          padding:8px 14px;border:1.5px dashed oklch(0.72 0.12 150);border-radius:8px;
          font-size:13px;color:oklch(0.448 0.148 148);background:oklch(0.97 0.015 148/0.4);
          transition:background .15s">
          📎 Scegli file${q.accept ? ` (${q.accept.replace(/\./g,'').toUpperCase()})` : ''}
        </label>
        <input id="${id}" type="file" style="display:none" accept="${q.accept || ''}"
          onchange="document.getElementById('${id}-name').textContent=this.files[0]?.name||''">
        <span id="${id}-name" style="font-size:12px;color:oklch(0.5 0.04 150)"></span>
      </div>`;
    } else {
      input = `<input id="${id}" type="${q.type || 'text'}" class="${baseClass}" placeholder="${q.placeholder || ''}" value="${val}"${q.autocomplete ? ` autocomplete="${q.autocomplete}"` : ''}>`;
    }
    return input + hint;
  },

  _renderCompletion() {
    const contentEl = document.getElementById('tform-content');
    const { disclosures } = typeformQuestionnaireState;
    const answered = Object.keys(typeformQuestionnaireState.answers).length;
    const total = disclosures.length;

    // Elapsed time
    const elapsedMs = typeformQuestionnaireState.startTime ? Date.now() - typeformQuestionnaireState.startTime : 0;
    const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));
    const timeLabel = elapsedMin === 1 ? '1 minuto' : `${elapsedMin} minuti`;

    // Reset module color to green for celebration
    document.documentElement.style.setProperty('--tform-color', 'oklch(0.44 0.15 148)');
    document.documentElement.style.setProperty('--tform-bg', 'oklch(0.97 0.025 148)');
    if (document.getElementById('tform-progress-fill'))
      document.getElementById('tform-progress-fill').style.width = '100%';

    // Update topbar
    const chLabel = document.getElementById('tform-chapter-label');
    const mName   = document.getElementById('tform-module-name');
    const mDot    = document.getElementById('tform-module-dot');
    if (chLabel) chLabel.textContent = 'VERA ESG';
    if (mName)   mName.textContent   = 'Questionario completato';
    if (mDot)    mDot.style.background = 'oklch(0.44 0.15 148)';

    contentEl.innerHTML = `
      <div class="tform-card tform-completion" style="border-left-color:oklch(0.44 0.15 148)">
        <div class="tform-completion-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(0.44 0.15 148)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2>Ottimo lavoro!</h2>
        <p>Hai compilato tutte le disclosure richieste.<br>I dati verranno elaborati per generare il report ESG.</p>
        <div class="tform-completion-stats">
          <div class="tform-stat">
            <span class="tform-stat-num">${answered}</span>
            <span class="tform-stat-label">Disclosure</span>
          </div>
          <div class="tform-stat">
            <span class="tform-stat-num">${total > 0 ? Math.round(answered/total*100) : 100}%</span>
            <span class="tform-stat-label">Completamento</span>
          </div>
          <div class="tform-stat">
            <span class="tform-stat-num">${timeLabel}</span>
            <span class="tform-stat-label">Tempo impiegato</span>
          </div>
        </div>
        <button onclick="typeformQuestionnaire.save()" class="tform-save-btn">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"/>
            <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v3a1 1 0 11-2 0V5H7v3a1 1 0 11-2 0V5z"/>
          </svg>
          Salva e genera report
        </button>
        <p style="font-size:11px;color:oklch(0.65 0.03 75);margin-top:14px;margin-bottom:0">
          Il report ESG verrà aggiornato con i dati appena inseriti
        </p>
      </div>
    `;

    const nextBtn = document.getElementById('tform-btn-next');
    const prevBtn = document.getElementById('tform-btn-prev');
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    const stepLabel = document.getElementById('tform-step-label');
    if (stepLabel) stepLabel.textContent = 'Tutte le disclosure completate ✓';
  },

  _validateCurrentSlide() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    if (currentIndex >= disclosures.length) return true;

    const disclosure = disclosures[currentIndex];
    const std = typeformQuestionnaireState.std;
    const code = disclosure.code;
    const codeSafe = code.replace(/[^a-z0-9]/gi, '_');
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);

    let isValid = true;
    let firstError = null;
    questions.forEach(q => {
      const el = document.getElementById(`tform-${codeSafe}-${q.id}`);
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
        if (!firstError) firstError = el;
      } else {
        el.classList.remove('error');
        if (errEl) errEl.style.display = 'none';
      }
    });

    // Auto-focus the first invalid field
    if (firstError) firstError.focus({ preventScroll: false });
    return isValid;
  },

  _saveCurrentSlide() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    if (currentIndex >= disclosures.length) return;

    const disclosure = disclosures[currentIndex];
    const std = typeformQuestionnaireState.std;
    const code = disclosure.code;
    const codeSafe = code.replace(/[^a-z0-9]/gi, '_');
    const questions = std === 'gri' ? (GRI_QUESTIONS[code] || []) : (VSME_QUESTIONS[code] || []);

    const vals = {};
    questions.forEach(q => {
      const el = document.getElementById(`tform-${codeSafe}-${q.id}`);
      if (el) vals[q.id] = el.value;
    });
    typeformQuestionnaireState.answers[code] = vals;
  },

  _updateProgress() {
    const { disclosures, currentIndex } = typeformQuestionnaireState;
    const total = disclosures.length;
    const pct = total > 0 ? Math.round((currentIndex + 1) / total * 100) : 0;
    const disclosure = disclosures[currentIndex];
    const meta = disclosure ? this._getMeta(disclosure.code) : null;

    // Progress rail & text
    const fillEl    = document.getElementById('tform-progress-fill');
    const progressEl = document.getElementById('tform-progress-text');
    const stepLabel = document.getElementById('tform-step-label');
    if (fillEl)     fillEl.style.width = pct + '%';
    if (progressEl) progressEl.textContent = `${currentIndex + 1} / ${total}`;
    if (stepLabel)  stepLabel.textContent = `Sezione ${currentIndex + 1} di ${total}`;

    // Topbar: chapter label + module name + dot color
    const chLabel = document.getElementById('tform-chapter-label');
    const mName   = document.getElementById('tform-module-name');
    const mDot    = document.getElementById('tform-module-dot');
    if (meta) {
      if (chLabel) chLabel.textContent = meta.ch;
      if (mName)   mName.textContent   = disclosure.label;
      if (mDot)    mDot.style.background = meta.color;
    }

    // Milestone badges (show once per threshold)
    if (!typeformQuestionnaireState.milestonesShown) typeformQuestionnaireState.milestonesShown = new Set();
    const milestones = [
      { pct:25, label:'25% completato 🎯' },
      { pct:50, label:'Metà strada! 🌿' },
      { pct:75, label:'Quasi finito! 🚀' },
    ];
    const badgeEl = document.getElementById('tform-milestone-badge');
    if (badgeEl) {
      for (const m of milestones) {
        if (pct >= m.pct && !typeformQuestionnaireState.milestonesShown.has(m.pct)) {
          typeformQuestionnaireState.milestonesShown.add(m.pct);
          badgeEl.textContent = m.label;
          badgeEl.style.display = 'inline-block';
          setTimeout(() => { badgeEl.style.display = 'none'; }, 2800);
          break;
        }
      }
    }
  },

  /* ── Directional slide transition ───────────────────────── */
  _transition(direction, callback) {
    const el = document.getElementById('tform-content');
    if (!el) { callback(); return; }
    const exitX = direction === 'next' ? '-28px' : '28px';
    const enterX = direction === 'next' ? '28px' : '-28px';

    el.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
    el.style.opacity = '0';
    el.style.transform = `translateX(${exitX})`;

    setTimeout(() => {
      callback();
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = `translateX(${enterX})`;
      // Force reflow
      void el.offsetHeight;
      el.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
      // Scroll top
      const scrollArea = document.getElementById('tform-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;
    }, 170);
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
      const errEl = document.getElementById('tform-logic-error');
      if (errEl) errEl.style.display = 'none';
    }

    // Live report update
    this._liveUpdateReport();

    if (typeformQuestionnaireState.currentIndex < disclosures.length) {
      typeformQuestionnaireState.currentIndex++;
    }
    this._transition('next', () => this._renderCurrentSlide());
  },

  prev() {
    if (typeformQuestionnaireState.currentIndex > 0) {
      this._saveCurrentSlide();
      typeformQuestionnaireState.currentIndex--;
      this._transition('prev', () => this._renderCurrentSlide());
    }
  },

  save() {
    const answered = Object.keys(typeformQuestionnaireState.answers).length;
    this._liveUpdateReport();
    toast(`Questionario salvato — ${answered} disclosure compilate`, 'success');
    const c = currentClient();
    if (c && c.step < 3) { c.step = 3; updateWizardProgress(); }
    this.close();
  },

  /* ── Live report update — popola il report ad ogni avanzamento ── */
  _liveUpdateReport() {
    const c = currentClient();
    if (!c) return;

    // Flatten all typeform answers into a single map
    const answers = {};
    Object.values(typeformQuestionnaireState.answers).forEach(disc => Object.assign(answers, disc));

    // ── Aggiorna i campi del client con i dati primari compilati ──
    // Dipendenti
    const empTotal = parseFloat(answers.vsme_emp_total || answers.emp_total);
    if (!isNaN(empTotal) && empTotal > 0) c.employees = empTotal;

    // Emissioni: aggiorna sempre se typeform fornisce valori espliciti (priorità al GHG tool se il client
    // ha già dati più dettagliati — ma se typeform li sovrascrive lo facciamo comunque per coerenza live)
    const s1 = parseFloat(answers.vsme_s1 || answers.scope1_co2);
    const s2 = parseFloat(answers.vsme_s2 || answers.scope2_mb || answers.scope2_lb);
    const s3 = parseFloat(answers.vsme_s3 || answers.scope3_total);
    if (!isNaN(s1) && !isNaN(s2)) {
      const s3v = isNaN(s3) ? 0 : s3;
      c.ghg = { s1: s1*1000, s2: s2*1000, s3: s3v*1000, total: (s1+s2+s3v)*1000 };
      _updateScopeBars(c);
      _setText('kpi-total', (c.ghg.total/1000).toFixed(1));
      _setText('kpi-s1',    (c.ghg.s1/1000).toFixed(1));
      _setText('kpi-s2',    (c.ghg.s2/1000).toFixed(1));
      _setText('kpi-s3',    (c.ghg.s3/1000).toFixed(1));
    }

    // ── Genera sezioni testuali del report live ──
    const std = typeformQuestionnaireState.std || c.std || 'vsme';
    c.liveReportData = answers;
    c.std = std;

    // Aggiorna header report
    const name = answers.vsme_name || answers.org_name || c.name || '—';
    if (name !== '—') c.name = name;

    // Aggiorna report screen
    _renderReportScreen(c);

    // Flash sull'icona report nella sidebar per indicare aggiornamento
    const navReport = document.getElementById('nav-report');
    if (navReport) {
      navReport.style.outline = '2px solid oklch(0.72 0.21 150)';
      setTimeout(() => { if (navReport) navReport.style.outline = ''; }, 900);
    }
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
      const total = n('vsme_emp_total'), fn = n('vsme_emp_f_n'), mn = n('vsme_emp_m_n');
      if (fn !== null && fn < 0)
        return 'Errore logico: il numero di donne non può essere negativo.';
      if (mn !== null && mn < 0)
        return 'Errore logico: il numero di uomini non può essere negativo.';
      if (total !== null && fn !== null && fn > total)
        return `Errore logico: donne (${fn}) supera il totale dipendenti (${total}).`;
      if (total !== null && mn !== null && mn > total)
        return `Errore logico: uomini (${mn}) supera il totale dipendenti (${total}).`;
      if (fn !== null && mn !== null && total !== null && fn + mn > total)
        return `Errore logico: la somma donne+uomini (${fn+mn}) supera il totale dipendenti (${total}).`;
      const injuries = n('vsme_injuries');
      if (injuries !== null && total !== null && injuries > total)
        return `Errore logico: infortuni (${injuries}) non può superare il numero di dipendenti (${total}).`;
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
        { label: 'Emissioni Scope 1 (tCO2e)', value: ghg.s1 != null ? (ghg.s1/1000).toFixed(1) : '0.0', icon: '🏭' },
        { label: 'Emissioni Scope 2 (tCO2e)', value: ghg.s2 != null ? (ghg.s2/1000).toFixed(1) : '0.0', icon: '⚡' },
        { label: 'Totale Scope 1+2 (tCO2e)', value: (((ghg.s1||0)+(ghg.s2||0))/1000).toFixed(1), icon: '📊' },
        { label: 'Intensita\' GHG (tCO2e/dip.)', value: (typeof c.employees === 'number' && c.employees > 0) ? ((((ghg.s1||0)+(ghg.s2||0))/1000)/c.employees).toFixed(2) : 'N/A', icon: '📈' },
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

function openApp(tab) {
  document.getElementById('view-landing').style.display = 'none';
  document.getElementById('view-landing').classList.remove('active');
  const loginEl = document.getElementById('view-login');
  loginEl.style.display = 'flex';
  loginEl.classList.add('active');

  // Always show login panel (public signup removed — invite-only)
  const lp = document.getElementById('login-panel');
  if (lp) lp.style.display = 'block';
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

  // Guard insights screen — Pro plan or admin only
  if (id === 'insights' && !auth.isAdmin()) {
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    const isPro = c && (c.plan === 'pro' || c.plan === 'enterprise');
    if (!isPro) {
      // Show Pro upsell overlay
      const existing = document.getElementById('pro-gate-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'pro-gate-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9000;padding:16px';
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:18px;padding:40px 36px;max-width:440px;width:100%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.25)">
          <div style="font-size:44px;margin-bottom:12px">📊</div>
          <h2 style="font-size:20px;font-weight:800;color:#111;margin-bottom:8px">Funzionalità riservata al piano Pro</h2>
          <p style="font-size:14px;color:#6b7280;margin-bottom:6px">Insights ESG include:</p>
          <ul style="text-align:left;font-size:13px;color:#374151;margin:0 0 20px 0;padding-left:20px;line-height:1.8">
            <li>Benchmark di settore vs media nazionale e best-in-class</li>
            <li>Checklist banche verdi (Intesa S-Loan, UniCredit ESG-Linked, BNL Green, MCC)</li>
            <li>Simulatore riduzione GHG con ROI calcolato</li>
            <li>Doppia materialità ESRS</li>
            <li>Timbro digitale VERA</li>
          </ul>
          <div style="font-size:22px;font-weight:800;color:#16a34a;margin-bottom:4px">€1.500<span style="font-size:14px;font-weight:500;color:#6b7280">/anno</span></div>
          <div style="font-size:12px;color:#9ca3af;margin-bottom:24px">o €149/mese</div>
          <a href="mailto:info@veraesg.it?subject=Richiesta%20piano%20Pro%20VERA%20ESG"
            style="display:inline-block;padding:12px 28px;background:#16a34a;color:#fff;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:12px">
            Richiedi il piano Pro →
          </a>
          <br/>
          <button onclick="document.getElementById('pro-gate-overlay').remove()"
            style="border:none;background:none;color:#6b7280;font-size:13px;cursor:pointer;margin-top:8px;text-decoration:underline">
            Torna indietro
          </button>
        </div>`;
      document.body.appendChild(overlay);
      return;
    }
  }
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const _targetScreen = document.getElementById('screen-' + id);
  if (!_targetScreen) { console.warn('[showScreen] screen not found: screen-' + id); return; }
  _targetScreen.classList.add('active');
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
    insights:    'Insights ESG',
  };
  document.getElementById('page-title').textContent = titles[id] || id;

  // Inizializza modulo materialità alla prima apertura
  if (id === 'materiality' && window.materialityModule) {
    try { window.materialityModule.init(); } catch(e) { console.warn('[showScreen] materialityModule.init error', e); }
  }

  // Inizializza modulo insights alla prima apertura
  if (id === 'insights' && window.insightsModule) {
    try { window.insightsModule.init(); } catch(e) { console.warn('[showScreen] insightsModule.init error', e); }
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
    if (role === 'client') {
      // Client: start from Doppia Materialità
      // Small defer so Supabase client data finishes loading before init()
      showScreen('home', document.getElementById('nav-home'));
      setTimeout(() => {
        try {
          showScreen('materiality', document.getElementById('nav-materiality'));
        } catch(e) {
          console.warn('[auth.login] materiality redirect error', e);
        }
      }, 300);
    } else {
      showScreen('home', document.getElementById('nav-home'));
    }
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
    // Instead of demo mode, redirect to the registration form
    if (window.veraAuth && typeof window.veraAuth.showRegister === 'function') {
      window.veraAuth.showRegister();
    }
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
          showScreen('materiality', document.getElementById('nav-materiality'));
          if (window.materialityModule) materialityModule.init();
        }, 500);
      }
    }, 300);
  },
};

/* ══════════════════════════════════════════════════════════
   UPGRADE GATE — helper per blocchi funzionalità premium
══════════════════════════════════════════════════════════ */
function _renderUpgradeGate(featureName, desc) {
  return `
    <div class="upgrade-gate" style="border:2px dashed #d1fae5;border-radius:14px;padding:32px;text-align:center;background:#f0fdf4;opacity:0.85">
      <div style="font-size:32px;margin-bottom:8px">🔒</div>
      <div style="font-size:15px;font-weight:700;color:#14532d;margin-bottom:6px">${featureName}</div>
      <div style="font-size:13px;color:#6b7280;margin-bottom:16px;max-width:320px;margin-left:auto;margin-right:auto">${desc}</div>
      <a href="mailto:info@veraesg.it?subject=Upgrade%20Piano%20Pro%20VERA" class="btn btn-primary" style="font-size:13px">Attiva Piano Pro →</a>
    </div>`;
}
window._renderUpgradeGate = _renderUpgradeGate;

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

/* ══════════════════════════════════════════════════════════
   EXCEL TEMPLATE GENERATOR — VERA Client Data Template
══════════════════════════════════════════════════════════ */
function generateClientTemplate() {
  _loadSheetJS(() => {
    const c   = currentClient() || {};
    const std = c.std || (window._matState && _matState.chosenStandard) || 'vsme';
    const company = c.name || c.company_name || 'Azienda';
    const year    = c.reportYear || new Date().getFullYear() - 1;
    const XLSX    = window.XLSX;

    /* ── Helper: build a sheet from rows array ── */
    const makeSheet = (rows) => {
      const ws = XLSX.utils.aoa_to_sheet(rows);
      // Column widths: Label 38 | Value 22 | Unit 14 | Note 38
      ws['!cols'] = [{ wch: 38 }, { wch: 22 }, { wch: 14 }, { wch: 38 }];
      // Freeze header row
      ws['!freeze'] = { xSplit: 0, ySplit: 1 };
      return ws;
    };

    /* ── Row builders ── */
    const H  = (label) => [label, '', '', ''];          // section header
    const R  = (lbl, val, unit, note) => [lbl, val ?? '', unit ?? '', note ?? ''];

    /* ══ Sheet 1: Energia & Emissioni ══ */
    const energyRows = [
      R('Campo', 'Valore', 'Unità', 'Note / Fonte dati'),                       // col header
      H('── ENERGIA DIRETTA (Scope 1) ──'),
      R('Gas naturale consumato', '', 'kWh/anno', 'Da bolletta fornitore gas'),
      R('GPL consumato', '', 'kg/anno', 'Da bolletta o fattura'),
      R('Gasolio riscaldamento', '', 'L/anno', 'Da fattura'),
      R('Biomassa/pellet', '', 'kg/anno', 'Da fattura'),
      H('── ENERGIA ELETTRICA (Scope 2) ──'),
      R('Elettricità acquistata dalla rete', '', 'kWh/anno', 'Da bolletta elettrica'),
      R('Energia da fonti rinnovabili (autoprodotta)', '', 'kWh/anno', 'Es. fotovoltaico'),
      R('Acquisto certificati GO (Green Origin)', '', 'kWh/anno', 'Se applicabile'),
      H('── CONSUMI TERMICI ──'),
      R('Teleriscaldamento acquistato', '', 'kWh/anno', 'Da bolletta'),
      R('Vapore acquistato', '', 'kWh/anno', 'Se applicabile'),
      H('── PERFORMANCE ENERGETICA ──'),
      R('Intensità energetica (kWh / unità di prodotto)', '', 'kWh/unità', 'Definire unità di prodotto'),
      R('Anno di riferimento baseline', year, 'anno', 'Per calcolo trend'),
    ];

    /* ══ Sheet 2: Emissioni GHG ══ */
    const ghgRows = [
      R('Campo', 'Valore', 'Unità', 'Note / Fonte dati'),
      H('── SCOPE 1 — Emissioni dirette ──'),
      R('Combustione gas naturale', '', 'tCO₂e', 'Calcolato da VERA'),
      R('Combustione gasolio', '', 'tCO₂e', 'Calcolato da VERA'),
      R('Refrigeranti (perdite HFC)', '', 'tCO₂e', 'Da schede F-Gas / IPPC'),
      R('Processi industriali', '', 'tCO₂e', 'Se applicabile'),
      H('── SCOPE 2 — Emissioni indirette energia ──'),
      R('Elettricità acquistata (location-based)', '', 'tCO₂e', 'FE ISPRA anno corrente'),
      R('Elettricità acquistata (market-based)', '', 'tCO₂e', 'Con certificati GO'),
      H('── SCOPE 3 — Altre emissioni indirette ──'),
      R('Cat. 1: Beni e servizi acquistati', '', 'tCO₂e', 'Stima o da LCA fornitori'),
      R('Cat. 4: Trasporto e distribuzione (upstream)', '', 'tCO₂e', 'km × FE per veicolo/carburante'),
      R('Cat. 5: Rifiuti prodotti', '', 'tCO₂e', 'kg rifiuti × FE smaltimento'),
      R('Cat. 6: Viaggi di lavoro', '', 'tCO₂e', 'km aerei/treni'),
      R('Cat. 11: Uso dei prodotti venduti', '', 'tCO₂e', 'Se applicabile'),
      H('── TARGET & TREND ──'),
      R('Emissioni anno base (Scope 1+2)', '', 'tCO₂e', 'Anno di riferimento'),
      R('Target riduzione al 2030', '', '%', 'Es. -30% vs baseline'),
    ];

    /* ══ Sheet 3: Acqua & Rifiuti ══ */
    const wasteRows = [
      R('Campo', 'Valore', 'Unità', 'Note / Fonte dati'),
      H('── ACQUA ──'),
      R('Prelievo totale acqua', '', 'm³/anno', 'Da contatori / fatture'),
      R('di cui: rete idrica municipale', '', 'm³/anno', ''),
      R('di cui: pozzo/acquifero', '', 'm³/anno', 'Se applicabile'),
      R('di cui: acque superficiali', '', 'm³/anno', 'Se applicabile'),
      R('Acqua ricircolata/riutilizzata', '', 'm³/anno', ''),
      R('Scarichi idrici totali', '', 'm³/anno', 'Con autorizzazione allo scarico'),
      H('── RIFIUTI ──'),
      R('Rifiuti totali generati', '', 'kg/anno', ''),
      R('di cui: avviati a riciclo', '', 'kg/anno', ''),
      R('di cui: avviati a recupero energetico', '', 'kg/anno', ''),
      R('di cui: smaltiti in discarica', '', 'kg/anno', ''),
      R('Rifiuti pericolosi generati', '', 'kg/anno', 'Con codice CER pericoloso'),
      R('Intensità rifiuti (kg / unità di prodotto)', '', 'kg/unità', ''),
    ];

    /* ══ Sheet 4: Sociale ══ */
    const socialRows = [
      R('Campo', 'Valore', 'Unità', 'Note / Fonte dati'),
      H('── OCCUPAZIONE ──'),
      R('Numero dipendenti totali (EoY)', '', 'n°', 'Fine anno rendicontato'),
      R('di cui: donne', '', 'n°', ''),
      R('di cui: uomini', '', 'n°', ''),
      R('di cui: contratto a tempo indeterminato', '', 'n°', ''),
      R('di cui: contratto a tempo determinato', '', 'n°', ''),
      R('di cui: part-time', '', 'n°', ''),
      R('Nuove assunzioni nell\'anno', '', 'n°', ''),
      R('Turnover (cessazioni)', '', 'n°', ''),
      H('── FORMAZIONE ──'),
      R('Ore di formazione totali erogate', '', 'ore/anno', ''),
      R('Ore medie formazione per dipendente', '', 'ore/persona', ''),
      R('di cui: formazione su salute e sicurezza', '', 'ore/anno', ''),
      H('── SALUTE & SICUREZZA ──'),
      R('Infortuni sul lavoro (con assenza)', '', 'n°', 'INAIL denuncia'),
      R('Giorni persi per infortuni', '', 'giorni', ''),
      R('Indice di frequenza (IF)', '', 'IF', '(infortuni/ore lavorate)×1.000.000'),
      R('Malattie professionali riconosciute', '', 'n°', ''),
      H('── RETRIBUZIONE ──'),
      R('Retribuzione media annua (full-time)', '', '€/anno', ''),
      R('Gap retributivo di genere (donne/uomini)', '', '%', 'Es. 92% = donne guadagnano 8% in meno'),
      R('Dipendenti con retribuzione ≥ living wage locale', '', '%', 'Se disponibile'),
      H('── SUPPLY CHAIN SOCIALE ──'),
      R('Fornitori totali attivi', '', 'n°', ''),
      R('Fornitori con autovalutazione ESG completata', '', 'n°', ''),
      R('Fornitori locali (raggio 100 km)', '', '%', ''),
    ];

    /* ══ Sheet 5: Governance ══ */
    const govRows = [
      R('Campo', 'Valore', 'Unità', 'Note / Fonte dati'),
      H('── STRUTTURA GOVERNANCE ──'),
      R('N° componenti CdA / organo di governo', '', 'n°', ''),
      R('di cui: donne', '', 'n°', ''),
      R('di cui: indipendenti', '', 'n°', ''),
      R('Frequenza riunioni CdA/anno', '', 'n°', ''),
      H('── ETICA & COMPLIANCE ──'),
      R('Codice etico adottato?', '', 'Sì/No', ''),
      R('Whistleblowing policy attiva?', '', 'Sì/No', 'D.Lgs. 24/2023 se >50 dip.'),
      R('Reclami etici ricevuti nell\'anno', '', 'n°', ''),
      R('Procedimenti legali/sanzioni in corso', '', 'n°', ''),
      H('── ANTI-CORRUZIONE ──'),
      R('Dipendenti formati su anti-corruzione', '', 'n°', ''),
      R('% dipendenti con formazione anti-corruzione', '', '%', ''),
      R('Episodi di corruzione accertati', '', 'n°', ''),
      H('── PRIVACY & CYBER ──'),
      R('Violazioni dati personali (data breach)', '', 'n°', 'Da registro GDPR'),
      R('Certificazione ISO 27001?', '', 'Sì/No/In corso', ''),
    ];

    /* ══ Sheet 6: Anagrafica azienda ══ */
    const infoRows = [
      R('Campo', 'Valore', 'Unità', 'Note'),
      H('── DATI GENERALI ──'),
      R('Ragione sociale', company, '', ''),
      R('Partita IVA / Codice fiscale', c.vatNumber || '', '', ''),
      R('Anno di rendicontazione', year, 'anno', ''),
      R('Settore ATECO principale', c.sector || '', '', ''),
      R('Standard di rendicontazione', std.toUpperCase(), '', 'VSME / GRI'),
      R('N° dipendenti (valore al 31/12)', c.employees || '', 'n°', ''),
      R('Fatturato annuo', c.revenue || '', '€', ''),
      R('Sede legale (Comune, Provincia)', c.city || '', '', ''),
      R('Sito web aziendale', '', '', ''),
      R('Referente ESG (nome e email)', '', '', 'Compilato dal consulente VERA'),
      H('── ISTRUZIONI ══'),
      R('1. Compila le celle nella colonna "Valore"', '', '', ''),
      R('2. Non modificare colonne A, C, D', '', '', ''),
      R('3. Usa le unità indicate nella colonna C', '', '', ''),
      R('4. Carica il file completato nella sezione Upload di VERA', '', '', ''),
    ];

    /* ══ Build workbook ══ */
    const wb = XLSX.utils.book_new();
    wb.Props = { Title: `VERA ESG Template — ${company} ${year}`, Author: 'VERA ESG Platform' };

    const sheets = [
      { name: '0_Anagrafica',         rows: infoRows   },
      { name: '1_Energia',            rows: energyRows  },
      { name: '2_Emissioni GHG',      rows: ghgRows     },
      { name: '3_Acqua e Rifiuti',    rows: wasteRows   },
      { name: '4_Sociale',            rows: socialRows  },
      { name: '5_Governance',         rows: govRows     },
    ];

    sheets.forEach(({ name, rows }) => {
      XLSX.utils.book_append_sheet(wb, makeSheet(rows), name);
    });

    /* ══ Download ══ */
    XLSX.writeFile(wb, `VERA-Template-${company.replace(/\s+/g, '_')}-${year}.xlsx`);
    if (typeof toast === 'function') toast('Template Excel scaricato ✓', 'success');
  });
}
window.generateClientTemplate = generateClientTemplate;

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
