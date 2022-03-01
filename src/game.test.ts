import { Game } from './game';
import { Player } from './player';

function makeSut(): { sut: Game } {
  //gerar player stub
  const PlayerStub = new Player('test', '123');
  const sut = new Game([PlayerStub]);
  return { sut };
}

describe('Game', () => {
  describe('addColorSequence', () => {
    it('Should add a new color in the colorSequence prop ', () => {
      const { sut } = makeSut();
      jest.spyOn(sut, 'chooseRandomColor').mockReturnValue('yellow');
      sut.addColorSequence();
      expect(sut.colorSequence).toContain('yellow');
    });

    it('Should add a new color after the last one ', () => {
      const { sut } = makeSut();
      sut.colorSequence = ['yellow'];
      jest.spyOn(sut, 'chooseRandomColor').mockReturnValue('blue');
      sut.addColorSequence();
      expect(sut.colorSequence).toContain('blue');
    });
  });

  describe('chooseRandomColor', () => {
    it('should return on one of the 4 colors randomly', () => {
      const { sut } = makeSut();
      const randomTimes = Math.random() * (9 - 1) + 1;
      for (let i = 0; i < randomTimes; i++) {
        const value = sut.chooseRandomColor();
        expect(value === 'green' || value === 'yellow' || value === 'blue' || value === 'red').toBeTruthy();
      }
    });
  });
});
