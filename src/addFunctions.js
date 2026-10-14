import { parseISO, format } from "date-fns";
// 1. Import editState instead of the read-only todoBeingEdited binding
import { projects, Todo, editState } from "./index.js";

function createAndPushProject() {
  const projectNameInput = document.querySelector(`#projectNameInput`);
  const projectObject = { name: `${projectNameInput.value}`, todos: [] };
  projects.push(projectObject);
}

function updateProjectsList() {
  const ul = document.querySelector(`ul[ul-projects]`);
  const selectElement = document.querySelector(`#projectSelect`);

  selectElement.innerHTML = ``;
  ul.innerHTML = ``;
  for (let project of projects) {
    const li = document.createElement(`li`);
    const button = document.createElement(`button`);
    const deleteBtn = createAndReturnElement(`button`, `X`);
    const option = createAndReturnElement(`option`, `${project.name}`);

    option.value = project.name;
    button.setAttribute(`nameProject`, `${project.name}`);
    deleteBtn.setAttribute(`nameProject`, `${project.name}`);
    button.innerText = project.name;

    button.addEventListener(`click`, (e) => {
      const index = projects.findIndex(
        (item) => item.name == e.target.getAttribute(`nameProject`),
      );
      udpdateMain(index);
    });

    deleteBtn.addEventListener(`click`, (e) => {
      const index = projects.findIndex(
        (item) => item.name == e.target.getAttribute(`nameProject`),
      );
      projects.splice(index, 1);
      updateProjectsList();
      localStorage.setItem(`projects`, JSON.stringify(projects));
      udpdateMain(0);
    });

    selectElement.appendChild(option);
    if (project === projects[0]) {
      li.append(button);
    } else {
      li.append(button, deleteBtn);
    }
    ul.appendChild(li);
  }
}

function createAndPushTodo() {
  const title = document.querySelector(`#title`);
  const description = document.querySelector(`#description`);
  const dueDate = document.querySelector(`#dueDate`);
  const formatedDate = format(parseISO(dueDate.value), `MMM, d`);
  const priority = document.querySelector(`#priority`);
  const projectDestination = document.querySelector(`#projectSelect`);

  const index = projects.findIndex(
    (item) => item.name == projectDestination.value,
  );
  projects[index].todos.push(
    new Todo(title.value, description.value, formatedDate, priority.value),
  );
  udpdateMain(index);
}

function udpdateMain(index) {
  const tbody = document.querySelector(`tbody`);
  tbody.innerHTML = ``;

  // Guard clause in case a project index is out of bounds (e.g. after a project deletion)
  const targetProject = projects[index] || projects[0];
  const todos = targetProject.todos;

  const h3 = document.querySelector(`h3`);
  h3.innerText = targetProject.name;

  for (let todo of todos) {
    const tr = document.createElement(`tr`);

    //Checkbox
    const checkbox = document.createElement(`input`);
    checkbox.setAttribute(`type`, `checkbox`);
    checkbox.setAttribute(`indexProject`, `${index}`);
    checkbox.setAttribute(`todoName`, `${todo.title}`);
    if (todo.state == `checked`) {
      checkbox.checked = true;
    }

    checkbox.addEventListener(`change`, (e) => {
      const indexProject = e.target.getAttribute(`indexProject`);
      const todoName = e.target.getAttribute(`todoName`);
      const arr = projects[indexProject].todos;
      const result = arr.findIndex((object) => object.title == todoName);
      projects[indexProject].todos[result].state =
        projects[indexProject].todos[result].state == `unchecked`
          ? `checked`
          : `unchecked`;
      udpdateMain(indexProject);
      localStorage.setItem(`projects`, JSON.stringify(projects));
    });

    const tdCheckbox = document.createElement(`td`);
    tdCheckbox.appendChild(checkbox);

    //Edit Btn
    const editButton = createAndReturnElement(`button`, "✎");
    editButton.setAttribute(`index`, `${index}`);
    editButton.setAttribute(`name`, `${todo.title}`);
    editButton.setAttribute(`command`, `show-modal`);
    // 2. Point this to taskDialog instead of editTaskDialog
    editButton.setAttribute(`commandfor`, `taskDialog`);
    const editButtonTD = document.createElement(`td`);
    editButtonTD.appendChild(editButton);

    editButton.addEventListener("click", (e) => {
      const projectIndex = e.target.getAttribute(`index`);
      const todoName = e.target.getAttribute(`name`);

      // 3. Mutate the shared editState container safely
      editState.todoBeingEdited = projects[projectIndex].todos.find(
        (item) => item.title == todoName,
      );

      if (editState.todoBeingEdited) {
        document.querySelector(`#title`).value =
          editState.todoBeingEdited.title;
        document.querySelector(`#description`).value =
          editState.todoBeingEdited.description;
        document.querySelector(`#priority`).value =
          editState.todoBeingEdited.priority;

        document.querySelector(`#projectSelect`).value =
          projects[projectIndex].name;

        // Target button safely using its custom attribute flag from your HTML
        document.querySelector("form[formAddTask] button[addTask]").innerText =
          `Save changes`;
        document.querySelector(`#taskDialog`).showModal();
      }
    });

    //Delete Btn
    const deleteBtn = createAndReturnElement(`button`, `X`);
    deleteBtn.setAttribute(`index`, `${index}`);
    deleteBtn.setAttribute(`name`, `${todo.title}`);
    const tdDeleteBtn = document.createElement(`td`);
    tdDeleteBtn.appendChild(deleteBtn);

    deleteBtn.addEventListener(`click`, (e) => {
      const projectIndex = e.target.getAttribute(`index`);
      const todoName = e.target.getAttribute(`name`);
      const todoIndex = projects[projectIndex].todos.findIndex(
        (item) => item.title == todoName,
      );

      projects[projectIndex].todos.splice(todoIndex, 1);
      udpdateMain(index);
      localStorage.setItem(`projects`, JSON.stringify(projects));
    });

    tr.append(
      createAndReturnElement(`td`, todo.title),
      createAndReturnElement(`td`, todo.description),
      createAndReturnElement(`td`, todo.dueDate),
      createAndReturnElement(`td`, todo.priority),
      tdCheckbox,
      editButtonTD,
      tdDeleteBtn,
    );
    if (todo.state == `checked`) {
      tr.toggleAttribute(`checked`);
    }
    tbody.appendChild(tr);
  }
}

function createAndReturnElement(element, content) {
  const ele = document.createElement(`${element}`);
  ele.innerText = content;
  return ele;
}

export {
  createAndPushProject,
  updateProjectsList,
  createAndPushTodo,
  udpdateMain,
};
