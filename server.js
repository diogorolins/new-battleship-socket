const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const LoggedService = require("./services/LoggedService");
const InviteService = require("./services/InviteService");
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const PORT = process.env.PORT;
var loggedPlayers = [];
var invites = [];

loggedService = new LoggedService(loggedPlayers, invites);
inviteService = new InviteService(loggedPlayers, invites);

io.on("connection", (socket) => {
  loggedService.verifyIfUserIsLoggedAndLoginUser(
    JSON.parse(socket.handshake.query.player),
    socket
  );
  inviteService.checkDeniedInvites(socket);
  inviteService.checkAcceptInvites(socket);
  inviteService.checkIfGameCanStart(socket);
  inviteService.checkAndEmitInvites(socket);
  inviteService.checkClearInvites(socket);

  socket.on("disconnect", () => {
    loggedService.removePlayerLogged(
      JSON.parse(socket.handshake.query.player),
      socket
    );
  });
});

http.listen(PORT, () => {
  console.log(`Listen on port ${PORT} `);
});
