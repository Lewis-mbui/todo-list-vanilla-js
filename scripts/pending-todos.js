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

export function removeFromPending(task) {
  pendingTodos = pendingTodos.filter((todo) => {
    return todo.text !== task;
  });
}

export function addToPending(task) {
  pendingTodos.push({
    text: task,
    status: 'pending'
  });
}

export function calculatePendingTasks() {
  return pendingTodos.length;
}

export function clearPendingTodos() {
  pendingTodos.length = 0;
}

export function pendingTodosHTML() {
  let html = '';

  pendingTodos.forEach((todo) => {
    html += `
      <li class="todo">
        <div class="todo__item">
          <label for="check-todo">${todo.text}</label>
        </div>
        <div class="todo__icons">
          <svg class="icon icon-delete">
            <use xlink:href="/assets/images/icons.svg#trash-solid-full"></use>
          </svg>
        </div>
      </li>
    `;
  });

  return html;
}