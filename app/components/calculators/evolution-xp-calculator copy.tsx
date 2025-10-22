import { useState } from 'react';
import { View, Text, ScrollView, TextInput, useColorScheme } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import ResultCard from '../common/ResultCard';
import CalculatorHeading from '../common/CalculatorHeading';

interface EvolutionInputs {
  normal_evolutions: string;
  new_pokemon_evolutions: string;
  lucky_egg: boolean;
}

interface EvolutionXPCalculatorProps {
  onBack: () => void;
}

export function EvolutionXPCalculator({ onBack }: EvolutionXPCalculatorProps) {
  const [inputs, setInputs] = useState<EvolutionInputs>({
    normal_evolutions: '',
    new_pokemon_evolutions: '',
    lucky_egg: false,
  });

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const normalEvolutions = Number.parseInt(inputs.normal_evolutions) || 0;
    const newPokemonEvolutions = Number.parseInt(inputs.new_pokemon_evolutions) || 0;

    totalXP += normalEvolutions * XP_MULTIPLIERS.evolution.normal;
    totalXP += newPokemonEvolutions * XP_MULTIPLIERS.evolution.new_pokemon;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const updateInput = (field: keyof EvolutionInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberInput = (
    field: keyof Pick<EvolutionInputs, 'normal_evolutions' | 'new_pokemon_evolutions'>,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const normal_evolutions = parseInt(inputs.normal_evolutions) || 0;
      const new_pokemon_evolutions = parseInt(inputs.new_pokemon_evolutions) || 0;
      const int_value = parseInt(value) || 0;

      // Limit to 1 Million (from web version)
      if (int_value > 1000000) {
        value = '1000000';
      }

      if (field === 'new_pokemon_evolutions') {
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
        // if normal_evolutions is 0 then set new_pokemon_evolutions to 0
        if (int_value === 0) {
          updateInput('new_pokemon_evolutions', '');
        }
      }
    }
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

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header */}
      <CalculatorHeading
        title="Evolution XP Calculator"
        description="Calculate XP from Evolving Pokemon"
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
                  <Text className={`text-lg font-semibold ${textPrimary}`}>
                    Evolution Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Normal Evolutions */}
              <View className="gap-2">
                <Label nativeID="normal_evolutions">Normal Evolutions</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.normal_evolutions}
                  onChangeText={(value) => handleNumberInput('normal_evolutions', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.evolution.normal.toLocaleString()} XP each
                </Text>
              </View>

              {/* New Pokémon Evolutions */}
              <View className="gap-2">
                <Label nativeID="new_pokemon_evolutions">New Pokémon Evolutions</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.new_pokemon_evolutions}
                  onChangeText={(value) => handleNumberInput('new_pokemon_evolutions', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.evolution.new_pokemon.toLocaleString()} XP each
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
