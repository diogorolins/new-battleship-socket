const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const PORT = process.env.PORT;
var loggedPlayers = [];
var invites = [];

io.on("connection", (socket) => {
  verifyIfUserIsLoggedAndLoginUser(
    JSON.parse(socket.handshake.query.player),
    socket
  );
  checkDeniedInvites(socket);
  checkAndEmitInvites(socket);

  socket.on("disconnect", () => {
    removePlayerLogged(JSON.parse(socket.handshake.query.player), socket);
  });
});

checkDeniedInvites = (socket) => {
  socket.on("invite.deny", (invite) => {
    const index = invites.findIndex((i) => i.id === invite.id);
    invites[index].status = "denied";
    socket.emit("invite.send", invites);
    socket.broadcast.emit("invite.send", invites);
  });
};

checkAndEmitInvites = (socket) => {
  socket.on("invite.send", (invite) => {
    invites.push(invite);
    socket.emit("invite.send", invites);
    socket.broadcast.emit("invite.send", invites);
  });
};

removePlayerLogged = (player, socket) => {
  loggedPlayers = loggedPlayers.filter((l) => l.id !== player.id);

  socket.emit("players.logged", loggedPlayers);
  socket.broadcast.emit("players.logged", loggedPlayers);
  socket.emit("invite.send", invites);
  socket.broadcast.emit("invite.send", invites);
};

verifyIfUserIsLoggedAndLoginUser = (player, socket) => {
  const playerAlreadyLogged = loggedPlayers.filter(
    (l) => l.email === player.email
  );
  if (playerAlreadyLogged) {
    loggedPlayers.push(player);
    socket.emit("players.logged", loggedPlayers);
    socket.broadcast.emit("players.logged", loggedPlayers);
    socket.emit("invite.send", invites);
    socket.broadcast.emit("invite.send", invites);
  }
};

http.listen(PORT, () => {
  console.log(`Listen on port ${PORT} `);
});
