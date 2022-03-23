// const baseURL = "https://livetalkchat.herokuapp.com";
const baseURL = "http://localhost:3000/";

const socket = io(baseURL);




// get access to the socket id from the backend
let socketId = '';

socket.on('socket-id', id => {
  socketId = id;
});



const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let roomId = null;

if(params.socketId) {
  // if there is a query parameter, join a room that has that query parameter as its id
  socket.emit("join-room", params.socketId);

  roomId = params.socketId;
}

socket.on("gotMessage", (msg, userName, userPhoto) => {
  displayMessage(msg, false, userName, userPhoto);
})






// handling buttons 

const handleChangeName = () => {
  document.cookie = "userName=; expires=Thu, 18 Dec 1099 12:00:00 UTC; path=/";
  window.location.reload();
}

const handleCopyRoomId = () => {
  // copy to clipboard link to 'LiveTalk' website that has 
  // socketId (which will be used as a socket.io room) as a query parameter

  navigator.clipboard.writeText(`${baseURL}/?socketId=${socketId}`);

  // chat bug fix
  window.location.href = `${baseURL}/?socketId=${socketId}`;
}

const handleCreateRoom = () => {
  window.location.href = `${baseURL}/chat`;
}

const handlePhotoClick = () => {
  if(params.socketId) {
    window.location.href = `${baseURL}/processing-photo?socketId=${params.socketId}`;
  }
  else {
    window.location.href = `${baseURL}/processing-photo`;
  }
}





// handling messaging

const displayMessage = (msg, isSender, userName, userPhoto) => {
  /*
    the message sent by the author of the message will loke like this to the author:
      <div class="message message--sender">
        <p class="message__text">[Content]</p>
        <div class="message__img--sender message__img""></div>
      </div>

    and will look like this to others:
      <div class="message">
        <div class="message__img--non-sender message__img"></div>
        <div>
          <p class="message__name">[Name]</p>
          <span class="message__name">[Date]</span>
          <p class="message__text">[Content]</p>
        </div>
      </div>
  */

  const message_space = document.querySelector(".chat__message-space")
  const divMessage = document.createElement('div');
  const pMessageContent = document.createElement('p')
  const imgOfSender = document.createElement('div');

  pMessageContent.innerHTML = msg;

  imgOfSender.style.backgroundImage = userPhoto ? `url(${decodeURIComponent(userPhoto)})` : `url("/Anonymous.png")`;
  
  divMessage.classList.add("message");

  if(isSender) {
    divMessage.classList.add("message--sender");
    imgOfSender.classList.add("message__img--sender");
    pMessageContent.classList.add("message__text--sender");
    divMessage.appendChild(pMessageContent)
    divMessage.appendChild(imgOfSender);
  }
  else {
    const divMessageData = document.createElement('div'); // content, name and date
    const pMessageName = document.createElement('p');
    const spanDate = document.createElement('span');

    imgOfSender.classList.add("message__img--non-sender");
    pMessageName.classList.add("message__name");
    spanDate.classList.add("message__name");
    pMessageContent.classList.add("message__text--non-sender");

    pMessageName.innerHTML = decodeURI(userName);
    spanDate.innerHTML = `${new Date().getHours()}:${new Date().getMinutes()}`;
    divMessage.appendChild(imgOfSender);
    divMessageData.appendChild(pMessageName);
    divMessageData.appendChild(spanDate);
    divMessageData.appendChild(pMessageContent)
    divMessage.appendChild(divMessageData);
  }

  pMessageContent.classList.add("message__text");
  imgOfSender.classList.add("message__img");

  message_space.appendChild(divMessage);

  // automatic scroll down
  const chat = document.querySelector(".chat__message-space")
  chat.scrollTop = chat.scrollHeight;
}

const form = document.querySelector(".chat__form");

form.addEventListener("submit", e => {
  e.preventDefault();

  // get the photo of the user if it has one
  const matchPhoto = document.cookie.match(new RegExp('(^| )' + "userPhoto" + '=([^;]+)'));
  let userPhoto = null;
  
  if(matchPhoto){
    userPhoto = matchPhoto[2];
  }
  
  displayMessage(e.target.message.value, true, null, userPhoto);



  // if there is a roomId, emit messages to that room
  if(roomId){
    socket.emit("message", e.target.message.value, roomId);
  } 
  else {
    socket.emit("message", e.target.message.value, socketId);
  }

  // clear the input after a message is sent
  e.target.reset();
})
