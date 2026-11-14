"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const collect_1 = require("@civ-clone/base-treasury/lib/collect");
// The city's tax goes to its player's treasury, and so does each improvement's upkeep. Which improvements charge
//  upkeep (none under Anarchy, none in a computer player's city: OpenCiv2 `city_pay_improvement_upkeep`) is
//  civ2-city-improvement's `Cost` rule's; when paying one overdraws the treasury, the improvement is sold for its cost
//  (`collectYields`).
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new ProcessYield_1.default('civ2-treasury:city/process-yield/gold', new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Gold), new Effect_1.default((0, collect_1.default)(Yields_1.Gold, Yields_1.CityImprovementMaintenanceGold, playerTreasuryRegistry, ruleRegistry, cityImprovementRegistry, engine))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=process-yield.js.map