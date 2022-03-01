import { Game } from './game';
import { Player } from './player';

export class Room {
  running: boolean = false;

  players: Player[] = [];

  game: Game;

  constructor(public name: string, public id: string, public ownerId: string, playerName: string) {
    this.players.push(new Player(playerName, ownerId));
  }

  startGame(): void {
    this.game = new Game(this.players);
    this.game.addColorSequence();
    this.game.chooseRandomPlayer();
  }
}
