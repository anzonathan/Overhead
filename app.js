// ─── DATA ACCESSORS & HELPERS ────────────────────────────────────────────────

const _now = new Date(); const APP_TODAY = { y: _now.getFullYear(), m: _now.getMonth(), d: _now.getDate() };
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getGoal(id) { return GOALS.find(g => g.id === id); }
function getArea(id) { return AREAS.find(a => a.id === id); }

function getTasksForDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const dt = new Date(+y, +m-1, +d);
  dt.setDate(dt.getDate() - 1);
  const prevKey = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  
  const spilling = TASKS.filter(t => {
    if (t.title === '__DELETED__') return false;
    if (t.date !== prevKey) return false;
    if (!t.time || !t.time.includes('-')) return false;
    const [s, e] = t.time.split('-').map(x => parseMinutes(x.trim()));
    return e < s;
  }).map(t => ({ ...t, sortTime: 0, time: `00:00 - ${t.time.split('-')[1].trim()}` }));

  const today = TASKS.filter(t => t.date === dateStr && t.title !== '__DELETED__').map(t => {
    let st = 0;
    if (t.time && t.time.includes('-')) st = parseMinutes(t.time.split('-')[0].trim());
    else if (t.time) st = parseMinutes(t.time.trim());
    return { ...t, sortTime: st };
  });

  return [...spilling, ...today].sort((a,b) => a.sortTime - b.sortTime);
}

// ─── LOCAL STATE ──────────────────────────────────────────────────────────────
let currentView = 'today';
let calState    = { year: _now.getFullYear(), month: _now.getMonth() };
let selectedDay = null;
let goalFilter  = '';

let AREAS = [];
let GOALS = [];
let TASKS = [];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function dateKey(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function isToday(y, m, d) {
  return y === APP_TODAY.y && m === APP_TODAY.m && d === APP_TODAY.d;
}
function getHebrewDate(date) {
  const jewishMonths = ["Nisan", "Iyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Shvat", "Adar"];
  const m = jewishMonths[(date.getMonth() + 3) % 12]; // crude mock
  const y = date.getFullYear() + 3760;
  return `${m} ${y}`;
}

// ─── CLOCK (sidebar) ──────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const el = document.getElementById('sb-clock');
  if (el) el.textContent = `${h}:${m}`;
  const mClock = document.getElementById('mobile-clock');
  if (mClock) mClock.textContent = `${h}:${m}`;
}

function closeModal() {
  document.getElementById('add-modal').style.display = 'none';
  editTaskId = null;
  editGoalId = null;
  goalParentId = null;
  goalAreaId = null;
  editAreaId = null;
  modalTargetDate = null;
}

// ─── RENDER TODAY ─────────────────────────────────────────────────────────────
function parseMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  return parseInt(parts[0] || 0) * 60 + parseInt(parts[1] || 0);
}

function calcScheduledMins(tasks) {
  let total = 0;
  tasks.forEach(t => {
    if (t.time && t.time.includes('-')) {
      const [sStr, eStr] = t.time.split('-').map(x => x.trim());
      const s = parseMinutes(sStr), e = parseMinutes(eStr);
      if (e < s) {
        total += (1440 - s);
      } else {
        total += (e - s);
      }
    }
  });
  return total;
}

function renderToday() {
  const key  = dateKey(APP_TODAY.y, APP_TODAY.m, APP_TODAY.d);
  const date = new Date(APP_TODAY.y, APP_TODAY.m, APP_TODAY.d);
  const dd   = String(APP_TODAY.d).padStart(2, '0');
  const mon  = MONTH_NAMES[APP_TODAY.m].slice(0,3) + "'" + String(APP_TODAY.y).slice(2);
  const day  = DAY_NAMES[date.getDay()];
  const jewishDate = getHebrewDate(date);

  const tasks = getTasksForDate(key);
  const scheduled = tasks.filter(t => t.time && t.time.trim());
  const unscheduled = tasks.filter(t => !t.time || !t.time.trim());

  const scheduledMins = calcScheduledMins(scheduled);
  const totalMins = 24 * 60;
  const pct = Math.min(100, Math.round((scheduledMins / totalMins) * 100));
  const hrs = Math.floor(scheduledMins / 60);
  const mins = scheduledMins % 60;
  const freeH = Math.floor((totalMins - scheduledMins) / 60);
  const freeM = (totalMins - scheduledMins) % 60;

  function renderTaskRow(t, isSubtask = false) {
    const goal = t.goalId ? getGoal(t.goalId) : null;
    const area = goal ? getArea(goal.area) : null;
    const sym = area ? area.sym : '·';
    const label = t.title || (goal ? goal.title : 'Untitled');
    const timeLabel = (t.time && !isSubtask) ? `<span class="row-time">${t.time}</span>` : '';

    const subtasks = tasks.filter(st => st.parentId === t.id && st.title !== '__DELETED__');
    const hasSubtasks = subtasks.length > 0;

    const rowContent = `
      <div class="day-row${t.done ? ' done' : ''}">
        <span class="row-icon" title="${goal ? goal.area : 'none'}">${sym}</span>
        <span class="row-title" onclick="openModal('${t.id}')" style="cursor:pointer">${label}</span>
        ${timeLabel}
        <button class="sub-add-btn" onclick="openModal(null, '${key}', '${t.id}')">+</button>
        <span class="row-cb${t.done ? ' checked' : ''}" onclick="toggleRowTask(event, '${t.id}')">✓</span>
      </div>`;

    if (hasSubtasks) {
      const subtaskHtml = subtasks.map(st => renderTaskRow(st, true)).join('');
      return `
        <details class="task-node depth-${isSubtask ? 'sub' : 'root'}" open>
          <summary>${rowContent}</summary>
          <div class="task-children" style="margin-left: 24px; border-left: 1px solid var(--rule); padding-left: 10px;">
            ${subtaskHtml}
          </div>
        </details>
      `;
    }

    return rowContent;
  }

  const scheduledRows = scheduled.filter(t => !t.parentId).map(t => renderTaskRow(t)).join('');
  const unscheduledRows = unscheduled.filter(t => !t.parentId).map(t => renderTaskRow(t)).join('');

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const taskPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return `
    <div class="view-wrap">
      <div class="today-hero">
        <div class="hero-left">
          <span class="hero-num">${dd}</span>
          <span class="hero-dot"></span>
        </div>
        <div class="hero-right">
          <div class="hero-month" style="font-family:var(--mono);color:var(--ink-2);font-size:11px;margin-bottom:2px;">${jewishDate}</div>
          <div class="hero-month">${mon}</div>
          <div class="hero-day">${day}</div>
        </div>
      </div>

      <div style="font-family:var(--mono); font-size:10px; color:var(--ink-2); margin-bottom:16px; display:flex; justify-content:space-between;">
        <span>${doneTasks}/${totalTasks} tasks done</span>
        <span>${taskPct}%</span>
      </div>

      ${scheduledRows ? `<div class="list-section">Scheduled</div><div class="day-list">${scheduledRows}</div>` : ''}
      ${unscheduledRows ? `<div class="list-section">Unscheduled</div><div class="day-list">${unscheduledRows}</div>` : ''}
      ${!scheduledRows && !unscheduledRows ? '<p style="color:var(--ink-2);font-family:var(--mono);font-size:12px;">No tasks assigned today.</p>' : ''}
    </div>`;
}

// ─── RENDER WEEK ──────────────────────────────────────────────────────────────
function renderWeek() {
  const todayDate = new Date();
  
  let html = `<div class="view-wrap">
    <div class="week-hero">
      <h1>This Week</h1>
    </div><div class="week-list">`;
    
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + i);
    const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    const isSab = d.getDay() === 6;
    const tasks = getTasksForDate(key);
    
    function renderTaskRow(t, isSubtask = false) {
      const goal = t.goalId ? getGoal(t.goalId) : null;
      const area = goal ? getArea(goal.area) : null;
      const sym = area ? area.sym : '·';
      const label = t.title || (goal ? goal.title : 'Untitled');
      const timeLabel = (t.time && !isSubtask) ? `<span class="row-time">${t.time}</span>` : '';
      
      const subtasks = tasks.filter(st => st.parentId === t.id && st.title !== '__DELETED__');
      const hasSubtasks = subtasks.length > 0;

      const rowContent = `
        <div class="day-row${t.done ? ' done':''}" style="padding:6px 0;">
          <span class="row-icon">${sym}</span>
          <span class="row-title" onclick="openModal('${t.id}')" style="cursor:pointer;font-size:14px;">${label}</span>
          ${timeLabel}
          <button class="sub-add-btn" onclick="openModal(null, '${key}', '${t.id}')">+</button>
          <span class="row-cb${t.done ? ' checked' : ''}" onclick="toggleRowTask(event, '${t.id}')">✓</span>
        </div>`;

      if (hasSubtasks) {
        const subHtml = subtasks.map(st => renderTaskRow(st, true)).join('');
        return `
          <details class="task-node depth-${isSubtask ? 'sub' : 'root'}" open>
            <summary>${rowContent}</summary>
            <div class="task-children" style="margin-left: 20px; border-left: 1px solid var(--rule); padding-left: 10px;">
              ${subHtml}
            </div>
          </details>
        `;
      }
      return rowContent;
    }

    let taskHtml = isSab
      ? `<p style="color:#dc2626;font-family:var(--mono);font-size:11px;margin-bottom:12px;">⊗ SABBATH — no tasks scheduled</p>`
      : tasks.filter(t => !t.parentId).map(t => renderTaskRow(t)).join('');

    const addBtn = isSab ? '' : `<div style="margin-top:2px;"><button class="sub-add-btn" onclick="openModalForDate('${key}')" title="Add task in this day">+</button></div>`;

    html += `
      <div style="margin-bottom:24px;">
        <h3 style="font-size:16px; margin-bottom:8px; border-bottom:1.5px solid var(--ink); display:inline-block;">${DAY_NAMES[d.getDay()]}, ${d.getDate()}</h3>
        ${taskHtml || '<p style="color:var(--ink-2);font-family:var(--mono);font-size:11px;">No tasks.</p>'}
        ${addBtn}
      </div>
    `;
  }
  html += `</div></div>`;
  return html;
}

// ─── RENDER MONTH ─────────────────────────────────────────────────────────────
function renderMonth() {
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
      
      const tasksToday = getTasksForDate(key);
      const rootTasksToday = tasksToday.filter(t => !t.parentId);

      const preview = isSab
        ? `<div class="cal-sabbath-tag">⊗ sabbath</div>`
        : rootTasksToday.slice(0, 4).map(t => {
            const g = getGoal(t.goalId);
            return `
              <div class="cal-ev${t.done ? ' done':''}">
                <span class="cal-ev-t">${t.time}</span>
                <span class="cal-ev-n">${g ? g.title.toLowerCase() : (t.title || '...')}</span>
              </div>`;
          }).join('') +
          (rootTasksToday.length > 4 ? `<div class="cal-ev-more">+${rootTasksToday.length-4}</div>` : '');

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
    const tasks  = getTasksForDate(key);

    function renderTaskRow(t, isSubtask = false) {
      const goal = getGoal(t.goalId);
      const label = t.title || (goal ? goal.title : 'Untitled');
      const area = goal ? getArea(goal.area) : null;
      const sym = area ? area.sym : '·';
      const timeLabel = (t.time && !isSubtask) ? `<span class="row-time">${t.time}</span>` : '';
      
      const subtasks = tasks.filter(st => st.parentId === t.id && st.title !== '__DELETED__');
      
      const rowContent = `
        <div class="day-row${t.done ? ' done':''}">
          <span class="row-icon">${sym}</span>
          <span class="row-title" onclick="openModal('${t.id}')" style="cursor:pointer">${label}</span>
          ${timeLabel}
          <button class="sub-add-btn" onclick="openModal(null, '${key}', '${t.id}')">+</button>
          <span class="row-cb${t.done ? ' checked' : ''}" onclick="toggleRowTask(event, '${t.id}')">✓</span>
        </div>`;

      if (subtasks.length > 0) {
        return `
          <details class="task-node" open>
            <summary>${rowContent}</summary>
            <div class="task-children" style="margin-left:20px; border-left:1px solid var(--rule); padding-left:10px;">
              ${subtasks.map(st => renderTaskRow(st, true)).join('')}
            </div>
          </details>
        `;
      }
      return rowContent;
    }

    const schedRows = isSab
      ? `<p style="color:#e53e3e;font-family:var(--mono);font-size:12px;">⊗ SABBATH — no tasks scheduled</p>`
      : tasks.filter(t => !t.parentId).map(t => renderTaskRow(t)).join('');

    const addBtnMonth = isSab ? '' : `<span onclick="openModalForDate('${key}')" style="cursor:pointer;font-family:var(--mono);font-size:12px;color:var(--ink-2);margin-left:8px;" title="Add task">+ add task</span>`;

    detail = `
      <div class="cal-detail">
        <h3>${DAY_NAMES[date.getDay()]}, ${selectedDay.d} ${MONTH_NAMES[selectedDay.m]} ${addBtnMonth}</h3>
        ${schedRows}
      </div>`;
  }

  const hebrewApprox = getHebrewDate(new Date(year, month, 15));
  const monthTag = `<span style="font-family:var(--sans); font-size:16px; color:var(--ink-2); margin-left:12px; font-weight:400;">${hebrewApprox}</span>`;

  return `
    <div class="view-wrap">
      <div class="week-hero">
        <h1>${MONTH_NAMES[month]} ${year}${monthTag}</h1>
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
function renderGoalNode(goalId, depth) {
  const goal = getGoal(goalId);
  if (!goal) return '';
  
  let match = true;
  if (goalFilter) match = (goal.scale === goalFilter);
  
  let childrenHtml = '';
  const hasChildren = goal.subgoals && goal.subgoals.length > 0;
  if (hasChildren) {
    childrenHtml = goal.subgoals.map(sid => renderGoalNode(sid, depth+1)).join('');
  }
  
  if (!match && !childrenHtml && goalFilter) return '';

  const typeSym = goal.type === 'loop' ? '↻' : '→';
  const badgeClass = goal.scale === 'life' ? 'b-life' : (goal.scale === 'annual' ? 'b-plan' : (goal.scale === 'monthly' ? 'b-nonneg' : (goal.scale === 'weekly' ? 'b-high' : 'b-active')));
  
  const content = `
    <div class="goal-row">
      <span class="goal-type-sym">${typeSym}</span>
      <span class="goal-txt" style="cursor:pointer;" onclick="openGoalModal('${goal.id}')">${goal.title}</span>
      <span class="badge ${badgeClass}">${goal.scale.toUpperCase()}</span>
      <button class="sub-add-btn" onclick="openGoalModal(null, '${goal.id}')">+</button>
    </div>
  `;

  if (hasChildren) {
    return `
      <details class="goal-node depth-${depth}" open>
        <summary>${content}</summary>
        <div class="goal-children">
          ${childrenHtml}
        </div>
      </details>
    `;
  }

  return `
    <div class="goal-node depth-${depth}">
      ${content}
    </div>`;
}

function updateGoalFilter(val) {
  goalFilter = val;
  render();
}

function renderGoals() {
  let areasHTML = '';
  AREAS.forEach(area => {
    const rootsInArea = GOALS.filter(g => g.area === area.id && !GOALS.some(parent => parent.subgoals && parent.subgoals.includes(g.id)));
    
    // Evaluate if any goals in this area will actually render
    let areaHtml = rootsInArea.map(g => renderGoalNode(g.id, 0)).join('');
    
    if (goalFilter && !areaHtml) return; // Hide area completely if no matches
    
    areasHTML += `
      <details class="area" open>
        <summary>
          <span class="area-sym">${area.sym}</span>
          <span class="area-name" onclick="event.preventDefault(); openAreaModal('${area.id}')" style="cursor:pointer" title="Edit Category">${area.name}</span>
          <span class="area-cnt">${rootsInArea.length} root</span>
          <span class="chevron">▶</span>
        </summary>
        <div class="area-goals">
          ${areaHtml}
          <div class="goal-add-row">
            <span class="goal-add-btn" onclick="openGoalModal(null, null, '${area.id}')">+ new root goal</span>
          </div>
        </div>
      </details>`;
  });

  return `
    <div class="view-wrap">
      <div class="goals-hero" style="display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:8px; gap: 16px;">
        <div>
          <h1>Goal Tree</h1>
          <p>${GOALS.length} goals · Multi-scale planning</p>
        </div>
        <div class="horizon-filter">
          <div class="horizon-btn b-active ${goalFilter === '' ? '' : 'inactive'}" onclick="updateGoalFilter('')" title="All Horizons">*</div>
          <div class="horizon-btn b-life ${goalFilter === '' || goalFilter === 'life' ? '' : 'inactive'}" onclick="updateGoalFilter('life')" title="Life">L</div>
          <div class="horizon-btn b-plan ${goalFilter === '' || goalFilter === 'annual' ? '' : 'inactive'}" onclick="updateGoalFilter('annual')" title="Annual">A</div>
          <div class="horizon-btn b-nonneg ${goalFilter === '' || goalFilter === 'monthly' ? '' : 'inactive'}" onclick="updateGoalFilter('monthly')" title="Monthly">M</div>
          <div class="horizon-btn b-high ${goalFilter === '' || goalFilter === 'weekly' ? '' : 'inactive'}" onclick="updateGoalFilter('weekly')" title="Weekly">W</div>
          <div class="horizon-btn b-active ${goalFilter === '' || goalFilter === 'daily' ? '' : 'inactive'}" onclick="updateGoalFilter('daily')" title="Daily">D</div>
        </div>
      </div>
      ${areasHTML}
      <div style="margin-top:24px; padding-left:10px;">
        <span class="goal-add-btn" onclick="openAreaModal()" style="font-size:13px;">+ new category</span>
      </div>
    </div>`;
}

// ─── TASK INTERACTIONS ────────────────────────────────────────────────────────
async function toggleRowTask(e, taskId) {
  const cb = e.currentTarget;
  const el = cb.closest('.day-row');
  if (el.classList.contains('muted')) return;
  const done = cb.classList.toggle('checked');
  el.classList.toggle('done', done);
  
  const t = TASKS.find(x => x.id === taskId);
  if (t) {
    await updateTaskStatusRecursive(t, done);
  }
}

async function updateTaskStatusRecursive(task, done) {
  task.done = done;
  
  // 1. Handle children: if we check a parent, check all children. If we uncheck, uncheck all.
  const children = TASKS.filter(st => st.parentId === task.id && st.title !== '__DELETED__');
  for (const child of children) {
    if (child.done !== done) {
      await updateTaskStatusRecursive(child, done);
    }
  }

  // 2. Persist the current task
  if (task.isVirtual) {
    delete task.isVirtual;
    await fetch(`/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
  } else {
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
  }

  // 3. Handle parent: if we check a child, check parent if ALL siblings are done.
  // If we uncheck a child, uncheck parent.
  if (task.parentId) {
    const parent = TASKS.find(p => p.id === task.parentId);
    if (parent) {
      const siblings = TASKS.filter(s => s.parentId === parent.id && s.title !== '__DELETED__');
      const allDone = siblings.every(s => s.done);
      if (parent.done !== allDone) {
        await updateTaskStatusRecursive(parent, allDone);
      }
    }
  }
}

let editTaskId = null;
let modalTargetDate = null;
let taskParentId = null;

function cycleMobileView() {
  const views = ['today', 'week', 'month', 'goals'];
  const icons = ['○', 'w', '▦', '≡'];
  let idx = views.indexOf(currentView);
  idx = (idx + 1) % views.length;
  document.getElementById('mobile-toggle-icon').innerText = icons[idx];
  navigate(views[idx]);
}

function openModalForDate(dateStr) {
  modalTargetDate = dateStr;
  openModal(null);
}

function openModal(taskId = null, dateStr = null, parentId = null) {
  editTaskId = taskId;
  taskParentId = parentId;
  modalTargetDate = dateStr || modalTargetDate;

  document.getElementById('add-modal').style.display = 'flex';
  const inputEl = document.getElementById('modal-input');
  
  let st = "", et = "";
  let curGoalId = "";
  let isSubtask = !!parentId;
  
  if (taskId) {
    document.getElementById('modal-title').innerText = 'Edit Task';
    const t = TASKS.find(x => x.id === taskId);
    if (t) {
      inputEl.value = t.title || '';
      curGoalId = t.goalId;
      taskParentId = t.parentId;
      isSubtask = !!t.parentId;
      if (t.time && t.time.includes('-')) {
        const pts = t.time.split('-');
        st = pts[0].trim(); et = pts[1].trim();
      } else if (t.time) { st = t.time; et = ""; }
    }
  } else {
    document.getElementById('modal-title').innerText = parentId ? 'New Subtask' : 'Schedule Task';
    inputEl.value = '';
    inputEl.placeholder = parentId ? 'What subtask?' : 'Optional specific task...';
    if (parentId) {
      const p = TASKS.find(p => p.id === parentId);
      if (p) curGoalId = p.goalId;
    }
  }
  
  inputEl.focus();
  
  let options = '<option value="">(No Goal)</option>';
  AREAS.forEach(a => {
    options += `<optgroup label="${a.name}">`;
    const areaGoals = GOALS.filter(g => g.area === a.id);
    areaGoals.forEach(g => {
      const sel = (g.id === curGoalId) ? 'selected' : '';
      options += `<option value="${g.id}" ${sel}>${g.title}</option>`;
    });
    options += `</optgroup>`;
  });
  // Also list orphan goals (no area)
  const orphanGoals = GOALS.filter(g => !g.area || !getArea(g.area));
  if (orphanGoals.length) {
    options += `<optgroup label="Other">`;
    orphanGoals.forEach(g => {
      const sel = (g.id === curGoalId) ? 'selected' : '';
      options += `<option value="${g.id}" ${sel}>${g.title}</option>`;
    });
    options += `</optgroup>`;
  }

  const delBtn = taskId ? `<span title="Delete Task" onclick="deleteTask('${taskId}')" style="font-size:15px; cursor:pointer; color:var(--ink-2); display:flex; align-items:center; padding-left:4px; transition:color .1s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--ink-2)'">🗑</span>` : '';

  const timeRowDisplay = isSubtask ? 'none' : 'flex';

  document.getElementById('modal-fields').innerHTML = `
    <div style="flex:1;">
      <select id="modal-goal-sel" style="width:100%;background:var(--surface); border:1px solid #ccc; border-radius:4px; padding:4px 8px; font-family:var(--mono); font-size:11px;">
        ${options}
      </select>
    </div>
    <div style="display:${timeRowDisplay};gap:4px;align-items:center;">
      <input type="time" id="modal-time-start" style="background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; border-radius:4px; padding:4px; font-family:var(--mono); font-size:11px;" value="${st}" />
      <span style="color:var(--ink-2);font-size:10px;">-</span>
      <input type="time" id="modal-time-end" style="background:#fef2f2; color:#991b1b; border:1px solid #fecaca; border-radius:4px; padding:4px; font-family:var(--mono); font-size:11px;" value="${et}" />
    </div>
    ${delBtn}
  `;
  document.getElementById('modal-submit').onclick = submitModal;
}

async function submitModal() {
  const isSubtask = !!taskParentId;
  const st = !isSubtask ? (document.getElementById('modal-time-start')?.value || '') : '';
  const et = !isSubtask ? (document.getElementById('modal-time-end')?.value || '') : '';
  let mergedTime = st;
  if(st && et) mergedTime = `${st} - ${et}`;
  
  const titleText = document.getElementById('modal-input').value.trim();
  const goalId = document.getElementById('modal-goal-sel').value || '';
  if (!titleText && !goalId) return;

  // Conflict detection: only if NOT a subtask
  const targetKey = modalTargetDate || dateKey(APP_TODAY.y, APP_TODAY.m, APP_TODAY.d);
  
  if (!isSubtask && st && et) {
    const newStart = parseMinutes(st);
    const newEnd = parseMinutes(et);
    const dayTasks = getTasksForDate(targetKey).filter(t => t.id !== editTaskId);
    for (const existing of dayTasks) {
      if (existing.time && existing.time.includes('-')) {
        const [es, ee] = existing.time.split('-').map(x => x.trim());
        const exStart = parseMinutes(es);
        let exEnd = parseMinutes(ee);
        if (exEnd < exStart) exEnd += 24 * 60;
        
        let nEnd = newEnd;
        if (nEnd < newStart) nEnd += 24 * 60;

        if (newStart < exEnd && nEnd > exStart) {
          const label = existing.title || 'another task';
          alert(`Time conflict! "${label}" already occupies ${existing.time}.`);
          return;
        }
      }
    }
  } 
  
  if (editTaskId) {
    const t = TASKS.find(x => x.id === editTaskId);
    if (t) {
      t.title = titleText;
      t.goalId = goalId;
      t.time = mergedTime;
      t.parentId = taskParentId || '';
      
      if (t.isVirtual) {
        delete t.isVirtual;
        await fetch(`/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t)
        });
      } else {
        await fetch(`/api/tasks/${t.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t)
        });
      }
    }
  } else {
    const newTask = {
      id: 't' + Date.now(),
      date: targetKey,
      goalId: goalId,
      parentId: taskParentId || '',
      title: titleText,
      time: mergedTime,
      done: false
    };
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
  }
  
  await loadData();
  closeModal();
}

async function deleteTask(taskId) {
  const t = TASKS.find(x => x.id === taskId);
  if (!t) return;

  // Recursive deletion for children
  const children = TASKS.filter(c => c.parentId === taskId && c.title !== '__DELETED__');
  for (const child of children) {
    await deleteTask(child.id);
  }

  if (taskId.startsWith('t_loop_')) {
    t.title = '__DELETED__';
    t.time = '';
    if (t.isVirtual) {
      delete t.isVirtual;
      await fetch(`/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
    } else {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
    }
  } else {
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
  }
  
  closeModal();
  await loadData();
}

// ─── GOAL MODAL ──────────────────────────────────────────────────────────────
let editGoalId = null;
let goalParentId = null;
let goalAreaId = null;

function openGoalModal(goalId = null, parentId = null, areaId = null) {
  editGoalId = goalId;
  goalParentId = parentId;
  goalAreaId = areaId;
  
  document.getElementById('add-modal').style.display = 'flex';
  const inputEl = document.getElementById('modal-input');
  
  let scale = 'annual';
  let type = 'linear';
  let defSt = '';
  let defEt = '';
  let recDays = [0,1,2,3,4,5]; // default: Sun-Fri (exclude Sabbath)
  
  if (goalId) {
    document.getElementById('modal-title').innerText = 'Edit Goal';
    const g = getGoal(goalId);
    if (g) {
      inputEl.value = g.title || '';
      scale = g.scale;
      type = g.type;
      if (g.defaultTime && g.defaultTime.includes('-')) {
        const pts = g.defaultTime.split('-');
        defSt = pts[0].trim(); defEt = pts[1].trim();
      }
      if (g.recurrenceDays) {
        try { recDays = JSON.parse(g.recurrenceDays); } catch(e) {}
      }
    }
  } else {
    document.getElementById('modal-title').innerText = parentId ? 'New Sub-goal' : 'New Goal';
    inputEl.value = '';
    inputEl.placeholder = 'Goal title...';
    if (parentId) {
      const p = getGoal(parentId);
      if (p) scale = p.scale === 'life' ? 'annual' : (p.scale === 'annual' ? 'monthly' : 'weekly');
    }
  }
  
  inputEl.focus();

  const delBtn = goalId ? `<span title="Delete Goal" onclick="deleteGoal('${goalId}')" style="font-size:15px; cursor:pointer; color:var(--ink-2); display:flex; align-items:center; padding-left:4px; transition:color .1s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--ink-2)'">🗑</span>` : '';

  document.getElementById('modal-fields').innerHTML = `
    <div style="flex:1; display:flex; gap:8px;">
      <select id="modal-goal-scale" style="flex:1; background:var(--surface-alt); border:none; border-radius:4px; padding:4px 8px; font-family:var(--mono); font-size:11px; outline:none; color:var(--ink);">
        <option value="life" ${scale==='life'?'selected':''}>Life</option>
        <option value="annual" ${scale==='annual'?'selected':''}>Annual</option>
        <option value="monthly" ${scale==='monthly'?'selected':''}>Monthly</option>
        <option value="weekly" ${scale==='weekly'?'selected':''}>Weekly</option>
        <option value="daily" ${scale==='daily'?'selected':''}>Daily</option>
      </select>
      <select id="modal-goal-type" onchange="toggleLoopTime()" style="flex:1; background:var(--surface-alt); border:none; border-radius:4px; padding:4px 8px; font-family:var(--mono); font-size:11px; outline:none; color:var(--ink);">
        <option value="linear" ${type==='linear'?'selected':''}>Linear</option>
        <option value="loop" ${type==='loop'?'selected':''}>Loop</option>
      </select>
    </div>
    <div id="loop-time-row" style="display:${type==='loop'?'block':'none'}; margin-top:8px;">
      <div style="display:flex; gap:4px; align-items:center; margin-bottom:6px;">
        <span style="font-family:var(--mono); font-size:9px; color:var(--ink-2); text-transform:uppercase;">Default Time</span>
        <input type="time" id="modal-loop-st" value="${defSt}" style="background:var(--surface-alt); border:none; border-radius:4px; padding:4px; font-family:var(--mono); font-size:11px; color:var(--ink);" />
        <span style="color:var(--ink-2);font-size:10px;">-</span>
        <input type="time" id="modal-loop-et" value="${defEt}" style="background:var(--surface-alt); border:none; border-radius:4px; padding:4px; font-family:var(--mono); font-size:11px; color:var(--ink);" />
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; padding-top:2px;">
        ${['S','M','T','W','T','F','S'].map((lbl,i) => {
          const checked = recDays.includes(i) ? 'checked' : '';
          return `<label style="display:flex;align-items:center;gap:2px;font-family:var(--mono);font-size:10px;color:var(--ink-2);cursor:pointer;"><input type="checkbox" class="loop-day-cb" value="${i}" ${checked} style="width:13px;height:13px;margin:0;accent-color:var(--accent);" />${lbl}</label>`;
        }).join('')}
      </div>
    </div>
    ${delBtn}
  `;
  document.getElementById('modal-submit').onclick = submitGoalModal;
}

function toggleLoopTime() {
  const sel = document.getElementById('modal-goal-type').value;
  const row = document.getElementById('loop-time-row');
  if (row) row.style.display = sel === 'loop' ? 'flex' : 'none';
}

async function submitGoalModal() {
  const titleText = document.getElementById('modal-input').value.trim();
  if (!titleText) return;
  
  const scale = document.getElementById('modal-goal-scale').value;
  const type = document.getElementById('modal-goal-type').value;
  
  // Build defaultTime for loop goals
  let defaultTime = '';
  let recurrenceDays = '[]';
  if (type === 'loop') {
    const lst = document.getElementById('modal-loop-st')?.value || '';
    const let_ = document.getElementById('modal-loop-et')?.value || '';
    if (lst && let_) defaultTime = `${lst} - ${let_}`;
    const cbs = document.querySelectorAll('.loop-day-cb');
    const days = [];
    cbs.forEach(cb => { if (cb.checked) days.push(parseInt(cb.value)); });
    recurrenceDays = JSON.stringify(days);
  }
  
  if (editGoalId) {
    const g = getGoal(editGoalId);
    if (g) {
      g.title = titleText;
      g.scale = scale;
      g.type = type;
      g.defaultTime = defaultTime;
      g.recurrenceDays = recurrenceDays;
      await fetch(`/api/goals/${g.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...g, subgoals: JSON.stringify(g.subgoals)})
      });
    }
  } else {
    let area = goalAreaId;
    if (goalParentId) {
      const p = getGoal(goalParentId);
      if (p) area = p.area;
    }
    
    const newId = 'g_' + Math.random().toString(36).substr(2,6);
    const newGoal = { id: newId, title: titleText, scale, type, area, subgoals: '[]', defaultTime, recurrenceDays };
    
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal)
    });

    if (goalParentId) {
      const p = getGoal(goalParentId);
      if (p) {
        p.subgoals.push(newId);
        await fetch(`/api/goals/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({...p, subgoals: JSON.stringify(p.subgoals)})
        });
      }
    }
  }
  
  await loadData();
  closeModal();
}

async function deleteGoal(goalId) {
  await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
  closeModal();
  await loadData();
}

// ─── AREA MODAL ──────────────────────────────────────────────────────────────
let editAreaId = null;

function openAreaModal(areaId = null) {
  editAreaId = areaId;
  document.getElementById('add-modal').style.display = 'flex';
  const inputEl = document.getElementById('modal-input');
  
  let name = '';
  let sym = '⚡';

  if (areaId) {
    const a = getArea(areaId);
    if(a) { name = a.name; sym = a.sym; }
    document.getElementById('modal-title').innerText = 'Edit Category';
  } else {
    document.getElementById('modal-title').innerText = 'New Category';
  }
  
  inputEl.value = name;
  inputEl.placeholder = 'Category Name...';
  inputEl.focus();

  const EMOJIS = ["⚡", "♥", "⌂", "✧", "🛠", "📚", "🚀", "💰", "🎨", "🌿", "🧠", "🔥", "🛡", "⚙", "🎯", "🌟", "💡", "🌍", "💼", "🎵", "🏆", "✏"];
  
  const gridHtml = EMOJIS.map(e => `
    <div onclick="selectAreaEmoji(this, '${e}')" class="emoji-btn" style="cursor:pointer; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; font-size:16px; transition:background .1s; ${e === sym ? 'background:var(--ink); color:var(--bg);' : 'background:var(--surface-alt); color:var(--ink);'}">${e}</div>
  `).join('');

  const delBtn = areaId ? `<span title="Delete Category" onclick="deleteArea('${areaId}')" style="font-size:15px; cursor:pointer; color:var(--ink-2); display:flex; align-items:center; transition:color .1s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--ink-2)'">🗑</span>` : '';

  document.getElementById('modal-fields').innerHTML = `
    <div style="width:100%; display:flex; flex-direction:column; gap:4px;">
      <div style="font-family:var(--mono); font-size:10px; color:var(--ink-2); text-transform:uppercase; letter-spacing:.05em;">Select Icon</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px; max-height:120px; overflow-y:auto; padding-bottom:8px; margin-bottom:8px;" id="emoji-grid">
        ${gridHtml}
      </div>
      <input type="hidden" id="modal-area-sym" value="${sym}" />
      <div style="display:flex; justify-content:flex-end;">${delBtn}</div>
    </div>
  `;
  document.getElementById('modal-submit').onclick = submitAreaModal;
}

window.selectAreaEmoji = function(el, emoji) {
  document.getElementById('modal-area-sym').value = emoji;
  const sibs = document.getElementById('emoji-grid').children;
  for(let i=0; i<sibs.length; i++) {
    sibs[i].style.background = 'var(--surface-alt)';
    sibs[i].style.color = 'var(--ink)';
  }
  el.style.background = 'var(--ink)';
  el.style.color = 'var(--bg)';
}

async function submitAreaModal() {
  const name = document.getElementById('modal-input').value.trim();
  if (!name) return;
  const sym = document.getElementById('modal-area-sym').value.trim() || '·';
  
  if (editAreaId) {
    await fetch(`/api/areas/${editAreaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editAreaId, name, sym })
    });
  } else {
    const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substr(2,4);
    await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, name, sym })
    });
  }
  
  await loadData();
  closeModal();
}

async function deleteArea(areaId) {
  await fetch(`/api/areas/${areaId}`, { method: 'DELETE' });
  closeModal();
  await loadData();
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
    case 'month': main.innerHTML = renderMonth(); break;
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
  if (prev) prev.onclick = () => { calState.month--; if (calState.month<0){calState.month=11;calState.year--;} selectedDay=null; loadData(); };
  if (next) next.onclick = () => { calState.month++; if (calState.month>11){calState.month=0;calState.year++;} selectedDay=null; loadData(); };

  document.querySelectorAll('.cal-table td[data-day]').forEach(td => {
    td.onclick = () => {
      if (td.classList.contains('sabbath')) return;
      selectedDay = { y:+td.dataset.year, m:+td.dataset.month, d:+td.dataset.day };
      render();
    };
  });
}



// ─── INIT ─────────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error("Backend response failed");
    const data = await res.json();
    AREAS = data.areas || [];
    GOALS = (data.goals || []).map(g => {
      let parsed = [];
      try { parsed = JSON.parse(g.subgoals || "[]"); } catch(e) {}
      return {...g, subgoals: parsed };
    });
    TASKS = (data.tasks || []).map(t => ({...t, done: !!t.done, parentId: t.parentId || ''}));
    hydrateVirtualTasks();
    render();
  } catch(e) {
    console.error("Backend fetch error: ", e);
    document.getElementById('view').innerHTML = `<div style="padding:40px;word-break:break-word;color:var(--red);">Runtime Crash: ${e.message} <br/><br/> Stack: ${e.stack}</div>`;
  }
}

// ─── RECURRING TASK VIRTUAL HYDRATION ────────────────────────────────────────
// Projects loop-type goals into the local memory array for up to 30 days adjacent to focus
function hydrateVirtualTasks() {
  const loopGoals = GOALS.filter(g => g.type === 'loop');
  if (!loopGoals.length) return;

  const y = calState.year;
  const m = calState.month;
  
  for (let mOffset = -1; mOffset <= 1; mOffset++) {
    const dt = new Date(y, m + mOffset, 1);
    const mY = dt.getFullYear();
    const mM = dt.getMonth();
    const daysInMonth = new Date(mY, mM+1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const loopDate = new Date(mY, mM, day);
      const loopKey = dateKey(mY, mM, day);
      const dow = loopDate.getDay();
      
      for (const g of loopGoals) {
        let allowedDays = [0,1,2,3,4,5];
        if (g.recurrenceDays) {
          try { allowedDays = JSON.parse(g.recurrenceDays); } catch(e) {}
        }
        if (!allowedDays.includes(dow)) continue;
        
        const vId = 't_loop_' + g.id + '_' + loopKey;
        // Skip if there's already an explicit task for this date and goal
        if (TASKS.some(t => t.id === vId || (t.goalId === g.id && t.date === loopKey))) continue;

        TASKS.push({
          id: vId,
          date: loopKey,
          goalId: g.id,
          parentId: '',
          title: '',
          time: g.defaultTime || '',
          done: false,
          isVirtual: true
        });
      }
    }
  }
}

updateClock();
setInterval(updateClock, 30_000);

// SSE: listen for data changes instead of polling
const evtSource = new EventSource('/api/events');
evtSource.onmessage = async () => {
  if (document.getElementById('add-modal').style.display === 'flex') return;
  await loadData();
};

loadData();

// FAB / Modal
document.getElementById('fab').onclick = () => openModal(null);
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal-submit').onclick = submitModal;
document.getElementById('modal-input').onkeydown = e => { if (e.key==='Enter') submitModal(); if (e.key==='Escape') closeModal(); };
document.getElementById('add-modal').onclick = e => { if (e.target === e.currentTarget) closeModal(); };
