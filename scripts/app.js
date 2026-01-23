// app.js — single-source-of-truth approach, event delegation, localStorage persistence

const STORAGE_KEY = 'todoApp.v1';

// ---------- State ----------
const state = {
  todos: [
    // sample initial data (optional)
    { id: genId(), text: 'Edit Video', status: 'pending' },
    { id: genId(), text: 'Upload Video', status: 'pending' },
    { id: genId(), text: 'Watch Video', status: 'completed' },
    { id: genId(), text: 'Prepare Supper', status: 'completed' }
  ],
  filter: 'all' // 'all' | 'pending' | 'completed'
};

// ---------- DOM references ----------
const dom = {
  todoList: document.getElementById('todo-list'),
  addButton: document.getElementById('add-button'),
  taskInput: document.getElementById('task-input'),
  tasksNum: document.getElementById('tasks-num'),
  addedMessage: document.getElementById('added-message'),
  categories: document.querySelectorAll('.js-category'),
  clearButton: document.getElementById('clear-button')
};

// ---------- Utilities ----------
function genId() {
  // simple unique id
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.todos) && typeof parsed.filter === 'string') {
      state.todos = parsed.todos;
      state.filter = parsed.filter;
    }
  } catch (e) {
    console.warn('Could not parse saved state', e);
  }
}

function flashAdded() {
  dom.addedMessage.classList.add('show');
  clearTimeout(flashAdded._t);
  flashAdded._t = setTimeout(() => dom.addedMessage.classList.remove('show'), 900);
}

function countPending() {
  return state.todos.filter(t => t.status === 'pending').length;
}

function filteredTodos() {
  if (state.filter === 'all') return state.todos;
  return state.todos.filter(t => t.status === state.filter);
}

// ---------- CRUD + Actions ----------
function addTodo(text) {
  const value = (text || '').trim();
  if (!value) return false;
  const todo = { id: genId(), text: value, status: 'pending' };
  state.todos.push(todo);
  saveState();
  return todo;
}

function toggleTodo(id, completed) {
  const t = state.todos.find(x => x.id === id);
  if (!t) return;
  t.status = completed ? 'completed' : 'pending';
  saveState();
}

function editTodo(id, newText) {
  const trimmed = (newText || '').trim();
  if (!trimmed) return false;
  const t = state.todos.find(x => x.id === id);
  if (!t) return false;
  t.text = trimmed;
  saveState();
  return true;
}

function removeTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  saveState();
}

function clearAll() {
  state.todos = [];
  saveState();
}

function clearPending() {
  state.todos = state.todos.filter(t => t.status !== 'pending');
  saveState();
}

function clearCompleted() {
  state.todos = state.todos.filter(t => t.status !== 'completed');
  saveState();
}

function setFilter(f) {
  state.filter = f;
  saveState();
}

// ---------- Rendering ----------
function render() {
  // categories highlight
  dom.categories.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.filter === state.filter);
  });

  // task count
  dom.tasksNum.textContent = countPending();

  // render list
  const items = filteredTodos();
  dom.todoList.innerHTML = items.map(itemHtml).join('');
}

function itemHtml(todo) {
  const checked = todo.status === 'completed' ? 'checked' : '';
  const doneClass = todo.status === 'completed' ? 'done' : '';
  const checkboxId = `checkbox-${todo.id}`;

  // If pending, show edit icon; completed - no edit
  const editButton = todo.status === 'pending'
    ? `<button class="icon-btn icon-edit" data-action="edit" data-id="${todo.id}" aria-label="Edit task">
         ✎
       </button>`
    : '';

  return `
    <li class="todo" data-id="${todo.id}">
      <div class="left">
        <div class="todo__item ${doneClass}">
          <input ${checked} class="js-check-task" id="${checkboxId}" type="checkbox" data-action="toggle" data-id="${todo.id}" />
          <label for="${checkboxId}">${escapeHtml(todo.text)}</label>
        </div>

        <div class="edit-group">
          <input class="edit-input" value="${escapeHtml(todo.text)}" data-id="${todo.id}" />
          <button class="icon-btn js-done" data-action="done" data-id="${todo.id}">Done</button>
          <button class="icon-btn js-cancel" data-action="cancel" data-id="${todo.id}">Cancel</button>
        </div>
      </div>

      <div class="todo__icons">
        ${editButton}
        <button class="icon-btn icon-delete" data-action="delete" data-id="${todo.id}" aria-label="Delete task">🗑</button>
      </div>
    </li>
  `;
}

// basic escape to avoid injection when inserting user text into value/HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ---------- Event Listeners (delegation) ----------
function attachListeners() {
  // Add task on button click
  dom.addButton.addEventListener('click', () => {
    const val = dom.taskInput.value;
    const added = addTodo(val);
    if (added) {
      dom.taskInput.value = '';
      flashAdded();
      render();
    }
  });

  // Add task on Enter key in input
  dom.taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      dom.addButton.click();
    }
  });

  // Category buttons (filter)
  dom.categories.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
      render();
    });
  });

  // Clear button — behaviour depends on current filter
  dom.clearButton.addEventListener('click', () => {
    if (state.filter === 'all') {
      if (confirm('Clear ALL tasks?')) clearAll();
    } else if (state.filter === 'pending') {
      if (confirm('Clear all pending tasks?')) clearPending();
    } else if (state.filter === 'completed') {
      if (confirm('Clear all completed tasks?')) clearCompleted();
    }
    render();
  });

  // Event delegation for list actions
  dom.todoList.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const id = e.target.closest('[data-id]')?.dataset.id;
    if (!action || !id) return;

    if (action === 'toggle') {
      // checkbox toggle uses the checkbox input checked state
      const checkbox = e.target.closest('input[type=checkbox]');
      toggleTodo(id, checkbox.checked);
      render();
    } else if (action === 'delete') {
      if (confirm('Delete this task?')) {
        removeTodo(id);
        render();
      }
    } else if (action === 'edit') {
      // enter editing mode: add class on li; show edit-group
      const li = e.target.closest('li.todo');
      li.classList.add('is-editing');
      // focus input
      const input = li.querySelector('.edit-input');
      input.focus();
      // put cursor at end
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (action === 'done') {
      // commit edit
      const li = e.target.closest('li.todo');
      const input = li.querySelector('.edit-input');
      const success = editTodo(id, input.value);
      if (!success) {
        alert('Please provide a non-empty task.');
        return;
      }
      li.classList.remove('is-editing');
      render();
    } else if (action === 'cancel') {
      // cancel edit
      const li = e.target.closest('li.todo');
      li.classList.remove('is-editing');
      render();
    }
  });

  // Allow enter key inside edit input to save, Esc to cancel
  dom.todoList.addEventListener('keydown', (e) => {
    if (!e.target.matches('.edit-input')) return;
    const li = e.target.closest('li.todo');
    const id = e.target.dataset.id;
    if (e.key === 'Enter') {
      const ok = editTodo(id, e.target.value);
      if (!ok) {
        alert('Please provide a non-empty task.');
        return;
      }
      li.classList.remove('is-editing');
      render();
    } else if (e.key === 'Escape') {
      li.classList.remove('is-editing');
      render();
    }
  });
}

// ---------- Initialization ----------
function init() {
  loadState();
  attachListeners();
  render();
}

init();
