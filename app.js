const inputfield = document.querySelector("input");
const todos = document.querySelector("#todos");

// Input with 'Enter'
inputfield.addEventListener('keypress', function (event) {

    if (event.key === 'Enter') {
        event.preventDefault();
        AddTodo();
    }
});

function AddTodo() {
    // Check for empty input
    if (inputfield.value.trim() === "") {
        inputfield.classList.add("is-invalid");
        return;
    }
    else {
        if (inputfield.classList.contains("is-invalid"))
            inputfield.classList.remove("is-invalid");
    }

    SaveToLocalStorage(inputfield.value);
    inputfield.value = "";
    DisplayTodo();
}

function SaveToLocalStorage(task) {
    let curTasks = JSON.parse(localStorage.getItem("todo")) || [];
    curTasks.push({ text: task, completed: false });
    localStorage.setItem("todo", JSON.stringify(curTasks));
}

function DisplayTodo() {
    let curTasks = JSON.parse(localStorage.getItem("todo")) || [];

    todos.innerHTML = '';
    curTasks.forEach((taskObj, index) => {
        let newtask = document.createElement('li');
        newtask.innerHTML =
            `<div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-${index}" ${taskObj.completed ? 'checked' : ''}>
                <label class="form-check-label ${taskObj.completed ? 'completed' : ''}" for="task-${index}">${taskObj.text}</label>
                <button class="btn btn-danger btn-sm delete-btn"><i class="bi bi-trash-fill"></i></button>
            </div>
            <hr>`
        todos.append(newtask);

        // Get  checkbox
        const checkbox = newtask.querySelector('input');

        // Listen for when it's clicked
        checkbox.addEventListener('change', function () {
            // Toggle the completed status in memory
            taskObj.completed = !taskObj.completed;

            // Save the updated array back to localStorage
            localStorage.setItem("todo", JSON.stringify(curTasks));

            // Toggle the visual strikethrough
            const label = newtask.querySelector('label');
            label.classList.toggle('completed');
        })

        const deleteBtn = newtask.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            // Remove from array
            curTasks.splice(index, 1);

            // Update localStorage
            localStorage.setItem("todo", JSON.stringify(curTasks));

            // Re-render the list
            DisplayTodo();
        });
    });
}

DisplayTodo();