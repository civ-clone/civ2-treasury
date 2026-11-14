import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  recordSale,
  saleValue,
  soldOn as soldOnTurn,
} from '@civ-clone/base-treasury/lib/sell';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Palace from '@civ-clone/base-city-improvement-palace/Palace';
import Sell from '@civ-clone/core-treasury/Rules/Sell';
import Sold from '@civ-clone/core-treasury/Rules/Sold';
import Wonder from '@civ-clone/core-wonder/Wonder';

/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, as civ1-treasury's record
 *  (Civ2 keeps a city flag, `CITYF_IMPROVEMENT_SOLD`). A status, not a debt: no handler, never discharged; the city's
 *  next sale replaces it and its destruction removes it.
 */
export const SOLD = 'civ2-treasury:sold';

/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
export const soldOn = (
  city: City,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): number | null => soldOnTurn(city, SOLD, pendingEffects);

// OpenCiv2 `src/auto/city_window.cpp` `city_window_sell_improvement` (richardpenman/civ2@49f26ec): an improvement
//  sells for its cost in shields, 1 gold each, a city sells one a turn, the Palace can't be sold and Wonders aren't
//  listed.
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): (Sell | Sold)[] => [
  new Sell(
    'civ2-treasury:city-improvement/sell/value',
    new Criterion(
      (cityImprovement: CityImprovement): boolean =>
        !(cityImprovement instanceof Wonder) &&
        !(cityImprovement instanceof Palace)
    ),
    new Criterion(
      (cityImprovement: CityImprovement): boolean =>
        soldOn(cityImprovement.city(), pendingEffects) !== turn.value()
    ),
    new Effect(saleValue(Gold, ruleRegistry))
  ),

  // One record a city, replaced on each sale, so it never piles up.
  new Sold(
    'civ2-treasury:city-improvement/sold/once-a-turn',
    new Effect((cityImprovement: CityImprovement): void =>
      recordSale(cityImprovement.city(), SOLD, turn.value(), pendingEffects)
    )
  ),
];

export default getRules;
