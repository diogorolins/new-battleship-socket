class GameService {
  constructor(games, strikes) {
    this.games = games;
    this.strikes = strikes;
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
  hitStrike(socket) {
    socket.on("game.strike", (strike) => {
      console.log(
        `[GAME SERVICE INFORM]: ${strike.playerId} atacou na posição ${strike.position}`
      );
      console.log(
        "--------------------------------------------------------------------"
      );
      this.strikes.push(strike);
      socket.broadcast.emit("game.strike", this.strikes);
    });
  }
}
module.exports = GameService;
