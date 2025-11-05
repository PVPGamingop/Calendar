const storageKey = 'crosscal_marks';
let marks = JSON.parse(localStorage.getItem(storageKey) || '{}');

const grid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const clearBtn = document.getElementById('clearBtn');

let viewDate = new Date(); // currently viewed month

function isoDate(y,m,d){
  // m is 1-12
  const mm = String(m).padStart(2,'0');
  const dd = String(d).padStart(2,'0');
  return `${y}-${mm}-${dd}`;
}

function startOfMonth(date){
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date){
  return new Date(date.getFullYear(), date.getMonth()+1, 0);
}

function renderCalendar(){
  grid.innerHTML = '';
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-11
  const firstWeekday = start.getDay(); // 0-6
  monthYear.textContent = start.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  // fill leading empty cells
  for(let i=0;i<firstWeekday;i++){
    const empty = document.createElement('div');
    empty.className = 'day muted-day';
    empty.innerHTML = '<div class="num"></div>';
    grid.appendChild(empty);
  }

  // create day cells
  for(let d=1; d<=end.getDate(); d++){
    const cell = document.createElement('button');
    cell.className = 'day';
    cell.type = 'button';
    const thisDate = isoDate(year, month+1, d);
    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = d;
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = ''; // reserved for future notes

    const x = document.createElement('div');
    x.className = 'xmark hidden';
    x.innerHTML = '<span class="xred">✕</span>';

    if(marks[thisDate]){
      x.classList.remove('hidden');
    }
    
    

    cell.appendChild(num);
    cell.appendChild(note);
    cell.appendChild(x);

    // accessibility label
    cell.setAttribute('aria-label', `Day ${d} ${thisDate} ${marks[thisDate] ? 'completed' : 'not completed'}`);

    cell.addEventListener('click', (ev)=>{
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
  for(let i=0;i<trailing;i++){
    const empty = document.createElement('div');
    empty.className = 'day muted-day';
    empty.innerHTML = '<div class="num"></div>';
    grid.appendChild(empty);
  }
}

function toggleMark(dateKey, xElement, cell){
  if(marks[dateKey]){
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

function saveMarks(){
  localStorage.setItem(storageKey, JSON.stringify(marks));
}

prevBtn.addEventListener('click', ()=>{
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1);
  renderCalendar();
});
nextBtn.addEventListener('click', ()=>{
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1);
  renderCalendar();
});
todayBtn.addEventListener('click', ()=>{
  viewDate = new Date();
  renderCalendar();
});
clearBtn.addEventListener('click', ()=>{
  if(confirm('Are you sure you want to clear all marks?')) {
    marks = {};
    saveMarks();
    renderCalendar();
  }
});


/* Initialize */
renderCalendar();


/* Optional: keyboard shortcuts */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft'){ prevBtn.click(); }
  if(e.key === 'ArrowRight'){ nextBtn.click(); }
  if(e.key === 't' || e.key === 'T'){ todayBtn.click(); }
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

const todoToggle = document.getElementById("todoToggle");
const todoPanel = document.getElementById("todoPanel");
const calendarWrap = document.getElementById("calendarWrap");
const todoInput = document.getElementById("todoInput");
const addTodo = document.getElementById("addTodo");
const todoList = document.getElementById("todoList"); // Pending
const completedList = document.getElementById("completedList"); // Completed

const TODO_KEY = "todoItems";
let todos = JSON.parse(localStorage.getItem(TODO_KEY)) || [];

// 🧱 Render all tasks
function renderTodos() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";

  const pending = todos.filter(t => !t.completed);
  const done = todos.filter(t => t.completed);

  pending.forEach(addTodoItem);
  done.forEach(addTodoItem);

  // hide "Completed" if empty
  completedList.previousElementSibling.style.display = done.length > 0 ? "block" : "none";
  // hide "Pending" if empty
  todoList.previousElementSibling.style.display = pending.length > 0 ? "block" : "none";
}

// 🧩 Add single item to UI
function addTodoItem(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  if (todo.completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const span = document.createElement("span");
  span.textContent = todo.text;

  const del = document.createElement("button");
  del.textContent = "🗑️";
  

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);

  // ✅ Move between sections
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
    renderPendingTasks();

  });

  // 🗑 delete item
  del.addEventListener("click", () => {
    todos = todos.filter(t => t !== todo);
    saveTodos();
    renderTodos();
    renderPendingTasks();

  });
    // ✏️ sidebar edit on text click
  span.addEventListener('click', (e) => {
    e.stopPropagation(); // stop checkbox click conflict
    const index = todos.indexOf(todo);
    openSidebar(index);
  });

  if (todo.completed) completedList.appendChild(li);
  else todoList.appendChild(li);
}

// 💾 Save to storage
function saveTodos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

// ➕ Add new task
function addTask() {
  const text = todoInput.value.trim();
  if (!text) return;
  const newTodo = { text, completed: false };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = "";
  
}

// 🎯 Add on click or Enter
addTodo.addEventListener("click", addTask);
todoInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
  
});

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

// ♻️ Initial render
renderTodos();
function renderPendingTasks() {
  const pendingContainer = document.getElementById('pending-tasks');
  pendingContainer.innerHTML = '';

  const pending = todos.filter(task => !task.completed);
  if (pending.length === 0) {
    pendingContainer.innerHTML = '<li style="color:gray;">All tasks completed ✅</li>';
    return;
  }

  pending.forEach(task => {
    const li = document.createElement('li');
    li.textContent = '• ' + task.text;
    li.style.marginBottom = '6px';
    li.style.fontSize = '15px';
    pendingContainer.appendChild(li);
  });
}
renderPendingTasks();
let editingTaskIndex = null;

const sidebar = document.getElementById('editSidebar');
const editTitle = document.getElementById('editTaskTitle');
const editDesc = document.getElementById('editTaskDesc');
const saveBtn = document.getElementById('saveTaskBtn');
const delBtn = document.getElementById('deleteTaskBtn');
const closeBtn = document.getElementById('closeSidebar');

function openSidebar(index) {
  editingTaskIndex = index;
  editTitle.value = todos[index].text;
  editDesc.value = todos[index].desc || '';
  sidebar.classList.add('open');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  editingTaskIndex = null;
}

saveBtn.addEventListener('click', () => {
  if (editingTaskIndex === null) return;
  todos[editingTaskIndex].text = editTitle.value.trim();
  todos[editingTaskIndex].desc = editDesc.value.trim();
saveTodos();
renderTodos();

  renderPendingTasks();
  closeSidebar();
});

delBtn.addEventListener('click', () => {
  if (editingTaskIndex === null) return;
  todos.splice(editingTaskIndex, 1);
saveTodos();
renderTodos();

  renderPendingTasks();
  closeSidebar();
});

closeBtn.addEventListener('click', closeSidebar);
