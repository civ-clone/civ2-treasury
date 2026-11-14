import { SOLD, soldOn } from '../Rules/CityImprovement/sell';
import { buildCost } from '@civ-clone/core-city-build/Rules/BuildCost';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import { Gold } from '../Yields';
import Palace from '@civ-clone/base-city-improvement-palace/Palace';
import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Wonder from '@civ-clone/core-wonder/Wonder';
import destroyed from '../Rules/City/destroyed';
import { expect } from 'chai';
import { instanceOf } from './lib';
import sell from '../Rules/CityImprovement/sell';

class Temple extends CityImprovement {}
class Library extends CityImprovement {}
class TestWonder extends Wonder {}

describe('city-improvement:sell', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      pendingEffects = new PendingEffectRegistry(),
      turn = new Turn(),
      player = new Player(ruleRegistry),
      city = instanceOf(City, { player: () => player }),
      treasury = new PlayerTreasury(
        player,
        Gold,
        new CityBuildRegistry(),
        ruleRegistry
      ),
      improvement = (Type: typeof CityImprovement): CityImprovement =>
        instanceOf(Type, { city: () => city, _destroyed: false });

    ruleRegistry.register(
      ...sell(ruleRegistry, turn, pendingEffects),
      ...destroyed(pendingEffects),
      ...(
        [
          [Temple, 30],
          [Library, 60],
          [Palace, 100],
          [TestWonder, 200],
        ] as [typeof CityImprovement, number][]
      ).flatMap(([Type, cost]) =>
        buildCost(Type as unknown as typeof Buildable, cost)
      )
    );

    return { city, improvement, pendingEffects, ruleRegistry, treasury, turn };
  };

  it('sells an improvement for its cost in shields, one a city a turn', (): void => {
    const { city, improvement, pendingEffects, treasury, turn } = setUp(),
      temple = improvement(Temple),
      library = improvement(Library);

    treasury.sell(temple);

    expect(treasury.value()).equal(30);
    expect(temple.destroyed()).true;
    expect(soldOn(city, pendingEffects)).equal(turn.value());

    treasury.sell(library);

    expect(treasury.value()).equal(30);
    expect(library.destroyed()).false;

    turn.increment();
    treasury.sell(library);

    expect(treasury.value()).equal(90);
    // One record a city, replaced on each sale.
    expect(
      pendingEffects
        .getByTarget(city)
        .filter((pendingEffect) => pendingEffect.handler() === SOLD)
    ).length(1);
  });

  it("can't sell the Palace or a Wonder", (): void => {
    const { improvement, treasury } = setUp(),
      palace = improvement(Palace),
      wonder = improvement(TestWonder);

    treasury.sell(palace);
    treasury.sell(wonder);

    expect(treasury.value()).equal(0);
    expect(palace.destroyed()).false;
    expect(wonder.destroyed()).false;
  });

  it('forgets the record when the city is destroyed', (): void => {
    const { city, improvement, pendingEffects, ruleRegistry, treasury } =
      setUp();

    treasury.sell(improvement(Temple));
    ruleRegistry.process(Destroyed, city, null);

    expect(soldOn(city, pendingEffects)).null;
  });
});
