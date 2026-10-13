import { parseISO, format } from "date-fns";
import { projects, Todo } from ".";

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
    const option = createAndReturnElement(`option`, `${project.name}`);

    option.value = project.name;
    button.setAttribute(`nameProject`, `${project.name}`);
    button.innerText = project.name;

    button.addEventListener(`click`, (e) => {
      const index = projects.findIndex(
        (item) => item.name == e.target.getAttribute(`nameProject`),
      );
      udpdateMain(index);
    });

    selectElement.appendChild(option);
    li.appendChild(button);
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
  const todos = projects[index].todos;
  const h3 = document.querySelector(`h3`);
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
        projects[indexProject].todos[result].state == `unchecked`
          ? `checked`
          : `unchecked`;
      udpdateMain(indexProject);
    });

    const tdCheckbox = document.createElement(`td`);
    tdCheckbox.appendChild(checkbox);

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
    });

    tr.append(
      createAndReturnElement(`td`, todo.title),
      createAndReturnElement(`td`, todo.description),
      createAndReturnElement(`td`, todo.dueDate),
      createAndReturnElement(`td`, todo.priority),
      tdCheckbox,
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
