const socket = io.connect("http://localhost:3000");

const formEle = document.querySelector(".form");
const usernameInput = document.querySelector(".username");
const formParentContainer = document.querySelector(".parent-container");
const chatContainer = document.querySelector(".chat-container");
const msgTypingPlace = document.querySelector(".msg-typing-place");
const msgForm = document.querySelector(".msg-form");
const msgDisplayEle = document.querySelector(".message-display");

let user = {};

formEle.addEventListener("submit", (e) => {
  e.preventDefault();
  user.username = usernameInput.value;
  socket.emit("add-activeUser", user);
  formParentContainer.classList.add("displayNone");
  chatContainer.classList.remove("displayNone");
  socket.emit("join", user);
});

msgTypingPlace.addEventListener("keydown", (e) => {
  socket.emit("typing", user);
});

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = msgTypingPlace.value;
  socket.emit("new-msg", user, message);
  msgTypingPlace.value = "";
});

socket.on("user-typing", (userId) => {
  const status = document.getElementById(userId);
  status.innerHTML = "typing...";
});

socket.on("add-new-msg", (data) => {
  const userDiv = document.createElement("div");
  userDiv.classList.add("user-div");
  userDiv.innerHTML = `<img
              src="https://img.freepik.com/free-photo/close-up-beautiful-girl-portrait_23-2150799919.jpg?w=740"
              alt=""
            />

            <div class="user-details">
              <div class="username">
                <span class="name">${data.username}</span>
                <span class="active-time">Yesterday</span>
              </div>
              <span class="msg"
                >${data.message}
              </span>
            </div>`;

  msgDisplayEle.appendChild(userDiv);
});

socket.on("new-user", (name) => {
  console.log("Inside index.js");
  const usersList = document.querySelector(".users-section");

  const userStatus = document.querySelector(".user-status");
  userStatus.innerHTML = user.username;

  console.log(name.length);

  if (name.length) {
    name.forEach((n) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("user-div");
      userDiv.innerHTML = `<img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt=""
            />

            <div class="user-details">
              <div class="username">
                <span class="name">${n.username}</span>
                <span class="msg" id=${n._id}>Active</span>
              </div>
              <div class="active-time">10:15 am</div>
            </div>`;

      usersList.appendChild(userDiv);
    });
  } else {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user-div");
    userDiv.innerHTML = `<img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt=""
            />

            <div class="user-details">
              <div class="username">
                <span class="name">${name.name}</span>
                <span class="msg" id=${name.id}>How are you?</span>
              </div>
              <div class="active-time">10:15 am</div>
            </div>`;

    usersList.appendChild(userDiv);
  }
});
