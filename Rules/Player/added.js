"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const treasury_1 = require("@civ-clone/base-treasury/lib/treasury");
const treasury_2 = require("../../data/treasury");
// Every player has a Gold treasury, empty to start with (OpenCiv2 `civ_create_reset_civ`).
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Added_1.default('civ2-treasury:player/added/treasury', new Effect_1.default((player) => (0, treasury_1.addPlayerTreasury)(player, Yields_1.Gold, treasury_2.startingGold, playerTreasuryRegistry, cityBuildRegistry, ruleRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map