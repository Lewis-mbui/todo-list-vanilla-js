const todos = [
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
    status: 'done'
  }
];

function calculatePendingTasks() {
  return todos.reduce((prev, todo) => {
    return prev + (todo.status === 'pending' ? 1 : 0);
  }, 0);
}

renderList();

function addTodo(task) {
  if (task !== '' && task !== null) {
    todos.push({
      text: task,
      status: 'pending'
    });
  }
}

function renderList() {
  let todoListHtml = '';

  todos.forEach((todo) => {
    todoListHtml += `
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

  // console.log(todoListHtml);

  document.querySelector('.js-todo-list')
    .innerHTML = todoListHtml;

  document.querySelector('.js-add-button')
    .addEventListener('click', () => {
      const taskInput = document.querySelector('.js-task-input');
      const task = taskInput.value;

      addTodo(task);
      taskInput.value = '';
      renderList();
    });

  document.querySelector('.js-tasks-num')
    .innerHTML = calculatePendingTasks();
}