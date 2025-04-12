// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return; // Prevent adding empty tasks

    let taskList = document.getElementById("taskList");

    // If the task list only contains the icon, clear it before adding the new task
    if (taskList.querySelector(".bi-list-task")) {
        taskList.innerHTML = ""; // Remove the icon
    }

    let li = document.createElement("li");
    let taskNumber = taskList.children.length + 1; // Assign a number to the task

    // Add task text along with a remove button
    li.innerHTML = `<span>${taskNumber}. ${taskText}</span> <button class="remove-btn">Remove</button>`;
    taskList.appendChild(li);

    saveTasks(); // Save tasks to local storage
    taskInput.value = ""; // Clear input field
}

// Use event delegation to handle remove button clicks
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        removeTask(event.target);
    }
});

// Add Enter key handler for the task input
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission or other default behavior
        addTask(); // Call the addTask function
    }
});

function removeTask(button) {
    let li = button.parentElement;
    let taskList = document.getElementById("taskList");
    li.remove(); // Remove the clicked task
    updateTaskNumbers(); // Update numbering after removal
    saveTasks(); // Save updated list to local storage

    // Add icon if task list is empty
    if (taskList.children.length === 0) {
        taskList.innerHTML = `<i class="bi bi-list-task"></i>`;
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li span").forEach(span => {
        // Store tasks without their number prefixes
        tasks.push(span.textContent.trim().replace(/^\d+\.\s*/, ""));
    });
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks in local storage
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks before loading

    if (tasks.length === 0) {
        taskList.innerHTML = `<i class="bi bi-list-task"></i>`;
    } else {
        tasks.forEach((task, index) => {
            let li = document.createElement("li");
            li.classList.add("task");
            li.innerHTML = `<span>${index + 1}. ${task}</span> <button class="remove-btn">Remove</button>`;
            taskList.appendChild(li);
        });
    }
}

function updateTaskNumbers() {
    let taskList = document.getElementById("taskList");
    // Reassign numbers to tasks after one is removed
    Array.from(taskList.children).forEach((li, index) => {
        let text = li.querySelector("span").textContent.trim().replace(/^\d+\.\s*/, ""); // Remove old number
        li.querySelector("span").textContent = `${index + 1}. ${text}`; // Update numbering
    });
}

// Bind add task event
document.getElementById("add-task").addEventListener('click', addTask);
