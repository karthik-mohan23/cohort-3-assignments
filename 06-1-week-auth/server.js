const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const users = [];
const JWT_SECRET = "abc123";

// authMiddleware
function authMiddleware(req, res, next) {
  const { token } = req.headers;
  const { username } = jwt.verify(token, JWT_SECRET);

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    req.userId = new Date();
    next();
  } else {
    return res.send("unauthorized");
  }
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.json("user already exists");
  }
  users.push({ username, password });
  res.send("successfully registered");
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    const token = jwt.sign({ username }, JWT_SECRET);
    return res.send(token);
  } else {
    return res.send("user needs to sign up first");
  }
});

app.get("/verify", authMiddleware, (req, res) => {
  const { userId } = req;
  if (userId) {
    return res.send(userId);
  } else {
    return res.send("unauthorized");
  }
});

app.listen(3000, () => {
  console.log("Port listening on port 3000");
});
