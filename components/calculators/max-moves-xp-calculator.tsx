import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LuckyEggCard from '@/components/common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResultCard from '@/components/common/ResultCard';
import CalculatorHeading from '@/components/common/CalculatorHeading';

interface MaxMovesInputs {
  level_1_moves: string;
  level_2_moves: string;
  level_max_moves: string;
  lucky_egg: boolean;
}

interface MaxMovesXPCalculatorProps {
  onBack: () => void;
}

export default function MaxMovesXPCalculator({ onBack }: MaxMovesXPCalculatorProps) {
  const [inputs, setInputs] = useState<MaxMovesInputs>({
    level_1_moves: '',
    level_2_moves: '',
    level_max_moves: '',
    lucky_egg: false,
  });

  const handleNumberInput = (
    field: keyof Pick<MaxMovesInputs, 'level_1_moves' | 'level_2_moves' | 'level_max_moves'>,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      // Limit to 10000
      if (int_value > 10000) {
        value = '10000';
      }
      updateInput(field, value);
    }
  };

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const level1Moves = Number.parseInt(inputs.level_1_moves) || 0;
    const level2Moves = Number.parseInt(inputs.level_2_moves) || 0;
    const levelMaxMoves = Number.parseInt(inputs.level_max_moves) || 0;

    totalXP += level1Moves * XP_MULTIPLIERS.maxMoves.level_1;
    totalXP += level2Moves * XP_MULTIPLIERS.maxMoves.level_2;
    totalXP += levelMaxMoves * XP_MULTIPLIERS.maxMoves.level_max;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const updateInput = (field: keyof MaxMovesInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalXP = calculateTotalXP();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header */}
      <CalculatorHeading
        title="Max Moves XP Calculator"
        description="Calculate XP from Max Moves"
        onBack={onBack}
      />

      <ScrollView contentContainerClassName="pb-8">
        {/* Calculator Content */}
        <View className="gap-6 px-6">
          {/* Lucky Egg Toggle */}
          <LuckyEggCard
            isActive={inputs.lucky_egg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          />

          {/* Input Fields Card */}
          <Card className={`${cardBg} ${cardBorderColor}`}>
            <CardHeader className="pb-4">
              <CardTitle className="">
                <View className="flex-row items-center gap-2">
                  <Calculator color="#ef4444" className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold text-foreground">
                    Max Moves Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Level 1 Moves */}
              <View className="gap-2">
                <Label nativeID="level_1_moves">Level 1 Moves</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.level_1_moves}
                  onChangeText={(value) => handleNumberInput('level_1_moves', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* Level 2 Moves */}
              <View className="gap-2">
                <Label nativeID="level_2_moves">Level 2 Moves</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.level_2_moves}
                  onChangeText={(value) => handleNumberInput('level_2_moves', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_2.toLocaleString()} XP each
                </Text>
              </View>

              {/* Level Max Moves */}
              <View className="gap-2">
                <Label nativeID="level_max_moves">Level Max Moves</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.level_max_moves}
                  onChangeText={(value) => handleNumberInput('level_max_moves', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_max.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card */}
          <ResultCard totalXP={totalXP} luckEggStatus={inputs.lucky_egg} />
        </View>
      </ScrollView>
    </View>
  );
}
