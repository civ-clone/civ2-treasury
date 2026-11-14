"use strict";
// Civilization II's treasury numbers. Numbers only, each with the OpenCiv2 function it comes from
//  (richardpenman/civ2@49f26ec).
Object.defineProperty(exports, "__esModule", { value: true });
exports.startingGold = exports.emptyBoxMultiplier = exports.wonderPerShield = exports.improvementPerShield = exports.unitPerShield = exports.unitSquaredDivisor = exports.maximumRemaining = void 0;
/** `city_button_buy`: the shields still to find are clamped to 0 to 999 before pricing. */
exports.maximumRemaining = 999;
/** `city_button_buy`: a unit costs remaining² / 20 + 2 × remaining. */
exports.unitSquaredDivisor = 20;
exports.unitPerShield = 2;
/** `city_button_buy`: an improvement costs 2 gold a shield. */
exports.improvementPerShield = 2;
/**
 * `city_button_buy`: anything past @IMPROVE row 34 costs 4 gold a shield: the spaceship parts (rows 35 to 37) and the
 *  Wonders. M2a has no spaceship parts, so here it's the Wonders.
 */
exports.wonderPerShield = 4;
/** `city_button_buy`: every price is doubled while the city's shield box is empty. */
exports.emptyBoxMultiplier = 2;
/** `civ_create_reset_civ`: every civilization starts with no gold. */
exports.startingGold = 0;
//# sourceMappingURL=treasury.js.map