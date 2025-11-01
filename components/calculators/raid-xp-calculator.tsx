import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { ArrowLeft, Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LuckyEggCard from '@/components/common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import ResultCard from '@/components/common/ResultCard';
import { cn } from '@/lib/utils';
import CalculatorHeading from '@/components/common/CalculatorHeading';

interface RaidInputs {
  one_star_raids: string;
  three_star_raids: string;
  five_star_raids: string;
  mega_raids: string;
  shadow_raids: string;
  lucky_egg: boolean;
}

interface RaidXPCalculatorProps {
  onBack: () => void;
}

export default function RaidXPCalculator({ onBack }: RaidXPCalculatorProps) {
  const [inputs, setInputs] = useState<RaidInputs>({
    one_star_raids: '',
    three_star_raids: '',
    five_star_raids: '',
    mega_raids: '',
    shadow_raids: '',
    lucky_egg: false,
  });

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const oneStarRaids = Number.parseInt(inputs.one_star_raids) || 0;
    const threeStarRaids = Number.parseInt(inputs.three_star_raids) || 0;
    const fiveStarRaids = Number.parseInt(inputs.five_star_raids) || 0;
    const megaRaids = Number.parseInt(inputs.mega_raids) || 0;
    const shadowRaids = Number.parseInt(inputs.shadow_raids) || 0;

    totalXP += oneStarRaids * XP_MULTIPLIERS.raids.star_1;
    totalXP += threeStarRaids * XP_MULTIPLIERS.raids.star_3;
    totalXP += fiveStarRaids * XP_MULTIPLIERS.raids.star_5;
    totalXP += megaRaids * XP_MULTIPLIERS.raids.mega;
    totalXP += shadowRaids * XP_MULTIPLIERS.raids.shadow;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const handleNumberInput = (
    field: keyof Pick<
      RaidInputs,
      'one_star_raids' | 'three_star_raids' | 'five_star_raids' | 'mega_raids' | 'shadow_raids'
    >,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      // Limit to 100000
      if (int_value > 100000) {
        value = '100000';
      }
      updateInput(field, value);
    }
  };

  const updateInput = (field: keyof RaidInputs, value: string | boolean) => {
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
        title="Raid XP Calculator"
        description="Calculate XP from Raid Battles"
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
                  <Text className="text-lg font-semibold text-foreground">Raid Activities</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* 1-Star Raids */}
              <View className="gap-2">
                <Label nativeID="one_star_raids">1-Star Raids</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.one_star_raids}
                  onChangeText={(value) => handleNumberInput('one_star_raids', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* 3-Star Raids */}
              <View className="gap-2">
                <Label nativeID="three_star_raids">3-Star Raids</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.three_star_raids}
                  onChangeText={(value) => handleNumberInput('three_star_raids', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_3.toLocaleString()} XP each
                </Text>
              </View>

              {/* 5-Star Raids */}
              <View className="gap-2">
                <Label nativeID="five_star_raids">5-Star Raids</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.five_star_raids}
                  onChangeText={(value) => handleNumberInput('five_star_raids', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_5.toLocaleString()} XP each
                </Text>
              </View>

              {/* Mega Raids */}
              <View className="gap-2">
                <Label nativeID="mega_raids">Mega Raids</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.mega_raids}
                  onChangeText={(value) => handleNumberInput('mega_raids', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.mega.toLocaleString()} XP each
                </Text>
              </View>

              {/* Shadow Raids */}
              <View className="gap-2">
                <Label nativeID="shadow_raids">Shadow Raids</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.shadow_raids}
                  onChangeText={(value) => handleNumberInput('shadow_raids', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.shadow.toLocaleString()} XP each
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
