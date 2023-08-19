const form = document.getElementById("form")

form.addEventListener("submit" , (e) => {
    e.preventDefault()
    const inputElement = e.target.elements
    const task ={};
  [...inputElement].forEach(element =>{
    if(element.name)
    task[element.name] = element.value
   })
   console.log(task);
})
