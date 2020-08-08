const socketio = require("socket.io");
const User = require("..//model/User");

let io;

exports.init = (server) => {
  io = socketio(server);
  console.log("Socket initialized");
  io.on("connection", async (socket) => {
    console.log("New connection!!");
    let user;
    socket.on("online", async (id) => {
      user = await User.findById(id);
      if (user) {
        user.socketId = socket.id;
        user.online = true;
        await user.save();
      }
    });
    socket.on("disconnect", async () => {
      if (user) {
        user.online = false;
        user.socketId = null;
        await user.save();
      }
      console.log("user disconnected");
    });
  });
};

exports.getIO = () => {
  if (!io) throw new Error("Socket io has not been initialized yet");
  return io;
};
