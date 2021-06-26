let form = document.querySelector("#addForm")
let items = document.querySelector("#items")
let filter = document.querySelector("#filter")

form.addEventListener("submit", (e)=>{
    e.preventDefault() // prevent form submission
    
    let value = document.querySelector("#item").value

    let li = document.createElement("li")

    li.appendChild(document.createTextNode(value))
    li.className = "list-group-item"

    let deleteBtn = document.createElement("button")
    deleteBtn.appendChild(document.createTextNode("X"))

    deleteBtn.className = "btn btn-danger btn-sm float-right delete"
    li.appendChild(deleteBtn)
    li.addEventListener("click", (e)=>{
        if(confirm("Are you sure?")){
            let li = e.target.parentElement
            items.removeChild(li)
        }
    })
    items.appendChild(li)
})

let delBtns = document.querySelectorAll(".delete")

for(let i=0;i<delBtns.length;i++){
    delBtns[i].addEventListener("click", (e)=>{
        if(confirm("Are you sure?")){
            let li = e.target.parentElement
            items.removeChild(li)
        }
    })
}

filter.addEventListener("keyup", (e)=>{
    let value = e.target.value.toLowerCase()

    Array.from(items.getElementsByTagName("li")).forEach((val)=>{
        if(val.textContent.toLowerCase().indexOf(value) > -1){
            val.style.display = "block";
        }else{
            val.style.display = "none"
        }
    })
})