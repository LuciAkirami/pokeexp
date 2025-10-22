import { useState } from 'react';
import { View, Text, ScrollView, TextInput, useColorScheme } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg'; // Adjusted path
import { XP_MULTIPLIERS } from '@/types/xp-constants'; // Using from your reference
import ResultCard from '../common/ResultCard'; // Using from your reference
import CalculatorHeading from '../common/CalculatorHeading'; // Using from your reference

interface CatchingInputs {
  normal_catches: string;
  new_pokemon_catches: string;
  excellent_throws: string;
  curve_balls: string;
  first_throws: string;
  great_throws: string;
  nice_throws: string;
  lucky_egg: boolean;
}

interface CatchXPCalculatorProps {
  onBack: () => void;
}

export function CatchXPCalculator({ onBack }: CatchXPCalculatorProps) {
  const [inputs, setInputs] = useState<CatchingInputs>({
    normal_catches: '',
    new_pokemon_catches: '',
    excellent_throws: '',
    curve_balls: '',
    first_throws: '',
    great_throws: '',
    nice_throws: '',
    lucky_egg: false,
  });

  const updateInput = (field: keyof CatchingInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // This complex logic is preserved from your web version
  const handleNumberInput = (
    field: keyof Pick<
      CatchingInputs,
      | 'normal_catches'
      | 'new_pokemon_catches'
      | 'excellent_throws'
      | 'curve_balls'
      | 'first_throws'
      | 'great_throws'
      | 'nice_throws'
    >,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const normal_catches = parseInt(inputs.normal_catches) || 0;
      const curve_balls = parseInt(inputs.curve_balls) || 0;
      const first_throws = parseInt(inputs.first_throws) || 0;
      const excellent_throws = parseInt(inputs.excellent_throws) || 0;
      const great_throws = parseInt(inputs.great_throws) || 0;
      const nice_throws = parseInt(inputs.nice_throws) || 0;
      const new_pokemon_catches = parseInt(inputs.new_pokemon_catches) || 0;
      const int_value = parseInt(value) || 0;

      // Cap to 10M (from your web version)
      if (int_value > 10000000) {
        value = '10000000';
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
    }
  };

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const normalCatches = Number.parseInt(inputs.normal_catches) || 0;
    const newPokemonCatches = Number.parseInt(inputs.new_pokemon_catches) || 0;
    const excellentThrows = Number.parseInt(inputs.excellent_throws) || 0;
    const curveBalls = Number.parseInt(inputs.curve_balls) || 0;
    const firstThrows = Number.parseInt(inputs.first_throws) || 0;
    const greatThrows = Number.parseInt(inputs.great_throws) || 0;
    const niceThrows = Number.parseInt(inputs.nice_throws) || 0;

    // Using XP_MULTIPLIERS from your reference file
    totalXP += normalCatches * XP_MULTIPLIERS.catching.normal;
    totalXP += newPokemonCatches * XP_MULTIPLIERS.catching.new_pokemon;
    totalXP += excellentThrows * XP_MULTIPLIERS.catching.excellent_throw;
    totalXP += curveBalls * XP_MULTIPLIERS.catching.curve_ball;
    totalXP += firstThrows * XP_MULTIPLIERS.catching.first_throw;
    totalXP += greatThrows * XP_MULTIPLIERS.catching.great_throw;
    totalXP += niceThrows * XP_MULTIPLIERS.catching.nice_throw;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const totalXP = calculateTotalXP();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Styles from your reference file
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';
  const placeholderTextColor = isDark ? '#555' : '#9ca3af';

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header */}
      <CalculatorHeading
        title="Catch XP Calculator"
        description="Calculate XP from catching Pokemon"
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
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <Calculator color="#ef4444" className="h-5 w-5" />
                  <Text
                    className={`text-lg font-semibold ${textPrimary}`}
                    // Use textPrimary for foreground
                  >
                    Catching Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Normal Catches */}
              <View className="gap-2">
                <Label nativeID="normal_catches">Normal Catches</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.normal_catches}
                  onChangeText={(value) => handleNumberInput('normal_catches', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.normal.toLocaleString()} XP each
                </Text>
              </View>

              {/* New Pokémon Catches */}
              <View className="gap-2">
                <Label nativeID="new_pokemon_catches">New Pokémon Catches</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.new_pokemon_catches}
                  onChangeText={(value) => handleNumberInput('new_pokemon_catches', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.new_pokemon.toLocaleString()} XP each
                </Text>
              </View>

              {/* Excellent Throws */}
              <View className="gap-2">
                <Label nativeID="excellent_throws">Excellent Throws</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.excellent_throws}
                  onChangeText={(value) => handleNumberInput('excellent_throws', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.excellent_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* Great Throws */}
              <View className="gap-2">
                <Label nativeID="great_throws">Great Throws</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.great_throws}
                  onChangeText={(value) => handleNumberInput('great_throws', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.great_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* Nice Throws */}
              <View className="gap-2">
                <Label nativeID="nice_throws">Nice Throws</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.nice_throws}
                  onChangeText={(value) => handleNumberInput('nice_throws', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.nice_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* Curve Balls */}
              <View className="gap-2">
                <Label nativeID="curve_balls">Curve Balls</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.curve_balls}
                  onChangeText={(value) => handleNumberInput('curve_balls', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.curve_ball.toLocaleString()} XP each
                </Text>
              </View>

              {/* First Throws */}
              <View className="gap-2">
                <Label nativeID="first_throws">First Throws</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.first_throws}
                  onChangeText={(value) => handleNumberInput('first_throws', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.first_throw.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card */}
          <ResultCard totalXP={totalXP} />
        </View>
      </ScrollView>
    </View>
  );
}
