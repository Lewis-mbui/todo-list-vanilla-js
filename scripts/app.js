// index.js

import { todos, addTodo, clearTodos, allTodosHTML, clearPendingFromAll, clearCompletedFromAll, completeTodo, resetTodo, editTodo, removeFromTodos } from "./all-todos.js";
import { pendingTodos, calculatePendingTasks, pendingTodosHTML, clearPendingTodos, addToPending, removeFromPending, editPendingTodo} from "./pending-todos.js";
import { completedTodos, completedTodosHTML, clearCompletedTodos, addToCompleted, removeFromCompleted } from "./completed-todos.js";

let currentList = todos;
let timeoutId;

loadAppState(); // load saved todos and category
higlightCategory();
renderList();
updatePendingTasksIndicator();

function saveAppState() {
  const state = {
    todos,
    pendingTodos,
    completedTodos,
    currentCategory: document.querySelector('.selected')?.textContent || 'All'
  };
  localStorage.setItem('todoAppState', JSON.stringify(state));
}

function loadAppState() {
  const savedState = JSON.parse(localStorage.getItem('todoAppState'));

  if (savedState) {
    // Restore arrays
    todos.length = 0;
    pendingTodos.length = 0;
    completedTodos.length = 0;

    todos.push(...savedState.todos);
    pendingTodos.push(...savedState.pendingTodos);
    completedTodos.push(...savedState.completedTodos);

    // Restore category selection
    removePreviousHighlight();
    const categoryText = savedState.currentCategory;
    const categories = document.querySelectorAll('.category');

    categories.forEach(cat => {
      if (cat.textContent.trim() === categoryText) {
        cat.classList.add('selected');
      }
    });

    // Set the correct currentList reference
    setCurrentList();
  }
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


function higlightCategory() {
  removePreviousHighlight();

  const savedState = JSON.parse(localStorage.getItem('todoAppState'));
  const savedCategory = savedState?.currentCategory;

  if (savedCategory) {
    document.querySelectorAll('.category').forEach(cat => {
      if (cat.textContent.trim() === savedCategory) {
        cat.classList.add('selected');
      }
    });
  } else {
    document.querySelector('.js-category-1').classList.add('selected');
  }
}

function removePreviousHighlight() {
  document.querySelectorAll('.selected')
    .forEach((selectedCategory) => {
      selectedCategory.classList.remove('selected');
    });
}

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
        } else {
          resetTodo(task);
          addToPending(task);
          removeFromCompleted(task);
        }
        renderList();
        updatePendingTasksIndicator();
        saveAppState();
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
        saveAppState();
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
        saveAppState();
      });
    });
}

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
      saveAppState();
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
      saveAppState();
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
    saveAppState();
  });

  updatePendingTasksIndicator();
