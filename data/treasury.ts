// Civilization II's treasury numbers. Numbers only, each with the OpenCiv2 function it comes from
//  (richardpenman/civ2@49f26ec).

/** `city_button_buy`: the shields still to find are clamped to 0 to 999 before pricing. */
export const maximumRemaining = 999;

/** `city_button_buy`: a unit costs remaining² / 20 + 2 × remaining. */
export const unitSquaredDivisor = 20;
export const unitPerShield = 2;

/** `city_button_buy`: an improvement costs 2 gold a shield. */
export const improvementPerShield = 2;

/**
 * `city_button_buy`: anything past @IMPROVE row 34 costs 4 gold a shield: the spaceship parts (rows 35 to 37) and the
 *  Wonders. M2a has no spaceship parts, so here it's the Wonders.
 */
export const wonderPerShield = 4;

/** `city_button_buy`: every price is doubled while the city's shield box is empty. */
export const emptyBoxMultiplier = 2;

/** `civ_create_reset_civ`: every civilization starts with no gold. */
export const startingGold = 0;
