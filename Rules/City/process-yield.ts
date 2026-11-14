import { CityImprovementMaintenanceGold, Gold } from '../../Yields';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Yield from '@civ-clone/core-yield/Yield';
import collectYields from '@civ-clone/base-treasury/lib/collect';

// The city's tax goes to its player's treasury, and so does each improvement's upkeep. Which improvements charge
//  upkeep (none under Anarchy, none in a computer player's city: OpenCiv2 `city_pay_improvement_upkeep`) is
//  civ2-city-improvement's `Cost` rule's; when paying one overdraws the treasury, the improvement is sold for its cost
//  (`collectYields`).
export const getRules = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  engine: Engine = engineInstance
): ProcessYield[] => [
  new ProcessYield(
    'civ2-treasury:city/process-yield/gold',
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Gold),
    new Effect(
      collectYields(
        Gold,
        CityImprovementMaintenanceGold,
        playerTreasuryRegistry,
        ruleRegistry,
        cityImprovementRegistry,
        engine
      )
    )
  ),
];

export default getRules;
