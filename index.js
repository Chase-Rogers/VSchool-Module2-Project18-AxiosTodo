const getData = () => 
    axios
        .get("https://api.vschool.io/chaserogers/todo")
        // .then((response) => console.log(response.data))
        .then((response) => listData(response.data))
        .catch((error) => console.log(error));


getData();

axios
    .get("https://api.vschool.io/chaserogers/todo")
    .then((response) => {
        // for(let i = 0; i < response.data.length; i++){
        //     const h1 = document.createElement('h1')
        //     h1.textContent = response.data[i].title
        //     document.body.appendChild(h1)
        // }
    })
    .catch((error) => console.log(error));

const todoForm = document.todoform
const updateform = document.updateform
// Add Record
const newTodo = (event) => {
    event.preventDefault();

    const newToDo = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        imgUrl: todoForm.imgUrl.value,
    };
    axios
        .post("https://api.vschool.io/chaserogers/todo", newToDo)
        .then((response) => getData())
        .catch((error) => console.log(error));
};

// Delete Record
const deleteToDo = (event) => {
    event.preventDefault();
    const id = event.target.parentElement.children[1].textContent
    console.log(id)
    

    axios.delete(`https://api.vschool.io/chaserogers/todo/${id}`)
        .then(response => event.target.parentElement.remove())

        .catch(error => console.log(error))
};

// const updateToDo = (event) => {
//     event.preventDefault();
//     const id = document.updateform.id.value
//     const updates = {
//         title: updateform.title.value,
//         completed: true,
//         description: updateform.description.value,
//         price: updateform.price.value,
//         imgUrl: updateform.imgUrl.value,
//     }
//     axios.put(`https://api.vschool.io/chaserogers/todo/${id}`, updates)
//         .then(response => getData())
//         .catch(error => error)
// }

const listData = data => {
    clearList();
    for(let i = 0; i < data.length; i++){
        const h1 = document.createElement('h1')
        const p = document.createElement('p')
        const img = document.createElement('img')
        const price = document.createElement('p')
        const status = document.createElement('input')
        const newform = document.createElement('form')
        const button = document.createElement('button')
        button.setAttribute('onclick', 'deleteToDo(event)')
        button.textContent = "Delete"
        newform.setAttribute('name', `newform${i}`)
        newform.setAttribute('id', `newform${i}`)
        status.setAttribute('type', 'checkbox')
        status.setAttribute('onchange', 'completeToDo(event)')

        if (data[i].completed) {
            h1.innerHTML = `Title: ${data[i].title.strike()}`
            p.innerHTML = `Description: ${data[i].description.strike()}`
            img.textContent = data[i].imgUrl.strike()
            price.textContent = `Price: ${data[i].price}`
        } else {
            h1.textContent = `Title: ${data[i].title}`
            p.textContent = `Description: ${data[i].description}`
            img.src = data[i].imgUrl
            price.textContent = `Price: ${data[i].price}`
        }
        status.textContent = data[i]._id
        if (data[i].completed === true) {
            status.setAttribute("checked", true);
        } else {
            status.removeAttribute("checked")
        }
        document.getElementById(`todo-list`).appendChild(newform)
        document.getElementById(`newform${i}`).appendChild(h1)
        document.getElementById(`newform${i}`).appendChild(status)
        document.getElementById(`newform${i}`).appendChild(p)
        document.getElementById(`newform${i}`).appendChild(img)
        document.getElementById(`newform${i}`).appendChild(price)
        document.getElementById(`newform${i}`).appendChild(button)
    }
}

const clearList = () => {
    const element = document.getElementById('todo-list')
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}

const completeToDo = event => {
    const form = event.currentTarget.form.id;
    const id = event.currentTarget.textContent
    console.log(event.target.checked)
    console.log('test');
    axios.put(`https://api.vschool.io/chaserogers/todo/${id}`, {completed: event.target.checked})
        .then(response => getData())
        .catch(error => error)
}