const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    count: document.getElementById('count')
};
const tasks = [];

// Загрузка задач при загрузке страницы
window.onload = () => {
    loadTasks();
};

// Сохранение задач в LocalStorage
function saveTasks(list) {
    localStorage.setItem('tasks', JSON.stringify(list));// Сохраняем массив задач как строку JSON
}

// Загрузка задач из LocalStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks.push(...JSON.parse(savedTasks));
    }
    tasksRender(tasks);
}

// отслеживание клика по кномпе добавить задачу
dom.add.onclick = () => {
    const newTaskText = dom.new.value;
    if (newTaskText && isNotHaveTask(newTaskText, tasks)) {//проверить есть ли текст в поле 'добавить новую задачу'
        addTask(newTaskText, tasks);
        dom.new.value = '';//очистка импута при добавлении задачи
        tasksRender(tasks);
        saveTasks(tasks);// Сохранить задачи после добавления
    }
};

// функция добавления задачи
function addTask(text, list) {
    const time = Date.now();// временная метка (уникальное число для айди)
    const task = {
        id: time,
        text,
        isComplete: false
    };
    list.push(task);//добавлять задачи в массив
}

// Проверка существования задачи в массиве tasks
function isNotHaveTask(text, list) {
    let isNotHave = true;
    list.forEach((task) => {
        if (task.text === text) {
            alert('Такая задача уже существует!');
            isNotHave = false;
        }
    });
    return isNotHave;//статус проверки
}
// Функция сортировки задач
function sortTasks(list) {
    list.sort((a, b) => {
        if (a.isComplete !== b.isComplete) {
            return a.isComplete - b.isComplete; 
        }
        return b.id - a.id; 
    });
}

// функция для вывода списка чадач
function tasksRender(list) {
    sortTasks(list) // сортировка перед рендерингом
    let htmlList = '';
    list.forEach((task) => {
        const cls = task.isComplete 
            ? 'todo-task todo-task_completed' 
            : 'todo-task';
        const checked = task.isComplete ? 'checked' : ''; 
        const taskHtml = `
            <div id="${task.id}" class="${cls}">  
                <label class="todo-checkbox">
                    <input type="checkbox" ${checked}>
                    <div class="todo-checkbox-div"></div>
                </label>
                <div class="todo-task-text">${task.text}</div>
                <div class="todo-task-del">-</div>
            </div> 
        `;
        htmlList = htmlList + taskHtml; //наполнение списка задач
    });
    dom.tasks.innerHTML = htmlList;
    renderTaskCount(list);
}

//отслеживание клика по чекбоксу задачи
dom.tasks.onclick = (event) => {
    const target = event.target;
    const isCheckboxEl = target.classList.contains('todo-checkbox-div');
    const isDeleteEl = target.classList.contains('todo-task-del');
    
    if (isCheckboxEl) {
        const task = target.parentElement.parentElement; //подянться в родителю выше родителя
        const taskId = task.getAttribute('id');//получить айди задачи
        changeTaskStatus(taskId, tasks);
        tasksRender(tasks);
        saveTasks(tasks);
    }
    if (isDeleteEl) {
        const task = target.parentElement;
        const taskId = task.getAttribute('id');
        deleteTask(taskId, tasks);
        tasksRender(tasks);
        saveTasks(tasks);
    }
};

// функция изменения статуса задачи
function changeTaskStatus(id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isComplete = !task.isComplete;
        }
    });
}

// функция удаления задачи
function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            list.splice(idx, 1);
        }
    });
}
//вывод кол-ва задач
function renderTaskCount(list) {
    dom.count.innerHTML = list.length; 
}
