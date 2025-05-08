
var firebaseConfig = {
  apiKey: "AIzaSyD7WwLUX-OIzUcZZRww559pDt5A-Vil7FE",
  authDomain: "todo-71403.firebaseapp.com",
  databaseURL: "https://todo-71403-default-rtdb.firebaseio.com",
  projectId: "todo-71403",
  storageBucket: "todo-71403.appspot.com",
  messagingSenderId: "20579440437",
  appId: "1:20579440437:web:6c48e184dbd5cae2171e7c",
  measurementId: "G-Y23Z2L6KTT"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.database().ref("todos");

firebase.database().ref("todos").on("child_added", function(snapshot) {
  var key = snapshot.key;
  var text = snapshot.val().text;
  console.log("Added → [" + key + "]: " + text);
  renderTodo(key, text);
});

firebase.database().ref("todos").on("child_changed", function(snapshot) {
  var key = snapshot.key;
  var text = snapshot.val().text;
  console.log("Updated → [" + key + "]: " + text);
  var li = document.getElementById(key);
  if (li) li.firstChild.textContent = text;
});

firebase.database().ref("todos").on("child_removed", function(snapshot) {
  var key = snapshot.key;
  console.log("Removed → [" + key + "]");
  var li = document.getElementById(key);
  if (li) li.remove();
});

function renderTodo(key, text) {
  var ul = document.getElementById("items_data");
  var li = document.createElement("li");
  li.id = key;
  li.textContent = text + " ";

  var delBtn = document.createElement("button");
  delBtn.textContent = "DELETE";
  delBtn.onclick = function() { deleteSingleTodo(key); };
  delBtn.className = "deletebtn";
  li.appendChild(delBtn);

  var editBtn = document.createElement("button");
  editBtn.textContent = "EDIT";
  editBtn.onclick = function() { EditSingleTodo(key); };
  editBtn.className = "Editbtn";
  li.appendChild(editBtn);

  ul.appendChild(li);
}

function addTodo() {
  var todoInput = document.getElementById("todoInput");
  var text = todoInput.value.trim();
  if (!text) {
    alert("Required input field");
    return;
  }
  firebase.database().ref("todos").push({ text: text })
    .then(function() {
      console.log("✅ Pushed to Firebase: " + text);
    })
    .catch(function(error) {
      console.error("❌ Push Error:", error);
    });
  todoInput.value = "";
}

function deleteSingleTodo(key) {
  firebase.database().ref("todos").child(key).remove()
    .then(function() {
      console.log("✅ Removed from Firebase: [" + key + "]");
    })
    .catch(function(error) {
      console.error("❌ Remove Error:", error);
    });
}

function EditSingleTodo(key) {
  var newText = prompt("Enter updated value");
  if (newText && newText.trim()) {
    firebase.database().ref("todos").child(key).update({ text: newText.trim() })
      .then(function() {
        console.log("✅ Updated Firebase: [" + key + "] → " + newText);
      })
      .catch(function(error) {
        console.error("❌ Update Error:", error);
      });
  }
}


function deleteAllTodos() {
  if (confirm("Are you sure you want to delete ALL todos?")) {
    firebase.database().ref("todos").remove()
      .then(function() {
        console.log("✅ All todos removed from Firebase");
      })
      .catch(function(error) {
        console.error("❌ Remove All Error:", error);
      });
  }
}

