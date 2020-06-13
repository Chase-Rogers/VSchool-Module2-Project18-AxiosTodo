const getData = () => 
    axios
        .get("https://api.vschool.io/chaserogers/todo")
        .then((response) => listData(response.data))
        .catch((error) => console.log(error));

getData();

const todoForm = document.todoform
const updateform = document.updateform

const createForm = () => {
    const newform = document.createElement('form')
    const h1 = document.createElement('h1')
    const img = document.createElement('img')
    const p = document.createElement('p')
    const price = document.createElement('p')
    const status = document.createElement('input')
    const button = document.createElement('button')
    status.setAttribute('type', 'checkbox')
    status.setAttribute('onchange', 'completeToDo(event)')
    button.setAttribute('onclick', 'deleteToDo(event)')
    button.textContent = "Delete"
    newform.appendChild(h1)
    newform.appendChild(status)
    newform.appendChild(p)
    newform.appendChild(img)
    newform.appendChild(price)
    newform.appendChild(button)

    return newform;
}

// Add Record
const newTodo = (event) => {
    event.preventDefault();

    const newToDo = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        imgUrl: todoForm.imgUrl.value,
        price: todoForm.price.value
    };

    const newform = createForm();
    newform.getElementsByTagName('h1')[0].innerHTML = todoForm.title.value
    newform.getElementsByTagName('p')[0].innerHTML = `Description: ${todoForm.description.value}`
    newform.getElementsByTagName('img')[0].src = todoForm.imgUrl.value
    newform.getElementsByTagName('p')[1].textContent = `Price: ${todoForm.price.value}`
    todoForm.title.value = ''
    todoForm.description.value = ''
    todoForm.imgUrl.value = ''
    todoForm.price.value = '';
    axios
        .post("https://api.vschool.io/chaserogers/todo", newToDo)
        .then((response) => {
            newform.getElementsByTagName('input')[0].textContent = response.data._id;
            document.getElementById(`todo-list`).appendChild(newform)


        })
        .catch((error) => console.log(error));
};

// Delete Record
const deleteToDo = (event) => {
    event.preventDefault();
    const id = event.target.parentElement.children[1].textContent

    axios.delete(`https://api.vschool.io/chaserogers/todo/${id}`)
        .then(response => event.target.parentElement.remove())

        .catch(error => console.log(error))
};

const listData = data => {
    clearList();
    for(let i = 0; i < data.length; i++){
        const newform = createForm();
        newform.getElementsByTagName('h1')[0].textContent = `Title: ${data[i].title}`
        newform.getElementsByTagName('p')[0].textContent = `Description: ${data[i].description}`
        newform.getElementsByTagName('img')[0].src = data[i].imgUrl
        newform.getElementsByTagName('p')[1].textContent = `Price: ${data[i].price}`
        if (data[i].completed) {
            newform.classList.add('complete');
            newform.getElementsByTagName('input')[0].setAttribute("checked", true);
        } else {
            newform.getElementsByTagName('input')[0].removeAttribute("checked")
        }
        newform.getElementsByTagName('input')[0].textContent = data[i]._id
        document.getElementById(`todo-list`).appendChild(newform)
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
    const id = event.currentTarget.textContent;
    (event.target.checked ? event.target.parentElement.classList.add('complete') : event.target.parentElement.classList.remove('complete'))
    
    axios.put(`https://api.vschool.io/chaserogers/todo/${id}`, {completed: event.target.checked})
        .then(response => {})
        .catch(error => error)
}