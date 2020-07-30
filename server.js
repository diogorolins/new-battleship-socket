const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var loggedPlayers = [];
var invites = [];

io.on("connection", (socket) => {
  verifyIfUserisLoggedAndLogin(
    JSON.parse(socket.handshake.query.player),
    socket
  );
  checkAndEmitInvites(socket);
  console.log(loggedPlayers);
  socket.on("disconnect", () => {
    removevePlayerLogged(JSON.parse(socket.handshake.query.player), socket);
    console.log(loggedPlayers);
  });
});

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
};

verifyIfUserisLoggedAndLogin = (player, socket) => {
  const platerAlreadyLogged = loggedPlayers.filter(
    (l) => l.email === player.email
  );
  if (platerAlreadyLogged) {
    loggedPlayers.push(player);
    socket.emit("players.logged", loggedPlayers);
    socket.broadcast.emit("players.logged", loggedPlayers);
  }
};

http.listen(3002, () => {
  console.log("Listen on port 3002 ");
});
