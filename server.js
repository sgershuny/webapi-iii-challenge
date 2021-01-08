const express = require('express');
const users = require('./users/userRouter')
const server = express();

server.use(express.json());

function logger(req, res, next) {
  console.log("Request Method: ", req.method);
  console.log("Request URL", req.url);
  console.log("Time: ", Date.now())
  next();
};
server.use(logger)

server.use('/users',users)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

module.exports = server;
