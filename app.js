const inputfield = document.querySelector("input");
const addbutton = document.querySelector("button");

inputfield.addEventListener('keypress', function (event) {

    if (event.key === 'Enter') {
        event.preventDefault();
        AddTodo();
    }
});

function AddTodo() {
    // Check for empty input
    if (inputfield.value.trim() == "") {
        inputfield.classList.add("is-invalid");
        return;
    }
    else {
        if (inputfield.classList.contains("is-invalid"))
            inputfield.classList.remove("is-invalid");
    }

    SaveToLocalStorage(inputfield.value);
    inputfield.value = "";
}

function SaveToLocalStorage(task) {
    let curTasks = JSON.parse(localStorage.getItem("todo")) || [];
    curTasks.push(task.trim());
    localStorage.setItem("todo", JSON.stringify(curTasks));
}