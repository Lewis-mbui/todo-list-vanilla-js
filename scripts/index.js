import { todos, addTodo, clearTodos, allTodosHTML, clearPendingFromAll, clearCompletedFromAll, completeTodo, resetTodo, editTodo, removeFromTodos } from "./all-todos.js";
import { pendingTodos, calculatePendingTasks, pendingTodosHTML, clearPendingTodos, addToPending, removeFromPending, editPendingTodo} from "./pending-todos.js";
import { completedTodos, completedTodosHTML, clearCompletedTodos, addToCompleted, removeFromCompleted } from "./completed-todos.js";

let currentList = todos;
let timeoutId;

function updatePendingTasksIndicator() {
  document.querySelector('.js-tasks-num')
  .innerHTML = calculatePendingTasks();
}

function showAddedMessage() {
  document.querySelector('.js-added-message')
    .classList.add('is-added');
}

function hideAddedMessage() {
  document.querySelector('.is-added')
    .classList.remove('is-added');
}

function higlightCategory() {
  removePreviousHighlight();

  if (currentList === todos)
    document.querySelector('.js-category-1')
      .classList.add('selected');
  
  if (currentList === pendingTodos)
    document.querySelector('.js-category-2')
      .classList.add('.selected');

  if (currentList === completedTodos)
    document.querySelector('.js-category-3')
      .classList.add('.selected');

}

function removePreviousHighlight() {
  document.querySelectorAll('.selected')
    .forEach((selectedCategory) => {
      selectedCategory.classList.remove('selected');
    });
}

function setCurrentList() {
  const selectedCategoryLink = document.querySelector('.selected');

  if (selectedCategoryLink.classList.contains('js-category-1'))
    currentList = todos;

  else if (selectedCategoryLink.classList.contains('js-category-2'))
    currentList = pendingTodos;

  else if (selectedCategoryLink.classList.contains('js-category-3'))
    currentList = completedTodos;
}

function saveListToStorage() {
  localStorage.setItem('currentList', JSON.stringify(currentList));
}

function loadListFromStorage() {
  return JSON.parse(localStorage.getItem('currentList'));
}


function renderList() {
  let todoListHtml = '';

  if (currentList === todos) todoListHtml = allTodosHTML();
  else if (currentList === pendingTodos) todoListHtml = pendingTodosHTML();
  else if (currentList === completedTodos) todoListHtml = completedTodosHTML();

  // console.log(todoListHtml);

  document.querySelector('.js-todo-list')
    .innerHTML = todoListHtml;

   document.querySelectorAll('.js-check-task')
    .forEach((checkbox) => {
      checkbox.addEventListener('click', () => {
        const todoElement = checkbox.parentElement;
        const task = todoElement.querySelector('label')
          .innerText.trim();

        if (checkbox.checked) {
          completeTodo(task);
          removeFromPending(task);
          addToCompleted(task);
          renderList();
        } else {
          resetTodo(task);
          addToPending(task);
          removeFromCompleted(task);
          renderList();
        }
        updatePendingTasksIndicator();
      });
    });

  document.querySelectorAll('.js-icon-edit')
    .forEach((icon) => {
      icon.addEventListener('click', () => {
        const todoContainer = icon.parentElement.parentElement;
        todoContainer.classList.add('is-editing');
      });
    });

  document.querySelectorAll('.js-done-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const inputElement = link.parentElement
          .querySelector('input');
        const todoContainer = link.parentElement.parentElement;
        const labelElement = link.parentElement.parentElement
          .querySelector('label');

        const previousTask = labelElement.innerText;

        const task = inputElement.value;

        if (task !== '' && task !== null) {
          editTodo(previousTask, task);
          editPendingTodo(previousTask, task);
        }
        todoContainer.classList.remove('is-editing');
        renderList();
      });
    });

  document.querySelectorAll('.js-delete-icon')
    .forEach((icon) => {
      icon.addEventListener('click', () => {
        const task = icon.parentElement.parentElement
          .querySelector('label').innerText;

        removeFromTodos(task);
        removeFromPending(task);
        removeFromCompleted(task);
        setCurrentList();
        updatePendingTasksIndicator();
        renderList();
      });
    });
}

higlightCategory();
renderList();

document.querySelector('.js-add-button')
  .addEventListener('click', () => {
    const taskInput = document.querySelector('.js-task-input');
    const task = taskInput.value;
    const length = todos.length;
    const isAdded = false;

    addTodo(task);
    const currentLength = todos.length;
    if (currentLength > length) {
      showAddedMessage();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        hideAddedMessage();
      }, 1000);
      updatePendingTasksIndicator();
      renderList();
    }
    taskInput.value = '';
  });

document.querySelectorAll('.category')
  .forEach((categoryLink) => {
    categoryLink.addEventListener('click', () => {
      removePreviousHighlight();
      categoryLink.classList.add('selected');
      setCurrentList();
      // console.log(currentList);
      renderList();
    });
  });

document.querySelector('.js-clear-button')
  .addEventListener('click', () => {
    if (currentList === todos) {
      clearTodos();
      renderList();
    } else if (currentList === pendingTodos) {
      clearPendingTodos();
      clearPendingFromAll();
      renderList();
    } else if (currentList === completedTodos) {
      clearCompletedTodos();
      clearCompletedFromAll();
      renderList();
    }
    updatePendingTasksIndicator();
  });

  updatePendingTasksIndicator();
