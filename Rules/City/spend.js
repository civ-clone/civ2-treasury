"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.clamped = void 0;
const PendingEffectRegistry_1 = require("@civ-clone/core-pending-effect/PendingEffectRegistry");
const buy_1 = require("@civ-clone/base-treasury/lib/buy");
const treasury_1 = require("../../data/treasury");
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const cityStatus_1 = require("@civ-clone/civ2-city-happiness/lib/cityStatus");
/** `formula` of the shields remaining, clamped to `maximumRemaining` first, as `city_button_buy` clamps them. */
const clamped = (formula) => (remaining) => formula(Math.min(Math.max(remaining, 0), treasury_1.maximumRemaining));
exports.clamped = clamped;
const price = (formula) => (0, buy_1.buyCost)(Yields_1.Gold, (0, exports.clamped)(formula), treasury_1.emptyBoxMultiplier);
// OpenCiv2 `src/auto/city_window.cpp` `city_button_buy` (richardpenman/civ2@49f26ec): with `r` shields left (at most
//  999), a unit costs r² / 20 + 2r, an improvement 2r and a Wonder 4r, each doubled while the box is empty. A city in
//  civil disorder can't buy a unit; it can still buy an improvement. Nothing is offered once the box already covers the
//  cost (`isBuying`), where Civ2 offers a $0 purchase.
const getRules = (pendingEffects = PendingEffectRegistry_1.instance) => [
    new Spend_1.default('civ2-treasury:city/spend/unit', new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, Unit_1.default)), new Criterion_1.default((cityBuild) => (0, cityStatus_1.civilDisorder)(cityBuild.city(), pendingEffects) === null), new Effect_1.default(price((0, buy_1.squaredBuyCost)(treasury_1.unitSquaredDivisor, treasury_1.unitPerShield)))),
    new Spend_1.default('civ2-treasury:city/spend/improvement', new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, CityImprovement_1.default) && !(0, buy_1.isBuying)(cityBuild, Wonder_1.default)), new Effect_1.default(price((0, buy_1.linearBuyCost)(treasury_1.improvementPerShield)))),
    new Spend_1.default('civ2-treasury:city/spend/wonder', new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, Wonder_1.default)), new Effect_1.default(price((0, buy_1.linearBuyCost)(treasury_1.wonderPerShield)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map