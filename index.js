// const formEl = document.querySelector(".form");
// const inputEl = document.querySelector(".input");
// const ulEl = document.querySelector(".list");

// let list = JSON.parse(localStorage.getItem("list"));

// list.forEach(task=>{
// 	todoList(task)
// })

// formEl.addEventListener("submit", (event)=>{
// 	event.preventDefault();
// 	todoList();
// });

// function todoList(task) {

// 	let newTask = inputEl.value;

// 	if (task) {
// 		newTask = task.name
// 	} 


// 	// create a new li element
// 	const liEl = document.createElement("li");
// 		if(task && task.checked) {
// 			liEl.classList.add("checked")
// 		}
// 	liEl.innerText = newTask;   //li should have newtask
// 	ulEl.appendChild(liEl);

// 	inputEl.value = "";

// 	const checkBtnEl = document.createElement("div");
// 	checkBtnEl.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
// 	liEl.appendChild(checkBtnEl);

// 	const trashBtnEl = document.createElement("div");
// 	trashBtnEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;
// 	liEl.appendChild(trashBtnEl);

// 	checkBtnEl.addEventListener("click", ()=>{
// 		liEl.classList.toggle("checked");
// 		updateLocalStorage();
// 	});

// 	trashBtnEl.addEventListener("click", ()=>{
// 		liEl.remove();
// 		updateLocalStorage();
// 	});
// 	updateLocalStorage();

// }

// function updateLocalStorage() {
// 	const liEls = document.querySelectorAll("li");
// 	 list = [];
// 	liEls.forEach(liEl =>{
// 		list.push({
// 			name: liEl.innerText,
// 			checked: liEl.classList.contains("checked")
// 		})
// 	})

// 	localStorage.setItem("list", JSON.stringify(list))
// }


const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const ulEl = document.querySelector(".list");

let list = JSON.parse(localStorage.getItem("list")) || [];

list.forEach(task => {
    todoList(task);
});

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    todoList();
});

function todoList(task) {
    let newTask = inputEl.value;

    if (task) {
        newTask = task.name;
    }

    if (!newTask.trim()) {
        return;
    }

    const liEl = document.createElement("li");
    if (task && task.checked) {
        liEl.classList.add("checked");
    }
    liEl.innerText = `${newTask} - ${getCurrentDateTime()}`;
    ulEl.appendChild(liEl);

    inputEl.value = "";

    const checkBtnEl = document.createElement("div");
    checkBtnEl.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
    liEl.appendChild(checkBtnEl);

    const trashBtnEl = document.createElement("div");
    trashBtnEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    liEl.appendChild(trashBtnEl);

    checkBtnEl.addEventListener("click", () => {
        liEl.classList.toggle("checked");
        updateLocalStorage();
    });

    trashBtnEl.addEventListener("click", () => {
        liEl.remove();
        updateLocalStorage();
    });

    // Schedule notification for the task
    const taskTime = task ? new Date(task.time) : new Date();
    const currentTime = new Date();
    if (taskTime > currentTime) {
        scheduleNotification(newTask, taskTime);
    }

    updateLocalStorage();
}

function updateLocalStorage() {
    const liEls = document.querySelectorAll("li");
    list = [];
    liEls.forEach(liEl => {
        list.push({
            name: liEl.innerText.split(" - ")[0],
            checked: liEl.classList.contains("checked"),
            time: liEl.innerText.split(" - ")[1] // Store the time for each task
        });
    });

    localStorage.setItem("list", JSON.stringify(list));
}

function getCurrentDateTime() {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    return `${date} ${time}`;
}

function scheduleNotification(taskName, taskTime) {
    const notificationTime = taskTime.getTime() - Date.now();
    if (Notification.permission === "granted") {
        setTimeout(() => {
            new Notification(`Task Reminder`, {
                body: `It's time to finish "${taskName}"`,
            });
        }, notificationTime);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                setTimeout(() => {
                    new Notification(`Task Reminder`, {
                        body: `It's time to finish "${taskName}"`,
                    });
                }, notificationTime);
            }
        });
    }
}
