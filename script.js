'user strict';
const date = new Date();
const fullDate = date.toLocaleString('en-GB', {
    weekday: 'short', // long, short, narrow
    day: 'numeric', // numeric, 2-digit
    year: 'numeric', // numeric, 2-digit
    month: 'long', // numeric, 2-digit, long, short, narrow
});
document.getElementById('date').innerText = fullDate;
const form = document.getElementById('new-todo-form');
const todoInput = document.getElementById('todo-input');
const list = document.getElementById('list');
const template = document.getElementById('list-item-template');
const clearButton = document.getElementById('clearButton');
const LOCAL_STORAGE_PREFIX = "TODO_LIST"; //prevent conflicts with other app
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach(renderTodo);

list.addEventListener('change', e => {
    if (!e.target.matches('#checkbox')) return;
    const parent = e.target.closest('.list-item');
    const todoId = parent.id;
    const todo = todos.find(t => t.id === todoId);
    todo.complete = e.target.checked; //true if checked
    saveTodos();
});

//add todos
form.addEventListener('submit', e => {
    e.preventDefault();

    const todoName = todoInput.value;
    if (todoName === "") return; //prevent empty todos
    const newTodo = {
        name: todoName,
        complete: false,
        id: new Date().valueOf().toString()
    };
    todos.push(newTodo); //add todoName to the array todos
    renderTodo(newTodo);
    saveTodos();
    todoInput.value = ""; //clear input
});

//render todo
function renderTodo(todo) {
    const templateClone = template.content.cloneNode(true); //property returns a <template> element's template contents
    const listItem = templateClone.querySelector('.list-item');
    listItem.setAttribute('id', `${todo.id}`);//add id in html
    const textElement = templateClone.getElementById('item-text');
    textElement.innerText = todo.name;
    const checkbox = templateClone.getElementById('checkbox');
    checkbox.checked = todo.complete;
    list.appendChild(templateClone);
    renderAchievement(todos);
}

//save todos
function saveTodos() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos)); //convert array in a string
    renderAchievement(todos);
}

//load todos
function loadTodos() {
    const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
    return JSON.parse(todosString) || []; // or return an empty array
}

//delete
list.addEventListener('click', e => {
    if (!e.target.matches(".fa-trash-alt")) return;

    const parent = e.target.closest('.list-item');
    const todoId = parent.id;
    parent.remove();//remove from the screen
    todos = todos.filter(todo => todo.id !== todoId); //gives a new list and remove the todo with equal ids
    saveTodos();
});

// formula of achievement progress bar
function generateAchievementProgressBar(completeTodos, totalTodos) {
    const completeSummary = document.createElement('span');
    completeSummary.style.width = `calc(${(completeTodos.length / totalTodos.length) * 100}%)`;
    return completeSummary;
}

// Render achievement
function renderAchievement(todos) {
    const completeTodos = todos.filter((todo) => todo.complete);
    const totalTodos = todos.filter((todo) => todo.complete + !todo.complete);
    const totalPercent = document.createElement('span');

    document.querySelector('#percentage').innerHTML = '';
    document.querySelector('#percentage').appendChild(generateAchievementProgressBar(completeTodos, totalTodos));
    document.querySelector('#percentage').appendChild(totalPercent);
}

//edit
list.addEventListener('click', e => {
    if (!e.target.matches(".fa-edit")) return;
    todoInput.value = "";
    const parent = e.target.closest('.list-item');
    const todoId = parent.id;
    todoInput.value = parent.querySelector('span').innerText;

    parent.remove();//remove from the screen
    todos = todos.filter(todo => todo.id !== todoId); //gives a new list and remove the todo with equal ids
    saveTodos();
});

//search list
function myFunction() {
    let input, filter, label, li, span, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    li = document.getElementsByTagName('li');
    label = document.querySelectorAll('.list-item-label');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//clear all items from the list
clearButton.addEventListener('click', function () {
    let question = confirm("Do you want to delete all the tasks?");
    if (question) {

        alert("Done");
        document.getElementById("list").innerHTML = "";
        window.localStorage.clear();
    }
});