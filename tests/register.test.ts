import { Game } from '@civ-clone/core-game';
import { expect } from 'chai';
import register from '../registerRules';

describe('register', (): void => {
  it("registers only civ2-treasury's rules, each with its own id", (): void => {
    const game = new Game();

    register(game);

    const ids = game.rules.entries().map((rule) => rule.id());

    expect(ids).length(10);
    ids.forEach((id) => expect(id).match(/^civ2-treasury:/));
    expect(new Set(ids).size).equal(ids.length);
  });

  it('loads no civ1-* or library-* module', (): void => {
    expect(
      Object.keys(require.cache).filter((path) =>
        /@civ-clone[\\/+](civ1|library)-/.test(path)
      )
    ).eql([]);
  });
});
