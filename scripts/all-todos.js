import { pendingTodos, addToPending } from "./pending-todos.js";

export let todos = [
  {
    text: 'Edit Video',
    status: 'pending'
  },
  {
    text: 'Upload Video',
    status: 'pending'
  },
  {
    text: 'Watch Video',
    status: 'completed'
  },
  {
    text: 'Prepare Supper',
    status: 'completed'
  }
];

export function addTodo(task) {
  if (task !== '' && task !== null) {
    todos.push({
      text: task,
      status: 'pending'
    });
    
    addToPending(task);
  }
}

function getTodo(task) {
  return todos.find((todo) => {
    return todo.text === task;
  });
}

export function clearTodos() {
  todos.length = 0;
  pendingTodos.length = 0;
}

export function clearPendingFromAll() {
  todos = todos.filter((todo) => {
    return todo.status !== 'pending';
  });
}

export function clearCompletedFromAll() {
  todos = todos.filter((todo) => {
    return todo.status !== 'completed';
  });
}

export function completeTodo(task) {
  const todo = getTodo(task);
  todo.status = 'completed';
}

export function resetTodo(task) {
  const todo = getTodo(task);
  todo.status = 'pending';
}

export function editTodo(previousTask, task) {
  const todo = getTodo(previousTask);
  todo.text = task;
}

export function allTodosHTML() {
  let html = '';

  todos.forEach((todo) => {
    html += `
      <li class="todo is-editin">
        <div class="todo__item ${todo.status === 'completed' ? 'done' : ''}">
          <input ${todo.status === 'completed' ? 'checked' : ''} class="js-check-task" id="check-todo" type="checkbox" />
          <label for="check-todo">${todo.text}</label>
        </div>
        <div class="todo__icons">
          <svg class="icon icon-edit js-icon-edit">
            <use xlink:href="/assets/images/icons.svg#pen-solid-full"></use>
          </svg>
          <svg class="icon icon-delete">
            <use xlink:href="/assets/images/icons.svg#trash-solid-full"></use>
          </svg>
        </div>
        <div class="edit-group">
          <input class="js-edited-task"/>
          <span class="done-link js-done-link">Done</>
        </div>
      </li>
    `;
  });

  return html;
}