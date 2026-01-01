const inputField = document.querySelector("input");
const todos = document.querySelector("#todos");
const clearAll = document.querySelector("#clear-btn");

function getTasks() {
    try {
        return JSON.parse(localStorage.getItem("todo")) || [];
    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

function saveTasks(tasks) {
    try {
        localStorage.setItem("todo", JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks:", error);
        alert("Unable to save tasks. Storage might be full.");
    }
}

inputField.addEventListener('keypress', function (event) {

    if (event.key === 'Enter') {
        event.preventDefault();
        AddTodo();
    }
});

todos.addEventListener('click', function (event) {
    const target = event.target;

    if (target.closest('.delete-btn')) {
        const taskIndex = parseInt(target.closest('li').dataset.index);
        deleteTask(taskIndex);
    }
    
    if (target.closest('.edit-btn')) {
        const taskIndex = parseInt(target.closest('li').dataset.index);
        editTask(taskIndex);
    }
});

todos.addEventListener('change', function (event) {
    if (event.target.classList.contains('form-check-input')) {
        const taskIndex = parseInt(event.target.closest('li').dataset.index);
        toggleTask(taskIndex);
    }
});

function AddTodo() {
    if (inputField.value.trim() === "") {
        inputField.classList.add("is-invalid");
        return;
    }
    else {
        if (inputField.classList.contains("is-invalid"))
            inputField.classList.remove("is-invalid");
    }

    SaveToLocalStorage(inputField.value);
    inputField.value = "";
    DisplayTodo();
}

function SaveToLocalStorage(task) {
    let curTasks = getTasks();
    curTasks.push({ text: task, completed: false });
    saveTasks(curTasks);
}

function toggleTask(index) {
    let curTasks = getTasks();
    if (index < 0 || index >= curTasks.length) return;
    curTasks[index].completed = !curTasks[index].completed;
    saveTasks(curTasks);
    DisplayTodo();
}

function deleteTask(index) {
    let curTasks = getTasks();
    if (index < 0 || index >= curTasks.length) return;
    curTasks.splice(index, 1);
    saveTasks(curTasks);
    DisplayTodo();
}

function editTask(index) {
    let curTasks = getTasks();
    if (index < 0 || index >= curTasks.length) return;
    
    const taskElement = document.querySelector(`li[data-index="${index}"]`);
    const labelElement = taskElement.querySelector('.form-check-label');
    const currentText = curTasks[index].text;
    
    // Replace label with input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.className = 'form-control edit-input';
    
    labelElement.replaceWith(editInput);
    editInput.focus();
    editInput.select();
    
    // Hide edit button and show save/cancel buttons
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    
    // Create save and cancel buttons
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-success btn-sm save-btn';
    saveBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary btn-sm cancel-btn';
    cancelBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
    
    const buttonContainer = taskElement.querySelector('.form-check');
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    
    // Save function
    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText === "") {
            editInput.classList.add('is-invalid');
            return;
        }
        curTasks[index].text = newText;
        saveTasks(curTasks);
        DisplayTodo();
    };
    
    // Cancel function
    const cancelEdit = () => {
        DisplayTodo();
    };
    
    // Event listeners
    saveBtn.addEventListener('click', saveEdit);
    cancelBtn.addEventListener('click', cancelEdit);
    
    editInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            cancelEdit();
        }
    });
}

function DisplayTodo() {
    let curTasks = getTasks();

    if (curTasks.length === 0) {
        todos.innerHTML = `
        <div class="text-center p-4 opacity-50">
            <p class="mb-2" style="font-size: 1.1rem; font-weight: 500;">Ready to get started?</p>
            <p style="font-size: 0.9rem;">Add your first task above to begin organizing your day!</p>
        </div>`;
        clearAll.classList.add("d-none");
        return;
    }

    clearAll.classList.remove("d-none");
    todos.innerHTML = '';
    curTasks.forEach((taskObj, index) => {
        let newTask = document.createElement('li');
        newTask.dataset.index = index;
        newTask.innerHTML =
            `<div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-${index}" ${taskObj.completed ? 'checked' : ''}>
                <label class="form-check-label ${taskObj.completed ? 'completed' : ''}" for="task-${index}"></label>
                <button class="btn btn-warning btn-sm edit-btn"><i class="bi bi-pencil-fill"></i></button>
                <button class="btn btn-danger btn-sm delete-btn"><i class="bi bi-trash-fill"></i></button>
            </div>
            <hr>`;
        const labelElement = newTask.querySelector('label');
        labelElement.textContent = taskObj.text;
        todos.append(newTask);
    });
}

function clearCompleted() {
    let curTasks = getTasks();
    curTasks = curTasks.filter(task => !task.completed);
    saveTasks(curTasks);
    DisplayTodo();
}

DisplayTodo();