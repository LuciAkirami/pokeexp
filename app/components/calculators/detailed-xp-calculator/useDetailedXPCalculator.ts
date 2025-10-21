import { useState } from 'react';
import {
  XP_REQUIREMENTS,
  XP_MULTIPLIERS,
  GAME_CONSTANTS,
} from '@/types/xp-constants';
import type { DetailedXPInputs } from '@/types/xp-calculator';

const INITIAL_STATE: DetailedXPInputs = {
  currentLevel: '',
  currentXP: '',
  targetLevel: '',
  normal_catches: '',
  new_pokemon_catches: '',
  excellent_throws: '',
  curve_balls: '',
  first_throws: '',
  great_throws: '',
  nice_throws: '',
  normal_evolutions: '',
  new_pokemon_evolutions: '',
  km_2_eggs: '',
  km_5_eggs: '',
  km_7_eggs: '',
  km_10_eggs: '',
  km_12_eggs: '',
  star_1_raids: '',
  star_3_raids: '',
  star_5_raids: '',
  mega_raids: '',
  shadow_raids: '',
  star_1_battles: '',
  star_2_battles: '',
  star_3_battles: '',
  star_4_battles: '',
  star_5_battles: '',
  star_6_battles: '',
  in_person_bonus: '',
  level_1_moves: '',
  level_2_moves: '',
  level_max_moves: '',
  good_friends: '',
  great_friends: '',
  ultra_friends: '',
  best_friends: '',
  lucky_egg: false,
  use_target_timeline: true,
  target_type: 'date',
  target_date: '2025-12-31',
  target_days: '',
};

export function useDetailedXPCalculator() {
  const [inputs, setInputs] = useState<DetailedXPInputs>(INITIAL_STATE);

  // --- All calculation and handler functions ---

  const calculateCategoryXP = () => {
    // --------  Catching ----------
    const normal_catches = Number.parseInt(inputs.normal_catches) || 0;
    const new_pokemon_catches = Number.parseInt(inputs.new_pokemon_catches) || 0;
    const excellent_throws = Number.parseInt(inputs.excellent_throws) || 0;
    const curve_balls = Number.parseInt(inputs.curve_balls) || 0;
    const first_throws = Number.parseInt(inputs.first_throws) || 0;
    const great_throws = Number.parseInt(inputs.great_throws) || 0;
    const nice_throws = Number.parseInt(inputs.nice_throws) || 0;

    const catching =
      normal_catches * XP_MULTIPLIERS.catching.normal +
      new_pokemon_catches * XP_MULTIPLIERS.catching.new_pokemon +
      excellent_throws * XP_MULTIPLIERS.catching.excellent_throw +
      curve_balls * XP_MULTIPLIERS.catching.curve_ball +
      first_throws * XP_MULTIPLIERS.catching.first_throw +
      great_throws * XP_MULTIPLIERS.catching.great_throw +
      nice_throws * XP_MULTIPLIERS.catching.nice_throw;

    // --------  Evolution ----------
    const normal_evolutions = Number.parseInt(inputs.normal_evolutions) || 0;
    const new_pokemon_evolutions =
      Number.parseInt(inputs.new_pokemon_evolutions) || 0;
    const evolution =
      normal_evolutions * XP_MULTIPLIERS.evolution.normal +
      new_pokemon_evolutions * XP_MULTIPLIERS.evolution.new_pokemon;

    // --------  Hatching ----------
    const km_2_eggs = Number.parseInt(inputs.km_2_eggs) || 0;
    const km_5_eggs = Number.parseInt(inputs.km_5_eggs) || 0;
    const km_7_eggs = Number.parseInt(inputs.km_7_eggs) || 0;
    const km_10_eggs = Number.parseInt(inputs.km_10_eggs) || 0;
    const km_12_eggs = Number.parseInt(inputs.km_12_eggs) || 0;
    const hatching =
      km_2_eggs * XP_MULTIPLIERS.hatching.km_2 +
      km_5_eggs * XP_MULTIPLIERS.hatching.km_5 +
      km_7_eggs * XP_MULTIPLIERS.hatching.km_7 +
      km_10_eggs * XP_MULTIPLIERS.hatching.km_10 +
      km_12_eggs * XP_MULTIPLIERS.hatching.km_12;

    // --------  Raids ----------
    const star_1_raids = Number.parseInt(inputs.star_1_raids) || 0;
    const star_3_raids = Number.parseInt(inputs.star_3_raids) || 0;
    const star_5_raids = Number.parseInt(inputs.star_5_raids) || 0;
    const mega_raids = Number.parseInt(inputs.mega_raids) || 0;
    const shadow_raids = Number.parseInt(inputs.shadow_raids) || 0;
    const raids =
      star_1_raids * XP_MULTIPLIERS.raids.star_1 +
      star_3_raids * XP_MULTIPLIERS.raids.star_3 +
      star_5_raids * XP_MULTIPLIERS.raids.star_5 +
      mega_raids * XP_MULTIPLIERS.raids.mega +
      shadow_raids * XP_MULTIPLIERS.raids.shadow;

    // --------  Max Battles ----------
    const star_1_battles = Number.parseInt(inputs.star_1_battles) || 0;
    const star_2_battles = Number.parseInt(inputs.star_2_battles) || 0;
    const star_3_battles = Number.parseInt(inputs.star_3_battles) || 0;
    const star_4_battles = Number.parseInt(inputs.star_4_battles) || 0;
    const star_5_battles = Number.parseInt(inputs.star_5_battles) || 0;
    const star_6_battles = Number.parseInt(inputs.star_6_battles) || 0;
    const in_person_bonus = Number.parseInt(inputs.in_person_bonus) || 0;
    const maxBattle =
      star_1_battles * XP_MULTIPLIERS.maxBattle.star_1 +
      star_2_battles * XP_MULTIPLIERS.maxBattle.star_2 +
      star_3_battles * XP_MULTIPLIERS.maxBattle.star_3 +
      star_4_battles * XP_MULTIPLIERS.maxBattle.star_4 +
      star_5_battles * XP_MULTIPLIERS.maxBattle.star_5 +
      star_6_battles * XP_MULTIPLIERS.maxBattle.star_6 +
      in_person_bonus * XP_MULTIPLIERS.maxBattle.in_person_bonus;

    // --------  Max Moves ----------
    const level_1_moves = Number.parseInt(inputs.level_1_moves) || 0;
    const level_2_moves = Number.parseInt(inputs.level_2_moves) || 0;
    const level_max_moves = Number.parseInt(inputs.level_max_moves) || 0;
    const maxMoves =
      level_1_moves * XP_MULTIPLIERS.maxMoves.level_1 +
      level_2_moves * XP_MULTIPLIERS.maxMoves.level_2 +
      level_max_moves * XP_MULTIPLIERS.maxMoves.level_max;

    // --------  Friendship ----------
    const good_friends = Number.parseInt(inputs.good_friends) || 0;
    const great_friends = Number.parseInt(inputs.great_friends) || 0;
    const ultra_friends = Number.parseInt(inputs.ultra_friends) || 0;
    const best_friends = Number.parseInt(inputs.best_friends) || 0;
    const friendship =
      good_friends * XP_MULTIPLIERS.friendship.good_friends +
      great_friends * XP_MULTIPLIERS.friendship.great_friends +
      ultra_friends * XP_MULTIPLIERS.friendship.ultra_friends +
      best_friends * XP_MULTIPLIERS.friendship.best_friends;

    const dailyXP = catching + evolution + hatching + raids + maxBattle + maxMoves;
    const adjustedDailyXP = inputs.lucky_egg ? dailyXP * 2 : dailyXP;

    return {
      catching: inputs.lucky_egg ? catching * 2 : catching,
      evolution: inputs.lucky_egg ? evolution * 2 : evolution,
      hatching: inputs.lucky_egg ? hatching * 2 : hatching,
      raids: inputs.lucky_egg ? raids * 2 : raids,
      maxBattle: inputs.lucky_egg ? maxBattle * 2 : maxBattle,
      maxMoves: inputs.lucky_egg ? maxMoves * 2 : maxMoves,
      friendship,
      total: adjustedDailyXP + friendship,
      dailyXP: adjustedDailyXP,
    };
  };

  const calculateLevelProgress = () => {
    const categoryXP = calculateCategoryXP();
    const currentXP = Number.parseInt(inputs.currentXP) || 0;
    const currentLevel = Number.parseInt(inputs.currentLevel) || 1;
    const targetLevel = Number.parseInt(inputs.targetLevel) || 50;
    const currentTotalXP = XP_REQUIREMENTS[currentLevel] + currentXP;
    const targetTotalXP = XP_REQUIREMENTS[targetLevel] || XP_REQUIREMENTS[50];
    const newTotalXP = currentTotalXP + categoryXP.total;

    const xpNeeded = Math.max(0, targetTotalXP - currentTotalXP);
    const xpRemaining = Math.max(0, targetTotalXP - newTotalXP);
    const targetReached = newTotalXP >= targetTotalXP;

    let reachedLevel = currentLevel;
    for (let level = currentLevel + 1; level <= 50; level++) {
      if (newTotalXP >= XP_REQUIREMENTS[level]) {
        reachedLevel = level;
      } else {
        break;
      }
    }

    return {
      currentTotalXP,
      newTotalXP,
      xpNeeded,
      xpRemaining,
      targetReached,
      reachedLevel,
      categoryXP,
    };
  };

  const updateInput = (
    field: keyof DetailedXPInputs,
    value: string | boolean
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberInput = (field: keyof DetailedXPInputs, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      if (field === 'currentLevel' && value !== '') {
        if (parseInt(value) > GAME_CONSTANTS.MAX_LEVEL) {
          updateInput(field, GAME_CONSTANTS.MAX_LEVEL.toString());
        } else {
          updateInput(field, value);
        }
      } else if (field === 'currentXP' && value !== '') {
        if (parseInt(value) > GAME_CONSTANTS.MAX_XP) {
          updateInput(field, GAME_CONSTANTS.MAX_XP.toString());
        } else {
          updateInput(field, value);
        }
      } else if (field === 'targetLevel' && value !== '') {
        if (parseInt(value) > GAME_CONSTANTS.MAX_LEVEL) {
          updateInput(field, GAME_CONSTANTS.MAX_LEVEL.toString());
        } else {
          updateInput(field, value);
        }
      } else if (
        field === 'curve_balls' ||
        field === 'first_throws' ||
        field === 'new_pokemon_catches' ||
        field === 'normal_catches' ||
        field === 'nice_throws' ||
        field === 'great_throws' ||
        field === 'excellent_throws'
      ) {
        const normal_catches = parseInt(inputs.normal_catches) || 0;
        const curve_balls = parseInt(inputs.curve_balls) || 0;
        const first_throws = parseInt(inputs.first_throws) || 0;
        const excellent_throws = parseInt(inputs.excellent_throws) || 0;
        const great_throws = parseInt(inputs.great_throws) || 0;
        const nice_throws = parseInt(inputs.nice_throws) || 0;
        const new_pokemon_catches =
          parseInt(inputs.new_pokemon_catches) || 0;
        const int_value = parseInt(value) || 0;

        if (int_value > GAME_CONSTANTS.MAX_CATCHES) {
          value = GAME_CONSTANTS.MAX_CATCHES.toString();
        }

        if (field === 'normal_catches') {
          if (int_value < curve_balls) {
            updateInput('curve_balls', value);
          }
          if (int_value < first_throws) {
            updateInput('first_throws', value);
          }
          if (int_value < new_pokemon_catches) {
            updateInput('new_pokemon_catches', value);
          }
          if (int_value < excellent_throws) {
            updateInput('excellent_throws', value);
          }
          if (int_value < great_throws) {
            updateInput('great_throws', value);
          }
          if (int_value < nice_throws) {
            updateInput('nice_throws', value);
          }
          updateInput(field, value);

          if (int_value === 0) {
            updateInput('curve_balls', '');
            updateInput('first_throws', '');
            updateInput('new_pokemon_catches', '');
            updateInput('nice_throws', '');
            updateInput('great_throws', '');
            updateInput('excellent_throws', '');
          }
        } else if (field === 'curve_balls') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'first_throws') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'new_pokemon_catches') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'nice_throws') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'great_throws') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'excellent_throws') {
          if (int_value > normal_catches) {
            updateInput(field, normal_catches.toString());
          } else {
            updateInput(field, value);
          }
        }
      } else if (
        field === 'new_pokemon_evolutions' ||
        field === 'normal_evolutions'
      ) {
        const normal_evolutions = parseInt(inputs.normal_evolutions) || 0;
        const new_pokemon_evolutions =
          parseInt(inputs.new_pokemon_evolutions) || 0;
        const int_value = parseInt(value) || 0;

        if (
          field === 'normal_evolutions' &&
          int_value > GAME_CONSTANTS.MAX_EVOLUTIONS
        ) {
          updateInput(field, GAME_CONSTANTS.MAX_EVOLUTIONS.toString());
        } else if (field === 'new_pokemon_evolutions') {
          if (int_value > normal_evolutions) {
            updateInput(field, normal_evolutions.toString());
          } else {
            updateInput(field, value);
          }
        } else if (field === 'normal_evolutions') {
          if (int_value < new_pokemon_evolutions) {
            updateInput('new_pokemon_evolutions', value);
          }
          updateInput(field, value);
          if (int_value === 0) {
            updateInput('new_pokemon_evolutions', '');
          }
        }
      } else if (
        field === 'good_friends' ||
        field === 'great_friends' ||
        field === 'ultra_friends' ||
        field === 'best_friends'
      ) {
        const int_value = parseInt(value) || 0;
        if (int_value > GAME_CONSTANTS.MAX_FRIENDSHIP) {
          updateInput(field, GAME_CONSTANTS.MAX_FRIENDSHIP.toString());
        } else {
          updateInput(field, value);
        }
      } else if (
        field === 'km_2_eggs' ||
        field === 'km_5_eggs' ||
        field === 'km_7_eggs' ||
        field === 'km_10_eggs' ||
        field === 'km_12_eggs'
      ) {
        const int_value = parseInt(value) || 0;
        if (int_value > GAME_CONSTANTS.MAX_HATCHES) {
          updateInput(field, GAME_CONSTANTS.MAX_HATCHES.toString());
        } else {
          updateInput(field, value);
        }
      } else if (
        field === 'star_1_raids' ||
        field === 'star_3_raids' ||
        field === 'star_5_raids' ||
        field === 'mega_raids' ||
        field === 'shadow_raids'
      ) {
        const int_value = parseInt(value) || 0;
        if (int_value > GAME_CONSTANTS.MAX_RAIDS) {
          updateInput(field, GAME_CONSTANTS.MAX_RAIDS.toString());
        } else {
          updateInput(field, value);
        }
      } else if (
        field === 'star_1_battles' ||
        field === 'star_2_battles' ||
        field === 'star_3_battles' ||
        field === 'star_4_battles' ||
        field === 'star_5_battles' ||
        field === 'star_6_battles' ||
        field === 'in_person_bonus'
      ) {
        const int_value = parseInt(value) || 0;
        if (int_value > GAME_CONSTANTS.MAX_MAX_BATTLES) {
          updateInput(field, GAME_CONSTANTS.MAX_MAX_BATTLES.toString());
        } else {
          updateInput(field, value);
        }
      } else if (
        field === 'level_1_moves' ||
        field === 'level_2_moves' ||
        field === 'level_max_moves'
      ) {
        const int_value = parseInt(value) || 0;
        if (int_value > GAME_CONSTANTS.MAX_MAX_MOVES) {
          updateInput(field, GAME_CONSTANTS.MAX_MAX_MOVES.toString());
        } else {
          updateInput(field, value);
        }
      } else {
        updateInput(field, value);
      }
    }
  };

  const calculateTimeToTarget = () => {
    const progress = calculateLevelProgress();
    if (progress.targetReached) return { daysToTarget: 0 };
    const dailyXPEarned = progress.categoryXP.dailyXP;
    if (dailyXPEarned <= 0) return { daysToTarget: Infinity };
    const daysToTarget = Math.ceil(progress.xpRemaining / dailyXPEarned);
    return { daysToTarget };
  };

  const calculateDailyRequirements = () => {
    const progress = calculateLevelProgress();
    if (progress.targetReached || !inputs.use_target_timeline)
      return { daysNeeded: 0, dailyXPNeeded: 0 };
    let days = 0;
    if (inputs.target_type === 'date') {
      const targetDate = new Date(inputs.target_date);
      const today = new Date();
      const timeDiff = targetDate.getTime() - today.getTime();
      days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    } else {
      days = Number.parseInt(inputs.target_days) || 0;
    }
    if (days <= 0) return { daysNeeded: 0, dailyXPNeeded: 0 };
    const dailyXPNeeded = Math.ceil(progress.xpRemaining / days);
    return { daysNeeded: days, dailyXPNeeded };
  };

  // Calculate derived state once
  const progress = calculateLevelProgress();
  const dailyReq = calculateDailyRequirements();
  const timeToTarget = calculateTimeToTarget();

  return {
    inputs,
    updateInput,
    handleNumberInput,
    progress,
    dailyReq,
    timeToTarget,
  };
}