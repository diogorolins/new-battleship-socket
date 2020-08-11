class GameService {
  constructor(games) {
    this.games = games;
  }

  startGame(socket) {
    socket.on("create.game", (game) => {
      this.games.push(game);

      const gameAlreadStarted = this.games.filter((g) => g.id === game.id);
      if (gameAlreadStarted.length === 2) {
        socket.emit("game.canStart", this.games);
        socket.broadcast.emit("game.canStart", this.games);
      }
    });
  }
}
module.exports = GameService;
