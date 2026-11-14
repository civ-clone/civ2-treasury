import { CityImprovementMaintenanceGold, Gold } from '../Yields';
import { buildCost } from '@civ-clone/core-city-build/Rules/BuildCost';
import Buildable from '@civ-clone/core-city-build/Buildable';
import BaseGold from '@civ-clone/base-city-yield-gold/Gold';
import City from '@civ-clone/core-city/City';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasuryRegistry from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import added from '../Rules/Player/added';
import { expect } from 'chai';
import { instanceOf } from './lib';
import processYield from '../Rules/City/process-yield';

class Temple extends CityImprovement {}

describe('player:added and city:process-yield', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      playerTreasuryRegistry = new PlayerTreasuryRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      engine = new Engine();

    ruleRegistry.register(
      ...added(playerTreasuryRegistry, new CityBuildRegistry(), ruleRegistry),
      ...processYield(
        playerTreasuryRegistry,
        ruleRegistry,
        cityImprovementRegistry,
        engine
      ),
      ...buildCost(Temple as unknown as typeof Buildable, 30)
    );

    const player = new Player(ruleRegistry),
      city = instanceOf(City, { player: () => player }),
      [treasury] = playerTreasuryRegistry.getByPlayer(player);

    return { city, cityImprovementRegistry, engine, ruleRegistry, treasury };
  };

  it("gives every player an empty treasury of base-city-yield-gold's Gold, the class simple-ai-client buys with", (): void => {
    const { treasury } = setUp();

    expect(treasury.yield()).equal(BaseGold);
    expect(Gold).equal(BaseGold);
    expect(treasury.value()).equal(0);
  });

  it("collects a city's gold", (): void => {
    const { city, ruleRegistry, treasury } = setUp(),
      yields: Yield[] = [new Gold(7)];

    ruleRegistry.process(ProcessYield, yields[0], city, yields);

    expect(treasury.value()).equal(7);
  });

  it("sells an improvement whose upkeep the treasury can't pay, for its cost in shields", (): void => {
    const { city, cityImprovementRegistry, engine, ruleRegistry, treasury } =
        setUp(),
      temple = instanceOf(Temple, { city: () => city, _destroyed: false }),
      told: unknown[] = [];

    cityImprovementRegistry.register(temple);
    engine.on('city:unsupported-improvement', (...args) => told.push(args));
    treasury.add(1);

    const yields: Yield[] = [new CityImprovementMaintenanceGold(3, temple)];

    ruleRegistry.process(ProcessYield, yields[0], city, yields);

    expect(cityImprovementRegistry.getByCity(city)).eql([]);
    // 1 - 3 + 30: Civ2 resets the overdrawn treasury to 0 before the refund, so would leave 30 (a listed gap).
    expect(treasury.value()).equal(28);
    expect(told).length(1);
  });
});
