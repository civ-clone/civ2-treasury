# civ2-treasury

Civilization II's treasury on `base-treasury`, from OpenCiv2 (richardpenman/civ2@49f26ec). The numbers are in
`data/treasury.ts`, each with the function it comes from.

- **A Gold treasury for every player** (`Rules/Player/added`), empty to start with (`civ_create_reset_civ`). It holds
  `base-city-yield-gold`'s `Gold`, the class simple-ai-client buys a lost defender with.
- **Buying** (`Rules/City/spend`, `city_button_buy`): with `r` shields left, clamped to 999, a unit costs r² / 20 + 2r,
  an improvement 2r and a Wonder 4r, each doubled while the box is empty. A city in civil disorder can't buy a unit.
- **Selling** (`Rules/CityImprovement/sell`, `city_window_sell_improvement`): an improvement sells for its cost in
  shields, one a city a turn. The Palace and Wonders can't be sold.
- **Collecting and bankruptcy** (`Rules/City/process-yield`): the city's tax is added to the treasury with each
  improvement's upkeep; an improvement whose upkeep the treasury can't pay is sold for its cost in shields. Which
  improvements charge upkeep is civ2-city-improvement's (none under Anarchy and none in a computer player's city, as
  `city_pay_improvement_upkeep`).

## Not yet (Civ2 M2a deviations and gaps)

- **Bankruptcy:** Civ2 resets the overdrawn treasury to 0 before adding the sale; `base-treasury` adds the sale to the
  overdrawn amount, so the treasury ends a few gold lower.
- **$0 purchases:** nothing is offered once the box covers the cost; Civ2 offers a $0 purchase.
- **The 30,000 gold cap** (`civ_turn_begin`) isn't applied.
- **Spaceship parts and Capitalization** aren't in M2a.
