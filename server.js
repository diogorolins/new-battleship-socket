const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const LoggedService = require("./services/LoggedService");
const InviteService = require("./services/InviteService");
const GameService = require("./services/GameService");
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const PORT = process.env.PORT;
var loggedPlayers = [];
var invites = [];

loggedService = new LoggedService(loggedPlayers, invites);
inviteService = new InviteService(loggedPlayers, invites);
gameService = new GameService(loggedPlayers);

io.on("connect", (socket) => {
  loggedService.verifyIfUserIsLoggedAndLoginUser(socket);
  inviteService.checkDeniedInvites(socket);
  inviteService.checkAcceptInvites(socket);
  inviteService.checkAndEmitInvites(socket);
  inviteService.checkClearInvites(socket);
  inviteService.checkIfGameCanStart(socket);
  gameService.putPlayerInGame(socket);
  loggedService.removePlayerLogged(socket);
});

http.listen(PORT, () => {
  console.log(`Listen on port ${PORT} `);
});
