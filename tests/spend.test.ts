import {
  PendingEffect,
  PendingEffectRegistry,
} from '@civ-clone/core-pending-effect';
import { building, instanceOf } from './lib';
import { CIVIL_DISORDER } from '@civ-clone/civ2-city-happiness/lib/cityStatus';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { Gold } from '../Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { expect } from 'chai';
import spend from '../Rules/City/spend';

class TestUnit extends Unit {}
class TestImprovement extends CityImprovement {}
class TestWonder extends Wonder {}

describe('city:spend', (): void => {
  const pendingEffects = new PendingEffectRegistry(),
    ruleRegistry = new RuleRegistry(),
    city = instanceOf(City, {}),
    price = (Item: unknown, remaining: number, progress: number): number[] =>
      ruleRegistry
        .process(Spend, building(city, Item, remaining, progress))
        .map((cost: SpendCost): number => {
          expect(cost.resource()).equal(Gold);

          return cost.value();
        });

  ruleRegistry.register(...spend(pendingEffects));

  // OpenCiv2 `city_button_buy`: r² / 20 + 2r for a unit, 2r an improvement, 4r a Wonder, doubled with an empty box.
  (
    [
      [TestUnit, 10, 5, 25],
      [TestUnit, 30, 10, 105],
      [TestUnit, 30, 0, 210],
      [TestImprovement, 40, 20, 80],
      [TestImprovement, 40, 0, 160],
      [TestWonder, 200, 100, 800],
      [TestWonder, 200, 0, 1600],
      // The shields left are clamped to 999.
      [TestImprovement, 1500, 1, 1998],
      [TestUnit, 1200, 1, Math.floor(999 ** 2 / 20) + 1998],
    ] as [unknown, number, number, number][]
  ).forEach(([Item, remaining, progress, expected]): void => {
    it(`prices ${
      (Item as Function).name
    } with ${remaining} left and ${progress} stored at ${expected}`, (): void => {
      expect(price(Item, remaining, progress)).eql([expected]);
    });
  });

  it('offers nothing once the box covers the cost', (): void => {
    expect(price(TestUnit, 0, 30)).eql([]);
    expect(price(TestImprovement, 0, 40)).eql([]);
  });

  it("won't sell a unit to a city in civil disorder, but still an improvement", (): void => {
    const disorder = new PendingEffect(CIVIL_DISORDER, city, {});

    pendingEffects.register(disorder);

    try {
      expect(price(TestUnit, 10, 5)).eql([]);
      expect(price(TestImprovement, 40, 20)).eql([80]);
    } finally {
      pendingEffects.unregister(disorder);
    }

    expect(price(TestUnit, 10, 5)).eql([25]);
  });
});
