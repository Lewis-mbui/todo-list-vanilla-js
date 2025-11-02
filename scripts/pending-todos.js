export let pendingTodos = [
  {
    text: 'Edit Video',
    status: 'pending'
  },
  {
    text: 'Upload Video',
    status: 'pending'
  }
];

export function removeFromPending() {
  pendingTodos = pendingTodos.filter((todo) => {
    return todo.status === 'pending';
  });
}

export function calculatePendingTasks() {
  return pendingTodos.length;
}

export function pendingTodosHTML() {
  let html = '';

  pendingTodos.forEach((todo) => {
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