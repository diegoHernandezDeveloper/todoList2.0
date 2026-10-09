import "./style.css";

const addProjectBtn = document.querySelector(`form[formAddProject]`);
const addTaskBtn = document.querySelector(`form[formAddTask]`);

let projects = [
  {
    name: `default`,
    todos: [],
  },
];

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.state = `check`;
  }
}

const cook = new Todo(
  `cook`,
  `make that sweet sweet potato dude!`,
  `today`,
  `high`,
);
const lundry = new Todo(
  `do the lundry`,
  `do it before wife comes home!`,
  `today`,
  `high`,
);
projects[0].todos.push(cook);
projects[0].todos.push(lundry);

addProjectBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  const project = document.querySelector(`#projectValue`);
  const projectObject = { name: `${project.value}`, todos: [] };
  projects.push(projectObject);
  addProjectBtn.reset();
  document.querySelector(`#addProjectDialog`).close();

  udpateProjects();
});

addTaskBtn.addEventListener("submit", (e) => {
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
  addTaskBtn.reset();
  document.querySelector(`#addTaskDialog`).close();
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
  const h3 = document.querySelector(`h3[nameMain]`);
  h3.innerText = projects[index].name;
  for (let todo of todos) {
    const tr = document.createElement(`tr`);

    const checkbox = document.createElement(`input`);
    checkbox.setAttribute(`type`, `checkbox`);
    checkbox.setAttribute(`indexProject`, `${index}`);
    checkbox.setAttribute(`todoName`, `${todo.title}`);
    if (todo.state == `checked`) {
      checkbox.checked = `true`;
    }

    checkbox.addEventListener(`change`, (e) => {
      const indexProject = e.target.getAttribute(`indexProject`);
      const todoName = e.target.getAttribute(`todoName`);
      const arr = projects[indexProject].todos;
      const result = arr.findIndex((object) => object.title == todoName);
      projects[indexProject].todos[result].state =
        projects[indexProject].todos[result].state == `check`
          ? `checked`
          : `check`;
      udpdateMainAddingATask(indexProject);
      console.log(projects[indexProject].todos[result].state);
    });

    const tdCheckbox = document.createElement(`td`);
    tdCheckbox.appendChild(checkbox);

    const editBtn = returnElement(`button`, `edit`);
    const tdEditBtn = document.createElement(`td`);
    tdEditBtn.appendChild(editBtn);

    const deleteBtn = returnElement(`button`, `X`);
    const tdDeleteBtn = document.createElement(`td`);
    tdDeleteBtn.appendChild(deleteBtn);

    tr.append(
      returnElement(`td`, todo.title),
      returnElement(`td`, todo.description),
      returnElement(`td`, todo.dueDate),
      returnElement(`td`, todo.priority),
      tdCheckbox,
      tdEditBtn,
      tdDeleteBtn,
    );
    if (todo.state == `checked`) {
      tr.toggleAttribute(`checked`);
    }
    tbody.appendChild(tr);
  }
}

function returnElement(element, content) {
  const ele = document.createElement(`${element}`);
  ele.innerText = content;
  return ele;
}

udpateProjects();
udpdateMainAddingATask(0);
// learn to store in local store, finist the editing todos, create the botons to complete and erase
