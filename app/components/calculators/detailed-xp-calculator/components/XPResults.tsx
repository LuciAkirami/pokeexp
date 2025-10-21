import { View, Text } from 'react-native';
import { Calculator, TrendingUp, Zap } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { useDetailedXPCalculator } from '../useDetailedXPCalculator'; // Import type

// Define theme props
type ThemeProps = {
  cardBg: string;
  cardBorderColor: string;
  inputBg: string;
  textPrimary: string;
  textSecondary: string;
  primaryColor: string;
};

// Get the return type of the hook for 'progress' prop
type ProgressProp = ReturnType<typeof useDetailedXPCalculator>["progress"];

interface XPResultsProps {
  progress: ProgressProp;
  luckyEggActive: boolean;
  theme: ThemeProps;
}

export function XPResults({ progress, luckyEggActive, theme }: XPResultsProps) {
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
                <Text className={`text-lg font-semibold text-primary`}>
                  {value.toLocaleString()}
                </Text>
              </View>
            ))}
          <View className={`mb-4 w-[48%] rounded-lg p-3 ${theme.inputBg} items-center`}>
            <Text className={`text-sm capitalize ${theme.textSecondary}`}>Total XP</Text>
            <Text className={`text-lg font-semibold text-primary`}>
              {progress.categoryXP.total.toLocaleString()}
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* Level Progress Results */}
      <Card className={`${theme.cardBg} ${theme.cardBorderColor} border-primary/40 bg-primary/10`}>
        <CardHeader>
          <CardTitle className="flex-row items-center gap-2">
            <TrendingUp color={theme.primaryColor} size={20} />
            <Text className={`text-lg font-semibold ${theme.textPrimary}`}>Progress Results</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row justify-around">
            <View className="items-center gap-2">
              <Text className={`text-sm ${theme.textSecondary}`}>You will reach:</Text>
              <Text className={`text-2xl font-bold text-primary`}>
                Level {progress.reachedLevel}
              </Text>
            </View>
            <View className="items-center gap-2">
              <Text className={`text-sm ${theme.textSecondary}`}>Target reached:</Text>
              <Text
                className={`text-2xl font-bold ${
                  progress.targetReached ? 'text-green-500' : 'text-orange-500'
                }`}>
                {progress.targetReached ? 'Yes!' : 'No'}
              </Text>
            </View>
          </View>

          {!progress.targetReached && (
            <View className="gap-4 border-t border-white/10 pt-4">
              {/* ... Analysis Text would go here ... */}
            </View>
          )}

          {luckyEggActive && (
            <View
              className={`flex-row items-center gap-2 rounded-lg border border-yellow-500/20 p-4 ${theme.inputBg}`}>
              <Zap size={16} color="gold" />
              <Text className="font-medium text-yellow-500">Lucky Egg Active!</Text>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
}
