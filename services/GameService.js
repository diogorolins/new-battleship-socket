class GameService {
  constructor(loggedPlayers) {
    this.loggedPlayers = loggedPlayers;
  }

  putPlayerInGame(socket) {
    socket.on("player.game", (playerId) => {});
  }
}
module.exports = GameService;
