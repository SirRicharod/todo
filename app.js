const inputField = document.querySelector("input");
const todos = document.querySelector("#todos");
const clearAll = document.querySelectorAll("#btn");

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

    if (target.closest('.important-btn')) {
        const taskIndex = parseInt(target.closest('li').dataset.index);
        updateImportant(taskIndex);
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
    curTasks.push({ text: task, completed: false, important: 0 });
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

    editInput.addEventListener('keypress', function (event) {
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
            <p class="started-text">Ready to get started?</p>
            <p class="empty-text">Add your first task above to begin organizing your day!</p>
        </div>`;
        clearAll.forEach(element => {
            element.classList.add("d-none");
        });
        return;
    }

    clearAll.forEach(element => {
        element.classList.remove("d-none");
    });
    todos.innerHTML = '';
    curTasks.forEach((taskObj, index) => {
        let newTask = document.createElement('li');
        newTask.dataset.index = index;
        newTask.innerHTML =
            `<div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-${index}" ${taskObj.completed ? 'checked' : ''}>
                <label class="form-check-label ${taskObj.completed ? 'completed' : ''}" for="task-${index}"></label>
                <button class="btn btn-warning btn-sm edit-btn"><i class="bi bi-pencil-fill"></i></button>
                <button class="btn btn-warning btn-sm important-btn me-2"><i class="bi bi-patch-exclamation-fill"></i></button>
                <button class="btn btn-danger btn-sm delete-btn id="task-${index}"><i class="bi bi-trash-fill"></i></button>
            </div>
            <hr>`;
        switch (taskObj.important) {
            case 1:
                newTask.firstElementChild.classList.remove("border0");
                newTask.firstElementChild.classList.add("border1");
                break;
            case 2:
                newTask.firstElementChild.classList.remove("border1");
                newTask.firstElementChild.classList.add("border2");
                break;
            case 3:
                newTask.firstElementChild.classList.remove("border2");
                newTask.firstElementChild.classList.add("border3");
                break;
            default:
                if (newTask.firstElementChild.classList.contains("border3"))
                    newTask.firstElementChild.classList.remove("border3");
                newTask.firstElementChild.classList.add("border0");
        }
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

function selectAll() {
    let curTasks = getTasks();
    curTasks.forEach(task => {
        task.completed = true;
    });
    saveTasks(curTasks);
    DisplayTodo();
}

function setImportant(index) {
    let curTasks = getTasks();
    if (index < 0 || index >= curTasks.length) return;
    updateImportant(index);
    DisplayTodo();

}

function updateImportant(index) {
    let curTasks = getTasks();
    if (index < 0 || index >= curTasks.length) return;

    const taskElement = document.querySelector(`li[data-index="${index}"]`);

    if (curTasks[index].important === 3) {
        curTasks[index].important = 0;
    } else {
        curTasks[index].important += 1;
    }

    switch (curTasks[index].important) {
        case 1:
            if (taskElement.firstElementChild.classList.contains("border0"))
                taskElement.firstElementChild.classList.remove("border0");
                taskElement.firstElementChild.classList.add("border1");
                break;
        case 2:
            if (taskElement.firstElementChild.classList.contains("border1"))
                taskElement.firstElementChild.classList.remove("border1");
            taskElement.firstElementChild.classList.add("border2");
            break;
        case 3:
            if (taskElement.firstElementChild.classList.contains("border2"))
                taskElement.firstElementChild.classList.remove("border2");
            taskElement.firstElementChild.classList.add("border3");
            break;
        default:
            if (taskElement.firstElementChild.classList.contains("border3"))
                taskElement.firstElementChild.classList.remove("border3");
            taskElement.firstElementChild.classList.add("border0");
    }

    saveTasks(curTasks);

}

DisplayTodo();