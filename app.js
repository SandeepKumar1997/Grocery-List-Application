// Get all the elements

let alert = document.querySelector(".alert");
let form = document.querySelector(".grocery-form");
let groceryInput = document.getElementById("grocery");
let container = document.querySelector(".grocery-container");
let groceryList = document.querySelector(".grocery-list");
let submitBtn = document.querySelector(".submit-btn");
let clearBtn = document.querySelector(".clear-btn");

// Edit option

let editElement;
let EditFlag = false;
let editID = ""; //In order to get the ID of the specific item we want to Edit

// EVENT LISTENERS //

// Submit Form //

form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded",setupForm);//display items on laod from local storage

function addItem(e) {
  e.preventDefault(); //This method prevents the form's default submission behaviour to the server

  let inputValue = groceryInput.value;
  let inputID = new Date().getTime().toString();

  if (inputValue && !EditFlag) {
    createList(inputID,inputValue); 

    //Display the success meassage
    displayAlert("Item added succesfully", "success");

    //Show the container
    container.classList.add("show-container");

    addToLocalStorage(inputID, inputValue);

    setBackToDefault();
  } 
  else if (inputValue && EditFlag) {
    editElement.innerHTML=inputValue;
    displayAlert("Value is changed successfully","success");
    editLocalStorage(editID,inputValue);
    setBackToDefault();
  } 
  
  else {
    displayAlert("Please enter a value", "danger");
  }
}

//Function to display alert message if the input is empty

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //Remove the alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function setBackToDefault() {
  groceryInput.value = "";
  EditFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

function editItem(e) {
    let editItem = e.currentTarget.parentElement.parentElement;
    editElement=e.currentTarget.parentElement.previousElementSibling;

    groceryInput.value=editElement.innerHTML;
    EditFlag=true;
    editID=editItem.dataset.id;

    submitBtn.textContent="Edit"
}

function deleteItem(e) {
  let delItem = e.currentTarget.parentElement.parentElement;
  let id=delItem.dataset.id;
  groceryList.removeChild(delItem);

  if (groceryList.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item removed","danger");
  setBackToDefault();

  //remove from local storage

  removeFromLocalStorage(id);
}

function clearItems() {
  let listItems = document.querySelectorAll(".grocery-item");
  if (listItems.length > 0) {
    listItems.forEach(function (item) {
      groceryList.removeChild(item);
    });
  }

  container.classList.remove("show-container");
  displayAlert("All items are deleted", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}


function addToLocalStorage(id,value){
    let groceryItem={id:id,value:value};
    let items=getlocalStorage();
    items.push(groceryItem);
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items=getlocalStorage();
    items=items.map(function(item){
        if(item.id===id){
            item.value=value
        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items=getlocalStorage();
    items=items.filter(function(item){
        if(item.id != id){
            return item;
        }
    });

    localStorage.setItem("list",JSON.stringify(items));
}

function setupForm(){
    let items=getlocalStorage();

    if(items.length >0){
        items.forEach(function(item){
            createList(item.id,item.value);
        });
        container.classList.add("show-container");
    }
}

function getlocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}


function createList(inputID,inputValue){
    let element = document.createElement("article");
    element.classList.add("grocery-item");
    let attr = document.createAttribute("data-id");
    attr.value = inputID;
    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${inputValue}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="far fa-edit"></i>
            </button>

            <button type="button" class="delete-btn">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
    `;
    let editBtn = element.querySelector(".edit-btn");

    let deleteBtn = element.querySelector(".delete-btn");

    editBtn.addEventListener("click", editItem);
    deleteBtn.addEventListener("click", deleteItem);

    //Appending the element
    groceryList.appendChild(element);
}