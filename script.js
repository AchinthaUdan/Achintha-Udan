let tasks = [];
let currentListName = 'defaultList';

// Load tasks from localStorage on startup
function loadList() {
  const savedListName = localStorage.getItem('currentListName');
  if (savedListName) {
    currentListName = savedListName;
    const savedTasks = localStorage.getItem(currentListName);
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      displayTasks();
    }
  }
  populateSavedLists(); // Populate the dropdown with saved lists
}

// Call loadList when the page loads
window.onload = loadList;

// Function to populate the dropdown with saved lists
function populateSavedLists() {
  const savedListsDropdown = document.getElementById('saved-lists');
  savedListsDropdown.innerHTML = '<option value="">-- Select Saved List --</option>';
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== 'currentListName') {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      savedListsDropdown.appendChild(option);
    }
  }
}

// Function to load the selected list from the dropdown
function loadSelectedList() {
  const savedListsDropdown = document.getElementById('saved-lists');
  const selectedList = savedListsDropdown.value;

  if (selectedList) {
    currentListName = selectedList;
    localStorage.setItem('currentListName', currentListName); // Update current list name in localStorage
    tasks = JSON.parse(localStorage.getItem(currentListName)) || [];
    displayTasks();
  }
}

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById('new-task');
  const prioritySelect = document.getElementById('task-priority');
  const priority = prioritySelect.value;

  if (taskInput.value.trim() === '') return;

  tasks.push({ task: taskInput.value, priority, completed: false });
  displayTasks();
  taskInput.value = '';
}

// Function to display the tasks
function displayTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = task.completed ? 'completed' : '';
    taskItem.innerHTML = `
      <span class="task-content ${task.priority.toLowerCase()}">${task.task}</span>
      <span class="priority">${task.priority}</span>
      <span class="edit-btn" onclick="editTask(${index})">&#9998;</span>
      <span class="delete-btn" onclick="deleteTask(${index})">&#10006;</span>
      <span class="complete-btn" onclick="toggleCompletion(${index})">&#10003;</span>
    `;
    taskList.appendChild(taskItem);
  });
}

// Function to delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
}

// Function to toggle task completion
function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  displayTasks();
}

// Function to edit a task
function editTask(index) {
  const newTask = prompt("Edit task:", tasks[index].task);
  if (newTask) {
    tasks[index].task = newTask;
    displayTasks();
  }
}

// Function to save the list
function saveList() {
  if (tasks.length === 0) {
    alert('There are no tasks to save!');
    return;
  }

  if (currentListName === 'defaultList') {
    const listName = prompt('Enter a list name to save:');
    if (!listName) {
      alert('Please enter a valid list name!');
      return;
    }
    currentListName = listName;
    localStorage.setItem('currentListName', currentListName);
    populateSavedLists(); // Refresh the dropdown to include the new list
  }

  localStorage.setItem(currentListName, JSON.stringify(tasks));
  alert(`List saved as "${currentListName}" successfully!`);
}

// Function to create a new list
function newList() {
  if (tasks.length > 0) {
    const confirmSave = confirm('Do you want to save your current list before starting a new one?');
    if (confirmSave) {
      saveList();
    }
  }

  tasks = [];
  currentListName = 'defaultList';
  displayTasks();
}
