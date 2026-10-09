import "./style.css";

const addProjectBtn = document.querySelector(`button[addProject]`);
const addTaskBtn = document.querySelector(`button[addTask]`);

let projects = [
  {
    name: `default`,
    todos: [
      {
        title: `do the lundry`,
        description: `do it before wife comes home!`,
        dueDate: `today`,
        priority: `high`,
      },
    ],
  },
];

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}

const cook = new Todo(
  `cook`,
  `make that sweet sweet potato dude!`,
  `today`,
  `high`,
);
projects[0].todos.push(cook);

addProjectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const project = document.querySelector(`#projectValue`);
  const projectObject = { name: `${project.value}`, todos: [] };
  projects.push(projectObject);

  udpateProjects();
});

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.querySelector(`#title`);
  const description = document.querySelector(`#description`);
  const dueDate = document.querySelector(`#dueDate`);

  const priority = document.querySelector(`#priority`);
  const project = document.querySelector(`#project`);

  const index = projects.findIndex((item) => item.name == project.value);
  projects[index].todos.push(
    new Todo(title.value, description.value, dueDate.value, priority.value),
  );

  udpdateMainAddingATask(index);
});

function udpateProjects() {
  const ul = document.querySelector(`ul[ul-projects]`);
  const selectElement = document.querySelector(`#project`);
  selectElement.innerHTML = ``;
  ul.innerHTML = ``;
  for (let project of projects) {
    const li = document.createElement(`li`);
    const button = document.createElement(`button`);
    const option = returnElement(`option`, `${project.name}`);

    option.value = project.name;
    button.setAttribute(`namevalue`, `${project.name}`);
    button.innerText = project.name;
    button.addEventListener(`click`, updateMain);

    selectElement.appendChild(option);
    li.appendChild(button);
    ul.appendChild(li);
  }
}

function updateMain(e) {
  const index = projects.findIndex(
    (item) => item.name == e.target.getAttribute(`namevalue`),
  );

  udpdateMainAddingATask(index);
}

function udpdateMainAddingATask(index) {
  const tbody = document.querySelector(`tbody`);
  tbody.innerHTML = ``;
  const todos = projects[index].todos;
  for (let todo of todos) {
    const tr = document.createElement(`tr`);
    tr.append(
      returnElement(`td`, todo.title),
      returnElement(`td`, todo.description),
      returnElement(`td`, todo.dueDate),
      returnElement(`td`, todo.priority),
    );
    tbody.appendChild(tr);
  }
}

function returnElement(element, content) {
  const ele = document.createElement(`${element}`);
  ele.innerText = content;
  return ele;
}
udpateProjects();
