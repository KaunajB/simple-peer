"use strict";

//Declarations
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


// const cache = require("./operator/storage/cache")
const socket = require("./socket.js");
// const broker = require("./operator/network/broker")
// const api = require("./operator/network/api")
// const aggData = require("./operator/core/aggData.js");
const config = require("./config.js");
// const schedular = require("./operator/scripts/schedular.js").fileRemover;


const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  path: config.socketPath,
  pingInterval: 30000,
  pingTimeout: 120000
});


// All the initial setup around session management and apis
(function () {
  const jsonParser = bodyParser.json({
    limit: 1024 * 1024 * 100,
    type: "application/json"
  });
  const urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 100,
    type: "application/x-www-form-urlencoding"
  });
  app.use(jsonParser);
  app.use(urlencodedParser);
  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
  });
  app.use(express.static(path.join(__dirname, 'src')));
})();


// Initialize server
(function () {
  console.log("Server starting to listen to port " + config.httpPort);
  http.listen(config.httpPort, () => {
    console.log("Server listening on port " + config.httpPort);
  });
})();


// Initialize all modules
(async function () {
  try {
    console.log("Initializing all socket connections...");
    socket.init(io);
    console.log("All setup done successfully..");
  } catch (e) {
    console.error(e);
  }
})();
