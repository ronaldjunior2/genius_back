import { Player } from './player';

export class Game {
  colorSequence: string[] = [];

  playerAswerSequence: string[] = [];

  currentPlayers: Player[];

  playerTurnInfos: Player;

  private readonly geniusColors = ['green', 'yellow', 'blue', 'red'];

  constructor(private readonly starterPlayers: Player[]) {
    const intialPlayers = [...starterPlayers];
    this.currentPlayers = intialPlayers;
  }

  addColorSequence(): string[] {
    this.colorSequence.push(this.chooseRandomColor());
    return this.colorSequence;
  }

  chooseRandomColor(): string {
    const colorName = this.geniusColors[Math.floor(Math.random() * this.geniusColors.length)];
    return colorName;
  }

  chooseRandomPlayer(): Player {
    const player = this.currentPlayers[Math.floor(Math.random() * this.currentPlayers.length)];
    this.playerTurnInfos = player;
    return player;
  }

  nextTurn(hasMistake?: boolean): void {
    const indexLastPLayer = this.currentPlayers.findIndex((p) => p.id === this.playerTurnInfos.id);
    if (hasMistake === false || hasMistake === undefined || hasMistake === null) {
      this.addColorSequence();
      if (indexLastPLayer + 1 === this.currentPlayers.length) {
        this.playerTurnInfos = this.currentPlayers[0];
      } else {
        this.playerTurnInfos = this.currentPlayers[indexLastPLayer + 1];
      }
      this.playerAswerSequence = [];
    } else {
      if (indexLastPLayer + 1 === this.currentPlayers.length) {
        this.playerTurnInfos = this.currentPlayers[0];
      } else {
        this.playerTurnInfos = this.currentPlayers[indexLastPLayer + 1];
      }
      this.removePlayer(this.currentPlayers[indexLastPLayer].id);
      this.playerAswerSequence = [];
      this.colorSequence = [];
      this.addColorSequence();
    }
  }

  restartGame(players: Player[]): void {
    const intialPlayers = [...players];
    this.currentPlayers = intialPlayers;
    this.playerAswerSequence = [];
    this.colorSequence = [];
    this.chooseRandomPlayer();
    this.addColorSequence();
  }

  aswerIsRight(color: string): boolean {
    if (this.playerAswerSequence.length === 0) {
      if (this.colorSequence[0] === color) {
        this.playerAswerSequence.push(color);
        return true;
      } else {
        return false;
      }
    } else {
      console.log('CORZINHA', this.colorSequence[this.playerAswerSequence.length + 1]);
      console.log('ENVIADA', color);
      if (this.colorSequence[this.playerAswerSequence.length] === color) {
        this.playerAswerSequence.push(color);
        return true;
      } else {
        return false;
      }
    }
  }

  isTheLastPlayOfPlayer(): boolean {
    if (this.colorSequence.length === this.playerAswerSequence.length) {
      return true;
    }
    return false;
  }

  removePlayer(playerId): void {
    const playerIndex = this.currentPlayers.findIndex((p) => p.id === playerId);
    this.currentPlayers.splice(playerIndex, 1);
  }
}
