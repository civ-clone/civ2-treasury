import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Player from '@civ-clone/core-player/Player';
import { addPlayerTreasury } from '@civ-clone/base-treasury/lib/treasury';
import { startingGold } from '../../data/treasury';

// Every player has a Gold treasury, empty to start with (OpenCiv2 `civ_create_reset_civ`).
export const getRules = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Added[] => [
  new Added(
    'civ2-treasury:player/added/treasury',
    new Effect((player: Player): void =>
      addPlayerTreasury(
        player,
        Gold,
        startingGold,
        playerTreasuryRegistry,
        cityBuildRegistry,
        ruleRegistry
      )
    )
  ),
];

export default getRules;
