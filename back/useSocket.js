const socketIo = require("socket.io");

const onlineUsers = {};
module.exports = (server, app) => {
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  app.set("io", io);
  app.set("onlineMap", onlineUsers);

  io.on("connection", (socket) => {
    socket.on("login", async (id) => {
      onlineUsers[socket.id] = id;
    });

    console.log(socket.id);
    socket.on("disconnect", async () => {
      delete onlineUsers[socket.id];
    });
  });
};

//socket
