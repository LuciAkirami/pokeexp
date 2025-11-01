import { useState } from 'react';
import { View, Text, ScrollView, TextInput, useColorScheme } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LuckyEggCard from '@/components/common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResultCard from '@/components/common/ResultCard';
import CalculatorHeading from '@/components/common/CalculatorHeading';

interface MaxBattleInputs {
  one_star_battles: string;
  two_star_battles: string;
  three_star_battles: string;
  four_star_battles: string;
  five_star_battles: string;
  six_star_battles: string;
  in_person_bonus_battles: string;
  lucky_egg: boolean;
}

interface MaxBattleXPCalculatorProps {
  onBack: () => void;
}

export default function MaxBattleXPCalculator({ onBack }: MaxBattleXPCalculatorProps) {
  const [inputs, setInputs] = useState<MaxBattleInputs>({
    one_star_battles: '',
    two_star_battles: '',
    three_star_battles: '',
    four_star_battles: '',
    five_star_battles: '',
    six_star_battles: '',
    in_person_bonus_battles: '',
    lucky_egg: false,
  });

  const handleNumberInput = (
    field: keyof Pick<
      MaxBattleInputs,
      | 'one_star_battles'
      | 'two_star_battles'
      | 'three_star_battles'
      | 'four_star_battles'
      | 'five_star_battles'
      | 'six_star_battles'
      | 'in_person_bonus_battles'
    >,
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

  const updateInput = (field: keyof MaxBattleInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const oneStarBattles = Number.parseInt(inputs.one_star_battles) || 0;
    const twoStarBattles = Number.parseInt(inputs.two_star_battles) || 0;
    const threeStarBattles = Number.parseInt(inputs.three_star_battles) || 0;
    const fourStarBattles = Number.parseInt(inputs.four_star_battles) || 0;
    const fiveStarBattles = Number.parseInt(inputs.five_star_battles) || 0;
    const sixStarBattles = Number.parseInt(inputs.six_star_battles) || 0;
    const inPersonBonusBattles = Number.parseInt(inputs.in_person_bonus_battles) || 0;

    totalXP += oneStarBattles * XP_MULTIPLIERS.maxBattle.star_1;
    totalXP += twoStarBattles * XP_MULTIPLIERS.maxBattle.star_2;
    totalXP += threeStarBattles * XP_MULTIPLIERS.maxBattle.star_3;
    totalXP += fourStarBattles * XP_MULTIPLIERS.maxBattle.star_4;
    totalXP += fiveStarBattles * XP_MULTIPLIERS.maxBattle.star_5;
    totalXP += sixStarBattles * XP_MULTIPLIERS.maxBattle.star_6;
    totalXP += inPersonBonusBattles * XP_MULTIPLIERS.maxBattle.in_person_bonus;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
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
        title="Max Battle XP Calculator"
        description="Calculate XP from Max Battles"
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
                  <Text className="text-lg font-semibold text-foreground">Max Battle Activities</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* 1-Star Battles */}
              <View className="gap-2">
                <Label nativeID="one_star_battles">1-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.one_star_battles}
                  onChangeText={(value) => handleNumberInput('one_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* 2-Star Battles */}
              <View className="gap-2">
                <Label nativeID="two_star_battles">2-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.two_star_battles}
                  onChangeText={(value) => handleNumberInput('two_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_2.toLocaleString()} XP each
                </Text>
              </View>

              {/* 3-Star Battles */}
              <View className="gap-2">
                <Label nativeID="three_star_battles">3-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.three_star_battles}
                  onChangeText={(value) => handleNumberInput('three_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_3.toLocaleString()} XP each
                </Text>
              </View>

              {/* 4-Star Battles */}
              <View className="gap-2">
                <Label nativeID="four_star_battles">4-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.four_star_battles}
                  onChangeText={(value) => handleNumberInput('four_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_4.toLocaleString()} XP each
                </Text>
              </View>

              {/* 5-Star Battles */}
              <View className="gap-2">
                <Label nativeID="five_star_battles">5-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.five_star_battles}
                  onChangeText={(value) => handleNumberInput('five_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_5.toLocaleString()} XP each
                </Text>
              </View>

              {/* 6-Star Battles */}
              <View className="gap-2">
                <Label nativeID="six_star_battles">6-Star Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.six_star_battles}
                  onChangeText={(value) => handleNumberInput('six_star_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_6.toLocaleString()} XP each
                </Text>
              </View>

              {/* In-Person Bonus Battles */}
              <View className="gap-2">
                <Label nativeID="in_person_bonus_battles">In-Person Bonus Battles</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.in_person_bonus_battles}
                  onChangeText={(value) => handleNumberInput('in_person_bonus_battles', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.in_person_bonus.toLocaleString()} XP each
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