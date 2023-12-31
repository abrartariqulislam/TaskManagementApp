const form = document.getElementById("form");
const tbody = document.getElementById("tbody");
const date = document.querySelector("#date")
const search = document.querySelector("#search_name")
const filter = document.querySelector("#filtering")
const sort = document.querySelector("#sorting")
const byDate = document.querySelector("#by_date")
const allSelected = document.querySelector("#allSelected")
const bulkAction = document.querySelector(".bulk_action")
const bulkActionCloseBtn = document.querySelector(".close_btn")
const deleteAll = document.querySelector(".edit_area_delete_btn")
const changePriority = document.querySelector("#change_priority")
const changeStatus = document.querySelector("#change_status")
const chooseNameDate = document.querySelector("#choose_name_date")
const chooseNameDateInput = document.querySelector("#choose_name_date_input")

 
// set today date
date.value = new Date().toISOString().slice(0,10)

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

// Bulk Action
let selectedTask = []

// bulkAction show
function bulkActionShow(){
  bulkAction.classList.remove("hide")
}
// bulkAction hide
function bulkActionHide(){
  bulkAction.classList.add("hide")
}

// Make Selected
function makeSelected(id){
  allSelected.checked = false
  if(selectedTask.includes(id)){
    selectedTask = selectedTask.filter(taskId =>{
      if(taskId !== id) return true
      return false
    })
  }else{
    selectedTask.push(id)
  }
 if(selectedTask.length){
  bulkActionShow()
 }else{
  bulkActionHide()
 }

}

// allSelected
allSelected.addEventListener("change", function(e){
  const tasks = tbody.children
if(e.target.checked){
  selectedTask = [...tasks].map(taskEl => {
    const checkBox = taskEl.querySelector("input[type=checkbox]");
    checkBox.checked = true;
    const id = taskEl.dataset.id
    return Number(id)
  })
  bulkActionShow()
 
}else{
selectedTask = [];
[...tasks].map(taskEl =>{
  const checkBox = taskEl.querySelector("input[type=checkbox]");
  checkBox.checked = false;
})
bulkActionHide()
}

})

// close bulk action
bulkActionCloseBtn.addEventListener("click", function(e){
  bulkActionHide()
  allSelected.checked = false;
  const tasks = tbody.children;
  [...tasks].map(taskEl =>{
    const checkBox = taskEl.querySelector("input[type=checkbox]");
    checkBox.checked = false;
  })
  selectedTask = []
 
})

// delete all selected Task
deleteAll.addEventListener("click", function(e){
  const isConfirm = confirm("Are You Delete Task....?")
  let tasks = getFormLocalStorage();
if(isConfirm){
  tasks = tasks.filter(task =>{
    if(selectedTask.includes(task.id)){
      return false
    }else{
      return true
    }
  })

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskDisplay();
  allSelected.checked = false
  selectedTask = []
  bulkActionHide()
}
})

// change Priority selected Task
changePriority.addEventListener("change", function(e){
  const PriorityValue = e.target.value
  let tasks = getFormLocalStorage();
  tasks = tasks.map(task =>{
   if(selectedTask.includes(task.id)){
    task.priority = PriorityValue
   }
   return task
  })
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskDisplay();
})

// change status selected Task
changeStatus.addEventListener("change", function(e){
  const statusValue = e.target.value
  let tasks = getFormLocalStorage();
  tasks = tasks.map(task =>{
   if(selectedTask.includes(task.id)){
    task.status = statusValue
   }
   return task
  })
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskDisplay();
})

// choose name or date
chooseNameDate.addEventListener("change", function(e){
  const value = e.target.value
  if(value === "Date"){
    chooseNameDateInput.type = "date"
  }else{
    chooseNameDateInput.type = "text"
  }
})
// change name and date selected Task
chooseNameDateInput.addEventListener("keypress", function(e){
  const value = e.target.value
  let tasks = getFormLocalStorage();
  if(value && e.target.type === "text" && e.key === "Enter"){
    tasks = tasks.map(task =>{
    if(selectedTask.includes(task.id)){
    task.name = value
    }
    return task
    })
    }
    if(value && e.target.type === "date"){
      tasks = tasks.map(task =>{
        if(selectedTask.includes(task.id)){
        task.date = value
        }
        return task
        })
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskDisplay();
})

let searchTextStore, filterValueStore, sortValueStore, byDateValueStore;

// display task list
function taskDisplay(searchText = searchTextStore,filterValue = filterValueStore,sortValue = sortValueStore,byDateValue = byDateValueStore) {
  let tasks = getFormLocalStorage();
// byDateValue
if(byDateValue){
  tasks = tasks.filter(task =>{
    if(task.date === byDateValue) return true
    return false
  })
}

  // sort
  if(sortValue){
  tasks = tasks.sort((a,b) =>{
    if(sortValue === "newest"){
      console.log(a.status);
      if(a.date < b.date) return 1
      if(a.date > b.date) return -1
      return 0
    }
    if(sortValue === "oldest"){
      console.log(b.status);
      if(a.date < b.date) return -1
      if(a.date > b.date) return 1
      return 0
    }
  })
  }else{
    tasks = tasks.reverse()
  }

  // filter
  if(filterValue){
    tasks = tasks.filter(task=>{
      if(task.priority === filterValue) return true
      else if(task.status === filterValue) return true
      else if(filterValue === "All") return true
      else if(filterValue === "Today" && task.date === new Date().toISOString().slice(0,10)) return true
      return false
    })
  }

  // search
  if(searchText){
    tasks = tasks.filter(task=>{
      searchText = searchText.trim().toLowerCase()
      if(task.name.toLowerCase().includes(searchText)) {
        return true
      }else{
        return  false
      }
      
    })
  }

  // display
  tbody.innerHTML =""
if(tasks.length){
  tasks?.map(({name,priority,date,status,id}, index) => {
    const tr = document.createElement("tr");
    tr.dataset.id = id
    tr.id = `task_${id}`
    tr.innerHTML = `
    <td>
      <label class="checkbox_container">
        <input type="checkbox" onclick="makeSelected(${id})">
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

    const checkBox = tr.querySelector("input[type=checkbox]")
    if(selectedTask.length && selectedTask.includes(id)){
      checkBox.checked = true
    }
    
    tbody.appendChild(tr);
  });
}else{
  if(searchText || filterValue || sortValue || byDateValue){
    tbody.innerHTML =`<p>No Task Found.....!</p>`
  }else{
    tbody.innerHTML =`<p>No Task Added</p>`
  }
  
}
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
// search
search.addEventListener("input", function(e){
  const searchText = e.target.value
  searchTextStore = searchText
  taskDisplay(searchText)
})

// filter
filter.addEventListener("change", function(e){
  const filterValue = e.target.value
  filterValueStore = filterValue
  taskDisplay(undefined,filterValue)
})

// sort
sort.addEventListener("change", function(e){
  const sortValue = e.target.value
  sortValueStore = sortValue
  taskDisplay(undefined,undefined,sortValue)
})

// byDate
byDate.addEventListener("change", function(e){
  const byDateValue = e.target.value
  byDateValueStore = byDateValue
  taskDisplay(undefined,undefined,undefined,byDateValue)
})