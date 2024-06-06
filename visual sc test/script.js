// Selectors: These variables are used to select elements from the HTML document by their IDs.
const addTaskButton = document.getElementById('add-task-button');
const newTaskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const apiDataList = document.getElementById('api-data-list');

// TaskManager class to handle task operations
class TaskManager {
    constructor() {
        // Initialize an empty array to hold tasks and load any saved tasks from localStorage
        this.tasks = [];
        this.loadTasks();
    }

    // Add a new task to the task list
    // taskText: string - The text of the task to add
    addTask(taskText) {
        const task = {
            id: Date.now().toString(), // Generate a unique ID based on the current timestamp
            text: taskText, // The text of the task
        };
        this.tasks.push(task); // Add the task to the tasks array
        this.saveTasks(); // Save the updated tasks array to localStorage
        this.renderTasks(); // Update the UI to display the new task
    }

    // Delete a task from the task list using task ID
    // taskId: string - The ID of the task to delete
    deleteTask(taskId) {
        // Filter out the task with the specified ID from the tasks array
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks(); // Save the updated tasks array to localStorage
        this.renderTasks(); // Update the UI to remove the deleted task
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks)); // Convert tasks array to a JSON string and save it
    }

    // Load tasks from localStorage
    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')); // Retrieve and parse the tasks JSON string from localStorage
        if (tasks) {
            this.tasks = tasks; // If tasks exist in localStorage, load them into the tasks array
            this.renderTasks(); // Update the UI to display the loaded tasks
        }
    }

    // Render the task list in the UI
    renderTasks() {
        taskList.innerHTML = ''; // Clear the current task list UI
        this.tasks.forEach(task => {
            const li = document.createElement('li'); // Create a new list item element
            li.className = 'list-group-item d-flex justify-content-between align-items-center'; // Set its classes for styling
            li.id = task.id; // Set its ID to the task's ID
            li.innerHTML = `<span>${task.text}</span><button class="btn btn-danger btn-sm">Delete</button>`; // Set its inner HTML to include the task text and a delete button
            taskList.appendChild(li); // Add the list item to the task list in the UI
        });
    }
}

// Initialize TaskManager
const taskManager = new TaskManager();

// Event listener to add a new task
addTaskButton.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim(); // Get the trimmed value of the new task input
    if (taskText) { // If the input is not empty
        taskManager.addTask(taskText); // Add the new task
        newTaskInput.value = ''; // Clear the input field
    } else {
        alert('Please enter a task.'); // Alert the user to enter a task if the input is empty
    }
});

// Event listener to delete a task
taskList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') { // If the clicked element is a button
        const taskId = event.target.parentElement.id; // Get the ID of the parent element (the task's ID)
        taskManager.deleteTask(taskId); // Delete the task with the specified ID
    }
});


async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5'); // Fetch data from the API
        const data = await response.json(); 
        data.forEach((item, index) => { // Iterate over the fetched data
            const li = document.createElement('li'); // Create a new list item element
            li.className = 'list-group-item'; // Set its class for styling
            li.textContent = `Task ${index + 1}: ${item.title}`; // Set its text content to include the task number and title
            apiDataList.appendChild(li); // Add the list item to the API data list in the UI
        });
    } catch (error) {
        console.error('Error fetching data:', error); // Log any errors to the console
    }
}

// Fetch and display data from the API when the page loads
fetchData();
