let section = document.querySelector("section");
// 找到add into list的按鈕
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    // prevent form from being submitted 避免還未輸入時間就被交出表單
    e.preventDefault();

    // get the input values 獲得輸入的值
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
    // 如果沒有輸入值，跳出提醒
    if (todoText === "") {
        alert("Please Enter some Text.");
        return;
    }

    // create a todo 創造出待辦事項
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("P");
    text.classList.add("todo-text");
    text.innerHTML = todoText;
    let time = document.createElement("P");
    time.classList.add("todo-time"); 
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trash can 創造確認與刪除的按鈕
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement; // 讓完成鈕按下去會出現done class
        todoItem.classList.toggle("done"); // 這邊設置.toggle為確認狀態與取消確認
    })
    // 刪除鈕
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        // 設定事件為，代辦事項取消動畫後執行刪除
        todoItem.addEventListener("animationend", () => {

            // remove from local storage 刪除本地存取資料
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if(item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.5s forwards";
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    todo.style.animation = "scaleUp 0.5s forwards";

    // create an object 將三個值轉換成物件才可被套用
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    // store data into an array of objects 將物件以array屬性儲存
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo])); // 透過JSON.stringify將array變string存取
    } else {
        let myListArray = JSON.parse(myList); // 透過JSON.parse會回傳出array資料類型
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));
    
    // clear tho text input
    form.children[0].value = "";
    // form.children[1].value = "";
    // form.children[2].value = "";
    section.appendChild(todo);
    
})

loadData();

function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach(item => {

        // create a todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoMonth + "/" + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);

        // create green check and red trash can
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

        completeButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        })
    
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        trashButton.addEventListener("click", e => {
            let todoItem = e.target.parentElement;
    
            todoItem.addEventListener("animationend", () => {

            // remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if(item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            
            todoItem.remove();
            })
        todoItem.style.animation = "scaleDown 0.5s forwards";
        })

        todo.appendChild(completeButton);
        todo.appendChild(trashButton);

        section.appendChild(todo);
        })
    }
}


function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

// console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    // load data
    loadData();
})