const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const PORT = process.env.PORT;
var loggedPlayers = [];
var invites = [];
var messages = [];

io.on("connection", (socket) => {
  verifyIfUserisLoggedAndLogin(
    JSON.parse(socket.handshake.query.player),
    socket
  );
  checkAndEmitInvites(socket);
  checkChatMessages(socket);
  socket.on("disconnect", () => {
    removevePlayerLogged(JSON.parse(socket.handshake.query.player), socket);
  });
});

checkChatMessages = (socket) => {
  socket.on("message", (message) => {
    messages.push(message);
    socket.emit("message", messages);
    socket.broadcast.emit("message", messages);
    console.log(messages);
  });
};

checkAndEmitInvites = (socket) => {
  socket.on("invite.send", (invite) => {
    invites.push(invite);
    socket.emit("invite.send", invites);
    socket.broadcast.emit("invite.send", invites);
  });
};

removevePlayerLogged = (player, socket) => {
  loggedPlayers = loggedPlayers.filter((l) => l.email !== player.email);
  socket.emit("players.logged", loggedPlayers);
  socket.broadcast.emit("players.logged", loggedPlayers);
  socket.emit("invite.send", invites);
  socket.broadcast.emit("invite.send", invites);
  socket.emit("message", messages);
  socket.broadcast.emit("message", messages);
};

verifyIfUserisLoggedAndLogin = (player, socket) => {
  const platerAlreadyLogged = loggedPlayers.filter(
    (l) => l.email === player.email
  );
  if (platerAlreadyLogged) {
    loggedPlayers.push(player);
    socket.emit("players.logged", loggedPlayers);
    socket.broadcast.emit("players.logged", loggedPlayers);
    socket.emit("invite.send", invites);
    socket.broadcast.emit("invite.send", invites);
    socket.emit("message", messages);
    socket.broadcast.emit("message", messages);
  }
};

http.listen(PORT, () => {
  console.log(`Listen on port ${PORT} `);
});
