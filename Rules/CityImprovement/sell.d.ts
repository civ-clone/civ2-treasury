import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import City from '@civ-clone/core-city/City';
import Sell from '@civ-clone/core-treasury/Rules/Sell';
import Sold from '@civ-clone/core-treasury/Rules/Sold';
/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, as civ1-treasury's record
 *  (Civ2 keeps a city flag, `CITYF_IMPROVEMENT_SOLD`). A status, not a debt: no handler, never discharged; the city's
 *  next sale replaces it and its destruction removes it.
 */
export declare const SOLD = 'civ2-treasury:sold';
/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
export declare const soldOn: (
  city: City,
  pendingEffects?: PendingEffectRegistry
) => number | null;
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  turn?: Turn,
  pendingEffects?: PendingEffectRegistry
) => (Sell | Sold)[];
export default getRules;
