var socketObjectMap = {};
let config = require("./config.js");

let uidObj;


module.exports = {
  init: async (io) => {
    console.log("Connecting all sockets...");
    uidObj = { '1': '', '2': '' };
    io.sockets.on("connection", socket => {
      try {
        socketObjectMap[socket.id] = socket;
        console.log("User Connected");
        socket.on("error", function (err) {
          console.error(err);
        });
        console.log(
          Object.keys(socketObjectMap).length + " Total Users connected"
        );
        socket.on("disconnect", function () {
          socketObjectMap[socket.id] = undefined
          delete socketObjectMap[socket.id]
          console.log("Socket user Disonnected");
          console.log(
            Object.keys(socketObjectMap).length + " Total Users connected"
          );
        });
        socketProtocols(socket);
      } catch (e) {
        console.error(e);
      }
    });
  },

  getSocketObjectMap: () => socketObjectMap
}


function socketProtocols(socket) {

  let onInit = async (options) => {
    try {
      // mapSocket(projectId, socket);
      console.log('uid received');
      if (uidObj['1'] === '') {
        uidObj['1'] = options.uid;
      } else if (uidObj['2'] === '') {
        uidObj['2'] = options.uid;
      }
      console.log('uidObj', uidObj);
    }
    catch (e) {
      console.log(e);
      socket.emit('error' + options.reqId, 'Something went wrong');
    }
  }

  let onCall = async (options) => {
    try {
      // mapSocket(projectId, socket);
      console.log('signal received');
      if (options.uid == uidObj['1']) {
        socket.emit('call' + uidObj['2'], { uid: options.uid });
      } else if (options.uid == uidObj['2']) {
        socket.emit('call' + uidObj['1'], { uid: options.uid });
      }
    }
    catch (e) {
      console.log(e);
      socket.emit('error' + options.reqId, 'Something went wrong');
    }
  }

  let onReceived = async (options) => {
    try {
      // mapSocket(projectId, socket);
      console.log('signal received');
    }
    catch (e) {
      console.log(e);
      socket.emit('error' + options.reqId, 'Something went wrong');
    }
  }

  socket.on('init', onInit);
  socket.on('call', onCall);
  socket.on('signal', onReceived);
}
