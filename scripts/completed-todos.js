export const completedTodos = [
  {
    text: 'Watch Video',
    status: 'completed'
  }
];

export function addCompletedTodo(todo) {
  completedTodos.push(todo);
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