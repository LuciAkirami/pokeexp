// XP Calculator Types

export type TargetType = "date" | "days";

// Base interface with common fields
export interface BaseXPInputs {
  currentLevel: string;
  currentXP: string;
  targetLevel: string;
  lucky_egg: boolean;
  use_target_timeline: boolean;
  target_type: TargetType;
  target_date: string;
  target_days: string;
}

// Catching related types
export interface CatchingInputs {
  normal_catches: string;
  new_pokemon_catches: string;
  excellent_throws: string;
  curve_balls: string;
  first_throws: string;
  great_throws: string;
  nice_throws: string;
}

// Evolution related types
export interface EvolutionInputs {
  normal_evolutions: string;
  new_pokemon_evolutions: string;
}

// Hatching related types
export interface HatchingInputs {
  km_2_eggs: string;
  km_5_eggs: string;
  km_7_eggs: string;
  km_10_eggs: string;
  km_12_eggs: string;
}

// Raid related types
export interface RaidInputs {
  star_1_raids: string;
  star_3_raids: string;
  star_5_raids: string;
  mega_raids: string;
  shadow_raids: string;
}

// Max Battle related types
export interface MaxBattleInputs {
  star_1_battles: string;
  star_2_battles: string;
  star_3_battles: string;
  star_4_battles: string;
  star_5_battles: string;
  star_6_battles: string;
  in_person_bonus: string;
}

// Max Moves related types
export interface MaxMovesInputs {
  level_1_moves: string;
  level_2_moves: string;
  level_max_moves: string;
}

// Friendship related types
export interface FriendshipInputs {
  good_friends: string;
  great_friends: string;
  ultra_friends: string;
  best_friends: string;
}

// Main detailed XP inputs that combines all categories
export interface DetailedXPInputs extends 
  BaseXPInputs, 
  CatchingInputs, 
  EvolutionInputs, 
  HatchingInputs, 
  RaidInputs, 
  MaxBattleInputs, 
  MaxMovesInputs, 
  FriendshipInputs {}

export interface CategoryXP {
  catching: number;
  evolution: number;
  hatching: number;
  raids: number;
  maxBattle: number;
  maxMoves: number;
  friendship: number;
  total: number;
  dailyXP: number;
}

export interface LevelProgress {
  currentTotalXP: number;
  newTotalXP: number;
  xpNeeded: number;
  xpRemaining: number;
  targetReached: boolean;
  reachedLevel: number;
  categoryXP: CategoryXP;
}

export interface TimeToTarget {
  daysToTarget: number;
}

export interface DailyRequirements {
  daysNeeded: number;
  dailyXPNeeded: number;
}

export interface DetailedXPCalculatorProps {
  onBack: () => void;
}

// Helper types for individual calculators
export interface CatchXPCalculatorProps {
  inputs: CatchingInputs;
  onUpdate: (updates: Partial<CatchingInputs>) => void;
}

export interface EvolutionXPCalculatorProps {
  inputs: EvolutionInputs;
  onUpdate: (updates: Partial<EvolutionInputs>) => void;
}

export interface HatchingXPCalculatorProps {
  inputs: HatchingInputs;
  onUpdate: (updates: Partial<HatchingInputs>) => void;
}

export interface RaidXPCalculatorProps {
  inputs: RaidInputs;
  onUpdate: (updates: Partial<RaidInputs>) => void;
}

export interface MaxBattleXPCalculatorProps {
  inputs: MaxBattleInputs;
  onUpdate: (updates: Partial<MaxBattleInputs>) => void;
}

export interface MaxMovesXPCalculatorProps {
  inputs: MaxMovesInputs;
  onUpdate: (updates: Partial<MaxMovesInputs>) => void;
}

export interface FriendshipXPCalculatorProps {
  inputs: FriendshipInputs;
  onUpdate: (updates: Partial<FriendshipInputs>) => void;
}
