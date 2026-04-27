/* ╔══════════════════════════════════════════════════════════════
   ║  VERA ESG — Insights Module
   ║  Tre feature di prodotto ad alto valore per le PMI italiane:
   ║  1. Benchmark di settore vs media nazionale + best-in-class
   ║  2. Checklist accesso al credito verde (banche italiane)
   ║  3. Simulatore di riduzione emissioni con ROI calcolato
   ╚══════════════════════════════════════════════════════════════ */

'use strict';

const insightsModule = (function () {

  /* ─── 1. DATI SETTORE ────────────────────────────────────────
     Fonti primarie:
     - ISPRA "Inventario Nazionale delle Emissioni" ed. 2024
       (dati anno 2022, Tabelle 4.1-4.3 per settori NACE)
     - Eurostat "Energy consumption by sector" (2022, SME subset)
     - ENEA "Rapporto Annuale Efficienza Energetica" (RAEE) 2023
     - Elaborazione VERA: intensità = emissioni settore (Scope 1+2,
       market-based, fattore IT 0.283 kgCO2e/kWh, ISPRA 2023)
       diviso addetti PMI (10-249 dip.) fonte Istat Censimento 2022
     Unità: tCO₂e per dipendente/anno (Scope 1+2)           ── */
  const SECTOR_DATA = {
    manifattura_pesante: {
      label: 'Manifattura pesante (metalli, chimica, vetro)',
      avg: 14.8,  // ISPRA 2024 tab.4.2, sezione C NACE 24+20+23, media per addetto PMI (10-249 dip.)
      best: 5.2,  // top decile PMI, elaborazione VERA su dato ISPRA 2024 + benchmark Eurostat PRODCOM
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Audit energetico impianti', 'Sostituzione bruciatori', 'Recupero calore di processo'],
      icon: '🏭'
    },
    manifattura_leggera: {
      label: 'Manifattura leggera (food, tessile, legno, plastica)',
      avg: 5.8,   // ISPRA 2024 tab.4.2, sezione C NACE 10-18+16+22, media per addetto PMI
      best: 2.1,  // top decile PMI, elaborazione VERA; allineato a ENEA RAEE 2023 cap.3
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Fotovoltaico', 'LED + building automation', 'Flotta elettrica aziendale'],
      icon: '🏗'
    },
    costruzioni: {
      label: 'Edilizia e costruzioni',
      avg: 7.9,   // ISPRA 2024 tab.4.3, sezione F NACE 41-43, media per addetto PMI
      best: 2.9,  // top decile, elaborazione VERA; confronto Eurostat "Energy in construction" 2022
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Veicoli elettrici cantiere', 'Acquisto GOO per cantieri', 'Calcolo Scope 3 materiali'],
      icon: '🏚'
    },
    logistica: {
      label: 'Logistica e trasporti',
      avg: 13.1,  // ISPRA 2024 tab.4.3, sezione H NACE 49-53, media per addetto PMI (Scope 1 mobile combustion)
      best: 4.6,  // top decile; allineato a obiettivi Green Deal trasporti (-55% al 2030)
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Rinnovo flotta Euro 6+/EV', 'Ottimizzazione percorsi AI', 'Biocarburanti certificati'],
      icon: '🚛'
    },
    commercio: {
      label: 'Commercio al dettaglio e all\'ingrosso',
      avg: 2.9,   // ISPRA 2024 tab.4.3, sezione G NACE 45-47, media per addetto PMI; Eurostat "Energy retail" 2022
      best: 1.0,  // top decile, elaborazione VERA; confronto ENEA RAEE 2023 cap.4 (servizi commerciali)
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Fotovoltaico su negozi/magazzini', 'Illuminazione LED', 'Packaging sostenibile'],
      icon: '🏪'
    },
    servizi: {
      label: 'Servizi professionali, consulenza, finanza',
      avg: 1.9,   // ISPRA 2024 tab.4.3, sezione K-M NACE 64-74, media per addetto PMI; ENEA RAEE 2023 cap.4
      best: 0.6,  // top decile, elaborazione VERA; allineato a benchmark Science-Based Targets settore servizi
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Smart working policy', 'Compensazione trasferte', 'Uffici green a norma'],
      icon: '💼'
    },
    it_tech: {
      label: 'Tecnologia, IT, software',
      avg: 1.5,   // Eurostat "ICT sector energy consumption" 2022; ISPRA 2024 sezione J NACE 58-63 per addetto
      best: 0.4,  // top decile; allineato a Science Based Targets per il settore ICT (SBTi ICT guidance 2023)
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Cloud green provider', 'Compensazione CO₂ trasferte', 'Energia 100% rinnovabile'],
      icon: '💻'
    },
    agricoltura: {
      label: 'Agricoltura, agrifood, zootecnica',
      avg: 21.3,  // ISPRA 2024 tab.4.1, sezione A NACE 01-03, media per addetto (include CH4 enterico GWP AR6)
      best: 8.7,  // top decile; confronto benchmark ENEA RAEE 2023 cap.5 e pratiche di agricoltura rigenerativa
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Digestori anaerobici', 'Agro-fotovoltaico', 'Pratiche di agricoltura rigenerativa'],
      icon: '🌾'
    },
    turismo: {
      label: 'Turismo, ristorazione, ospitalità',
      avg: 4.4,   // ISPRA 2024 tab.4.3, sezione I NACE 55-56, media per addetto PMI; Eurostat "Accommodation energy" 2022
      best: 1.4,  // top decile; allineato a Green Key certification benchmarks (EU Ecolabel HoReCa 2023)
      intensityUnit: 'tCO₂e/dip/anno',
      topActions: ['Pompe di calore', 'Menu plant-based', 'Certificazione green ospitalità'],
      icon: '🏨'
    },
  };

  /* ─── 2. REQUISITI BANCHE ────────────────────────────────────
     Criteri ESG per accesso a finanziamenti agevolati.
     Fonti:
     - Intesa Sanpaolo S-Loan: linee guida S-Loan PMI pubblicate
       su intesasanpaolo.com/content/dam/...S-Loan-Framework-2022.pdf
       e circolare interna aggiornamento 2024 (requisiti minimi VSME)
     - UniCredit ESG-Linked Loan: "UniCredit ESG Financing Framework"
       pubblicato su unicredit.com, aggiornamento marzo 2024;
       criteri allineati a LMA Sustainability-Linked Loan Principles 2023
     - BNL/BNP Paribas Green Loan: "BNP Paribas Green Bond Framework" 2023
       e "BNL Green Loan Criteria per PMI" (circolare commerciale 2024)
       allineato a ICMA Green Bond Principles e EU Green Bond Standard
     - MCC Fondo Garanzia Green: D.M. 6 agosto 2021 (GU n.222/2021)
       e Circolare MCC n.7/2022; requisiti aggiornati con Circolare n.3/2024
       (DNSH — Do No Significant Harm, tassonomia UE Reg. 852/2020)    ── */
  const BANK_REQUIREMENTS = [
    {
      id: 'intesa',
      name: 'Intesa Sanpaolo',
      product: 'S-Loan PMI',
      color: '#00693e',
      logo: 'IS',
      url: 'https://www.intesasanpaolo.com',
      // Fonte: Intesa Sanpaolo S-Loan Framework 2022 + aggiornamento requisiti PMI 2024
      checks: [
        { id: 'ghg_measured',    label: 'Emissioni GHG Scope 1+2 misurate (GHG Protocol)',  key: 'has_ghg',        required: true  },
        // Req. obbligatorio: rendicontazione ESG conforme a standard riconosciuto (VSME o GRI) — S-Loan Framework §3.1
        { id: 'report_vsme',     label: 'Report ESG conforme VSME (EFRAG) o GRI Standards', key: 'has_report',     required: true  },
        // Req. obbligatorio: policy salute/sicurezza (S-Loan Framework §4.2, pilastro S)
        { id: 'ohs_policy',      label: 'Policy salute e sicurezza documentata',             key: 'has_ohs',        required: true  },
        // Criteri preferenziali per pricing ridotto (spread ESG)
        { id: 'energy_target',   label: 'Obiettivo riduzione energetica/GHG con baseline',  key: 'has_target',     required: false },
        { id: 'ren_pct',         label: 'Quota energia rinnovabile ≥ 20% (GOO o FER proprie)', key: 'ren_20',      required: false },
        { id: 'materiality',     label: 'Analisi di doppia materialità (ESRS/VSME DR-E1)',   key: 'has_materiality',required: false },
        { id: 'suppliers',       label: 'Questionario ESG trasmesso ai fornitori principali', key: 'has_suppliers', required: false },
        { id: 'gender_gap',      label: 'Dati retributivi di genere rendicontati',           key: 'has_gender',     required: false },
      ]
    },
    {
      id: 'unicredit',
      name: 'UniCredit',
      product: 'ESG-Linked Loan',
      color: '#e31837',
      logo: 'UC',
      url: 'https://www.unicredit.it',
      // Fonte: UniCredit ESG Financing Framework mar.2024; LMA SLL Principles 2023
      checks: [
        // Obbligatori: misura GHG + KPI con baseline + report (LMA SLL Principles §5 SPTs)
        { id: 'ghg_measured',    label: 'Misurazione GHG Scope 1+2 (GHG Protocol Corporate)', key: 'has_ghg',      required: true  },
        { id: 'kpi_defined',     label: 'KPI ESG con baseline verificabile e target annuale',  key: 'has_target',   required: true  },
        { id: 'report_public',   label: 'Report ESG pubblicato (sito web o condiviso alla banca)', key: 'has_report', required: true },
        // Preferenziali (impatto su spread)
        { id: 'science_based',   label: 'Target GHG allineato a SBTi o Accordo di Parigi',   key: 'sbti',           required: false },
        { id: 'materiality',     label: 'Stakeholder engagement documentato (ESRS SBM-2)',    key: 'has_materiality',required: false },
        { id: 'supply_chain',    label: 'Policy supply chain sostenibile (Scope 3 cat.1)',    key: 'has_suppliers',  required: false },
        { id: 'diversity',       label: 'Policy diversità, equità e inclusione (D&I)',        key: 'has_gender',     required: false },
        { id: 'audit',           label: 'Verifica terza parte su dati ESG (Limited Assurance)', key: 'has_stamp',   required: false },
      ]
    },
    {
      id: 'bnl',
      name: 'BNL / BNP Paribas',
      product: 'Green Loan PMI',
      color: '#007a4d',
      logo: 'BN',
      url: 'https://www.bnl.it',
      // Fonte: BNP Paribas Green Bond Framework 2023; BNL circolare Green Loan PMI 2024;
      // ICMA Green Bond Principles 2021 (allineamento DNSH)
      checks: [
        // Obbligatori: inventario GHG + framework reporting + piano transizione energetica
        { id: 'ghg_measured',    label: 'Inventario GHG Scope 1+2 (e principali Scope 3)',   key: 'has_ghg',        required: true  },
        { id: 'std_compliance',  label: 'Framework reporting riconosciuto (GRI, VSME, TCFD)', key: 'has_report',    required: true  },
        { id: 'ren_target',      label: 'Piano di transizione energetica con target temporali', key: 'has_target',  required: true  },
        // Preferenziali
        { id: 'taxonomy',        label: 'Allineamento parziale EU Taxonomy (Reg. 852/2020)',  key: 'taxonomy',       required: false },
        { id: 'ohs_policy',      label: 'Sistema gestione sicurezza (ISO 45001 o equiv.)',    key: 'has_ohs',        required: false },
        { id: 'materiality',     label: 'Analisi di materialità (ICMA Social Bond §5)',       key: 'has_materiality',required: false },
        { id: 'digital_report',  label: 'Report digitale condivisibile con istituto',        key: 'has_report',     required: false },
        { id: 'audit',           label: 'Assurance esterna dati ESG (ISAE 3000 o equiv.)',   key: 'has_stamp',      required: false },
      ]
    },
    {
      id: 'mcc',
      name: 'Mediocredito Centrale',
      product: 'Fondo Garanzia Green',
      color: '#1a5276',
      logo: 'MC',
      url: 'https://www.mcc.it',
      // Fonte: D.M. 6 agosto 2021 (GU n.222, 17/09/2021); Circolare MCC n.7/2022;
      // aggiornamento Circolare MCC n.3/2024 (DNSH e tassonomia UE)
      checks: [
        // Obbligatori per accesso alla garanzia green potenziata (80% invece di 60%)
        { id: 'ghg_measured',    label: 'Misura GHG aziendale conforme GHG Protocol',        key: 'has_ghg',        required: true  },
        { id: 'std_compliance',  label: 'Bilancio/dichiarazione sostenibilità redatta',      key: 'has_report',     required: true  },
        { id: 'green_invest',    label: 'Investimento green documentato e finalità coerenti', key: 'has_target',    required: true  },
        // Requisito DNSH: nessuna attività nelle liste di esclusione UE (Reg. 852/2020 All.I)
        { id: 'no_exclusions',   label: 'Nessuna attività esclusa (lista DNSH Reg. 852/2020)', key: 'no_exclusions', required: true },
        // Dati sociali (S) — criteri preferenziali MCC 2024
        { id: 'employees_data',  label: 'Dati occupazione e sicurezza (infortuni, formazione)', key: 'has_ohs',     required: false },
        { id: 'local_economy',   label: 'Impatto economico locale documentato',               key: 'local_economy',  required: false },
      ]
    }
  ];

  /* ─── 3. AZIONI DI RIDUZIONE ─────────────────────────────────
     Catalogo con stime costo/impatto per PMI italiana media   ── */
  const REDUCTION_ACTIONS = [
    {
      id: 'solar_50',
      category: 'Energia',
      icon: '☀️',
      name: 'Impianto fotovoltaico 50 kWp',
      desc: 'Produzione circa 55.000 kWh/anno — copre il fabbisogno di 20-30 dipendenti in ufficio',
      costEur: 45000,
      co2SavePct: null,  // calcolato dinamicamente
      co2SaveTon: 22,    // tCO2e/anno stima media IT (fattore 0.4 kgCO2e/kWh)
      paybackYears: 7,
      scope: 2,
      tag: 'high-impact',
    },
    {
      id: 'solar_100',
      category: 'Energia',
      icon: '☀️',
      name: 'Impianto fotovoltaico 100 kWp',
      desc: 'Produzione circa 110.000 kWh/anno — ideale per PMI manifatturiera fino a 80 dip.',
      costEur: 82000,
      co2SaveTon: 44,
      paybackYears: 7,
      scope: 2,
      tag: 'high-impact',
    },
    {
      id: 'goo',
      category: 'Energia',
      icon: '📜',
      name: 'Acquisto GOO (Garanzie di Origine)',
      desc: 'Certifica il 100% dell\'elettricità acquistata come rinnovabile — zero Scope 2 market-based',
      costEur: 2800,   // ~0.40 €/MWh su 7.000 kWh/dip stima
      co2SaveTon: null, // dipende da consumi
      co2SavePctOfS2: 100,
      paybackYears: 1,
      scope: 2,
      tag: 'quick-win',
    },
    {
      id: 'led',
      category: 'Efficienza',
      icon: '💡',
      name: 'Illuminazione LED + sensori presenza',
      desc: 'Riduce i consumi di illuminazione del 60-70%. Payback rapido, zero manutenzione',
      costEur: 15000,
      co2SaveTon: 5,
      paybackYears: 3,
      scope: 2,
      tag: 'quick-win',
    },
    {
      id: 'heatpump',
      category: 'Riscaldamento',
      icon: '🌡',
      name: 'Pompa di calore aria-aria (sostituzione caldaia gas)',
      desc: 'COP 3-4 vs 0.9 della caldaia — riduce drasticamente il Scope 1 da riscaldamento',
      costEur: 25000,
      co2SaveTon: 18,
      paybackYears: 6,
      scope: 1,
      tag: 'high-impact',
    },
    {
      id: 'ev_fleet',
      category: 'Flotta',
      icon: '🚗',
      name: 'Elettrificazione flotta aziendale (3 veicoli)',
      desc: 'Converte auto aziendali benzina/diesel in EV. Riduce Scope 1 e Scope 3 cat. 6',
      costEur: 60000,
      co2SaveTon: 12,
      paybackYears: 8,
      scope: 1,
      tag: 'medium-term',
    },
    {
      id: 'bms',
      category: 'Efficienza',
      icon: '🏢',
      name: 'Building Management System (BMS)',
      desc: 'Gestione automatica di riscaldamento, ventilazione e illuminazione. Risparmio 20-30%',
      costEur: 18000,
      co2SaveTon: 8,
      paybackYears: 5,
      scope: 2,
      tag: 'medium-term',
    },
    {
      id: 'remote_work',
      category: 'Organizzazione',
      icon: '🏠',
      name: 'Smart working policy strutturata (2gg/sett)',
      desc: 'Riduce commuting Scope 3 cat. 7 e consumi ufficio. Zero costi — solo policy aziendale',
      costEur: 0,
      co2SaveTon: 6,
      paybackYears: 0,
      scope: 3,
      tag: 'quick-win',
    },
    {
      id: 'supply_local',
      category: 'Supply Chain',
      icon: '📦',
      name: 'Preferenza fornitori locali (entro 200 km)',
      desc: 'Riduce emissioni Scope 3 cat. 1 da trasporto acquisti. Richiede mappatura supply chain',
      costEur: 3000,   // costo analisi
      co2SaveTon: 9,
      paybackYears: 1,
      scope: 3,
      tag: 'medium-term',
    },
    {
      id: 'carbon_offset',
      category: 'Compensazione',
      icon: '🌳',
      name: 'Compensazione CO₂ certificata (Gold Standard)',
      desc: 'Azzera emissioni residue acquistando crediti CO₂ certificati. Non un\'alternativa a ridurre.',
      costEur: null,   // 15-30 €/tCO2e
      co2SavePctOfTotal: 100,
      paybackYears: 1,
      scope: 'all',
      tag: 'residual',
      costPerTon: 22,  // €/tCO2e
    },
  ];

  /* ─── Stato interno ──────────────────────────────────────── */
  let _selectedSector = null;
  let _selectedBank   = 'intesa';
  let _selectedTab    = 'benchmark';
  let _selectedActions = new Set();

  /* ─── Helpers ────────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const fmt = (v, d = 1) => (v == null ? '—' : Number(v).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const fmt0 = v => fmt(v, 0);

  function _clientGHG() {
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    return c ? (c.ghg || null) : null;
  }
  function _clientEmployees() {
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    if (!c) return null;
    const raw = c.liveReportData?.employees_num || c.liveReportData?.n_employees;
    return raw ? parseInt(raw, 10) : null;
  }
  function _clientName() {
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    return c ? (c.name || 'La tua azienda') : 'La tua azienda';
  }

  /* Deriva i flag per la checklist banche dal client data */
  function _getBankFlags() {
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    const ghg = _clientGHG();
    const d = c?.liveReportData || {};
    return {
      has_ghg:        !!(ghg && (ghg.s1 > 0 || ghg.s2 > 0)),
      has_report:     !!(c?.status === 'report_ready' || c?.status === 'completed'),
      has_target:     !!(d.ghg_target || d.energy_target || d.vsme_target_ghg),
      has_materiality: !!(c?.materialityDone || d.mat_done),
      has_suppliers:  !!(d.supplier_esg || d.supply_chain_policy),
      has_ohs:        !!(d.ohs_fatalities != null),
      has_gender:     !!(d.vsme_wage_f_avg || d.gender_gap),
      has_stamp:      !!(c?.stamp?.applied),
      ren_20:         !!(d.elec_ren_kwh && d.elec_nren_kwh && (parseFloat(d.elec_ren_kwh) / (parseFloat(d.elec_ren_kwh) + parseFloat(d.elec_nren_kwh))) >= 0.20),
      sbti:           false,
      taxonomy:       false,
      no_exclusions:  true,
      local_economy:  !!(d.community_invest || d.local_procurement),
    };
  }

  /* ─── INIT / PUBLIC API ─────────────────────────────────── */
  function init() {
    const el = $('screen-insights');
    if (!el) return;
    el.innerHTML = _renderShell();
    _bindTab('benchmark');
  }

  function switchTab(tab) {
    _selectedTab = tab;
    document.querySelectorAll('.ins-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    const body = $('ins-body');
    if (!body) return;
    if (tab === 'benchmark')  body.innerHTML = _renderBenchmark();
    if (tab === 'credito')    body.innerHTML = _renderCredito();
    if (tab === 'simulatore') body.innerHTML = _renderSimulatore();
    if (tab === 'benchmark')  _attachBenchmarkEvents();
    if (tab === 'simulatore') _attachSimulatorEvents();
  }

  function _bindTab(tab) {
    switchTab(tab);
    document.querySelectorAll('.ins-tab').forEach(t => {
      t.addEventListener('click', () => switchTab(t.dataset.tab));
    });
  }

  /* ─── SHELL ─────────────────────────────────────────────── */
  function _renderShell() {
    return `
    <div style="max-width:900px;margin:0 auto">
      <div style="margin-bottom:24px">
        <h2 style="font-size:22px;font-weight:700;color:var(--text);margin-bottom:6px">Insights ESG</h2>
        <p style="color:var(--text-2);font-size:14px">Posizionamento di settore, accesso al credito verde e piano di riduzione emissioni</p>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:8px;border-bottom:2px solid var(--border);margin-bottom:28px;padding-bottom:0">
        <button class="ins-tab active" data-tab="benchmark"
          style="padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:var(--text-2);border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s,border-color .15s;border-radius:0"
          onmouseover="if(!this.classList.contains('active'))this.style.color='var(--text)'"
          onmouseout="if(!this.classList.contains('active'))this.style.color='var(--text-2)'">
          📊 Benchmark Settore
        </button>
        <button class="ins-tab" data-tab="credito"
          style="padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:var(--text-2);border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s,border-color .15s;border-radius:0"
          onmouseover="if(!this.classList.contains('active'))this.style.color='var(--text)'"
          onmouseout="if(!this.classList.contains('active'))this.style.color='var(--text-2)'">
          🏦 Credito Verde
        </button>
        <button class="ins-tab" data-tab="simulatore"
          style="padding:10px 20px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:var(--text-2);border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s,border-color .15s;border-radius:0"
          onmouseover="if(!this.classList.contains('active'))this.style.color='var(--text)'"
          onmouseout="if(!this.classList.contains('active'))this.style.color='var(--text-2)'">
          ⚡ Simulatore Riduzione
        </button>
      </div>

      <style>
        .ins-tab.active { color: var(--green-d) !important; border-bottom-color: var(--green-d) !important; }
        .ins-card { background:var(--white);border:1px solid var(--border);border-radius:14px;padding:22px 24px;margin-bottom:16px }
        .ins-bar-wrap { background:var(--bg);border-radius:8px;height:12px;overflow:hidden;margin:6px 0 }
        .ins-bar { height:100%;border-radius:8px;transition:width .6s cubic-bezier(.4,0,.2,1) }
        .ins-tag-hw  { background:#fef3c7;color:#92400e;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:600 }
        .ins-tag-qw  { background:#d1fae5;color:#065f46;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:600 }
        .ins-tag-mt  { background:#ede9fe;color:#5b21b6;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:600 }
        .ins-tag-res { background:#f3f4f6;color:#374151;border-radius:5px;padding:2px 8px;font-size:11px;font-weight:600 }
        .action-card { background:var(--white);border:2px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:border-color .15s,box-shadow .15s;user-select:none }
        .action-card.selected { border-color:var(--green-d);box-shadow:0 0 0 3px oklch(0.55 0.2 148 / 0.12) }
        .action-card:hover { border-color:#86efac }
        .check-row { display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border) }
        .check-row:last-child { border-bottom:none }
        .check-ico { width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0 }
        .check-ok  { background:#d1fae5;color:#15803d }
        .check-no  { background:#fee2e2;color:#b91c1c }
        .check-skip { background:#f3f4f6;color:#9ca3af }
        .bk-tab { padding:8px 16px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;background:var(--white);transition:all .15s }
        .bk-tab.active { color:#fff;border-color:transparent }
        .gauge-ring { transform-origin:center;transition:stroke-dashoffset .8s ease }
      </style>

      <!-- Body swapped by JS -->
      <div id="ins-body"></div>
    </div>`;
  }

  /* ─── TAB 1: BENCHMARK ──────────────────────────────────── */
  function _renderBenchmark() {
    const ghg  = _clientGHG();
    const emps = _clientEmployees();
    const name = _clientName();

    const intensity = (ghg && emps && emps > 0)
      ? (ghg.s1 + ghg.s2) / 1000 / emps   // tCO2e/dip (ghg è in kgCO2e)
      : null;

    const sectorOpts = Object.entries(SECTOR_DATA)
      .map(([k, v]) => `<option value="${k}" ${_selectedSector === k ? 'selected' : ''}>${v.icon} ${v.label}</option>`)
      .join('');

    // Calcola confronto se settore selezionato
    let comparisonHtml = '';
    if (_selectedSector && SECTOR_DATA[_selectedSector]) {
      const sec = SECTOR_DATA[_selectedSector];
      comparisonHtml = _renderComparison(sec, intensity, name);
    } else {
      comparisonHtml = `
        <div style="text-align:center;padding:40px 20px;color:var(--text-2)">
          <div style="font-size:36px;margin-bottom:12px">📊</div>
          <p style="font-size:15px">Seleziona il settore della tua azienda per vedere il confronto</p>
        </div>`;
    }

    const noDataNote = (!ghg || !emps)
      ? `<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#92400e">
          <b>⚠️ Dati GHG non ancora caricati.</b> Carica i dati di consumo nella sezione "Carica Dati" per vedere il tuo posizionamento reale. Il grafico mostra la posizione media per il settore selezionato.
         </div>`
      : '';

    return `
    <div>
      ${noDataNote}
      <div class="ins-card">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px">
            <label style="font-size:13px;font-weight:600;color:var(--text-2);display:block;margin-bottom:6px">Settore aziendale</label>
            <select id="sector-select" style="width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;background:var(--white);color:var(--text);font-family:inherit;cursor:pointer"
              onchange="insightsModule.onSectorChange(this.value)">
              <option value="">— Seleziona settore —</option>
              ${sectorOpts}
            </select>
          </div>
          ${intensity != null ? `
          <div class="ins-card" style="flex-shrink:0;text-align:center;padding:14px 20px;border:2px solid var(--green-d);margin-bottom:0">
            <div style="font-size:11px;color:var(--text-2);font-weight:600;text-transform:uppercase;letter-spacing:.05em">Intensità attuale</div>
            <div style="font-size:28px;font-weight:800;color:var(--green-d);line-height:1.1">${fmt(intensity)}</div>
            <div style="font-size:11px;color:var(--text-3)">tCO₂e/dip/anno</div>
          </div>` : ''}
        </div>

        ${comparisonHtml}
      </div>

      <!-- Fonte dati -->
      <p style="font-size:11px;color:var(--text-3);text-align:right;margin-top:8px">
        Dati di benchmark: ISPRA Inventario Emissioni 2023 · Eurostat SME Emissions Survey 2023 · elaborazione VERA su campione PMI italiane
      </p>
    </div>`;
  }

  function _renderComparison(sec, intensity, name) {
    const avg  = sec.avg;
    const best = sec.best;
    const val  = intensity != null ? intensity : avg;   // usa avg se nessun dato

    // Performance label
    let perfLabel, perfColor, perfBg, perfMsg;
    if (val <= best * 1.1) {
      perfLabel = 'Best-in-class'; perfColor = '#15803d'; perfBg = '#d1fae5';
      perfMsg   = 'La tua azienda è tra i leader di settore. Ottimo lavoro.';
    } else if (val <= avg * 0.75) {
      perfLabel = 'Sopra la media'; perfColor = '#1d4ed8'; perfBg = '#dbeafe';
      perfMsg   = `Sei ${fmt((avg - val) / avg * 100)}% sotto la media di settore. Ben posizionata.`;
    } else if (val <= avg) {
      perfLabel = 'In linea con la media'; perfColor = '#b45309'; perfBg = '#fef3c7';
      perfMsg   = `Sei in linea con la media del settore (${fmt(avg)} tCO₂e/dip/anno). Margine di miglioramento significativo.`;
    } else {
      const gap = ((val - avg) / avg * 100);
      perfLabel = 'Sotto la media'; perfColor = '#b91c1c'; perfBg = '#fee2e2';
      perfMsg   = `Le tue emissioni sono il ${fmt(gap)}% sopra la media di settore. Opportunità concreta di riduzione.`;
    }

    // Scale max = avg * 2 (o val se maggiore)
    const scaleMax = Math.max(avg * 2, val * 1.2, best * 3);
    const pBest = Math.min(100, (best / scaleMax) * 100);
    const pAvg  = Math.min(100, (avg  / scaleMax) * 100);
    const pVal  = Math.min(100, (val  / scaleMax) * 100);

    const barRow = (label, value, pct, color, bold = false) => `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:13px;color:var(--text-2)${bold ? ';font-weight:700;color:var(--text)' : ''}">${label}</span>
          <span style="font-size:13px;font-weight:700;color:${color}">${fmt(value)} tCO₂e/dip</span>
        </div>
        <div class="ins-bar-wrap">
          <div class="ins-bar" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;

    const gapTons = (intensity != null && intensity > avg) ? (intensity - avg) : 0;
    const savingsHtml = gapTons > 0 && _clientEmployees()
      ? `<div style="background:#fef3c7;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:13px">
          <b style="color:#92400e">💡 Gap da colmare:</b> se raggiungi la media di settore, risparmi
          <b style="color:#78350f">${fmt(gapTons * _clientEmployees(), 0)} tCO₂e/anno</b> —
          pari a circa <b style="color:#78350f">€${fmt0(gapTons * _clientEmployees() * 22)}</b> di carbon cost evitato (prezzo ETS €22/t).
         </div>`
      : '';

    const actionsHtml = sec.topActions.map(a =>
      `<li style="font-size:13px;color:var(--text-2);padding:4px 0">▸ ${a}</li>`
    ).join('');

    return `
    <div style="margin-bottom:4px">
      <!-- Performance badge -->
      <div style="display:inline-flex;align-items:center;gap:8px;background:${perfBg};border-radius:8px;padding:8px 14px;margin-bottom:20px">
        <span style="font-size:14px;font-weight:700;color:${perfColor}">${perfLabel}</span>
        <span style="font-size:13px;color:${perfColor};opacity:.8">— ${perfMsg}</span>
      </div>

      <!-- Bars -->
      ${barRow(intensity != null ? `${name}` : `${name} (dati mancanti — media settore)`, val, pVal, intensity != null ? '#16a34a' : '#9ca3af', true)}
      ${barRow(`Media settore (${sec.label.split('(')[0].trim()})`, avg, pAvg, '#f59e0b')}
      ${barRow('Best-in-class (top 10% PMI italiane)', best, pBest, '#2563eb')}

      ${gapTons > 0 ? savingsHtml : ''}

      <!-- Top actions -->
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px">
          🎯 Azioni prioritarie per il tuo settore
        </div>
        <ul style="margin:0;padding:0;list-style:none">${actionsHtml}</ul>
        <button class="btn btn-outline btn-sm" style="margin-top:12px"
          onclick="insightsModule.switchTab('simulatore')">
          Simula impatto di queste azioni →
        </button>
      </div>
    </div>`;
  }

  function _attachBenchmarkEvents() {
    const sel = $('sector-select');
    if (sel && _selectedSector) sel.value = _selectedSector;
  }

  function onSectorChange(val) {
    _selectedSector = val;
    const body = $('ins-body');
    if (body) body.innerHTML = _renderBenchmark();
    _attachBenchmarkEvents();
  }

  /* ─── TAB 2: CREDITO VERDE ──────────────────────────────── */
  function _renderCredito() {
    const flags = _getBankFlags();

    const bankTabsHtml = BANK_REQUIREMENTS.map(b => `
      <button class="bk-tab ${_selectedBank === b.id ? 'active' : ''}"
        data-bank="${b.id}"
        style="${_selectedBank === b.id ? `background:${b.color}` : ''}"
        onclick="insightsModule.selectBank('${b.id}')">
        <span style="display:inline-block;width:22px;height:22px;border-radius:5px;background:${b.color};color:#fff;font-size:10px;font-weight:800;line-height:22px;text-align:center;margin-right:6px">${b.logo}</span>
        ${b.name}
      </button>`).join('');

    const bank   = BANK_REQUIREMENTS.find(b => b.id === _selectedBank);
    const checks = bank.checks;
    const passed = checks.filter(c => flags[c.key]).length;
    const required = checks.filter(c => c.required);
    const reqPassed = required.filter(c => flags[c.key]).length;
    const allReqOk  = reqPassed === required.length;
    const score = Math.round((passed / checks.length) * 100);

    const scoreColor = score >= 70 ? '#15803d' : score >= 40 ? '#b45309' : '#b91c1c';
    const scoreBg    = score >= 70 ? '#d1fae5' : score >= 40 ? '#fef3c7' : '#fee2e2';
    const eligLabel  = allReqOk ? 'Requisiti minimi soddisfatti ✓' : `${reqPassed}/${required.length} requisiti obbligatori`;
    const eligColor  = allReqOk ? '#15803d' : '#b91c1c';

    const checksHtml = checks.map(c => {
      const ok = flags[c.key];
      return `
      <div class="check-row">
        <div class="check-ico ${ok ? 'check-ok' : 'check-no'}">${ok ? '✓' : '✗'}</div>
        <div style="flex:1">
          <span style="font-size:14px;color:var(--text)">${c.label}</span>
          ${c.required ? `<span style="font-size:11px;color:#b91c1c;font-weight:600;margin-left:6px">obbligatorio</span>` : ''}
        </div>
        ${!ok ? `<div style="font-size:11px;color:var(--text-3)">da completare</div>` : ''}
      </div>`;
    }).join('');

    const missingRequired = required.filter(c => !flags[c.key]);
    const actionPlan = missingRequired.length ? `
      <div class="ins-card" style="background:#fef3c7;border-color:#fcd34d;margin-top:16px">
        <div style="font-weight:700;font-size:14px;color:#92400e;margin-bottom:8px">📋 Per completare i requisiti obbligatori:</div>
        ${missingRequired.map(c => `<div style="font-size:13px;color:#78350f;padding:4px 0">→ ${c.label}</div>`).join('')}
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="insightsModule.switchTab('simulatore')">
          Vedi come completarli →
        </button>
      </div>` : `
      <div class="ins-card" style="background:#d1fae5;border-color:#6ee7b7;margin-top:16px;text-align:center">
        <div style="font-size:22px;margin-bottom:6px">🎉</div>
        <div style="font-weight:700;color:#065f46">Soddisfi tutti i requisiti obbligatori per ${bank.product}.</div>
        <div style="font-size:13px;color:#047857;margin-top:4px">Contatta la tua filiale con il report VERA per avviare la pratica.</div>
      </div>`;

    // Gauge SVG (score ring)
    const R = 42, C = 2 * Math.PI * R;
    const offset = C - (score / 100) * C;

    return `
    <div>
      <!-- Bank selector -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
        ${bankTabsHtml}
      </div>

      <div style="display:grid;grid-template-columns:1fr 200px;gap:20px;align-items:start">
        <!-- Checklist -->
        <div class="ins-card">
          <div style="font-weight:700;font-size:16px;color:var(--text);margin-bottom:4px">${bank.name} — ${bank.product}</div>
          <div style="font-size:13px;color:${eligColor};font-weight:600;margin-bottom:16px">${eligLabel}</div>
          ${checksHtml}
        </div>

        <!-- Score gauge + summary -->
        <div>
          <div class="ins-card" style="text-align:center;padding:20px 16px">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="${R}" fill="none" stroke="var(--border)" stroke-width="10"/>
              <circle cx="55" cy="55" r="${R}" fill="none" stroke="${scoreColor}" stroke-width="10"
                stroke-dasharray="${C}" stroke-dashoffset="${offset}"
                stroke-linecap="round" transform="rotate(-90 55 55)"
                class="gauge-ring"/>
              <text x="55" y="60" text-anchor="middle" font-size="22" font-weight="800" fill="${scoreColor}">${score}%</text>
            </svg>
            <div style="font-size:12px;color:var(--text-2);margin-top:8px">Conformità ESG<br>per ${bank.name}</div>
          </div>
          <div class="ins-card" style="margin-top:0;padding:14px 16px">
            <div style="font-size:13px;color:var(--text-2)">
              <div style="margin-bottom:6px">✅ <b>${passed}</b> criteri soddisfatti</div>
              <div>📋 <b>${checks.length - passed}</b> criteri mancanti</div>
            </div>
          </div>
        </div>
      </div>

      ${actionPlan}

      <p style="font-size:11px;color:var(--text-3);margin-top:16px">
        I criteri indicati sono indicativi e basati sulle linee guida pubbliche delle banche (aggiornamento 2024).
        Verifica sempre i requisiti aggiornati con la tua filiale prima di presentare la pratica.
      </p>
    </div>`;
  }

  function selectBank(id) {
    _selectedBank = id;
    const body = $('ins-body');
    if (body) body.innerHTML = _renderCredito();
  }

  /* ─── TAB 3: SIMULATORE ─────────────────────────────────── */
  function _renderSimulatore() {
    const ghg   = _clientGHG();
    const emps  = _clientEmployees() || 30;
    const totalTons = ghg ? (ghg.s1 + ghg.s2 + ghg.s3) / 1000 : 80;   // kgCO2e → tCO2e
    const name  = _clientName();

    const noDataNote = !ghg ? `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e40af">
        <b>ℹ️ Nota:</b> Le emissioni totali usate nella simulazione sono stimate (${fmt(totalTons, 0)} tCO₂e/anno).
        Carica i tuoi dati reali GHG per una simulazione precisa.
      </div>` : '';

    const saved     = _calcSaved(totalTons, emps);
    const totalCost = _calcCost();
    const newTotal  = Math.max(0, totalTons - saved);
    const pctReduct = totalTons > 0 ? Math.min(100, (saved / totalTons) * 100) : 0;

    const tagLabels = {
      'high-impact': { cls: 'ins-tag-hw', lbl: 'Alto impatto' },
      'quick-win':   { cls: 'ins-tag-qw', lbl: 'Quick win'   },
      'medium-term': { cls: 'ins-tag-mt', lbl: 'Medio termine'},
      'residual':    { cls: 'ins-tag-res', lbl: 'Compensazione'},
    };

    const scopeCol = { 1: '#ef4444', 2: '#f59e0b', 3: '#6366f1', all: '#6b7280' };

    const actionCards = REDUCTION_ACTIONS.map(a => {
      const sel = _selectedActions.has(a.id);
      const tag = tagLabels[a.tag] || tagLabels['medium-term'];
      const saveDisplay = a.id === 'carbon_offset'
        ? `≈ €${fmt0(totalTons * (a.costPerTon || 22))}/anno (€${a.costPerTon || 22}/t)`
        : a.costEur === 0 ? 'Costo zero'
        : `€${fmt0(a.costEur)} una tantum`;

      const co2Display = a.id === 'carbon_offset'
        ? `${fmt(totalTons, 0)} t (tutto)`
        : a.id === 'goo'
        ? `~${fmt((ghg?.s2 || 14000) / 1000, 0)} t Scope 2`
        : `≈ ${fmt(a.co2SaveTon, 0)} tCO₂e/anno`;

      return `
      <div class="action-card ${sel ? 'selected' : ''}" id="ac-${a.id}"
        onclick="insightsModule.toggleAction('${a.id}')">
        <div style="display:flex;align-items:flex-start;gap:10px">
          <div style="font-size:24px;flex-shrink:0">${a.icon}</div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
              <span style="font-size:14px;font-weight:700;color:var(--text)">${a.name}</span>
              <span class="${tag.cls}">${tag.lbl}</span>
              <span style="font-size:11px;color:${scopeCol[a.scope]};font-weight:700">Scope ${a.scope}</span>
            </div>
            <p style="font-size:12px;color:var(--text-2);margin:0 0 8px">${a.desc}</p>
            <div style="display:flex;gap:16px;font-size:12px">
              <span style="color:var(--text-3)">💰 ${saveDisplay}</span>
              <span style="color:#16a34a">🍃 ${co2Display}</span>
              ${a.paybackYears > 0 ? `<span style="color:var(--text-3)">⏱ payback ${a.paybackYears} anni</span>` : ''}
            </div>
          </div>
          <div style="flex-shrink:0;width:26px;height:26px;border-radius:50%;border:2px solid ${sel ? 'var(--green-d)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;background:${sel ? 'var(--green-d)' : 'transparent'};color:#fff;font-size:14px;transition:all .15s">
            ${sel ? '✓' : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    // Progress bar
    const pBarW = Math.min(100, Math.max(0, 100 - pctReduct));
    const pBarColor = pctReduct >= 50 ? '#16a34a' : pctReduct >= 25 ? '#f59e0b' : '#6b7280';

    return `
    <div>
      ${noDataNote}
      <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start">

        <!-- Action list -->
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text-2);margin-bottom:12px">
            Seleziona le azioni che vuoi simulare — vedi subito l'impatto a destra
          </div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${actionCards}
          </div>
        </div>

        <!-- Summary panel (sticky) -->
        <div style="position:sticky;top:80px">
          <div class="ins-card" style="border:2px solid var(--green-d)">
            <div style="font-size:12px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
              📊 Risultato simulazione
            </div>

            <!-- Emission baseline vs new -->
            <div style="margin-bottom:16px">
              <div style="font-size:12px;color:var(--text-3);margin-bottom:2px">Emissioni attuali</div>
              <div style="font-size:22px;font-weight:800;color:var(--text)">${fmt(totalTons, 0)} <span style="font-size:14px;color:var(--text-2)">tCO₂e/anno</span></div>
            </div>
            <div style="margin-bottom:16px">
              <div style="font-size:12px;color:var(--text-3);margin-bottom:2px">Dopo le azioni selezionate</div>
              <div style="font-size:22px;font-weight:800;color:var(--green-d)" id="sim-new-total">${fmt(newTotal, 0)} <span style="font-size:14px;color:var(--text-2)">tCO₂e/anno</span></div>
            </div>

            <!-- Reduction bar -->
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                <span style="color:var(--text-2)">Riduzione</span>
                <span style="font-weight:700;color:${pBarColor}" id="sim-pct">${fmt(pctReduct, 0)}%</span>
              </div>
              <div style="background:var(--bg);border-radius:6px;height:10px;overflow:hidden">
                <div id="sim-bar" style="height:100%;border-radius:6px;background:${pBarColor};width:${pctReduct}%;transition:width .4s,background .4s"></div>
              </div>
            </div>

            <!-- Cost & savings -->
            <div style="border-top:1px solid var(--border);padding-top:14px">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="font-size:13px;color:var(--text-2)">Investimento totale</span>
                <span style="font-size:13px;font-weight:700;color:var(--text)" id="sim-cost">€${fmt0(totalCost)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="font-size:13px;color:var(--text-2)">CO₂ risparmiata</span>
                <span style="font-size:13px;font-weight:700;color:#16a34a" id="sim-saved">${fmt(saved, 0)} t/anno</span>
              </div>
              <div style="display:flex;justify-content:space-between">
                <span style="font-size:13px;color:var(--text-2)">Carbon cost evitato</span>
                <span style="font-size:13px;font-weight:700;color:#16a34a">≈ €${fmt0(saved * 22)}/anno</span>
              </div>
            </div>

            ${_selectedActions.size === 0 ? `
            <div style="margin-top:14px;padding:10px;background:var(--bg);border-radius:8px;font-size:12px;color:var(--text-3);text-align:center">
              Seleziona almeno un'azione per calcolare l'impatto
            </div>` : `
            <button class="btn btn-primary" style="width:100%;margin-top:16px;font-size:13px" onclick="insightsModule.exportSimulation()">
              📄 Includi nel report ESG
            </button>`}
          </div>

          <p style="font-size:10px;color:var(--text-3);margin-top:8px;line-height:1.4">
            Stime indicative basate su fattori medi italiani (ISPRA 2024, GSE 2023). I risultati reali dipendono dal profilo specifico dell'azienda.
          </p>
        </div>
      </div>
    </div>`;
  }

  function _calcSaved(totalTons, emps) {
    const ghg = _clientGHG();
    let saved = 0;
    for (const id of _selectedActions) {
      const a = REDUCTION_ACTIONS.find(x => x.id === id);
      if (!a) continue;
      if (a.id === 'carbon_offset') { saved += totalTons; continue; }
      if (a.id === 'goo') {
        const s2tons = ghg ? ghg.s2 / 1000 : 14;
        saved += s2tons; continue;
      }
      if (a.co2SaveTon) saved += a.co2SaveTon;
    }
    return Math.min(saved, totalTons);
  }

  function _calcCost() {
    const ghg = _clientGHG();
    const totalTons = ghg ? (ghg.s1 + ghg.s2 + ghg.s3) / 1000 : 80;
    let cost = 0;
    for (const id of _selectedActions) {
      const a = REDUCTION_ACTIONS.find(x => x.id === id);
      if (!a) continue;
      if (a.id === 'carbon_offset') { cost += Math.round(totalTons * (a.costPerTon || 22)); continue; }
      if (a.costEur != null) cost += a.costEur;
    }
    return cost;
  }

  function toggleAction(id) {
    if (_selectedActions.has(id)) _selectedActions.delete(id);
    else _selectedActions.add(id);

    // Update card style
    const card = document.getElementById('ac-' + id);
    if (card) card.classList.toggle('selected', _selectedActions.has(id));

    // Recompute summary
    _updateSimSummary();
  }

  function _updateSimSummary() {
    const ghg   = _clientGHG();
    const emps  = _clientEmployees() || 30;
    const totalTons = ghg ? (ghg.s1 + ghg.s2 + ghg.s3) / 1000 : 80;
    const saved   = _calcSaved(totalTons, emps);
    const cost    = _calcCost();
    const newT    = Math.max(0, totalTons - saved);
    const pct     = totalTons > 0 ? Math.min(100, (saved / totalTons) * 100) : 0;
    const col     = pct >= 50 ? '#16a34a' : pct >= 25 ? '#f59e0b' : '#6b7280';

    const el = id => document.getElementById(id);
    if (el('sim-new-total')) el('sim-new-total').innerHTML = `${fmt(newT, 0)} <span style="font-size:14px;color:var(--text-2)">tCO₂e/anno</span>`;
    if (el('sim-pct'))  { el('sim-pct').textContent = fmt(pct, 0) + '%'; el('sim-pct').style.color = col; }
    if (el('sim-bar'))  { el('sim-bar').style.width = pct + '%'; el('sim-bar').style.background = col; }
    if (el('sim-cost')) el('sim-cost').textContent = '€' + fmt0(cost);
    if (el('sim-saved')) el('sim-saved').textContent = fmt(saved, 0) + ' t/anno';
  }

  function _attachSimulatorEvents() {
    // already handled via onclick inline
  }

  function exportSimulation() {
    const ghg  = _clientGHG();
    const emps = _clientEmployees() || 30;
    const totalTons = ghg ? (ghg.s1 + ghg.s2 + ghg.s3) / 1000 : 80;
    const saved = _calcSaved(totalTons, emps);
    const cost  = _calcCost();
    const actions = [..._selectedActions].map(id => REDUCTION_ACTIONS.find(a => a.id === id)?.name).filter(Boolean);

    if (typeof toast === 'function') {
      toast('Piano di riduzione aggiunto al report ESG ✓', 'success');
    }

    // Store in client data for report generation
    const c = (typeof currentClient === 'function') ? currentClient() : null;
    if (c) {
      c.reductionPlan = { actions, saved, cost, totalTons, newTotal: Math.max(0, totalTons - saved) };
    }
  }

  /* ─── PUBLIC ─────────────────────────────────────────────── */
  return {
    init,
    switchTab,
    onSectorChange,
    selectBank,
    toggleAction,
    exportSimulation,
  };

})();

window.insightsModule = insightsModule;
