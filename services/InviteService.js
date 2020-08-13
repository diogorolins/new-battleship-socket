class InviteService {
  constructor(loggedPlayers, invites) {
    this.loggedPlayers = loggedPlayers;
    this.invites = invites;
  }

  checkClearInvites(socket) {
    socket.on("invite.clear", (playerId) => {
      this.invites = this.invites.filter((p) => p.from.id !== playerId);
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
    });
  }

  checkDeniedInvites(socket) {
    socket.on("invite.deny", (invite) => {
      console.log(
        `[INVITE SERVICE INFORM]: ${invite.to.name} negou o convite de ${invite.from.name}`
      );
      console.log(
        "--------------------------------------------------------------------"
      );
      const index = this.invites.findIndex((i) => i.id === invite.id);
      this.invites[index].status = "Negado";
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
    });
  }

  checkAcceptInvites(socket) {
    socket.on("invite.accept", (invite) => {
      console.log(
        `[INVITE SERVICE INFORM]: ${invite.to.name} aceitou o convite de ${invite.from.name}`
      );
      console.log(
        "--------------------------------------------------------------------"
      );
      const index = this.invites.findIndex((i) => i.id === invite.id);
      this.invites[index].status = "Aceito";
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
      socket.emit("invite.accept", this.invites[index]);
      socket.broadcast.emit("invite.accept", this.invites[index]);
    });
  }

  checkAndEmitInvites(socket) {
    socket.on("invite.send", (invite) => {
      console.log(
        `[INVITE SERVICE INFORM - TEST]: ${invite.from.name} convidou ${invite.to.name}`
      );
      console.log(
        "--------------------------------------------------------------------"
      );
      this.invites.push(invite);
      socket.emit("invite.send", this.invites);
      socket.broadcast.emit("invite.send", this.invites);
    });
  }

  checkIfGameCanStart(socket) {
    socket.on("invite.gameCanStart", (invite) => {
      console.log(
        `[INVITE SERVICE INFORM]: O jogo entre ${invite.from.name} e ${invite.to.name} vai começar a ser configurado`
      );
      console.log(
        "--------------------------------------------------------------------"
      );

      socket.broadcast.emit("invite.gameCanStart", invite.to.id);
      socket.emit("players.logged", this.loggedPlayers);
      socket.broadcast.emit("players.logged", this.loggedPlayers);
    });
  }
}

module.exports = InviteService;
