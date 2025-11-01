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
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import ResultCard from '@/components/common/ResultCard';
import { cn } from '@/lib/utils';
import CalculatorHeading from '@/components/common/CalculatorHeading';

interface HatchingInputs {
  two_km_eggs: string;
  five_km_eggs: string;
  seven_km_eggs: string;
  ten_km_eggs: string;
  twelve_km_eggs: string;
  lucky_egg: boolean;
}

interface HatchingXP {
  two_km: number;
  five_km: number;
  seven_km: number;
  ten_km: number;
  twelve_km: number;
}

const hatchingXP: HatchingXP = {
  two_km: 500,
  five_km: 1000,
  seven_km: 1000,
  ten_km: 2000,
  twelve_km: 4000,
};

interface HatchingXPCalculatorProps {
  onBack: () => void;
}

export default function HatchingXPCalculator({ onBack }: HatchingXPCalculatorProps) {
  const [inputs, setInputs] = useState<HatchingInputs>({
    two_km_eggs: '',
    five_km_eggs: '',
    seven_km_eggs: '',
    ten_km_eggs: '',
    twelve_km_eggs: '',
    lucky_egg: false,
  });

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const two_km_eggs = Number.parseInt(inputs.two_km_eggs) || 0;
    const five_km_eggs = Number.parseInt(inputs.five_km_eggs) || 0;
    const seven_km_eggs = Number.parseInt(inputs.seven_km_eggs) || 0;
    const ten_km_eggs = Number.parseInt(inputs.ten_km_eggs) || 0;
    const twelve_km_eggs = Number.parseInt(inputs.twelve_km_eggs) || 0;

    totalXP += two_km_eggs * hatchingXP.two_km;
    totalXP += five_km_eggs * hatchingXP.five_km;
    totalXP += seven_km_eggs * hatchingXP.seven_km;
    totalXP += ten_km_eggs * hatchingXP.ten_km;
    totalXP += twelve_km_eggs * hatchingXP.twelve_km;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const handleNumberInput = (
    field: keyof Pick<
      HatchingInputs,
      'two_km_eggs' | 'five_km_eggs' | 'seven_km_eggs' | 'ten_km_eggs' | 'twelve_km_eggs'
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

  const updateInput = (field: keyof HatchingInputs, value: string | boolean) => {
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
        title="Hatching XP Calculator"
        description="Calculate XP from Hatching Eggs"
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
                    Egg Hatching Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* 2km Eggs */}
              <View className="gap-2">
                <Label nativeID="two_km_eggs">2km Eggs</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.two_km_eggs}
                  onChangeText={(value) => handleNumberInput('two_km_eggs', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">+{hatchingXP.two_km} XP each</Text>
              </View>

              {/* 5km Eggs */}
              <View className="gap-2">
                <Label nativeID="five_km_eggs">5km Eggs</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.five_km_eggs}
                  onChangeText={(value) => handleNumberInput('five_km_eggs', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">+{hatchingXP.five_km} XP each</Text>
              </View>

              {/* 7km Eggs */}
              <View className="gap-2">
                <Label nativeID="seven_km_eggs">7km Eggs</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.seven_km_eggs}
                  onChangeText={(value) => handleNumberInput('seven_km_eggs', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{hatchingXP.seven_km} XP each
                </Text>
              </View>

              {/* 10km Eggs */}
              <View className="gap-2">
                <Label nativeID="ten_km_eggs">10km Eggs</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.ten_km_eggs}
                  onChangeText={(value) => handleNumberInput('ten_km_eggs', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">+{hatchingXP.ten_km} XP each</Text>
              </View>

              {/* 12km Eggs */}
              <View className="gap-2">
                <Label nativeID="twelve_km_eggs">12km Eggs</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.twelve_km_eggs}
                  onChangeText={(value) => handleNumberInput('twelve_km_eggs', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{hatchingXP.twelve_km} XP each
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
