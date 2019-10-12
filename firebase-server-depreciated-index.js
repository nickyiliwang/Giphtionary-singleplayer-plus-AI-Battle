const functions = require("firebase-functions");
const cors = require("cors");
const app = require("express")();
const Chatkit = require("@pusher/chatkit-server");
const admin = require("firebase-admin");
admin.initializeApp();

const { instanceLocator, secreteKey } = require("./util/config");
const chatkit = new Chatkit.default({
  instanceLocator: instanceLocator,
  key: secreteKey
});

app.use(cors());

app.get("/test", (req, res) => {
  chatkit
    .createUser({
      id: "meow",
      name: "meow"
    })
});

// this route creates new users
app.post("/", (req, res) => {
  // if (req.body.username.trim() === "") {
  //   return res.status(400).json({ body: "Username empty!" });
  // }

  const newUser = {
    username: req.body.username
  };

  chatkit
    .createUser({
      id: newUser.username,
      name: newUser.username
    })
    .then(() => {
      res.send("User created successfully");
    })
    .catch(err => {
      console.log(err);
    });
});

exports.api = functions.https.onRequest(app);
