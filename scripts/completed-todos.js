export let completedTodos = [
  {
    text: 'Watch Video',
    status: 'completed'
  },
  {
    text: 'Prepare Supper',
    status: 'completed'
  }
];

export function addCompletedTodo(todo) {
  completedTodos.push(todo);
}

function getTodo(task) {
  return completedTodos.find((todo) => {
    return todo.text === task;
  });
}

export function clearCompletedTodos() {
  completedTodos.length = 0;
}

export function removeFromCompleted(task) {
  completedTodos = completedTodos.filter((todo) => {
    return todo.text !== task;
  });
}

export function addToCompleted(task) {
  completedTodos.push({
    text: task,
    status: 'completed'
  });
}

export function completedTodosHTML() {
  let html = '';

  completedTodos.forEach((todo) => {
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