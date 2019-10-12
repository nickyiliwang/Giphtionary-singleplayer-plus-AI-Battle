// instanceLocator
// secreteKey
// TokenProviderToken

const createUser = document.querySelector(".create-user");
const userName = document.querySelector(".userName");
const handleCreateSubmit = document.querySelector(".handleCreateSubmit");
const chatroom = document.querySelector(".chatroom");
const newMessage = document.querySelector(".new-message");
const messageBody = document.querySelector(".messageBody");

// Global Variables
let userId = "nick";

// Create users
createUser.addEventListener("submit", e => {
  e.preventDefault();
  // let newUsername = userName.value;
});

const tokenProvider = new Chatkit.TokenProvider({
  url: TokenProviderToken
});

const chatManager = new Chatkit.ChatManager({
  instanceLocator: instanceLocator,
  userId,
  tokenProvider: tokenProvider
});

chatManager
  .connect({
    onUserJoinedRoom: room => {
      console.log(room);
      console.log(`Added to ${room.name}`);
    }
  })
  .then(currentUser => {
    console.log("Connected as user ", currentUser);

    newMessage.addEventListener("submit", e => {
      e.preventDefault();
      currentUser.sendSimpleMessage({
        text: messageBody.value,
        roomId: currentUser.rooms[0].id
      });
      messageBody.value = "";
    });

    currentUser.subscribeToRoomMultipart({
      roomId: currentUser.rooms[0].id,
      hooks: {
        onMessage: message => {
          const renderHtml = document.createElement("div");
          renderHtml.innerHTML = `
            <p  class="message"><span class='sender'>Sender: ${message.senderId}</span></br><span>CreatedAt: ${message.createdAt}</span></br>Message: ${message.parts[0].payload.content}<hr></p>
        `;
          chatroom.appendChild(renderHtml);
        }
      },
      messageLimit: 5
    });
  })
  .catch(error => {
    console.error("error:", error);
  });

  messageBody.addEventListener('keypress', (e)=>{
    setTimeout(() => {
      console.log('api call');
    }, 2000);
  })