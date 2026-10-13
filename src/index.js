import "./style.css";

import {
  createAndPushProject,
  updateProjectsList,
  createAndPushTodo,
  udpdateMain,
} from "./addFunctions.js";

const addProjectForm = document.querySelector(`form[formAddProject]`);
const addTaskForm = document.querySelector(`form[formAddTask]`);

let projects = [
  {
    name: `Default`,
    todos: [],
  },
];

if (JSON.parse(localStorage.getItem(`projects`)))
  projects = JSON.parse(localStorage.getItem(`projects`));

const updateLocalStorage = () =>
  localStorage.setItem(`projects`, JSON.stringify(projects));

class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.state = `unchecked`;
  }
}

if (projects[0].todos.length < 1) {
  projects[0].todos.push(
    new Todo(`Cook`, `Make that sweet sweet potato dude!`, `Oct, 9`, `high`),
  );
  projects[0].todos.push(
    new Todo(
      `Do the lundry`,
      `Do it before wife comes home!`,
      `Oct, 9`,
      `high`,
    ),
  );
}

addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createAndPushProject();
  updateProjectsList();
  updateLocalStorage();

  addProjectForm.reset();
  document.querySelector(`#projectDialog`).close();
});

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createAndPushTodo();
  updateLocalStorage();

  addTaskForm.reset();
  document.querySelector(`#taskDialog`).close();
});

updateProjectsList();
udpdateMain(0);

export { projects, Todo };
// learn to store in local store, finist the editing todos, create the botons to complete and erase
