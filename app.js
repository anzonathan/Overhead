// ─── DATA ─────────────────────────────────────────────────────────────────────

const APP_TODAY = { y: 2026, m: 3, d: 5 };
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Icon per block type
const ICONS = {
  spiritual:   '☀',
  health:      '◦',
  ministry:    '◈',
  'deep-work': '⊙',
  class:       '◻',
  intellectual:'◻',
  relational:  '◇',
  creative:    '♫',
  rest:        '🌙',
  sabbath:     '⊗',
};

// Schedule keyed by YYYY-MM-DD
const SCHEDULE = {
  '2026-04-05': [
    { time:'04:30', title:'Devotions',               type:'spiritual',   nonNeg:true  },
    { time:'05:10', title:'Hygiene + clean spaces',  type:'health'                    },
    { time:'09:00', title:'Church',                  type:'spiritual',   nonNeg:true  },
    { time:'12:00', title:'Family time + calls',     type:'relational'                },
    { time:'14:30', title:'Reading — Elon Musk bio', type:'intellectual'              },
    { time:'17:00', title:'Overhead UI work',        type:'intellectual'              },
    { time:'21:40', title:'Piano',                   type:'creative'                  },
    { time:'22:30', title:'Wind-down',               type:'rest'                      },
  ],
  '2026-04-06': [
    { time:'04:30', title:'Devotions',              type:'spiritual',  nonNeg:true },
    { time:'05:10', title:'Hygiene',                type:'health'                  },
    { time:'05:30', title:'Inspo block',            type:'deep-work'               },
    { time:'07:00', title:'b6e block (EPD)',         type:'ministry'                },
    { time:'10:00', title:'OOP class',              type:'class'                   },
    { time:'13:00', title:'OS batch · deep work',   type:'deep-work'               },
    { time:'15:30', title:'Linear Algebra Ch.1',    type:'intellectual'            },
    { time:'21:40', title:'Piano',                  type:'creative'                },
    { time:'22:30', title:'Wind-down',              type:'rest'                    },
  ],
  '2026-04-07': [
    { time:'04:30', title:'Devotions',            type:'spiritual',  nonNeg:true },
    { time:'05:10', title:'Hygiene',              type:'health'                  },
    { time:'05:30', title:'Inspo block',          type:'deep-work'               },
    { time:'07:00', title:'b6e block',            type:'ministry'                },
    { time:'08:00', title:'Calisthenics',         type:'health'                  },
    { time:'10:00', title:'OS class',             type:'class'                   },
    { time:'13:00', title:'Deep work — FYP',      type:'deep-work'               },
    { time:'21:40', title:'Piano',                type:'creative'                },
    { time:'22:30', title:'Wind-down',            type:'rest'                    },
  ],
  '2026-04-08': [
    { time:'04:30', title:'Devotions',            type:'spiritual',  nonNeg:true },
    { time:'05:10', title:'Hygiene',              type:'health'                  },
    { time:'05:30', title:'Inspo block',          type:'deep-work'               },
    { time:'07:00', title:'b6e block (EPD)',      type:'ministry'                },
    { time:'08:30', title:'Calisthenics',         type:'health'                  },
    { time:'10:00', title:'OS batch · deep work', type:'deep-work'               },
    { time:'13:00', title:'b6e afternoon',        type:'ministry'                },
    { time:'15:00', title:'CSEA / SWE',           type:'ministry'                },
    { time:'16:30', title:'SWE Chapter Meet',     type:'ministry'                },
    { time:'18:20', title:'Cell group',           type:'spiritual',  nonNeg:true },
    { time:'21:40', title:'Piano',                type:'creative'                },
    { time:'22:30', title:'Wind-down',            type:'rest'                    },
  ],
  '2026-04-09': [
    { time:'04:30', title:'Devotions',            type:'spiritual',  nonNeg:true },
    { time:'05:10', title:'Hygiene',              type:'health'                  },
    { time:'05:30', title:'Inspo block',          type:'deep-work'               },
    { time:'07:00', title:'b6e block',            type:'ministry'                },
    { time:'10:00', title:'DELD class',           type:'class'                   },
    { time:'13:00', title:'Deep work — The Moon', type:'deep-work'               },
    { time:'17:00', title:'Lidri website review', type:'ministry'                },
    { time:'21:40', title:'Piano',                type:'creative'                },
    { time:'22:30', title:'Wind-down',            type:'rest'                    },
  ],
  '2026-04-10': [
    { time:'04:30', title:'Devotions',               type:'spiritual',  nonNeg:true },
    { time:'05:10', title:'Hygiene',                 type:'health'                  },
    { time:'05:30', title:'Inspo block',             type:'deep-work'               },
    { time:'07:00', title:'b6e block',               type:'ministry'                },
    { time:'10:00', title:'OOP class',               type:'class'                   },
    { time:'13:00', title:'Deep work — Novice',      type:'deep-work'               },
    { time:'16:00', title:'IBM DataScience lesson',  type:'intellectual'            },
    { time:'21:40', title:'Piano',                   type:'creative'                },
    { time:'22:30', title:'Wind-down',               type:'rest'                    },
  ],
  '2026-04-11': [
    { time:'',      title:'SABBATH — Full rest',     type:'sabbath',    nonNeg:true },
    { time:'morn',  title:'Calisthenics',            type:'health'                  },
  ],
  '2026-04-12': [
    { time:'04:30', title:'Devotions',               type:'spiritual',  nonNeg:true },
    { time:'09:00', title:'Church',                  type:'spiritual',  nonNeg:true },
    { time:'12:00', title:'Family + reading',        type:'relational'              },
  ],
};

// Tasks keyed by YYYY-MM-DD
const TASKS = {
  '2026-04-05': {
    must:   [
      { text:'Devotions',          done:true  },
      { text:'Church',             done:false },
      { text:'Wind-down by 22:30', done:false },
    ],
    should: [
      { text:'Read — Elon Musk bio', done:false, hint:'30 min' },
      { text:'Call family',          done:false              },
      { text:'Write journal entry',  done:false              },
    ],
    backlog:[
      { text:'Linear Algebra Ch.1',    hint:'→ Mon 10:00' },
      { text:'b6e EPD prep',           hint:'→ Mon 07:00' },
      { text:'Lidri website',          hint:'→ Thu'       },
      { text:'CSEA Discord bot',       hint:'→ Wed'       },
      { text:'IBM DataScience lesson', hint:'→ Fri'       },
    ],
  },
  '2026-04-08': {
    must:   [
      { text:'Devotions',                  done:false },
      { text:'b6e EPD (LLM plan + memo)',  done:false },
      { text:'OS batch — deep work block', done:false },
      { text:'Cell group 18:20',           done:false },
    ],
    should: [
      { text:'CSEA slides',           done:false, hint:'trim to essentials' },
      { text:'CSEA Discord bot',      done:false                            },
      { text:'Calisthenics',          done:false, hint:'08:30'              },
    ],
    backlog:[
      { text:'Linear Algebra Ch.1',       hint:'→ Thu' },
      { text:'DELD K-Maps + assignments', hint:'→ Thu' },
      { text:'Blog post: Firefox to Zen', hint:'→ Fri' },
      { text:'Indaba article start',      hint:'→ Fri' },
      { text:'Novice backend items',      hint:'→ Fri' },
    ],
  },
};

// Goals
const GOALS = [
  { id:'spiritual',   sym:'☀',  name:'Spiritual',   color:'#b45309', goals:[
    { n:1,  text:'Daily devotions — Proverbs + Isaiah 60 + TBIOY', badge:'active' },
    { n:2,  text:'Sabbath weekly (24hr rest)',                       badge:'active' },
    { n:3,  text:'Consistent chapel + Pacesetters service',          badge:'active' },
  ]},
  { id:'ministry',    sym:'◈',  name:'Ministry',    color:'#6d28d9', goals:[
    { n:4,  text:'b6e — EPD, GTM, Foundation',                      badge:'high'   },
    { n:5,  text:'CSEA SWE chapter — Discord bot, Code Challenge',   badge:'high'   },
    { n:6,  text:'The Moon MVP',                                     badge:'high'   },
    { n:7,  text:'Novice — UCU learning platform',                   badge:'active' },
    { n:8,  text:'Lidri — convention + website + blog',              badge:'active' },
    { n:9,  text:'Moments — social, gigs, album pipeline',           badge:'active' },
  ]},
  { id:'intellectual',sym:'◉',  name:'Intellectual',color:'#0369a1', goals:[
    { n:10, text:'Final Year Project — Hive Mind Framework',         badge:'high'   },
    { n:11, text:'IBM internship / Singapore application',           badge:'high'   },
    { n:12, text:'Legal docs — Passport + Permit + Birth Cert',      badge:'high'   },
    { n:13, text:'Ship personal website',                            badge:'active' },
    { n:14, text:'OSS contributions — Django, Musescore, BeeAI',     badge:'active' },
    { n:15, text:'Build Home Lab',                                   badge:'plan'   },
    { n:16, text:'NeoVim + Arch Linux migration',                    badge:'active' },
    { n:17, text:'Piano — structured routine + repertoire',          badge:'active' },
    { n:18, text:'Read 20 books this year',                          badge:'active' },
  ]},
  { id:'health',      sym:'◎',  name:'Health',      color:'#047857', goals:[
    { n:19, text:'Calisthenics habit (Tue/Wed/Sat)',                  badge:'active' },
  ]},
  { id:'relational',  sym:'◇',  name:'Relational',  color:'#be185d', goals:[
    { n:20, text:'Weekly calls — Jeremiah, Chipo, Rutiba, Makumbi',  badge:'active' },
    { n:21, text:'Choir, family time',                               badge:'active' },
  ]},
  { id:'financial',   sym:'◆',  name:'Financial',   color:'#b45309', goals:[
    { n:22, text:'Always on a written budget',                       badge:'nonneg' },
    { n:23, text:'6-month emergency fund',                           badge:'active' },
  ]},
];

// ─── STATE ────────────────────────────────────────────────────────────────────
let currentView = 'today';
let calState    = { year: 2026, month: 3 };
let selectedDay = null;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function dateKey(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function isToday(y, m, d) {
  return y === APP_TODAY.y && m === APP_TODAY.m && d === APP_TODAY.d;
}

// ─── CLOCK (sidebar) ──────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const el = document.getElementById('sb-clock');
  if (el) el.textContent = `${h}:${m}`;
}

// ─── RENDER TODAY ─────────────────────────────────────────────────────────────
function renderToday() {
  const key  = dateKey(APP_TODAY.y, APP_TODAY.m, APP_TODAY.d);
  const date = new Date(APP_TODAY.y, APP_TODAY.m, APP_TODAY.d);
  const dd   = String(APP_TODAY.d).padStart(2, '0');
  const mon  = MONTH_NAMES[APP_TODAY.m].slice(0,3) + "'" + String(APP_TODAY.y).slice(2);
  const day  = DAY_NAMES[date.getDay()];

  const blocks = SCHEDULE[key] || [];
  const tasks  = TASKS[key];

  // Schedule rows
  const schedRows = blocks.map(b => `
    <div class="day-row">
      <span class="row-icon">${ICONS[b.type] || '·'}</span>
      <span class="row-title${b.nonNeg ? ' row-nonneg' : ''}">${b.title}</span>
      <span class="row-time">${b.time}</span>
    </div>`).join('');

  // Task rows (must + should + backlog)
  let taskRows = '';
  if (tasks) {
    const toRow = (item, muted=false) => `
      <div class="day-row${item.done ? ' done' : ''}${muted ? ' muted' : ''}" onclick="toggleRowTask(this)">
        <span class="row-cb${item.done ? ' checked' : ''}">✓</span>
        <span class="row-title">${item.text}${item.hint ? `<span style="font-size:11px;color:#bbb;margin-left:6px;">${item.hint}</span>` : ''}</span>
        <span class="row-time"></span>
      </div>`;

    if (tasks.must.length)   taskRows += `<div class="list-section">must</div>` + tasks.must.map(i => toRow(i)).join('');
    if (tasks.should.length) taskRows += `<div class="list-section">should</div>` + tasks.should.map(i => toRow(i)).join('');
    if (tasks.backlog.length) taskRows += `<div class="list-section">backlog</div>` + tasks.backlog.map(i => toRow(i, true)).join('');
  }

  return `
    <div class="view-wrap">
      <div class="today-hero">
        <div class="hero-left">
          <span class="hero-num">${dd}</span>
          <span class="hero-dot"></span>
        </div>
        <div class="hero-right">
          <div class="hero-month">${mon}</div>
          <div class="hero-day">${day}</div>
        </div>
      </div>
      <div class="day-list">
        ${schedRows}
        ${taskRows}
      </div>
    </div>`;
}

// ─── RENDER WEEK ──────────────────────────────────────────────────────────────
function renderWeek() {
  const { year, month } = calState;
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const ths = ['sun','mon','tue','wed','thu','fri','sat']
    .map((d,i) => `<th class="${i===6?'sat-col':''}">${d}</th>`).join('');

  let cells = '', dayCount = 1;
  const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < total; i++) {
    const col = i % 7;
    if (col === 0) cells += '<tr>';

    if (i < firstDay || dayCount > daysInMonth) {
      cells += '<td class="empty"></td>';
    } else {
      const d       = dayCount;
      const key     = dateKey(year, month, d);
      const isSab   = col === 6;
      const isT     = isToday(year, month, d);
      const isSel   = selectedDay && selectedDay.d===d && selectedDay.m===month && selectedDay.y===year;
      const cls     = [isSab?'sabbath':'', isT?'today':'', isSel?'selected':''].filter(Boolean).join(' ');
      const blocks  = SCHEDULE[key] || [];

      const preview = isSab
        ? `<div class="cal-sabbath-tag">⊗ sabbath</div>`
        : blocks.slice(0, 4).map(b => `
            <div class="cal-ev">
              <span class="cal-ev-t">${b.time}</span>
              <span class="cal-ev-n">${b.title.toLowerCase()}</span>
            </div>`).join('') +
          (blocks.length > 4 ? `<div class="cal-ev-more">+${blocks.length-4}</div>` : '');

      cells += `
        <td class="${cls}" data-day="${d}" data-month="${month}" data-year="${year}">
          <div class="cal-day-num">${d}</div>
          ${preview}
        </td>`;
      dayCount++;
    }
    if (col === 6) cells += '</tr>';
  }

  let detail = '';
  if (selectedDay) {
    const key    = dateKey(selectedDay.y, selectedDay.m, selectedDay.d);
    const date   = new Date(selectedDay.y, selectedDay.m, selectedDay.d);
    const isSab  = date.getDay() === 6;
    const blocks = SCHEDULE[key] || [];

    const schedRows = isSab
      ? `<p style="color:#e53e3e;font-family:var(--mono);font-size:12px;">⊗ SABBATH — no work scheduled</p>`
      : blocks.map(b => `
          <div class="day-row">
            <span class="row-icon">${ICONS[b.type]||'·'}</span>
            <span class="row-title${b.nonNeg?' row-nonneg':''}">${b.title}</span>
            <span class="row-time">${b.time}</span>
          </div>`).join('');

    detail = `
      <div class="cal-detail">
        <h3>${DAY_NAMES[date.getDay()]}, ${selectedDay.d} ${MONTH_NAMES[selectedDay.m]}</h3>
        ${schedRows}
      </div>`;
  }

  return `
    <div class="view-wrap">
      <div class="week-hero">
        <h1>${MONTH_NAMES[month]} ${year}</h1>
        <div class="cal-btns">
          <button id="cal-prev">←</button>
          <button id="cal-next">→</button>
        </div>
      </div>
      <table class="cal-table">
        <thead><tr>${ths}</tr></thead>
        <tbody>${cells}</tbody>
      </table>
      ${detail}
    </div>`;
}

// ─── RENDER GOALS ─────────────────────────────────────────────────────────────
function renderGoals() {
  const badgeMap = {
    active:['b-active','ACTIVE'], high:['b-high','HIGH'],
    plan:  ['b-plan','PLAN'],     nonneg:['b-nonneg','NON-NEG'],
  };

  const areas = GOALS.map(area => {
    const rows = area.goals.map(g => {
      const [cls, label] = badgeMap[g.badge] || ['b-active','ACTIVE'];
      return `
        <div class="goal-row">
          <span class="goal-num">${g.n}</span>
          <span class="goal-txt">${g.text}</span>
          <span class="badge ${cls}">${label}</span>
        </div>`;
    }).join('');

    return `
      <details class="area">
        <summary>
          <span class="area-sym" style="color:${area.color}">${area.sym}</span>
          <span class="area-name">${area.name}</span>
          <span class="area-cnt">${area.goals.length}</span>
          <span class="chevron">›</span>
        </summary>
        <div class="area-goals">
          ${rows}
          <div class="goal-add-row">
            <span class="goal-add-btn" onclick="showGoalTaskForm(this)">+ task</span>
            <div class="goal-add-form">
              <span style="font-family:var(--mono);font-size:12px;color:#ccc;">[ ]</span>
              <input type="text" class="add-task-input"
                placeholder="new task under ${area.name.toLowerCase()}..."
                onkeydown="submitGoalTask(event,this)">
            </div>
          </div>
        </div>
      </details>`;
  }).join('');

  const total = GOALS.reduce((s, a) => s + a.goals.length, 0);
  return `
    <div class="view-wrap">
      <div class="goals-hero">
        <h1>Goal Tree</h1>
        <p>${total} goals · 6 life areas</p>
      </div>
      ${areas}
    </div>`;
}

// ─── TASK INTERACTIONS ────────────────────────────────────────────────────────
function toggleRowTask(el) {
  if (el.classList.contains('muted')) return;
  const cb = el.querySelector('.row-cb');
  if (!cb) return;
  const done = cb.classList.toggle('checked');
  el.classList.toggle('done', done);
}

function showGoalTaskForm(btn) {
  btn.style.display = 'none';
  const form = btn.nextElementSibling;
  form.style.display = 'flex';
  form.querySelector('input').focus();
}

function submitGoalTask(e, input) {
  if (e.key === 'Escape') {
    const form = input.closest('.goal-add-form');
    form.style.display = 'none';
    form.previousElementSibling.style.display = '';
    return;
  }
  if (e.key !== 'Enter') return;
  const text = input.value.trim();
  if (!text) return;
  const form    = input.closest('.goal-add-form');
  const addRow  = form.closest('.goal-add-row');
  const list    = form.closest('.area-goals');
  const item    = document.createElement('div');
  item.className = 'goal-row new-goal';
  item.innerHTML = `
    <span class="goal-num">·</span>
    <span class="goal-txt">${text}</span>
    <span class="badge b-active">TASK</span>`;
  list.insertBefore(item, addRow);
  input.value = '';
}

// ─── MODAL (FAB) ─────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('add-modal').classList.add('open');
  document.getElementById('modal-input').focus();
}
function closeModal() {
  document.getElementById('add-modal').classList.remove('open');
  document.getElementById('modal-input').value = '';
}
function submitModal() {
  const text = document.getElementById('modal-input').value.trim();
  if (!text) return;
  // If we're in today view, add the task to the DOM live
  if (currentView === 'today') {
    const list = document.querySelector('.day-list');
    if (list) {
      const row = document.createElement('div');
      row.className = 'day-row';
      row.setAttribute('onclick', 'toggleRowTask(this)');
      row.innerHTML = `
        <span class="row-cb">✓</span>
        <span class="row-title">${text}</span>
        <span class="row-time"></span>`;
      list.appendChild(row);
    }
  }
  closeModal();
}

// ─── RENDER & ROUTER ─────────────────────────────────────────────────────────
function navigate(view) {
  currentView = view;
  document.querySelectorAll('.sb-link').forEach(a =>
    a.classList.toggle('active', a.dataset.view === view)
  );
  render();
}

function render() {
  const main = document.getElementById('view');
  switch (currentView) {
    case 'today': main.innerHTML = renderToday(); break;
    case 'week':  main.innerHTML = renderWeek();  break;
    case 'goals': main.innerHTML = renderGoals(); break;
  }
  attachEvents();
}

function attachEvents() {
  document.querySelectorAll('.sb-link').forEach(a => {
    a.onclick = e => { e.preventDefault(); navigate(a.dataset.view); };
  });

  const prev = document.getElementById('cal-prev');
  const next = document.getElementById('cal-next');
  if (prev) prev.onclick = () => { calState.month--; if (calState.month<0){calState.month=11;calState.year--;} selectedDay=null; render(); };
  if (next) next.onclick = () => { calState.month++; if (calState.month>11){calState.month=0;calState.year++;} selectedDay=null; render(); };

  document.querySelectorAll('.cal-table td[data-day]').forEach(td => {
    td.onclick = () => {
      if (td.classList.contains('sabbath')) return;
      selectedDay = { y:+td.dataset.year, m:+td.dataset.month, d:+td.dataset.day };
      render();
    };
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
updateClock();
setInterval(updateClock, 30_000);
render();

// FAB / Modal
document.getElementById('fab').onclick = openModal;
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal-submit').onclick = submitModal;
document.getElementById('modal-input').onkeydown = e => { if (e.key==='Enter') submitModal(); if (e.key==='Escape') closeModal(); };
document.getElementById('add-modal').onclick = e => { if (e.target === e.currentTarget) closeModal(); };
