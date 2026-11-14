import { PendingEffectRegistry } from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import { BuyFormula } from '@civ-clone/base-treasury/lib/buy';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
/** `formula` of the shields remaining, clamped to `maximumRemaining` first, as `city_button_buy` clamps them. */
export declare const clamped: (formula: BuyFormula) => BuyFormula;
export declare const getRules: (
  pendingEffects?: PendingEffectRegistry
) => Spend[];
export default getRules;
