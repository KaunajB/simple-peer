var socketObjectMap = {};
let config = require("./config.js");


module.exports = {
  init: async (io) => {
    console.log("Connecting all sockets...");
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

  socket.on("signal", onReceived);
}
