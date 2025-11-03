import { todos, addTodo, clearTodos, allTodosHTML, clearPendingFromAll, clearCompletedFromAll } from "./all-todos.js";
import { pendingTodos, calculatePendingTasks, pendingTodosHTML, clearPendingTodos} from "./pending-todos.js";
import { completedTodos, completedTodosHTML, clearCompletedTodos } from "./completed-todos.js";

let currentList = todos;
let timeoutId;

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
      }, 1000)
      renderList();
    }
    taskInput.value = '';
  });

document.querySelector('.js-tasks-num')
  .innerHTML = calculatePendingTasks();

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
  });
