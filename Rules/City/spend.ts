import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import {
  BuyFormula,
  buyCost,
  isBuying,
  linearBuyCost,
  squaredBuyCost,
} from '@civ-clone/base-treasury/lib/buy';
import {
  emptyBoxMultiplier,
  improvementPerShield,
  maximumRemaining,
  unitPerShield,
  unitSquaredDivisor,
  wonderPerShield,
} from '../../data/treasury';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { civilDisorder } from '@civ-clone/civ2-city-happiness/lib/cityStatus';

/** `formula` of the shields remaining, clamped to `maximumRemaining` first, as `city_button_buy` clamps them. */
export const clamped =
  (formula: BuyFormula): BuyFormula =>
  (remaining: number): number =>
    formula(Math.min(Math.max(remaining, 0), maximumRemaining));

const price = (formula: BuyFormula): ((cityBuild: CityBuild) => SpendCost) =>
  buyCost(Gold, clamped(formula), emptyBoxMultiplier);

// OpenCiv2 `src/auto/city_window.cpp` `city_button_buy` (richardpenman/civ2@49f26ec): with `r` shields left (at most
//  999), a unit costs r² / 20 + 2r, an improvement 2r and a Wonder 4r, each doubled while the box is empty. A city in
//  civil disorder can't buy a unit; it can still buy an improvement. Nothing is offered once the box already covers the
//  cost (`isBuying`), where Civ2 offers a $0 purchase.
export const getRules = (
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): Spend[] => [
  new Spend(
    'civ2-treasury:city/spend/unit',
    new Criterion((cityBuild: CityBuild): boolean => isBuying(cityBuild, Unit)),
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        civilDisorder(cityBuild.city(), pendingEffects) === null
    ),
    new Effect(price(squaredBuyCost(unitSquaredDivisor, unitPerShield)))
  ),

  new Spend(
    'civ2-treasury:city/spend/improvement',
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        isBuying(cityBuild, CityImprovement) && !isBuying(cityBuild, Wonder)
    ),
    new Effect(price(linearBuyCost(improvementPerShield)))
  ),

  new Spend(
    'civ2-treasury:city/spend/wonder',
    new Criterion((cityBuild: CityBuild): boolean =>
      isBuying(cityBuild, Wonder)
    ),
    new Effect(price(linearBuyCost(wonderPerShield)))
  ),
];

export default getRules;
