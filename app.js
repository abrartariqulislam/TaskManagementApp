const form = document.getElementById("form");
const tbody = document.getElementById("tbody");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputElement = e.target.elements;
  const task = {};
  [...inputElement].forEach((element) => {
    if (element.name) task[element.name] = element.value;
  });
  task.id = Math.floor(Math.random() * 10000 + 1000);
  addLocalStorage(task);
  e.target.reset()
});

// get form local storage
function getFormLocalStorage(key = "tasks") {
  let tasks = JSON.parse(localStorage.getItem(key)) || [];
  return tasks;
}
// Add local storage
function addLocalStorage(task) {
  const tasks = getFormLocalStorage();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskDisplay();
}
// display
function taskDisplay() {
  const tasks = getFormLocalStorage();
  tbody.innerHTML =""
  tasks?.map(({name,priority,date,status}, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>
      <label class="checkbox_container">
        <input type="checkbox">
        <span class="checkmark checkmark_1"></span>
      </label>
    </td>
    <td>${index +1}</td>
    <td>${name}</td>
    <td>${priority}</td>
    <td>${status || "Incomplete"}</td>
    <td>${date}</td>
    <td>
      <button class="btn delete">
        <i class="fas fa-solid fa-trash-can"></i>
      </button>
      <button class="btn check">
        <i class="fa-solid fa-circle-check"></i>
      </button>
      <button class="btn edit">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </td>`;
    tbody.appendChild(tr);
  });
};

taskDisplay()