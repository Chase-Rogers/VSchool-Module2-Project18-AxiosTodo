

const complete = 'complete';

//clears values from form after submission
const clearForm = (todoForm) => {
    todoForm.title.value = '';
    todoForm.description.value = '';
    todoForm.imgUrl.value = '';
    todoForm.price.value = '';
}

// Adds new todo
const newTodo = (event) => {
    event.preventDefault();
    const todoForm = document.todoform;

    const newToDo = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        imgUrl: todoForm.imgUrl.value,
        price: todoForm.price.value
    };

    axios
        .post("https://api.vschool.io/chaserogers/todo", newToDo)
        .then((response) => {
            createToDo(response.data);
            clearForm(todoForm)
        })
        .catch((error) => console.log(error));
};

// Delete todo
const deleteToDo = (event) => {
    event.preventDefault();
    const id = event.target.parentElement.firstChild.textContent;

    axios.delete(`https://api.vschool.io/chaserogers/todo/${id}`)
        .then(response => { 
            if (response.data.msg === 'Successfully deleted record') {
                event.target.parentElement.remove();
            }
        })
        .catch(error => console.log(error))
};

//marks todo as complete
const completeToDo = event => {
    const target = event.target;
    const parentClassList = target.parentElement.classList;
    const id = target.parentElement.firstChild.textContent;
    
    axios.put(`https://api.vschool.io/chaserogers/todo/${id}`, {completed: target.checked})
        .then(response => {
            response.data.completed ? parentClassList.add(complete) : parentClassList.remove(complete)
        })
        .catch(error => error)
}

//gets data from api
const getData = () => 
    axios
        .get("https://api.vschool.io/chaserogers/todo")
        .then((response) => {
            response.data.forEach(data => {
                createToDo(data);
            });
        })
        .catch((error) => console.log(error));

// add todoItem to UI
const createToDo = (data) => {

    // Creates todo item container
    const div = document.createElement('div');
    if (data.completed) div.classList.add('complete');
    div.setAttribute('id', 'todoItem')
    document.getElementById('todo-list').appendChild(div)

    //creates hidden id tag
    const idEl = document.createElement('p');
    idEl.setAttribute('hidden', true);
    idEl.textContent = data._id;
    div.appendChild(idEl);

    //creates todo title
    const titleEl = document.createElement('h1');
    titleEl.textContent = `Title: ${data.title}`;
    div.appendChild(titleEl);

    // creates checkbox to mark todo as complete 
    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = data.completed;
    checkBox.addEventListener('click', completeToDo);
    div.appendChild(checkBox);

    // creates todo description
    const descEl = document.createElement('p');
    descEl.textContent = `Description: ${data.description}`;
    div.appendChild(descEl);

    // creates todo img
    const imgEl = document.createElement('img');
    imgEl.src = data.imgUrl;
    div.appendChild(imgEl);

    //creates todo price
    const priceEl = document.createElement('p');
    priceEl.textContent = `Price: ${data.price}`;
    div.appendChild(priceEl);

    //adds delete button for todo item
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteToDo);
    div.appendChild(deleteBtn);
}

getData();

/*
    Get data:
        axios.get
    Populate todo list with data received.
        on response from axios
            loop through data
                create todo UI and pass in data needed 
    On add todo:
        Grab data from form
            use form value, pass as body to api
        Save to api
            axios.post with body from form
        Add todo in html
            on response from axios post
                create todo and pass in data
    On complete todo:
        Get value of checkbox
            from on change event - pass in as body to put
        Update 'status to complete' on api
            axios.put with body containing checkbox value
        Strikethrough all text (not image)
            update UI
    On delete:
        Get id of todo to be deleted.
            from event? pass as id to axios delete
        Delete todo in api
            axios.delete with id from event
        Remove todo from html
            update UI

*/
