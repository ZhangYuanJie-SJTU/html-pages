/* ═══════════════════════════════════════════════════════════
   V6 Render · Precision Instrument
   ═══════════════════════════════════════════════════════════ */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const pad2 = n => String(n).padStart(2, '0');
const heatCls = v => 'hc-' + Math.max(1, Math.min(10, Math.round(v)));

const STATE = {
  filterCat: 'all',
  search: '',
  sortBy: 'score',
  heatCount: 20,
  weights: {...WEIGHTS_V4},
  selectedCurves: [],
  compareSet: new Set()
};
const DEFAULT_W = {...WEIGHTS_V4};

const DIM_META = {
  pay:         {l:'综合薪酬', d:'5 年 NPV · 现金+公积金+股票', r:'薪酬'},
  tech_now:    {l:'现栈契合', d:'嵌入式+FreeRTOS+BLE+TF Lite', r:'现栈'},
  tech_future: {l:'未来栈契合', d:'电化学+微针+POCT+MEMS', r:'未来栈'},
  geo:         {l:'上海地缘深度', d:'通勤+行业集聚（不含落户）', r:'地缘'},
  career:      {l:'长期职业', d:'35 岁+ 可持续 + 技能迁移', r:'职业'},
  wlb:         {l:'WLB 可持续', d:'周均工时 + 大小周', r:'WLB'},
  endow:       {l:'稀缺禀赋', d:'AFM + 专利 + 领导力', r:'禀赋'},
  industry:    {l:'行业前景', d:'2029-2032 政策+增速', r:'前景'},
  cohort:      {l:'课题组契合', d:'POCT × 汗液 × AI-IVD × 自供能', r:'课题'},
  housing:     {l:'宝山置换链', d:'宝山→闵/嘉资金可行性', r:'置换'}
};

const COHORT_AXES = [
  {k: 'poct',   l: 'POCT 即时诊断',   color: 'var(--plum)'},
  {k: 'sweat',  l: '汗液 / 柔性',      color: 'var(--violet)'},
  {k: 'ai_ivd', l: 'AI · IVD',        color: 'var(--azure)'},
  {k: 'energy', l: '自供能 / 能量',    color: 'var(--jade)'}
];

/* ═══ Recompute ═══ */
function recompute() {
  const W = STATE.weights;
  COMPANIES_V4.forEach(c => { c.score = computeTotalScore(c, W); });
  const sorted = [...COMPANIES_V4].sort((a,b)=>b.score-a.score);
  sorted.forEach((c,i) => {
    const pct = i / sorted.length;
    if (pct < 0.07) c.tier = 'SSS';
    else if (pct < 0.22) c.tier = 'SS';
    else if (pct < 0.48) c.tier = 'S';
    else if (pct < 0.75) c.tier = 'A';
    else c.tier = 'B';
    c.rank = i + 1;
  });
}

function tierCount() {
  const cnt = {SSS:0,SS:0,S:0,A:0,B:0};
  COMPANIES_V4.forEach(c => cnt[c.tier]++);
  return cnt;
}

/* ═══ HERO ═══ */
function renderHero() {
  const top5 = [...COMPANIES_V4].sort((a,b)=>b.score-a.score).slice(0,5);
  const avg = top5.reduce((s,c)=>s+c.score, 0) / top5.length;
  $('#heroRingNum').textContent = avg.toFixed(1);
  $('#heroRingPct').textContent = Math.round(avg * 10) + '%';
  const circ = 2 * Math.PI * 68;
  const offset = circ * (1 - avg / 10);
  const arc = document.querySelector('.ring-arc');
  if (arc) arc.setAttribute('stroke-dashoffset', offset);

  const catStats = ['medical','auto','aiot','soe','hospital','startup'].map(k => ({
    k, count: COMPANIES_V4.filter(c=>c.cat===k).length,
    color: CATEGORIES_V4[k].color,
    label: {medical:'医疗',auto:'汽车',aiot:'AIoT',soe:'国企',hospital:'医院',startup:'初创'}[k]
  }));
  const maxC = Math.max(...catStats.map(s=>s.count));
  $('#heroBars').innerHTML = catStats.map(s => `
    <div class="bar">
      <i style="height:${(s.count/maxC)*100}%;background:${s.color}"></i>
      <b>${s.label}</b>
      <span>${s.count}</span>
    </div>`).join('');
}

/* ═══ Weights ═══ */
function renderDims() {
  const W = STATE.weights;
  $('#dims').innerHTML = Object.entries(DIM_META).map(([k,m],i) => {
    const v = Math.round(W[k] * 100);
    return `
      <div class="dim">
        <div class="dim-num">${pad2(i+1)}</div>
        <div class="dim-meta">
          <h5>${m.l}</h5>
          <p>${m.d}</p>
        </div>
        <div class="dim-slot">
          <input type="range" min="0" max="40" value="${v}" oninput="setW('${k}',this.value)" aria-label="${m.l} 权重">
        </div>
        <div class="dim-val"><span id="dv-${k}">${v}</span><sub>%</sub></div>
      </div>`;
  }).join('');
}

function setW(k, v) {
  STATE.weights[k] = parseInt(v) / 100;
  $(`#dv-${k}`).textContent = v;
  $$('.preset').forEach(b => b.classList.remove('act'));
  recompute();
  renderHero();
  renderTierLegend();
  renderRank();
  renderHeat();
  renderCompare();
}

function preset(name, ev) {
  const ps = {
    default: {...DEFAULT_W},
    salary:  {pay:0.32, tech_now:0.10, tech_future:0.08, geo:0.10, career:0.10, wlb:0.07, endow:0.10, industry:0.07, cohort:0.04, housing:0.02},
    tech:    {pay:0.15, tech_now:0.15, tech_future:0.25, geo:0.08, career:0.10, wlb:0.08, endow:0.10, industry:0.05, cohort:0.02, housing:0.02},
    settle:  {pay:0.15, tech_now:0.08, tech_future:0.06, geo:0.22, career:0.10, wlb:0.10, endow:0.08, industry:0.06, cohort:0.05, housing:0.10},
    cohort:  {pay:0.15, tech_now:0.08, tech_future:0.15, geo:0.08, career:0.08, wlb:0.08, endow:0.10, industry:0.08, cohort:0.18, housing:0.02}
  };
  STATE.weights = {...ps[name]};
  $$('.preset').forEach(b => b.classList.remove('act'));
  if (ev && ev.target) ev.target.classList.add('act');
  renderDims();
  recompute();
  renderHero();
  renderTierLegend();
  renderRank();
  renderHeat();
  renderCompare();
}

/* ═══ Tier legend ═══ */
function renderTierLegend() {
  const cnt = tierCount();
  const data = [
    {cls:'sss', l:'SSS', n:'必投', d:'前 7% · 拿到即去', c:cnt.SSS},
    {cls:'ss',  l:'SS',  n:'强推', d:'7-22% · 次优先级', c:cnt.SS},
    {cls:'s',   l:'S',   n:'推荐', d:'22-48% · 主投池', c:cnt.S},
    {cls:'a',   l:'A',   n:'可投', d:'48-75% · 保底', c:cnt.A},
    {cls:'b',   l:'B',   n:'不推', d:'后 25% · 避坑', c:cnt.B}
  ];
  $('#tierLegend').innerHTML = data.map(t => `
    <div class="tier-card ${t.cls}">
      <div class="tier-label">${t.l} <span class="tier-count mono">${t.c}家</span></div>
      <div class="tier-name">${t.n}</div>
      <div class="tier-desc">${t.d}</div>
    </div>`).join('');
}

/* ═══ Radar SVG generator (9 dims) ═══ */
function radarSVG(c) {
  const dims = ['pay','tech_now','tech_future','geo','career','wlb','endow','industry','cohort'];
  const R = 55;
  const cx = 0, cy = 0;
  const n = dims.length;
  const pts = dims.map((k,i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (c[k] / 10) * R;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      lx: cx + Math.cos(angle) * (R + 12),
      ly: cy + Math.sin(angle) * (R + 12),
      lbl: DIM_META[k].r,
      v: c[k]
    };
  });
  const rings = [0.25, 0.5, 0.75, 1].map(ratio => {
    const rr = R * ratio;
    const ringPts = Array.from({length: n}, (_, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return `${(cx + Math.cos(angle) * rr).toFixed(1)},${(cy + Math.sin(angle) * rr).toFixed(1)}`;
    }).join(' ');
    return `<polygon points="${ringPts}" fill="none" stroke="var(--ink-4)" stroke-width="0.5"/>`;
  }).join('');
  const axes = Array.from({length: n}, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x2 = cx + Math.cos(angle) * R;
    const y2 = cy + Math.sin(angle) * R;
    return `<line x1="0" y1="0" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ink-4)" stroke-width="0.4" stroke-dasharray="1 2"/>`;
  }).join('');
  const dataPoly = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const dots = pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="var(--plum)"/>`).join('');
  const labels = pts.map(p => `<text x="${p.lx.toFixed(1)}" y="${(p.ly+3).toFixed(1)}" text-anchor="middle" class="radar-label">${p.lbl}</text>`).join('');
  return `
    <svg viewBox="-72 -72 144 144" class="radar-svg">
      ${rings}${axes}
      <polygon class="radar-data" points="${dataPoly}" fill="oklch(54% 0.22 340 / 0.18)" stroke="var(--plum)" stroke-width="1.5" stroke-linejoin="round"/>
      ${dots}${labels}
    </svg>`;
}

/* ═══ Orbit SVG (4-axis cohort) ═══ */
function orbitSVG(c) {
  const cx = 60, cy = 60, rMax = 48, rMin = 8;
  const avg = COHORT_AXES.reduce((s,a)=>s+c[a.k], 0) / 4;
  const arcs = COHORT_AXES.map((axis, i) => {
    const startAngle = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const endAngle = ((i+1) / 4) * Math.PI * 2 - Math.PI / 2;
    const r = (c[axis.k] / 10) * rMax;
    const x1 = cx + Math.cos(startAngle) * r;
    const y1 = cy + Math.sin(startAngle) * r;
    const x2 = cx + Math.cos(endAngle) * r;
    const y2 = cy + Math.sin(endAngle) * r;
    return `<path d="M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z"
      fill="${axis.color}" fill-opacity="0.35" stroke="${axis.color}" stroke-width="1"/>`;
  }).join('');
  const outerRing = `<circle cx="${cx}" cy="${cy}" r="${rMax}" fill="none" stroke="var(--ink-4)" stroke-width="0.5" stroke-dasharray="2 3"/>`;
  const innerRing = `<circle cx="${cx}" cy="${cy}" r="${rMax * 0.5}" fill="none" stroke="var(--ink-4)" stroke-width="0.4"/>`;
  const centerHub = `<circle cx="${cx}" cy="${cy}" r="${rMin}" fill="var(--surf-1)" stroke="var(--ink-4)" stroke-width="1"/>`;
  const legendHTML = COHORT_AXES.map(a => `
    <li><i style="background:${a.color}"></i>${a.l}<b class="mono">${c[a.k].toFixed(1)}</b></li>
  `).join('');
  return `
    <div class="orbit">
      <svg viewBox="0 0 120 120" class="orbit-svg">
        ${outerRing}${innerRing}${arcs}${centerHub}
        <text x="${cx}" y="${cy+2}" text-anchor="middle" class="orbit-center">${avg.toFixed(1)}</text>
        <text x="${cx}" y="${cy+12}" text-anchor="middle" class="orbit-center-label">AVG</text>
      </svg>
      <ul class="orbit-legend">${legendHTML}</ul>
    </div>`;
}

/* ═══ Spark (5-year) with baseline ═══ */
function sparkSVG(c) {
  const base = c.cash_mid || 30;
  const fund = c.fund_total || 5;
  let cum = 0;
  const pts = [];
  for (let yr = 0; yr <= 5; yr++) {
    const mul = yr === 0 ? 0 : 1 + (yr - 1) * 0.1;
    const inc = yr === 0 ? 0 : base * mul + fund;
    cum += inc;
    if (yr >= 3 && c.stock && !/none|无/i.test(c.stock)) cum += base * 0.15;
    pts.push(cum);
  }
  const total = pts[5];
  // 中位值作为基准
  const median = 210;
  const gain = ((total - median) / median * 100).toFixed(0);
  const gainSign = gain >= 0 ? '+' : '';

  const W = 220, H = 80, pad = 6;
  const maxV = Math.max(total, median) * 1.1;
  const xAt = i => pad + (W - 2*pad) * i / 5;
  const yAt = v => H - pad - (H - 2*pad) * v / maxV;

  const linePts = pts.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' L ');
  const pathD = `M ${linePts}`;
  const areaD = `${pathD} L ${xAt(5).toFixed(1)},${H-pad} L ${xAt(0).toFixed(1)},${H-pad} Z`;

  // 基准线（中位）
  const baselineY0 = yAt(median * 0.2);
  const baselineY5 = yAt(median);

  const dots = [0, 3, 5].map(i => `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(pts[i]).toFixed(1)}" r="${i===5?3:2}" fill="var(--plum)" stroke="var(--surf-1)" stroke-width="${i===5?1.5:0}"/>`).join('');
  const endLabel = `<text x="${(xAt(5) - 4).toFixed(1)}" y="${(yAt(total) - 4).toFixed(1)}" text-anchor="end" class="spark-label primary">¥${Math.round(total)}w</text>`;

  return `
    <svg viewBox="0 0 ${W} ${H}" class="spark-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill-${c.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="oklch(54% 0.22 340 / 0.32)"/>
          <stop offset="100%" stop-color="oklch(54% 0.22 340 / 0)"/>
        </linearGradient>
      </defs>
      <line x1="${pad}" y1="${baselineY0.toFixed(1)}" x2="${W-pad}" y2="${baselineY5.toFixed(1)}" stroke="var(--ink-8)" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="${W-pad-2}" y="${(baselineY5 - 3).toFixed(1)}" text-anchor="end" class="spark-label">中位</text>
      <path d="${areaD}" fill="url(#spark-fill-${c.id})"/>
      <path d="${pathD}" fill="none" stroke="var(--plum)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      ${endLabel}
    </svg>
    <div class="spark-meta">
      <span>Y1 <b>¥${Math.round(pts[1])}w</b></span>
      <span>Y5 <b>¥${Math.round(total)}w</b></span>
      <span class="gain">${gainSign}${gain}% <em>vs 中位</em></span>
    </div>`;
}

/* ═══ Firm card ═══ */
function renderFirmCard(c) {
  const cat = CATEGORIES_V4[c.cat];
  const matchScore = Math.round((c.tech_now * 0.4 + c.tech_future * 0.4 + c.cohort * 0.2) * 10);
  const tcls = c.tier.toLowerCase();

  // 岗位 chip（取前 3）
  const allJobs = (c.pos || []).flatMap(p => p.jobs.map(j => ({dept: p.dept, job: j})));
  const jobChips = allJobs.slice(0, 3).map(j => {
    const tag = /研究|研发/.test(j.dept) ? '研发' :
                /算法/.test(j.dept) ? '算法' :
                /产品/.test(j.dept) ? '产品' : '工程';
    return `<span class="job-chip"><b>${tag}</b>${j.job.substring(0, 18)}${j.job.length > 18 ? '…' : ''}</span>`;
  }).join('');
  const moreJobs = allJobs.length > 3 ? `<span class="job-chip ghost">+ ${allJobs.length - 3} 更多</span>` : '';

  const caveat = (c.caveat || c.honest_feedback) ?
    `<div class="firm-caveat">⚠ ${c.caveat || c.honest_feedback}</div>` : '';

  const why = c.why_for_you ? `
    <div class="detail-block why">
      <h6>§ 为什么这家适合你</h6>
      <ul>${c.why_for_you.map(w => `<li>${w}</li>`).join('')}</ul>
    </div>` : '';

  const posBlock = (c.pos && c.pos.length) ? `
    <div class="detail-block">
      <h6>§ 推荐岗位</h6>
      <ul>${c.pos.flatMap(p => p.jobs.map(j => `<li><b>${p.dept}</b> · ${j}</li>`)).join('')}</ul>
    </div>` : '';

  const ar = `
    <div class="advrisk-grid">
      <div class="ar adv">
        <h6>优势</h6>
        <ul>${(c.adv || []).map(a => `<li>${a}</li>`).join('')}</ul>
      </div>
      <div class="ar risk">
        <h6>风险</h6>
        <ul>${(c.risk || []).map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
    </div>`;

  const isAdded = STATE.compareSet.has(c.id);

  return `
    <article class="firm" data-tier="${c.tier}" data-cat="${c.cat}" data-id="${c.id}">
      <header class="firm-head">
        <div class="firm-rank mono">#${pad2(c.rank)}</div>
        <div class="firm-identity">
          <h3 class="firm-name">${c.name} <span class="firm-en">${c.en || ''}</span></h3>
          <div class="firm-tags">
            <span class="tag ${c.cat}">${cat.name.split(' · ')[0].replace(/^[^一-龥]+/, '')}</span>
            <span class="tag location">${c.dist}</span>
            <span class="tag match">★ 匹配 ${matchScore}%</span>
            ${c.tag ? `<span class="tag warn">⭐ 福地</span>` : ''}
            ${c.intern_path === 'current_off_topic' ? `<span class="tag warn">实习·跨方向</span>` : ''}
          </div>
        </div>
        <div class="firm-score">
          <div class="score-num mono"><span>${Math.floor(c.score)}.</span><b>${String(c.score.toFixed(2)).split('.')[1]}</b></div>
          <div class="score-tier ${tcls}">${c.tier}</div>
        </div>
        <button class="firm-compare ${isAdded?'added':''}" onclick="toggleCompare(${c.id}, event)" aria-label="加入对比">
          ${isAdded ?
            `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l3 3 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>` :
            `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M8 3v10" stroke-linecap="round"/></svg>`
          }
        </button>
      </header>

      <p class="firm-pull">${c.oneliner || ''}</p>
      ${caveat}

      <div class="firm-instruments">
        <div>
          <div class="inst-head">NINE DIMENSIONS</div>
          ${radarSVG(c)}
        </div>
        <div>
          <div class="inst-head">COHORT · 4 AXES</div>
          ${orbitSVG(c)}
        </div>
        <div>
          <div class="inst-head">5-YR EARNINGS · vs MEDIAN</div>
          ${sparkSVG(c)}
        </div>
      </div>

      <div class="firm-footer">
        <div class="firm-jobs">${jobChips}${moreJobs}</div>
        <button class="firm-expand" onclick="this.closest('.firm').classList.toggle('open')">
          完整档案 <svg viewBox="0 0 12 12" width="10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4l4 4 4-4"/></svg>
        </button>
      </div>

      <div class="firm-details">
        <div class="detail-grid">
          ${why}
          ${posBlock}
        </div>
        ${ar}
        <div class="firm-src">
          <span>${c.ticker || (c.cat==='soe'?'国资':c.cat==='hospital'?'事业':'未上市')} · ${c.source || ''}</span>
          <a href="${c.source_url || '#'}" target="_blank" rel="noopener">官方招聘 ↗</a>
        </div>
      </div>
    </article>`;
}

function toggleCompare(id, ev) {
  ev && ev.stopPropagation();
  if (STATE.compareSet.has(id)) STATE.compareSet.delete(id);
  else if (STATE.compareSet.size < 4) STATE.compareSet.add(id);
  const btn = event?.target?.closest('.firm-compare');
  if (btn) {
    btn.classList.toggle('added', STATE.compareSet.has(id));
    btn.innerHTML = STATE.compareSet.has(id) ?
      `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l3 3 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>` :
      `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M8 3v10" stroke-linecap="round"/></svg>`;
  }
  $('#cmpBadge').textContent = STATE.compareSet.size;
  renderCompare();
}

function renderRank() {
  let list = [...COMPANIES_V4];
  if (STATE.filterCat !== 'all') list = list.filter(c => c.cat === STATE.filterCat);
  if (STATE.search) {
    const q = STATE.search.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || (c.en||'').toLowerCase().includes(q));
  }
  if (STATE.sortBy === 'score') list.sort((a,b)=>b.score-a.score);
  else list.sort((a,b)=>(b[STATE.sortBy]||0)-(a[STATE.sortBy]||0));

  const tiers = ['SSS','SS','S','A','B'];
  const tn = {SSS:'必投', SS:'强推', S:'推荐', A:'可投', B:'避坑'};
  const ti = {
    SSS:'Must apply',
    SS:'Highly recommended',
    S:'Recommended',
    A:'Safety net',
    B:'Avoid'
  };

  let html = '';
  const gems = list.filter(c => c.tag);
  if (gems.length) {
    html += `<section class="tgroup">
      <div class="tgroup-head">
        <span class="tgroup-badge gem">⭐ HIDDEN GEMS</span>
        <span class="tgroup-title">隐藏福地 <em>· 非主流但特别适合你</em></span>
        <span class="tgroup-count mono">N = ${gems.length}</span>
      </div>
      ${gems.map(renderFirmCard).join('')}
    </section>`;
  }

  const others = list.filter(c => !c.tag);
  tiers.forEach(t => {
    const g = others.filter(c => c.tier === t);
    if (!g.length) return;
    html += `<section class="tgroup">
      <div class="tgroup-head">
        <span class="tgroup-badge ${t.toLowerCase()}">${t}</span>
        <span class="tgroup-title">${tn[t]} <em>· ${ti[t]}</em></span>
        <span class="tgroup-count mono">N = ${g.length}</span>
      </div>
      ${g.map(renderFirmCard).join('')}
    </section>`;
  });
  $('#rankC').innerHTML = html;
}

/* ═══ Heatmap ═══ */
function renderHeat() {
  const rows = [...COMPANIES_V4].sort((a,b)=>b.score-a.score).slice(0, STATE.heatCount);
  const dims = ['pay','tech_now','tech_future','geo','career','wlb','endow','industry','cohort','housing'];
  const dimLbl = {pay:'薪酬',tech_now:'现栈',tech_future:'未来',geo:'地缘',career:'职业',wlb:'WLB',endow:'禀赋',industry:'前景',cohort:'课题',housing:'置换'};
  let html = `<div class="h-head h-name">公司</div>`;
  dims.forEach(k => html += `<div class="h-head">${dimLbl[k]}</div>`);
  html += `<div class="h-head">Σ</div>`;
  rows.forEach((c, i) => {
    html += `<div class="h-name">#${pad2(i+1)} ${c.name}</div>`;
    dims.forEach(k => html += `<div class="${heatCls(c[k])}">${c[k].toFixed(1)}</div>`);
    html += `<div class="${heatCls(c.score)}" style="font-weight:700">${c.score.toFixed(2)}</div>`;
  });
  $('#heatC').innerHTML = html;
}
function setHeat(n, ev) {
  STATE.heatCount = n;
  $$('.heat-ctrl .chip-filter').forEach(b => b.classList.remove('act'));
  if (ev && ev.target) ev.target.classList.add('act');
  renderHeat();
}

/* ═══ Scatter ═══ */
function renderScatter() {
  const plot = $('#scPlot');
  [...plot.querySelectorAll('.sc-dot')].forEach(d => d.remove());
  const W = plot.offsetWidth, H = plot.offsetHeight;
  const pad = 50;
  COMPANIES_V4.forEach(c => {
    const x = pad + (c.pay / 10) * (W - 2*pad);
    const y = H - pad - (c.wlb / 10) * (H - 2*pad);
    const size = 8 + (c.score - 6) * 2.4;
    const color = CATEGORIES_V4[c.cat].color;
    const d = document.createElement('div');
    d.className = 'sc-dot';
    d.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color}`;
    d.setAttribute('aria-label', c.name);
    d.addEventListener('mouseenter', () => {
      const tip = $('#scTip');
      tip.innerHTML = `<b>${c.name}</b>薪酬 ${c.pay.toFixed(1)} · WLB ${c.wlb.toFixed(1)}<br>总分 ${c.score.toFixed(2)} · ${c.tier} · #${c.rank}`;
      tip.style.display = 'block';
      tip.style.left = (x + 14) + 'px';
      tip.style.top = (y - 34) + 'px';
    });
    d.addEventListener('mouseleave', () => { $('#scTip').style.display = 'none'; });
    plot.appendChild(d);
  });
  $('#scLegend').innerHTML = Object.entries(CATEGORIES_V4).map(([k,v]) =>
    `<span><span class="sl-dot" style="background:${v.color}"></span>${v.icon} ${v.name.split(' · ')[0]}</span>`
  ).join('');
}

/* ═══ Curve ═══ */
function renderCurve() {
  const top15 = [...COMPANIES_V4].sort((a,b)=>b.score-a.score).slice(0,15);
  if (STATE.selectedCurves.length === 0) STATE.selectedCurves = top15.slice(0,5).map(c=>c.id);
  $('#curveSel').innerHTML = top15.map(c =>
    `<button class="cs-btn ${STATE.selectedCurves.includes(c.id)?'act':''}" onclick="toggleCurve(${c.id})">${c.name}</button>`
  ).join('');
  const svg = $('#curveSvg');
  const Wv = 1000, Hv = 420, pad = 60;
  const maxVal = 500;
  let svgHtml = '';
  // 网格+刻度
  for (let y = 0; y <= 5; y++) {
    const yy = pad + (Hv - 2*pad) * y / 5;
    svgHtml += `<line x1="${pad}" y1="${yy}" x2="${Wv-pad}" y2="${yy}" stroke="oklch(88% 0.008 250)" stroke-width="0.8" stroke-dasharray="2 3"/>`;
    const val = (5-y) * 100;
    svgHtml += `<text x="${pad-12}" y="${yy+4}" fill="oklch(58% 0.018 250)" font-size="11" font-family="Geist Mono,monospace" text-anchor="end">${val}w</text>`;
  }
  for (let x = 0; x <= 5; x++) {
    const xx = pad + (Wv - 2*pad) * x / 5;
    svgHtml += `<line x1="${xx}" y1="${pad}" x2="${xx}" y2="${Hv-pad}" stroke="oklch(88% 0.008 250)" stroke-width="0.8" stroke-dasharray="2 3"/>`;
    svgHtml += `<text x="${xx}" y="${Hv-pad+24}" fill="oklch(58% 0.018 250)" font-size="11" font-family="Geist Mono,monospace" text-anchor="middle">Y${x}</text>`;
  }
  const colors = ['oklch(54% 0.22 340)','oklch(58% 0.24 290)','oklch(58% 0.20 240)','oklch(62% 0.16 168)','oklch(72% 0.16 72)','oklch(64% 0.22 24)'];
  STATE.selectedCurves.forEach((id, idx) => {
    const c = COMPANIES_V4.find(x=>x.id===id);
    if (!c) return;
    const base = c.cash_mid || 30;
    const fund = c.fund_total || 5;
    let cum = 0;
    const pts = [];
    for (let yr=0; yr<=5; yr++) {
      const mul = yr===0 ? 0 : 1 + (yr-1) * 0.1;
      const inc = yr===0 ? 0 : base*mul + fund;
      cum += inc;
      if (yr>=3 && c.stock && !/none|无/i.test(c.stock)) cum += base * 0.15;
      const x = pad + (Wv - 2*pad) * yr / 5;
      const y = Hv - pad - (Hv - 2*pad) * Math.min(cum, maxVal) / maxVal;
      pts.push({x,y,cum});
    }
    const path = pts.map((p,i) => (i===0?'M':'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
    const col = colors[idx % colors.length];
    svgHtml += `<path d="${path}" stroke="${col}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    pts.forEach((p,i) => {
      if (i===0) return;
      svgHtml += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${col}" stroke="white" stroke-width="1.5"/>`;
      if (i===5) svgHtml += `<text x="${(p.x+8).toFixed(1)}" y="${(p.y+4).toFixed(1)}" fill="${col}" font-size="12" font-weight="600" font-family="Geist">${c.name} ${Math.round(p.cum)}w</text>`;
    });
  });
  svg.innerHTML = svgHtml;
}
function toggleCurve(id) {
  if (STATE.selectedCurves.includes(id)) STATE.selectedCurves = STATE.selectedCurves.filter(x=>x!==id);
  else if (STATE.selectedCurves.length < 6) STATE.selectedCurves.push(id);
  renderCurve();
}

/* ═══ UT ═══ */
const UTG = [
  {cls:'medical', num:'01', name:'医疗电子 · 可穿戴', tag:'联影 · 迈瑞 · 微创 · 华为健康 · 三诺',
   body:'**你的主战场**。强技术壁垒 + 强政策红利 + 老龄化确定性。监管严格（IEC 62304/60601），准入门槛高，一旦进入<em>长期价值极高</em>。',
   b:['薪资 28-50w（龙头）· 35-55w（大厂军团）','WLB 44-50h（研发）· 40h（外企）','35 岁+ 无年龄焦虑','IEC 62304 · IEC 60601 证书'],
   rec:'✓ 最佳主投方向（契合度天花板）'},
  {cls:'auto', num:'02', name:'汽车电子', tag:'小米汽车 · 地平线 · 黑芝麻 · 蔚来',
   body:'**高薪 + 高强度 + 整合期**。新势力进入淘汰赛，头部玩家薪资优厚但 WLB 差。你已亲身体验过 —— <em>太累太卷且跨方向</em>。',
   b:['薪资 35-58w（新势力）· 25-35w（Tier 1）','WLB 48-55h，大小周','AUTOSAR/CAN/LIN/座舱 OS','2027-2029 可能二次洗牌'],
   rec:'○ 不推荐主投 · 小米可做保底'},
  {cls:'aiot', num:'03', name:'AIoT · 可穿戴芯片', tag:'恒玄 · 华为海思 · 英伟达 · 大疆',
   body:'**薪资天花板 + 技术前沿**。英伟达/华为海思简历含金量顶级，恒玄是国内可穿戴芯片龙头。<em>AIoT × 医疗是最佳交叉点</em>。',
   b:['薪资 42-67w（头部）· 32-45w（中档）','WLB 两极分化（外企优秀 / 中厂差）','SoC嵌入式+AI部署+低功耗','35 岁+ 焦虑较明显'],
   rec:'△ 冲击 SSS 级的备选'},
  {cls:'soe', num:'04', name:'央企 · 国企 · 研究所', tag:'商飞 · 中电科 · 中科院微系统所',
   body:'**稳定王者 + 人才公寓 + 事业编制**。安家费 10-15w + 公寓 5 年 + 公积金顶格 = 等效总包不输大厂 B 档。AFM + 交大学硕是<em>助理研究员岗绿色通道</em>。',
   b:['22-32w 现金 + 补贴 = 30-40w 等效','WLB 955 典范','晋升体制化但稳定到退休','国自然基金 · 在职博士'],
   rec:'⭐ 强烈推荐主投 + 保底'},
  {cls:'hospital', num:'05', name:'医院 · 临床研究中心', tag:'瑞金 · 仁济 · 中山 · 华山',
   body:'**绝对蓝海 + 交大医学院系统 + 事业编**。99% 同学没考虑过但极适合你：<em>你的 6 项发明专利 + AFM 论文可直接变现</em>为医院科研项目。',
   b:['18-28w（事业编）','WLB 955/965 典范','临床→科研→博后→副高','事业编+公寓+落户+科研基金'],
   rec:'⭐ 蓝海 · 你的科研背景完美匹配'},
  {cls:'startup', num:'06', name:'独角兽 · 前沿初创', tag:'脑虎 · 博睿康 · 阶跃星辰',
   body:'**期权潜力 + 技术前沿 + 风险高**。脑机接口赛道（脑虎/博睿康）<em>非你主线方向</em>（你没写脑机接口技术栈）。规模过小的不推荐。',
   b:['28-50w（头部）· 22-32w（小初创）','WLB 48-52h','扁平组织晋升快','融资断裂 · 期权归零风险'],
   rec:'○ 仅限头部 · 脑机接口非你主线'}
];
function renderUT() {
  $('#utGrid').innerHTML = UTG.map(u => `
    <article class="ut-card ${u.cls}">
      <div class="ut-num">${u.num}</div>
      <h5>${u.name.replace('×','<em>×</em>')}</h5>
      <div class="ut-tag">${u.tag}</div>
      <p class="ut-body">${u.body.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</p>
      <ul class="ut-bullets">${u.b.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="ut-rec">${u.rec}</div>
    </article>`).join('');
}

/* ═══ Timeline ═══ */
const TL = [
  {d:'2026.05',p:.02,l:'当前 · 小米实习',now:true,above:true},
  {d:'2026.06',p:.06,l:'本科毕业',above:false},
  {d:'2026.09',p:.14,l:'交大入学 · 王侃组',above:false,ms:true},
  {d:'2026.11',p:.18,l:'确定微针方向',above:true},
  {d:'2027.01',p:.24,l:'寒假 · 第一段实习',above:false},
  {d:'2027.06',p:.36,l:'SCI 综述投稿',above:true},
  {d:'2027.09',p:.44,l:'2028届秋招观察员',above:false},
  {d:'2027.12',p:.52,l:'AFM / 综述录用',above:true},
  {d:'2028.03',p:.58,l:'研究 SCI 投稿',above:false},
  {d:'2028.06',p:.66,l:'硕二暑期实习',above:true},
  {d:'2028.09',p:.74,l:'🎯 秋招启动',above:false,ms:true},
  {d:'2028.10',p:.78,l:'大厂提前批',above:true},
  {d:'2028.11',p:.82,l:'央企研究所 · 商飞',above:false},
  {d:'2028.12',p:.86,l:'医院科研岗补录',above:true},
  {d:'2029.01',p:.90,l:'春招冲刺',above:false},
  {d:'2029.03',p:.94,l:'毕业答辩',above:true},
  {d:'2029.04',p:.97,l:'🎯 入职签三方',above:false,ms:true}
];
function renderTL() {
  $('#tl').innerHTML = '<div class="tl-line"></div>' + TL.map(e => `
    <div class="tl-mk ${e.now?'now':''} ${e.ms?'ms':''}" style="left:${e.p*100}%"></div>
    <div class="tl-lbl ${e.above?'above':'below'} ${e.now?'now':''}" style="left:${e.p*100}%">
      <b>${e.l}</b><span class="tl-d">${e.d}</span>
    </div>`).join('');
}

/* ═══ Settle calc ═══ */
const PRICE_MAP = {'嘉定新城':4.0,'嘉定安亭':2.9,'闵行老闵行':3.9,'闵行马桥':5.5,'闵行莘庄':5.9,'张江':9.5,'临港':4.2};
function renderCalc() {
  const top30 = [...COMPANIES_V4].sort((a,b)=>b.score-a.score).slice(0, 30);
  $('#calcCompany').innerHTML = top30.map(c=>`<option value="${c.id}">${c.name} · ${c.cash_mid}w</option>`).join('');
  ['calcArea','calcBS','calcPR','calcSV','calcYR'].forEach(id => {
    $(`#${id}`).addEventListener('input', e => {
      const unit = id==='calcArea' ? '㎡' : id==='calcYR' ? 'Y' : 'w';
      $(`#${id}V`).textContent = e.target.value + unit;
      updateCalc();
    });
  });
  $('#calcCompany').addEventListener('change', updateCalc);
  $('#calcDist').addEventListener('change', updateCalc);
  updateCalc();
}
function updateCalc() {
  const cid = parseInt($('#calcCompany').value);
  const c = COMPANIES_V4.find(x=>x.id===cid);
  if (!c) return;
  const area = parseInt($('#calcArea').value);
  const bs = parseInt($('#calcBS').value);
  const pr = parseInt($('#calcPR').value);
  const sv = parseInt($('#calcSV').value);
  const yr = parseInt($('#calcYR').value);
  const price = PRICE_MAP[$('#calcDist').value];
  const totalW = area * price;
  const downW = totalW * 0.35;
  const fund = c.fund_total;
  const pool = bs + pr + sv;
  const gap = downW - pool;
  const loan = totalW - Math.max(downW, pool);
  const rate = 0.045 / 12;
  const months = yr * 12;
  const mly = loan * 10000 * rate * Math.pow(1+rate, months) / (Math.pow(1+rate, months) - 1);
  const salMly = c.cash_mid * 10000 / 12;
  const fundMly = fund * 10000 / 12;
  const ratio = mly / (salMly + fundMly * 0.5);
  const disposable = c.cash_mid - mly * 12 / 10000;
  const verdict = ratio < 0.3 ? '🟢 <strong>极为宽裕</strong> · 首付与月供都轻松' :
                  ratio < 0.5 ? '🟡 <strong>可负担</strong> · 月供占比正常' :
                  ratio < 0.7 ? '🟠 <strong>偏紧张</strong> · 建议提升薪资或降低预算' :
                                '🔴 <strong>紧张</strong> · 月供超 70% · 重新考虑目标区';
  $('#calcOut').innerHTML = `
    <div class="co"><div class="co-k">房屋总价</div><div class="co-v">${totalW.toFixed(0)}<small>w</small></div></div>
    <div class="co"><div class="co-k">首付 35%</div><div class="co-v">${downW.toFixed(0)}<small>w</small></div></div>
    <div class="co"><div class="co-k">资金池（宝山+父母+存款）</div><div class="co-v green">${pool}<small>w</small></div></div>
    <div class="co"><div class="co-k">首付缺口</div><div class="co-v ${gap>0?'red':'green'}">${gap>0?gap.toFixed(0)+'w':'无'}</div></div>
    <div class="co"><div class="co-k">贷款额度</div><div class="co-v">${loan.toFixed(0)}<small>w</small></div></div>
    <div class="co"><div class="co-k">月供</div><div class="co-v">${(mly/1000).toFixed(1)}<small>k</small></div></div>
    <div class="co"><div class="co-k">月供占比</div><div class="co-v ${ratio<0.5?'green':ratio<0.7?'':'red'}">${(ratio*100).toFixed(1)}%</div></div>
    <div class="co"><div class="co-k">年可支配</div><div class="co-v green">${disposable.toFixed(1)}<small>w</small></div></div>`;
  $('#calcVerdict').innerHTML = `<strong>判定：</strong> ${verdict}`;
}

/* ═══ Industry ═══ */
const IND = [
  {cls:'med', n:'医疗电子 · 可穿戴医疗', w:'MAIN 60% · 政策确定性最高',
   stats:[{l:'2030全球',v:'$996B'},{l:'CAGR',v:'15.6%'},{l:'中国 2024',v:'615 亿'},{l:'中国5年',v:'14.7%'}],
   body:'<strong>健康中国 2030 + 十五五 + 健康上海 2030</strong> 三重政策叠加。可穿戴医疗明确写入国家规划。上海集成电路+生物医药+AI 三大先导产业 <em>2024 突破 2 万亿</em>。',
   b:['老龄化 3.8 亿（2030）→ 慢病监测刚需','CGM / 心电 / 脑电三大细分高增速','王侃课题组微针+POCT 是明星细分','国产替代确定性极高','2029 毕业赶上第二波上市潮']},
  {cls:'auto', n:'汽车电子 · 智能驾驶', w:'SUB 30% · 小米实习延伸',
   stats:[{l:'2025新能源',v:'>50%'},{l:'2029预测',v:'>75%'},{l:'智驾 CAGR',v:'25%+'},{l:'座舱',v:'>80%'}],
   body:'<strong>行业进入淘汰赛</strong>。新势力前三 + 比亚迪 + 特斯拉占 70%。你亲身实习反馈 <em>WLB 差且跨方向</em>。',
   b:['小米 SU7 + YU7 持续放量','地平线/黑芝麻车规 AI 芯片','AUTOSAR + 域控制器嵌入式','2027-2029 可能二次洗牌']},
  {cls:'aiot', n:'AIoT · 边缘 AI', w:'SUB 10% · 技术栈深化',
   stats:[{l:'2030全球',v:'$185B'},{l:'CAGR',v:'15%'},{l:'传感器',v:'35%份额'},{l:'AI边缘',v:'20%+'}],
   body:'<strong>边缘 AI + 可穿戴芯片是交叉增长点</strong>。恒玄、华为海思、英伟达国产替代 + 天花板。<em>TF Lite Micro + 1D-CNN 与你毕设重合</em>。',
   b:['恒玄智能手表芯片国内第一','英伟达 Jetson = 嵌入式 AI 黄金组合','AIoT 生态持续扩张','AIoT × 医疗 = 金矿']}
];
function renderInd() {
  $('#indGrid').innerHTML = IND.map(i => `
    <article class="ind-card ${i.cls}">
      <h5>${i.n.replace('·','<em>·</em>')}</h5>
      <div class="ind-w mono">${i.w}</div>
      <div class="ind-stats">${i.stats.map(s=>`<div><div class="is-l">${s.l}</div><div class="is-v">${s.v}</div></div>`).join('')}</div>
      <p class="ind-body">${i.body}</p>
      <ul class="ind-b">${i.b.map(x=>`<li>${x}</li>`).join('')}</ul>
    </article>`).join('');
}

/* ═══ COMPARE DRAWER ═══ */
function openCompare() {
  $('#cmpDrawer').classList.add('open');
  $('#cdOverlay').classList.add('on');
  renderCompare();
}
function closeCompare() {
  $('#cmpDrawer').classList.remove('open');
  $('#cdOverlay').classList.remove('on');
}
function removeFromCompare(id) {
  STATE.compareSet.delete(id);
  $('#cmpBadge').textContent = STATE.compareSet.size;
  // refresh compare buttons in list
  $$('.firm-compare.added').forEach(btn => {
    const card = btn.closest('.firm');
    if (card && parseInt(card.dataset.id) === id) {
      btn.classList.remove('added');
      btn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M8 3v10" stroke-linecap="round"/></svg>`;
    }
  });
  renderCompare();
}
function renderCompare() {
  const ids = [...STATE.compareSet];
  const picks = ids.map(id => COMPANIES_V4.find(c => c.id === id)).filter(Boolean);
  $('#cmpCount').textContent = `${picks.length} candidate${picks.length===1?'':'s'}`;
  $('#cmpBadge').textContent = picks.length;
  if (!picks.length) {
    $('#cmpBar').innerHTML = `<div class="cd-empty"><em>从总榜勾选 2-4 家公司进行对比 →</em></div>`;
    $('#cmpDims').innerHTML = '';
    $('#cmpInsights').innerHTML = '<li>未选择候选，请回到总榜勾选</li>';
    return;
  }
  $('#cmpBar').innerHTML = picks.map(c => `
    <div class="cd-item">
      <span class="cd-item-rank">#${pad2(c.rank)}</span>
      <span class="cd-item-name">${c.name}</span>
      <span class="cd-item-score mono">${c.score.toFixed(2)}</span>
      <button class="cd-remove" onclick="removeFromCompare(${c.id})" aria-label="移除">×</button>
    </div>
  `).join('');

  const colors = ['var(--plum)','var(--violet)','var(--azure)','var(--jade)'];
  const dims = ['pay','tech_now','tech_future','geo','career','wlb','endow','industry','cohort','housing'];
  $('#cmpDims').innerHTML = dims.map(k => {
    const m = DIM_META[k];
    const w = (STATE.weights[k] * 100).toFixed(0);
    return `
      <div class="cd-dim">
        <div class="cd-dim-head">
          <span class="cd-dim-name">${m.l}</span>
          <span class="cd-dim-weight">w = ${w}%</span>
        </div>
        <div class="cd-dim-track">
          <div class="cd-dim-scale"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span></div>
          <div class="cd-dim-line"></div>
          ${picks.map((c, i) => `
            <span class="cd-pt" style="left:${c[k] * 10}%">
              <i style="background:${colors[i]}"></i>
              <u>${c.name.substring(0,6)} ${c[k].toFixed(1)}</u>
            </span>`).join('')}
        </div>
      </div>`;
  }).join('');

  // Insights
  const insights = [];
  if (picks.length >= 2) {
    const sorted = [...picks].sort((a,b)=>b.score-a.score);
    insights.push(`<b>${sorted[0].name}</b> 综合得分最高（${sorted[0].score.toFixed(2)}），比 ${sorted[sorted.length-1].name} 高 ${(sorted[0].score - sorted[sorted.length-1].score).toFixed(2)}`);
    const sortedPay = [...picks].sort((a,b)=>b.pay-a.pay);
    insights.push(`<b>${sortedPay[0].name}</b> 薪资最高（${sortedPay[0].pay.toFixed(1)}），${sortedPay[0].cash_low}-${sortedPay[0].cash_high}w`);
    const sortedWlb = [...picks].sort((a,b)=>b.wlb-a.wlb);
    if (sortedWlb[0].wlb - sortedWlb[sortedWlb.length-1].wlb > 1.5) {
      insights.push(`<b>${sortedWlb[0].name}</b> WLB 优势明显（${sortedWlb[0].wlb.toFixed(1)} vs ${sortedWlb[sortedWlb.length-1].wlb.toFixed(1)}）`);
    }
    const sortedCohort = [...picks].sort((a,b)=>b.cohort-a.cohort);
    if (sortedCohort[0].cohort > 7) {
      insights.push(`<b>${sortedCohort[0].name}</b> 课题组契合最强（${sortedCohort[0].cohort.toFixed(1)}），王侃课题组方向可直接变现`);
    }
  }
  $('#cmpInsights').innerHTML = insights.map(i=>`<li>${i}</li>`).join('');
}

/* ═══ Main ═══ */
function renderAll() {
  renderHero();
  renderDims();
  renderTierLegend();
  renderRank();
  renderHeat();
  renderScatter();
  renderCurve();
}
function setupEvents() {
  $$('.chip-filter[data-f]').forEach(b => {
    b.addEventListener('click', () => {
      const f = b.dataset.f, v = b.dataset.v;
      $$(`.chip-filter[data-f=${f}]`).forEach(x => x.classList.remove('act'));
      b.classList.add('act');
      STATE['filter' + f.charAt(0).toUpperCase() + f.slice(1)] = v;
      renderRank();
    });
  });
  $('#sortSel').addEventListener('change', e => { STATE.sortBy = e.target.value; renderRank(); });
  $('#searchInp').addEventListener('input', e => { STATE.search = e.target.value; renderRank(); });

  // Topnav active
  const secs = ['persona','method','tiers','rank','heat','scatter','curve','units','timeline','settle','industry','sources'];
  window.addEventListener('scroll', () => {
    let cur = 'persona';
    secs.forEach(id => { const s = document.getElementById(id); if (s && window.scrollY >= s.offsetTop - 100) cur = id; });
    $$('#topnav a').forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + cur));
    $('#btt').classList.toggle('vis', window.scrollY > 400);
  });

  // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: 0.05, rootMargin: '0px 0px -80px 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  // Esc closes drawer
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCompare(); });
}

window.addEventListener('DOMContentLoaded', () => {
  recompute();
  renderAll();
  renderUT();
  renderTL();
  renderCalc();
  renderInd();
  setupEvents();
});
window.addEventListener('resize', () => { renderScatter(); renderCurve(); });
