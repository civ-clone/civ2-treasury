import { Game, defaultGame } from '@civ-clone/core-game';
import cityDestroyed from './Rules/City/destroyed';
import cityImprovementSell from './Rules/CityImprovement/sell';
import citySpend from './Rules/City/spend';
import playerAction from './Rules/Player/action';
import playerAdded from './Rules/Player/added';
import processYields from './Rules/City/process-yield';
import treasuryUpdated from './Rules/Player/treasury-updated';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityDestroyed(game.pendingEffects),
    ...citySpend(game.pendingEffects),
    ...cityImprovementSell(game.rules, game.turn, game.pendingEffects),
    ...playerAction(game.cities, game.cityBuilds),
    ...playerAdded(game.playerTreasuries, game.cityBuilds, game.rules),
    ...processYields(
      game.playerTreasuries,
      game.rules,
      game.cityImprovements,
      game.engine
    ),
    ...treasuryUpdated(game.engine)
  );

// The plugin loader imports each package for this side effect. Until it passes a `Game` of its own, dropping it would
//  produce a game with silently absent rules: no error, just wrong behaviour.
register(defaultGame);

export default register;
