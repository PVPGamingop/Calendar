const storageKey = 'crosscal_marks';
let marks = JSON.parse(localStorage.getItem(storageKey) || '{}');

const grid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const clearBtn = document.getElementById('clearBtn');

let viewDate = new Date(); // currently viewed month

function isoDate(y, m, d) {
  // m is 1-12
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function renderCalendar() {
  grid.innerHTML = '';
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11
  const firstWeekday = start.getDay(); // 0-6
  monthYear.textContent = start.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  // fill leading empty cells
  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'day muted-day';
    empty.innerHTML = '<div class="num"></div>';
    grid.appendChild(empty);
  }

  // create day cells
  for (let d = 1; d <= end.getDate(); d++) {
    const cell = document.createElement('button');
    cell.className = 'day';
    cell.type = 'button';
    const thisDate = isoDate(year, month + 1, d);
    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = d;
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = ''; // reserved for future notes

    const x = document.createElement('div');
    x.className = 'xmark hidden';
    x.innerHTML = '<span class="xred">✕</span>';

    if (marks[thisDate]) {
      x.classList.remove('hidden');
    }



    cell.appendChild(num);
    cell.appendChild(note);
    cell.appendChild(x);

    // accessibility label
    cell.setAttribute('aria-label', `Day ${d} ${thisDate} ${marks[thisDate] ? 'completed' : 'not completed'}`);

    cell.addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleMark(thisDate, x, cell);

    });


    // ✅ Highlight today's date
    const today = new Date();
    if (
      today.getDate() === d &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    ) {
      cell.classList.add("today");
    }
    grid.appendChild(cell);

  }

  // trailing empty cells to fill week
  const totalCells = firstWeekday + end.getDate();
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < trailing; i++) {
    const empty = document.createElement('div');
    empty.className = 'day muted-day';
    empty.innerHTML = '<div class="num"></div>';
    grid.appendChild(empty);
  }
}

function toggleMark(dateKey, xElement, cell) {
  if (marks[dateKey]) {
    delete marks[dateKey];
    xElement.classList.add('hidden');
    cell.setAttribute('aria-label', `Day not completed`);
  } else {
    marks[dateKey] = true;
    xElement.classList.remove('hidden');
    cell.setAttribute('aria-label', `Day completed`);
  }
  saveMarks();
}

function saveMarks() {
  localStorage.setItem(storageKey, JSON.stringify(marks));
}

prevBtn.addEventListener('click', () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  renderCalendar();
});
nextBtn.addEventListener('click', () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  renderCalendar();
});
todayBtn.addEventListener('click', () => {
  viewDate = new Date();
  renderCalendar();
});
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all marks?')) {
    marks = {};
    saveMarks();
    renderCalendar();
  }
});


/* Initialize */
renderCalendar();


/* Optional: keyboard shortcuts */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { prevBtn.click(); }
  if (e.key === 'ArrowRight') { nextBtn.click(); }
  if (e.key === 't' || e.key === 'T') { todayBtn.click(); }
});
let isScrolling = false;

// calendar container select karo
const calendarContainer = document.querySelector(".wrap");

calendarContainer.addEventListener("wheel", (event) => {
  // check karo cursor calendar ke andar hai ya nahi
  if (!calendarContainer.matches(":hover")) return;

  // prevent page scroll jab calendar ke andar scroll kare
  event.preventDefault();

  if (isScrolling) return;
  isScrolling = true;

  if (event.deltaY > 0) {
    animateMonthChange("next");
  } else if (event.deltaY < 0) {
    animateMonthChange("prev");
  }

  setTimeout(() => (isScrolling = false), 800);
});

function animateMonthChange(direction) {
  grid.classList.add(direction === "next" ? "slide-up" : "slide-down");

  setTimeout(() => {
    viewDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + (direction === "next" ? 1 : -1),
      1
    );
    renderCalendar();
    grid.classList.remove("slide-up", "slide-down");
  }, 400);
}


/* STORAGE model (single key) */
const STORAGE_KEY = 'todo_sections_v1';
let store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
if (!store || typeof store !== 'object') store = {};
if (!store.all) store.all = [];
if (!store.sections) store.sections = {};
saveStore();
function saveStore() { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }

/* UI elements */
const todoToggle = document.getElementById("todoToggle");
const hambtn = document.getElementById('hambtn');
const sidebar = document.getElementById('sidebar');
const newSectionInput = document.getElementById('newSectionInput');
const addSectionBtn = document.getElementById('addSectionBtn');
const sectionList = document.getElementById('sectionList');

const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoListEl = document.getElementById('todoList');
const completedListEl = document.getElementById('completedList');
const todoHeader = document.getElementById('todoHeader');
const sectionInfo = document.getElementById('sectionInfo');

const editSidebar = document.getElementById('editSidebar');
const dim = document.getElementById('dim');
const closeSidebarBtn = document.getElementById('closeSidebar');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDesc = document.getElementById('editTaskDesc');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');

/* state */
let currentSection = 'all'; // 'all' or section name
let editContext = { listRef: null, index: null };

/* sidebar toggle */
hambtn.addEventListener('click', () => { sidebar.classList.toggle('open'); sidebar.setAttribute('aria-hidden', !sidebar.classList.contains('open')); });

/* render sections */
function renderSections() {
  sectionList.innerHTML = '';
  // All Tasks entry
  const liAll = document.createElement('li'); liAll.className = 'section-item';
  liAll.innerHTML = `<div>All Tasks</div><div style="opacity:.6; font-size:12px">${store.all.length}</div>`;
  liAll.addEventListener('click', () => { selectSection('all'); sidebar.classList.remove('open'); });
  if (currentSection === 'all') liAll.classList.add('active');
  sectionList.appendChild(liAll);

  // user sections
  Object.keys(store.sections).forEach(name => {
    const li = document.createElement('li'); li.className = 'section-item';
    li.innerHTML = `<div>📁 ${name} <span style="color:var(--muted); font-size:12px; margin-left:6px">(${store.sections[name].length})</span></div>
                    <div><span class="icon-del" data-name="${name}" title="Delete section">🗑️</span></div>`;
    li.addEventListener('click', () => { selectSection(name); sidebar.classList.remove('open'); });
    // delete icon handled below via event delegation
    if (currentSection === name) li.classList.add('active');
    sectionList.appendChild(li);
  });
}
// 🔘 Toggle between Calendar & To-Do
todoToggle.addEventListener("click", () => {
  const isOpen = todoPanel.classList.contains("show");
  if (isOpen) {
    todoPanel.classList.remove("show");
    setTimeout(() => todoPanel.classList.add("hidden"), 300);
    calendarWrap.classList.remove("hidden");
  } else {
    calendarWrap.classList.add("hidden");
    todoPanel.classList.remove("hidden");
    setTimeout(() => todoPanel.classList.add("show"), 10);
  }

});
/* add section */
addSectionBtn.addEventListener('click', () => {
  const name = newSectionInput.value.trim();
  if (!name) return alert('Enter section name');
  if (name.toLowerCase() === 'all') return alert('Invalid name');
  if (store.sections[name]) return alert('Section exists');
  store.sections[name] = [];
  saveStore();
  newSectionInput.value = '';
  renderSections();
  selectSection(name);
});

/* delete section (delegation) */
sectionList.addEventListener('click', (e) => {
  const del = e.target.closest('.icon-del');
  if (!del) return;
  const name = del.dataset.name;
  if (!confirm(`Delete section "${name}" and its tasks?`)) return;
  delete store.sections[name];
  saveStore();
  renderSections();
  selectSection('all');
});

/* select section */
function selectSection(name) {
  currentSection = name;
  todoHeader.textContent = (name === 'all') ? 'All Tasks' : `Section: ${name}`;
  sectionInfo.textContent = `Viewing: ${name === 'all' ? 'All' : name}`;
  renderTodos();
  renderSections();
}

/* helper to get list ref for current view */
function getListForCurrent() { return currentSection === 'all' ? store.all : store.sections[currentSection] || []; }

/* render todos for current view */
function renderTodos() {
  todoListEl.innerHTML = ''; completedListEl.innerHTML = '';
  const list = getListForCurrent();
  const pending = list.filter(t => !t.completed);
  const done = list.filter(t => t.completed);
  pending.forEach((t, i) => createTaskElement(t, i, false));
  done.forEach((t, i) => createTaskElement(t, i, true));
}

/* create li element with drag/drop + events */
function createTaskElement(task, idx, isDone) {
  const li = document.createElement('li'); li.className = 'todo-item';
  li.draggable = !isDone; // allow only pending reorder for UX (optional)
  li.dataset.id = task.id;

  const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = task.completed;
  const span = document.createElement('span'); span.textContent = task.text;
  const del = document.createElement('button'); del.innerHTML = '🗑️'; del.className = 'btn';

  li.appendChild(checkbox); li.appendChild(span); li.appendChild(del);

  // checkbox change
  checkbox.addEventListener('change', (e) => {
    task.completed = checkbox.checked;
    saveStore();
    renderTodos();
  });

  // delete
  del.addEventListener('click', (e) => { e.stopPropagation(); const listRef = getListForCurrent(); const i = listRef.findIndex(x => x.id === task.id); if (i > -1) listRef.splice(i, 1); saveStore(); renderTodos(); });

  // click text -> open edit sidebar
  span.addEventListener('click', (e) => { e.stopPropagation(); const listRef = getListForCurrent(); const i = listRef.findIndex(x => x.id === task.id); if (i > -1) openEditSidebar(listRef, i); });

  // Drag & Drop handlers
  li.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', String(task.id));
    li.classList.add('dragging');
  });
  li.addEventListener('dragend', () => li.classList.remove('dragging'));

  // drop zone is the UL (handled globally) - below
  if (isDone) completedListEl.appendChild(li); else todoListEl.appendChild(li);
}

/* DnD on lists (todoListEl & completedListEl) - allow reorder within todoListEl only */
function initDnD() {
  // allow drop on todoListEl
  todoListEl.addEventListener('dragover', (e) => { e.preventDefault(); const after = getDragAfterElement(todoListEl, e.clientY); const dragging = document.querySelector('.todo-item.dragging'); if (!dragging) return; if (after == null) todoListEl.appendChild(dragging); else todoListEl.insertBefore(dragging, after); });
  todoListEl.addEventListener('drop', (e) => {
    e.preventDefault(); // update order in store
    const draggingEl = document.querySelector('.todo-item.dragging');
    if (!draggingEl) return;
    const id = Number(draggingEl.dataset.id);
    const listRef = getListForCurrent();
    // rebuild order array from DOM
    const ids = Array.from(todoListEl.children).map(ch => Number(ch.dataset.id));
    // reorder listRef to match ids (keep only pending ones)
    const pending = listRef.filter(t => !t.completed);
    const pendingMap = Object.fromEntries(pending.map(t => [t.id, t]));
    const newPending = ids.map(i => pendingMap[i]).filter(Boolean);
    // splice back into listRef: remove old pending then add newPending at start
    const done = listRef.filter(t => t.completed);
    const newList = newPending.concat(done);
    if (currentSection === 'all') store.all = newList; else store.sections[currentSection] = newList;
    saveStore();
    renderTodos();
  });
}
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
initDnD();

/* add task */
function addTask() {
  const text = todoInput.value.trim();
  if (!text) return;
  const task = { id: Date.now(), text, completed: false, desc: '' };
  const listRef = getListForCurrent();
  listRef.push(task);
  saveStore();
  todoInput.value = '';
  renderTodos();
}
addTodoBtn.addEventListener('click', addTask);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

/* render pending list (only All Tasks) */
function renderPending() {
  // optional: not displayed here (we have only todo panel). But can be implemented if needed
}

/* edit sidebar */
function openEditSidebar(listRef, index) {
  editContext.listRef = listRef;
  editContext.index = index;
  const t = listRef[index];
  editTaskTitle.value = t.text;
  editTaskDesc.value = t.desc || '';
  editSidebar.classList.add('open'); dim.classList.add('show'); dim.style.display = 'block'; editSidebar.setAttribute('aria-hidden', 'false');
}
function closeEditSidebar() { editSidebar.classList.remove('open'); dim.classList.remove('show'); dim.style.display = 'none'; editContext = { listRef: null, index: null }; }
closeSidebarBtn.addEventListener('click', closeEditSidebar);
dim.addEventListener('click', closeEditSidebar);

saveTaskBtn.addEventListener('click', () => {
  if (!editContext.listRef) return;
  const t = editContext.listRef[editContext.index];
  t.text = editTaskTitle.value.trim() || t.text;
  t.desc = editTaskDesc.value.trim();
  saveStore();
  renderTodos();
  closeEditSidebar();
});
deleteTaskBtn.addEventListener('click', () => {
  if (!editContext.listRef) return;
  if (!confirm('Delete task?')) return;
  editContext.listRef.splice(editContext.index, 1);
  saveStore();
  renderTodos();
  closeEditSidebar();
});

/* initial render */
renderSections();
selectSection('all');

/* accessibility */
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (editSidebar.classList.contains('open')) closeEditSidebar(); if (sidebar.classList.contains('open')) sidebar.classList.remove('open'); } });
// ===================
