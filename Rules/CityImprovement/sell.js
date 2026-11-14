"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.soldOn = exports.SOLD = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const sell_1 = require("@civ-clone/base-treasury/lib/sell");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Palace_1 = require("@civ-clone/base-city-improvement-palace/Palace");
const Sell_1 = require("@civ-clone/core-treasury/Rules/Sell");
const Sold_1 = require("@civ-clone/core-treasury/Rules/Sold");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, as civ1-treasury's record
 *  (Civ2 keeps a city flag, `CITYF_IMPROVEMENT_SOLD`). A status, not a debt: no handler, never discharged; the city's
 *  next sale replaces it and its destruction removes it.
 */
exports.SOLD = 'civ2-treasury:sold';
/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
const soldOn = (city, pendingEffects = core_pending_effect_1.instance) => (0, sell_1.soldOn)(city, exports.SOLD, pendingEffects);
exports.soldOn = soldOn;
// OpenCiv2 `src/auto/city_window.cpp` `city_window_sell_improvement` (richardpenman/civ2@49f26ec): an improvement
//  sells for its cost in shields, 1 gold each, a city sells one a turn, the Palace can't be sold and Wonders aren't
//  listed.
const getRules = (ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, pendingEffects = core_pending_effect_1.instance) => [
    new Sell_1.default('civ2-treasury:city-improvement/sell/value', new Criterion_1.default((cityImprovement) => !(cityImprovement instanceof Wonder_1.default) &&
        !(cityImprovement instanceof Palace_1.default)), new Criterion_1.default((cityImprovement) => (0, exports.soldOn)(cityImprovement.city(), pendingEffects) !== turn.value()), new Effect_1.default((0, sell_1.saleValue)(Yields_1.Gold, ruleRegistry))),
    // One record a city, replaced on each sale, so it never piles up.
    new Sold_1.default('civ2-treasury:city-improvement/sold/once-a-turn', new Effect_1.default((cityImprovement) => (0, sell_1.recordSale)(cityImprovement.city(), exports.SOLD, turn.value(), pendingEffects))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=sell.js.map