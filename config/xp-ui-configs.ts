import { XP_MULTIPLIERS } from '@/types/xp-constants';
import {
  CatchingInputs,
  EvolutionInputs,
  HatchingInputs,
  RaidInputs,
  MaxBattleInputs,
  MaxMovesInputs,
  FriendshipInputs,
} from '@/types/xp-calculator';

// --- UI Configuration Arrays ---
// These arrays map your state keys to UI labels and XP constant values.

/**
 * A generic type for our UI input configuration.
 * Using <T> ensures that 'stateKey' must be a valid key
 * of the specific input type (e.g., 'CatchingInputs').
 */
type InputConfig<T> = {
  label: string;
  stateKey: keyof T; // This provides excellent type-safety
  xp: number;
};

// 1. Catching
export const catchingInputsConfig: InputConfig<CatchingInputs>[] = [
  {
    label: 'Normal Catches',
    stateKey: 'normal_catches',
    xp: XP_MULTIPLIERS.catching.normal,
  },
  {
    label: 'New Pokémon',
    stateKey: 'new_pokemon_catches',
    xp: XP_MULTIPLIERS.catching.new_pokemon,
  },
  {
    label: 'Excellent Throws',
    stateKey: 'excellent_throws',
    xp: XP_MULTIPLIERS.catching.excellent_throw,
  },
  {
    label: 'Curve Balls',
    stateKey: 'curve_balls',
    xp: XP_MULTIPLIERS.catching.curve_ball,
  },
  {
    label: 'First Throws',
    stateKey: 'first_throws',
    xp: XP_MULTIPLIERS.catching.first_throw,
  },
  {
    label: 'Great Throws',
    stateKey: 'great_throws',
    xp: XP_MULTIPLIERS.catching.great_throw,
  },
  {
    label: 'Nice Throws',
    stateKey: 'nice_throws',
    xp: XP_MULTIPLIERS.catching.nice_throw,
  },
];

// 2. Evolution
export const evolutionInputsConfig: InputConfig<EvolutionInputs>[] = [
  {
    label: 'Normal Evolutions',
    stateKey: 'normal_evolutions',
    xp: XP_MULTIPLIERS.evolution.normal,
  },
  {
    label: 'New Evolutions',
    stateKey: 'new_pokemon_evolutions',
    xp: XP_MULTIPLIERS.evolution.new_pokemon,
  },
];

// 3. Hatching
export const hatchingInputsConfig: InputConfig<HatchingInputs>[] = [
  {
    label: '2km Eggs',
    stateKey: 'km_2_eggs',
    xp: XP_MULTIPLIERS.hatching.km_2,
  },
  {
    label: '5km Eggs',
    stateKey: 'km_5_eggs',
    xp: XP_MULTIPLIERS.hatching.km_5,
  },
  {
    label: '7km Eggs',
    stateKey: 'km_7_eggs',
    xp: XP_MULTIPLIERS.hatching.km_7,
  },
  {
    label: '10km Eggs',
    stateKey: 'km_10_eggs',
    xp: XP_MULTIPLIERS.hatching.km_10,
  },
  {
    label: '12km Eggs',
    stateKey: 'km_12_eggs',
    xp: XP_MULTIPLIERS.hatching.km_12,
  },
];

// 4. Raids
export const raidInputsConfig: InputConfig<RaidInputs>[] = [
  {
    label: '1-Star Raids',
    stateKey: 'star_1_raids',
    xp: XP_MULTIPLIERS.raids.star_1,
  },
  {
    label: '3-Star Raids',
    stateKey: 'star_3_raids',
    xp: XP_MULTIPLIERS.raids.star_3,
  },
  {
    label: '5-Star Raids',
    stateKey: 'star_5_raids',
    xp: XP_MULTIPLIERS.raids.star_5,
  },
  {
    label: 'Mega Raids',
    stateKey: 'mega_raids',
    xp: XP_MULTIPLIERS.raids.mega,
  },
  {
    label: 'Shadow Raids',
    stateKey: 'shadow_raids',
    xp: XP_MULTIPLIERS.raids.shadow,
  },
];

// 5. Max Battle
export const maxBattleInputsConfig: InputConfig<MaxBattleInputs>[] = [
  {
    label: '1-Star Battles',
    stateKey: 'star_1_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_1,
  },
  {
    label: '2-Star Battles',
    stateKey: 'star_2_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_2,
  },
  {
    label: '3-Star Battles',
    stateKey: 'star_3_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_3,
  },
  {
    label: '4-Star Battles',
    stateKey: 'star_4_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_4,
  },
  {
    label: '5-Star Battles',
    stateKey: 'star_5_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_5,
  },
  {
    label: '6-Star Battles',
    stateKey: 'star_6_battles',
    xp: XP_MULTIPLIERS.maxBattle.star_6,
  },
  {
    label: 'In-Person Bonus',
    stateKey: 'in_person_bonus',
    xp: XP_MULTIPLIERS.maxBattle.in_person_bonus,
  },
];

// 6. Max Moves
export const maxMovesInputsConfig: InputConfig<MaxMovesInputs>[] = [
  {
    label: 'Level 1 Moves',
    stateKey: 'level_1_moves',
    xp: XP_MULTIPLIERS.maxMoves.level_1,
  },
  {
    label: 'Level 2 Moves',
    stateKey: 'level_2_moves',
    xp: XP_MULTIPLIERS.maxMoves.level_2,
  },
  {
    label: 'Max Level Moves',
    stateKey: 'level_max_moves',
    xp: XP_MULTIPLIERS.maxMoves.level_max,
  },
];

// 7. Friendship
export const friendshipInputsConfig: InputConfig<FriendshipInputs>[] = [
  {
    label: 'Good Friends',
    stateKey: 'good_friends',
    xp: XP_MULTIPLIERS.friendship.good_friends,
  },
  {
    label: 'Great Friends',
    stateKey: 'great_friends',
    xp: XP_MULTIPLIERS.friendship.great_friends,
  },
  {
    label: 'Ultra Friends',
    stateKey: 'ultra_friends',
    xp: XP_MULTIPLIERS.friendship.ultra_friends,
  },
  {
    label: 'Best Friends',
    stateKey: 'best_friends',
    xp: XP_MULTIPLIERS.friendship.best_friends,
  },
];
