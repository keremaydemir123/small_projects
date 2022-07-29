//! good working save
const container = document.querySelector("#container");
const addButton = document.querySelector("#add");
const todosContainer = document.querySelector("#todos-container");
const textInput = document.querySelector("#text-input");
const dateInput = document.querySelector("#date-input");
const tagSelector = document.querySelector("#tag-selector");
const filterTag = document.querySelector("#filter-tag");
const createTagInput = document.querySelector("#create-tag");
const deleteTagInput = document.querySelector("#delete-tag");
const filterTagsButton = document.querySelector("#filter-button");
const createTagButton = document.querySelector("#create-tag-button");
const deleteTagButton = document.querySelector("#delete-tag-button");
const colorInput = document.querySelector("#color-input");

dateInput.min = new Date().toISOString().split("T")[0];

const todos = [];
let localTodos = JSON.parse(localStorage.getItem("todos"));
if (localTodos != null)
  localTodos.forEach((localTodo) => todos.push(localTodo));

const tags = [];
let localTags = JSON.parse(localStorage.getItem("tags"));
if (localTags != null) localTags.forEach((localTag) => tags.push(localTag));

loadTags();
filterTodos();

filterTagsButton.addEventListener("click", () => {
  filterTodos(filterTag.value);
  tagSelector.value = filterTag.value;
  tagSelector.disabled = true;
  if (filterTag.value == "all") {
    tagSelector.disabled = false;
    document.getElementById("selected").selected = true;
  }
});

createTagButton.addEventListener("click", () => {
  if (
    //! check if input is empty and tag is already exist
    createTagInput.value != "" &&
    !tags.some((tag) => tag == createTagInput.value)
  ) {
    tags.push(createTagInput.value);
    let newTag = document.createElement("option");
    newTag.value = createTagInput.value;
    newTag.innerText = createTagInput.value;
    tagSelector.append(newTag.cloneNode(true));
    deleteTagInput.append(newTag.cloneNode(true));
    filterTag.append(newTag.cloneNode(true));
  }
  console.log(tags);
  createTagInput.value = "";
  localStorage.setItem("tags", JSON.stringify(tags));
});

deleteTagButton.addEventListener("click", () => {
  let index = tags.findIndex((tag) => tag == deleteTagInput.value);
  tags.splice(index, 1);
  console.log(tags);
  loadTags();
  localStorage.removeItem("tags");
  localStorage.setItem("tags", JSON.stringify(tags));
});

addButton.addEventListener("click", () => {
  if (textInput.value != "") {
    let todo = createTodo();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    textInput.value = "";
    colorInput.value = "#ffffff";
  }
});

//! CREATE TODO
function createTodo(
  text = textInput.value,
  date = dateInput.value,
  tag = tagSelector.value,
  bgColor = colorInput.value
) {
  console.log(date);
  let todoDiv = document.createElement("div");
  let todoText = document.createElement("div");
  let todoDelete = document.createElement("input");
  todoDelete.type = "button";
  todoDelete.value = "delete";

  todoText.innerText = text;
  todoDelete.innerText = "Delete";
  todoDiv.className = "todo-div";
  todoText.className = "todo-text";
  todoDelete.className = "todo-delete";
  todoDiv.style.backgroundColor = bgColor;

  todoDelete.addEventListener("click", (e) => {
    console.log(todos);
    let todoIndex = todos.findIndex(
      (todo) =>
        todo.text ==
        todoDelete.parentElement.querySelector(".todo-text").innerText
    );
    todos.splice(todoIndex, 1);

    localStorage.removeItem("todos");
    localStorage.setItem("todos", JSON.stringify(todos));

    todoDelete.parentElement.remove();
  });

  //! APPEND
  todosContainer.append(todoDiv);
  todoDiv.append(todoText);

  let remainingDate;

  if (date != "") {
    let todoRemainingTime = document.createElement("div");
    remainingDate = remainingTime(date);
    todoRemainingTime.innerText = remainingDate;
    todoRemainingTime.className = "todo-time";
    todoDiv.append(todoRemainingTime);
  }

  if (tag != "tagless") {
    let todoTag = document.createElement("div");
    todoTag.className = "todo-tag";
    todoTag.innerText = tag;
    todoDiv.append(todoTag);
  }
  todoDiv.append(todoDelete);

  //! TODO OBJECT
  let todo = {
    text: text,
    todoDate: date,
    remainingTime: remainingDate,
    tag: tag,
    color: bgColor,
  };

  return todo;
}

function filterTodos(tag = "all") {
  clearTodos();

  let filteredTodos = todos.filter((todo) => todo.tag == tag);
  if (tag == "all") filteredTodos = todos;

  filteredTodos.forEach((todo) => {
    createTodo(todo.text, todo.todoDate, todo.tag, todo.color);
  });
}

function remainingTime(date) {
  console.log(dateInput.value);
  let date_1 = new Date(date);
  let date_2 = new Date();
  let difference = date_1.getTime() - date_2.getTime();
  let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return totalDays + " days left";
}

function clearTodos() {
  todosContainer.innerHTML = "";
}

function loadTags() {
  clearTags();
  let allTag = document.createElement("option");
  allTag.value = "all";
  allTag.innerText = "all";
  allTag.selected = true;
  let noTag = document.createElement("option");
  noTag.value = "tagless";
  noTag.innerText = "no tag";
  noTag.selected = true;
  tagSelector.append(noTag);
  filterTag.append(allTag);
  tags.forEach((tag) => {
    let newTag = document.createElement("option");
    newTag.value = tag;
    newTag.innerText = tag;
    tagSelector.append(newTag.cloneNode(true));
    deleteTagInput.append(newTag.cloneNode(true));
    filterTag.append(newTag.cloneNode(true));
  });
}

function clearTags() {
  tagSelector.innerHTML = "";
  deleteTagInput.innerHTML = "";
  filterTag.innerHTML = "";
}
