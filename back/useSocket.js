const socketIo = require("socket.io");

const onlineUsers = {};
module.exports = (server, app) => {
  const io = socketIo(server, {
    cors: {
      origin: ["*"],
    },
  });

  app.set("io", io);
  app.set("onlineUsers", onlineUsers);

  //on은 받기 / emit은 보내기
  io.on("connection", (socket) => {
    socket.on("login", (data) => {
      onlineUsers[socket.id] = data.id;
      console.log("현재 접속 유저:", onlineUsers);
    });

    socket.on("disconnect", async () => {
      console.log(`${socket.id}유저 연결 해제`);
      delete onlineUsers[socket.id];
      console.log(onlineUsers);
    });
  });
};

//socket
