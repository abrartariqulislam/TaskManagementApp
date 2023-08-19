const form = document.getElementById("form")

form.addEventListener("submit" , (e) => {
    e.preventDefault()
    const inputElement = e.target.elements
    const task ={};
  [...inputElement].forEach(element =>{
    if(element.name)
    task[element.name] = element.value
   });
   addLocalStorage(task)
 
})

// get form local storage
function getFormLocalStorage(key = "tasks"){
   let tasks = JSON.parse(localStorage.getItem(key)) || [];
   return tasks;
};
// Add local storage
function addLocalStorage(task) {
    const tasks = getFormLocalStorage();
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
}