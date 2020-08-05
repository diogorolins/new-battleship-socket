class LoggedService {
  constructor(loggedPlayers, invites) {
    this.loggedPlayers = loggedPlayers;
    this.invites = invites;
  }

  removePlayerLogged(socket) {
    socket.on("player.disconnected", (player) => {
      this.loggedPlayers = this.loggedPlayers.filter((l) => l.id !== player.id);
      console.log(`[LOGIN SERVICE INFORM]: ${player.name} se desconectou`);
      console.log(
        "--------------------------------------------------------------------"
      );
      socket.emit("players.logged", this.loggedPlayers);
      socket.broadcast.emit("players.logged", this.loggedPlayers);
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
    });
  }

  verifyIfUserIsLoggedAndLoginUser(socket) {
    socket.on("player.connected", (player) => {
      const playerAlreadyLogged = this.loggedPlayers.filter(
        (l) => l.email === player.email
      );

      if (!playerAlreadyLogged.length) {
        console.log(
          `[LOGIN SERVICE INFORM]: ${player.name} se conectou ou reconectou`
        );
        console.log(
          "--------------------------------------------------------------------"
        );
        this.loggedPlayers.push(player);
      }
      socket.emit("players.logged", this.loggedPlayers);
      socket.broadcast.emit("players.logged", this.loggedPlayers);
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
    });
  }
}

module.exports = LoggedService;
