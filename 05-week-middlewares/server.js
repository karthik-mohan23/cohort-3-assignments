const express = require("express");
const app = express();
const port = 3000;

// 1.# Create an HTTP Server
// It should have 4 routes
// 1. http://localhost:3000/multiply?a=1&b=2
// 2. http://localhost:3000/add?a=1&b=2
// 3. http://localhost:3000/divide?a=1&b=2
// 4. http://localhost:3000/subtract?a=1&b=2

app.get("/add", (req, res) => {
  const { a, b } = req.query;

  res.send({
    ans: +a + +b,
  });
});
app.get("/subtract", (req, res) => {
  const { a, b } = req.query;

  res.send({
    ans: a - b,
  });
});
app.get("/divide", (req, res) => {
  const { a, b } = req.query;

  res.send({
    ans: a / b,
  });
});
app.get("/multiply", (req, res) => {
  const { a, b } = req.query;

  res.send({
    ans: a * b,
  });
});

// 2.Create a middleware function that logs each incoming request’s HTTP method,
//  URL, and timestamp to the console
// app.get("/", (req, res) => {
//   res.send({
//     method: req.method,
//     url: req.originalUrl,
//     time: Date.now() / 1000,
//   });
// });

// 3.Create a middleware that counts total number of requests sent to a server.
//  Also create an endpoint that exposes it
let count = 0;

function countRequests(req, res, next) {
  count++;
  next();
}

app.get("/", countRequests, (req, res) => {
  res.send({
    numRequests: count,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
