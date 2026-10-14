import "./style.css";
import { parseISO, format } from "date-fns";

import {
  createAndPushProject,
  updateProjectsList,
  createAndPushTodo,
  udpdateMain,
} from "./addFunctions.js";

const addProjectForm = document.querySelector(`form[formAddProject]`);
const addTaskForm = document.querySelector(`form[formAddTask]`);

// 1. Declare state variables clearly at the top
export let projects = [
  {
    name: `Default`,
    todos: [],
  },
];

// Create a state object or simple container object so other files can safely modify it without breaking read-only bindings
export let editState = {
  todoBeingEdited: null,
};

if (JSON.parse(localStorage.getItem(`projects`))) {
  projects = JSON.parse(localStorage.getItem(`projects`));
}

export const updateLocalStorage = () =>
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

  // Use editState object wrapper to bypass read-only module restrictions cleanly
  if (editState.todoBeingEdited) {
    let title = document.querySelector(`#title`);
    let description = document.querySelector(`#description`);
    let dueDate = document.querySelector(`#dueDate`);
    let priority = document.querySelector("#priority");

    editState.todoBeingEdited.title = title.value;
    editState.todoBeingEdited.description = description.value;

    // Only format the date if a new date was selected to avoid date-fns crashing
    if (dueDate.value) {
      editState.todoBeingEdited.dueDate = format(
        parseISO(dueDate.value),
        `MMM, d`,
      );
    }

    editState.todoBeingEdited.priority = priority.value;

    // Reset tracking state back to default safely
    editState.todoBeingEdited = null;
    document.querySelector(
      `form[formAddTask] button[type="submit"]`,
    ).innerText = "Add";
  } else {
    createAndPushTodo();
  }

  updateLocalStorage();

  const currentProjectName = document.querySelector(`#projectSelect`).value;
  const projectIndex = projects.findIndex((p) => p.name === currentProjectName);

  // Fallback to 0 if findIndex returns -1
  udpdateMain(projectIndex >= 0 ? projectIndex : 0);

  addTaskForm.reset();
  document.querySelector(`#taskDialog`).close();
});

updateProjectsList();
udpdateMain(0);

export { Todo };
