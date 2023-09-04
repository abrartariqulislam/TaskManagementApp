const form = document.getElementById("form");
const tbody = document.getElementById("tbody");
const date = document.querySelector("#date")
const toDay = new Date()

date.value = toDay.toISOString().slice(0,10)

// form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputElement = e.target.elements;
  const task = {};
  [...inputElement].forEach((element) => {
    if (element.name) task[element.name] = element.value;
  });
  task.id = Math.floor(Math.random() * 10000 + 1000);
  task.status = "Incomplete"
  addLocalStorage(task);
  e.target.reset()
});

// get data form local storage
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
  tasks?.map(({name,priority,date,status,id}, index) => {
    const tr = document.createElement("tr");
    tr.id = `task_${id}`
    tr.innerHTML = `
    <td>
      <label class="checkbox_container">
        <input type="checkbox">
        <span class="checkmark checkmark_1"></span>
      </label>
    </td>
    <td>${index +1}</td>
    <td class="taskName">${name}</td>
    <td class="taskPriority">${priority}</td>
    <td>${status}</td>
    <td class="taskDate">${date}</td>
    <td class="action">
      <button class="btn delete" onclick="deleteTask(${id})">
        <i class="fas fa-solid fa-trash-can"></i>
      </button>
      <button class="btn check" onclick="changeTaskStatus(${id})">
        <i class="fa-solid fa-circle-check"></i>
      </button>
      <button class="btn edit" onclick="editTask(${id})">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </td>`;
    tbody.appendChild(tr);
  });
};

taskDisplay()

// Delete Task
function deleteTask(id){
  const tasks = getFormLocalStorage();
  const newTask = tasks.filter(task => {
    if (task.id !== id){
      return true
    }
  })
  localStorage.setItem("tasks", JSON.stringify(newTask));
  taskDisplay();
}

// Change Task Status 
function changeTaskStatus(id){
  const tasks = getFormLocalStorage();
  const newTask = tasks.map(task =>{
    if(task.id === id){
      if(task.status === "Incomplete"){
        task.status = "Completed"
      }else{
        task.status = "Incomplete"
      }
    }
    return task
  })
  localStorage.setItem("tasks", JSON.stringify(newTask));
  taskDisplay();
}

// edit Task
function editTask(id){
  const tr = document.querySelector(`#task_${id}`)

// name
  const taskNameElement = tr.querySelector(".taskName")
  const taskName = taskNameElement.textContent
  const taskNameInput = document.createElement("input")
  taskNameInput.classList.add("editInputStyle", "editInputStyleName")
  taskNameElement.textContent = ""
  taskNameInput.value = taskName
  taskNameElement.appendChild(taskNameInput)

// priority
const taskPriorityElement = tr.querySelector(".taskPriority")
const taskPriority = taskPriorityElement.textContent
const taskPriorityInput = document.createElement("select")
taskPriorityInput.classList.add("editInputStyle", "editInputStylePriority")
taskPriorityElement.innerHTML = ""
taskPriorityInput.innerHTML = `
<option value="select" disabled>Select One</option>
<option ${taskPriority === "High" && "selected"} value="High" >High</option>
<option ${taskPriority === "Medium" && "selected"} value="Medium">Medium</option>
<option ${taskPriority === "Low" && "selected"} value="Low">Low</option>`

taskPriorityElement.appendChild(taskPriorityInput)



// Date
const taskDateElement = tr.querySelector(".taskDate")
const taskDate = taskDateElement.textContent
const taskDateInput = document.createElement("input")
taskDateInput.classList.add("editInputStyle")
taskDateInput.type = "date"
taskDateElement.textContent = ""
taskDateInput.value = taskDate
taskDateElement.appendChild(taskDateInput)

// action
const actionElement = tr.querySelector(".action")
const actionButtons = actionElement.innerHTML
const saveBtn = document.createElement("button")
saveBtn.classList.add("btn", "edit")
saveBtn.innerHTML= `
<i class="fa-solid fa-floppy-disk"></i>`
actionElement.innerHTML = ""
actionElement.appendChild(saveBtn)

// save  btn
saveBtn.onclick = function (){
  if(taskNameInput.value !== "" && taskDateInput.value !== ""){
    const newTaskName = taskNameInput.value
    const newTaskPriority = taskPriorityInput.value
    const newTaskDate = taskDateInput.value
  
    const tasks = getFormLocalStorage();
    const newTask = tasks.map(task =>{
      if(task.id === id){
        return{
          ...task,
          name: newTaskName,
          priority:newTaskPriority,
          date:newTaskDate
        }
  
      }
      return task
    })
    localStorage.setItem("tasks", JSON.stringify(newTask));
    taskDisplay()
  }
}

}
