import { View, Text } from 'react-native';
import {
  Calculator,
  TrendingUp,
  Zap,
  Activity, // <-- Add import
  Calendar, // <-- Add import
} from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { useDetailedXPCalculator } from '../useDetailedXPCalculator'; // Import type
import type { DetailedXPInputs } from '@/types/xp-calculator';

// Define theme props
type ThemeProps = {
  cardBg: string;
  cardBorderColor: string;
  inputBg: string;
  textPrimary: string;
  textSecondary: string;
  primaryColor: string;
  colors: {
    primary: string;
    textSecondary: string;
    // ... add other colors
  };
};

// Get the return type of the hook for props
type ProgressProp = ReturnType<typeof useDetailedXPCalculator>['progress'];
type TimeToTargetProp = ReturnType<typeof useDetailedXPCalculator>['timeToTarget'];
type DailyReqProp = ReturnType<typeof useDetailedXPCalculator>['dailyReq'];

interface XPResultsProps {
  progress: ProgressProp;
  luckyEggActive: boolean;
  theme: ThemeProps;
  timeToTarget: TimeToTargetProp; // <-- Add prop
  dailyReq: DailyReqProp; // <-- Add prop
  inputs: DetailedXPInputs; // <-- Add prop
}

export function XPResults({
  progress,
  luckyEggActive,
  theme,
  timeToTarget, // <-- Add prop
  dailyReq, // <-- Add prop
  inputs, // <-- Add prop
}: XPResultsProps) {
  const XPTextColor = 'text-red-500'; // Or theme.primaryColor

  return (
    <View className="gap-4">
      {/* Category Breakdown */}
      <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
        <CardHeader>
          <CardTitle className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-2">
              <Calculator color={theme.primaryColor} size={20} />
              <Text className={`text-lg font-semibold ${theme.textPrimary}`}>XP Breakdown</Text>
            </View>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-row flex-wrap justify-between">
          {Object.entries(progress.categoryXP)
            .filter(([key]) => key !== 'total' && key !== 'dailyXP')
            .map(([key, value]) => (
              <View
                key={key}
                className={`mb-4 w-[48%] rounded-lg p-3 ${theme.inputBg} items-center`}>
                <Text className={`text-sm capitalize ${theme.textSecondary}`}>{key}</Text>
                <Text className={`text-lg font-semibold ${XPTextColor}`}>
                  {value.toLocaleString()}
                </Text>
              </View>
            ))}
          <View className={`mb-4 w-[48%] rounded-lg p-3 ${theme.inputBg} items-center`}>
            <Text className={`text-sm capitalize ${theme.textSecondary}`}>Total XP</Text>
            <Text className={`text-lg font-semibold ${XPTextColor}`}>
              {progress.categoryXP.total.toLocaleString()}
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* Level Progress Results */}
      <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
        <CardHeader>
          <CardTitle className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-2">
              <TrendingUp color={theme.primaryColor} size={20} />
              <Text className={`text-lg font-semibold ${theme.textPrimary}`}>Level Progress Results</Text>
            </View>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex items-start gap-4">
            <View className="items-start gap-2">
              <Text className={`text-sm ${theme.textSecondary}`}>You will reach:</Text>
              <Text className={`text-2xl font-bold text-primary`}>
                Level {progress.reachedLevel}
              </Text>
            </View>
            <View className="items-start gap-2">
              <Text className={`text-sm ${theme.textSecondary}`}>Target reached:</Text>
              <Text
                className={`text-2xl font-bold ${
                  progress.targetReached ? 'text-green-500' : 'text-orange-500'
                }`}>
                {progress.targetReached ? 'Yes!' : 'No'}
              </Text>
            </View>
          </View>

          {/* --- XP Results --- */}
          {!progress.targetReached && (
            <View className="gap-4 border-t border-white/10 pt-4">
              <View className="flex items-start gap-4">
                {/* XP Still Needed */}
                <View className="flex-1 gap-2">
                  <Text className={`text-sm ${theme.textSecondary}`}>XP still needed:</Text>
                  <Text className="text-xl font-semibold text-orange-500">
                    {progress.xpRemaining.toLocaleString()} XP
                  </Text>
                </View>
                {/* Time at Current Pace */}
                <View className="flex-1 gap-2">
                  <View className="flex-row items-center gap-2">
                    <Activity size={16} color={theme.colors.textSecondary} />
                    <Text className={`text-sm ${theme.textSecondary}`}>Time at current pace:</Text>
                  </View>
                  <Text className="text-xl font-semibold text-blue-500">
                    {timeToTarget.daysToTarget === Infinity
                      ? 'Never (no daily XP)'
                      : timeToTarget.daysToTarget === 0
                        ? 'Already reached!'
                        : timeToTarget.daysToTarget === 1
                          ? '1 day'
                          : `${timeToTarget.daysToTarget} days`}
                  </Text>
                </View>
              </View>

              {/* Daily XP Needed */}
              {inputs.use_target_timeline && dailyReq.daysNeeded > 0 && (
                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <Calendar size={16} color={theme.colors.textSecondary} />
                    <Text className={`text-sm ${theme.textSecondary} flex-row items-center`}>
                      Daily XP needed for target:
                    </Text>
                  </View>
                  <Text className="text-xl font-semibold text-red-500">
                    {dailyReq.dailyXPNeeded.toLocaleString()} XP/day
                  </Text>
                </View>
              )}

              {/* Timeline Analysis */}
              <View className="gap-4">
                {/* Current Pace Analysis */}
                <View className={`rounded-lg border border-blue-500/20 p-4 ${theme.inputBg}`}>
                  <View className="mb-2 flex-row items-center gap-2">
                    <Activity size={16} color={'#3b82f6'} />
                    <Text className="font-medium text-blue-500">Current Pace Analysis</Text>
                  </View>
                  <Text className={`text-sm ${theme.textSecondary}`}>
                    {progress.categoryXP.dailyXP > 0 ? (
                      <>
                        Based on your daily activities, you're earning{' '}
                        {progress.categoryXP.dailyXP.toLocaleString()} XP per day
                        {inputs.lucky_egg && ' (with Lucky Egg)'}. At this pace, you'll reach level{' '}
                        {inputs.targetLevel} in {timeToTarget.daysToTarget} days.
                        {progress.categoryXP.friendship > 0 &&
                          ' This includes your one-time friendship XP bonus.'}
                      </>
                    ) : (
                      "You haven't entered any daily activities yet. Add some activities to see how long it will take to reach your target level."
                    )}
                  </Text>
                </View>

                {/* Target Timeline Analysis */}
                {inputs.use_target_timeline && dailyReq.daysNeeded > 0 && (
                  <View className={`rounded-lg border border-red-500/20 p-4 ${theme.inputBg}`}>
                    <View className="mb-2 flex-row items-center gap-2">
                      <Calendar size={16} color={'#ef4444'} />
                      <Text className="font-medium text-red-500">Target Timeline Analysis</Text>
                    </View>
                    <Text className={`text-sm ${theme.textSecondary}`}>
                      To reach level {inputs.targetLevel} in {dailyReq.daysNeeded} days, you need{' '}
                      {dailyReq.dailyXPNeeded.toLocaleString()} XP per day from daily activities
                      {inputs.lucky_egg && ' (with Lucky Egg active)'}.
                      {progress.categoryXP.dailyXP > 0 && (
                        <>
                          {' '}
                          Currently you're earning {progress.categoryXP.dailyXP.toLocaleString()}{' '}
                          XP/day, so you need{' '}
                          {Math.max(
                            0,
                            dailyReq.dailyXPNeeded - progress.categoryXP.dailyXP
                          ).toLocaleString()}{' '}
                          more XP per day.
                        </>
                      )}
                      {progress.categoryXP.friendship > 0 &&
                        ' Friendship XP is counted as a one-time bonus.'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* --- Lucky Egg Active --- */}

          {luckyEggActive && (
            <View
              className={`flex-row items-center gap-2 rounded-lg border border-yellow-500/20 p-4 ${theme.inputBg}`}>
              <Zap size={16} color="gold" />
              <Text className="font-medium text-yellow-500">
                Lucky Egg Active - Daily XP Doubled!
              </Text>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
}
