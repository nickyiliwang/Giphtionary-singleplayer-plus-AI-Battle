// all secrets are in the config file
// Global Variables
const createUser = document.querySelector(".create-user");
const userName = document.querySelector(".userName");
const handleCreateSubmit = document.querySelector(".handleCreateSubmit");
const chatroom = document.querySelector(".chatRoom");
const messageDisplay = document.querySelector(".messageDisplay");
const messageBody = document.querySelector(".messageBody");
const renderTempGifs = document.querySelector(".renderTempGifs");
const allGifs = document.querySelector(".all-gifs");
const gifsToSend = document.querySelector(".gifsToSend");
const hiddenGifContainer = document.querySelector(".hiddenGifContainer");
// Counter
const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");
const p1Inc = document.querySelector(".p1-inc");
const p1Dec = document.querySelector(".p1-dec");
const p2Inc = document.querySelector(".p2-inc");
const p2Dec = document.querySelector(".p2-dec");

// helper functions
const randomize = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let userId = `user${randomize(10)}`;

// ChatKit
const tokenProvider = new Chatkit.TokenProvider({
  url: TokenProviderToken
});

const chatManager = new Chatkit.ChatManager({
  instanceLocator: instanceLocator,
  userId,
  tokenProvider: tokenProvider
});

function giphtionaryInit() {
  chatManager
    .connect()
    .then(currentUser => {
      messageDisplay.addEventListener("submit", e => {
        e.preventDefault();
        currentUser.sendSimpleMessage({
          // need to send the hidden textbox. it contains html
          text: hiddenGifContainer.textContent,
          roomId: currentUser.rooms[0].id
        });
        messageBody.value = "";
        // remove after sending
        while (gifsToSend.firstChild)
          gifsToSend.removeChild(gifsToSend.firstChild);
      });

      currentUser.subscribeToRoomMultipart({
        roomId: currentUser.rooms[0].id,
        hooks: {
          onMessage: message => {
            const httpsCheck = () => {
              // onHold: this shows the senderId <span class='sender'>Sender: ${message.senderId}</span></br>
              if (message.parts[0].payload.content.startsWith("https")) {
                renderHtml.innerHTML = `
          <p  class="message"><span>CreatedAt: ${message.createdAt}</span></br>Message: <img class="all-gifs" src="${message.parts[0].payload.content}" alt="gifs"><hr></p>
      `;
              } else {
                renderHtml.innerHTML = `
          <p  class="message"></br><span>CreatedAt: ${message.createdAt}</span></br>Message: ${message.parts[0].payload.content}<hr></p>
      `;
              }
            };
            const renderHtml = document.createElement("div");
            renderHtml.setAttribute("class", "renderHtml");
            httpsCheck();
            chatroom.appendChild(renderHtml);
          }
        },
        messageLimit: 0
      });
    })
    .catch(error => {
      console.error("error:", error);
    });

  messageBody.addEventListener("keypress", e => {
    let searchTerm = e.target.value;

    fetch(
      `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${GiphyApiKey}&limit=12`
    )
      .then(res => res.json())
      .then(data => {
        // remove after new api calls
        while (renderTempGifs.firstChild)
          renderTempGifs.removeChild(renderTempGifs.firstChild);

        let gifsToRender = data.data;

        gifsToRender.forEach(gif => {
          const gifHtml = document.createElement("div");
          gifHtml.setAttribute("class", "gifHtml");

          gifHtml.innerHTML = `<div class="gif-box">
          <div class="img-box">
          <img class="all-gifs" src="${gif.images.downsized.url}" alt="gifs">
          </div>
          <p class="gif-title">${gif.title}</p>
      </div>
      `;
          renderTempGifs.appendChild(gifHtml);
        });
      });

    // if the textbox still has images stored, typing will overwrite the textContent
    hiddenGifContainer.textContent = searchTerm;
  });

  // Event Delegation for selecting images
  renderTempGifs.addEventListener("click", e => {
    if (e.target && e.target.nodeName == "IMG") {
      let clickedGif = e.target.src;
      // use the hidden input to store the html for sending
      hiddenGifContainer.textContent = e.target.src;

      const gifToSendHTML = document.createElement("div");
      gifToSendHTML.setAttribute("class", "gifToSend");

      gifToSendHTML.innerHTML = `<div class="gif-box">
        <img src="${clickedGif}" alt="pending-Gifs">
    </div>
    `;

      while (gifsToSend.firstChild)
        gifsToSend.removeChild(gifsToSend.firstChild);
      gifsToSend.appendChild(gifToSendHTML);
    }
  });

  // clicker logic
  p1Inc.addEventListener("click", () => {
    player1.textContent++;
  });

  p1Dec.addEventListener("click", () => {
    player1.textContent--;
  });

  p2Inc.addEventListener("click", () => {
    player2.textContent++;
  });

  p2Dec.addEventListener("click", () => {
    player2.textContent--;
  });
}

// Document Ready
if (document.readyState === "complete") {
  giphtionaryInit();
} else {
  document.addEventListener("DOMContentLoaded", giphtionaryInit);
}
