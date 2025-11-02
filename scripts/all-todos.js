import { pendingTodos } from "./pending-todos.js";

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
  }
];

export function addTodo(task) {
  if (task !== '' && task !== null) {
    todos.push({
      text: task,
      status: 'pending'
    });
    
    pendingTodos.push({
      text: task,
      status: 'pending'
    });
  }
}

export function allTodosHTML() {
  let html = '';

  todos.forEach((todo) => {
    html += `
      <li class="todo">
        <div class="todo__item">
          <input id="check-todo" type="checkbox" />
          <label for="check-todo">${todo.text}</label>
        </div>
        <div class="todo__icons">
          <svg class="icon icon-edit">
            <use xlink:href="/assets/images/icons.svg#pen-solid-full"></use>
          </svg>
          <svg class="icon icon-delete">
            <use xlink:href="/assets/images/icons.svg#trash-solid-full"></use>
          </svg>
        </div>
      </li>
    `;
  });

  return html;
}