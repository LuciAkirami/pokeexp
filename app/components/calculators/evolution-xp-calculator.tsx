import { useState, useEffect } from 'react'; // Import useEffect
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  Pressable, // Import Pressable
  BackHandler, // Import BackHandler
} from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import ResultCard from '../common/ResultCard';
import CalculatorHeading from '../common/CalculatorHeading';
import { Numpad } from '../common/Numpad'; // Assuming this is correct path

// --- Interfaces ---
interface EvolutionInputs {
  normal_evolutions: string;
  new_pokemon_evolutions: string;
  lucky_egg: boolean;
}

interface EvolutionXPCalculatorProps {
  onBack: () => void;
}

// Type for tracking the active input
type ActiveInputField = 'normal_evolutions' | 'new_pokemon_evolutions' | null;

export function EvolutionXPCalculator({ onBack }: EvolutionXPCalculatorProps) {
  const [inputs, setInputs] = useState<EvolutionInputs>({
    normal_evolutions: '',
    new_pokemon_evolutions: '',
    lucky_egg: false,
  });

  const [activeInput, setActiveInput] = useState<ActiveInputField>(null);

  // --- Handle Back Button ---
  useEffect(() => {
    const onBackPress = () => {
      // If the numpad is open
      if (activeInput !== null) {
        // Close the numpad
        setActiveInput(null);
        // Tell Android we've handled the back button
        return true;
      }
      // Numpad is closed, let the default action (navigate back) happen
      return false;
    };

    // Add the event listener and store the subscription
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Remove the event listener on cleanup by calling .remove()
    return () => subscription.remove();
  }, [activeInput]); // Re-run the effect if activeInput changes

  // --- (Calculation and update logic remains the same) ---
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const normalEvolutions = Number.parseInt(inputs.normal_evolutions) || 0;
    const newPokemonEvolutions = Number.parseInt(inputs.new_pokemon_evolutions) || 0;

    totalXP += normalEvolutions * XP_MULTIPLIERS.evolution.normal;
    totalXP += newPokemonEvolutions * XP_MULTIPLIERS.evolution.new_pokemon;

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

  const handleNumpadKeyPress = (key: string) => {
    if (!activeInput) return;
    const currentValue = inputs[activeInput];

    if (key === 'backspace') {
      const newValue = currentValue.slice(0, -1);
      handleNumberInput(activeInput, newValue);
    } else {
      const newValue = currentValue + key;
      handleNumberInput(activeInput, newValue);
    }
  };

  const handleNumberInput = (
    field: keyof Pick<EvolutionInputs, 'normal_evolutions' | 'new_pokemon_evolutions'>,
    value: string
  ) => {
    if (value === '' || /^\d+$/.test(value)) {
      const normal_evolutions = parseInt(inputs.normal_evolutions) || 0;
      const new_pokemon_evolutions = parseInt(inputs.new_pokemon_evolutions) || 0;
      const int_value = parseInt(value) || 0;

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
        if (int_value === 0) {
          updateInput('new_pokemon_evolutions', '');
        }
      }
    }
  };

  const totalXP = calculateTotalXP();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    cardBg: isDark ? 'bg-[#1a1a1a]' : 'bg-white',
    cardBorderColor: isDark ? 'border-[#2a2a2a]' : 'border-gray-200',
    inputBg: isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    borderColor: isDark ? 'border-[#2a2a2a]' : 'border-gray-200',
    bg: isDark ? 'bg-black' : 'bg-background',
    primaryColor: '#ef4444',
  };

  return (
    <View className={`flex-1 ${theme.bg}`}>
      <CalculatorHeading
        title="Evolution XP Calculator"
        description="Calculate XP from Evolving Pokemon"
        onBack={onBack}
      />

      {/* This Pressable handles "tapping off" the inputs to close the numpad */}
      <Pressable className="flex-1" onPress={() => setActiveInput(null)}>
        <ScrollView
          contentContainerClassName="pb-8"
          // This also helps close the numpad when you start scrolling
          // onScrollBeginDrag={() => setActiveInput(null)}
          >
          {/* This View "eats" the tap so it doesn't close the numpad
              when you tap on the content area */}
          <View className="gap-6 px-6" onStartShouldSetResponder={() => true}>
            <LuckyEggCard
              isActive={inputs.lucky_egg}
              onToggle={(checked) => updateInput('lucky_egg', checked)}
            />

            <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
              <CardHeader className="pb-4">
                <CardTitle>
                  <View className="flex-row items-center gap-2">
                    <Calculator color="#ef4444" className="h-5 w-5" />
                    <Text className={`text-lg font-semibold ${theme.textPrimary}`}>
                      Evolution Activities
                    </Text>
                  </View>
                </CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label nativeID="normal_evolutions">Normal Evolutions</Label>
                  <Pressable onPress={() => setActiveInput('normal_evolutions')}>
                    <TextInput
                      value={inputs.normal_evolutions}
                      className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${
                        activeInput === 'normal_evolutions' ? 'border-primary' : theme.borderColor
                      }`}
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                      showSoftInputOnFocus={false}
                      // Use onFocus as a fallback
                      onFocus={() => setActiveInput('normal_evolutions')}
                    />
                  </Pressable>
                  <Text className={`text-xs ${theme.textSecondary}`}>
                    +{XP_MULTIPLIERS.evolution.normal.toLocaleString()} XP each
                  </Text>
                </View>

                <View className="gap-2">
                  <Label nativeID="new_pokemon_evolutions">New Pokémon Evolutions</Label>
                  <Pressable onPress={() => setActiveInput('new_pokemon_evolutions')}>
                    <TextInput
                      value={inputs.new_pokemon_evolutions}
                      className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${
                        activeInput === 'new_pokemon_evolutions'
                          ? 'border-primary'
                          : theme.borderColor
                      }`}
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                      showSoftInputOnFocus={false}
                      onFocus={() => setActiveInput('new_pokemon_evolutions')}
                    />
                  </Pressable>
                  <Text className={`text-xs ${theme.textSecondary}`}>
                    +{XP_MULTIPLIERS.evolution.new_pokemon.toLocaleString()} XP each
                  </Text>
                </View>
              </CardContent>
            </Card>

            <ResultCard totalXP={totalXP} />
          </View>
        </ScrollView>
      </Pressable>

      {/* --- Conditional Rendering --- */}
      {/* Only render the Numpad if an input is active */}
      {activeInput !== null && (
        <View
          className="border-t border-white/10"
          // This stops a tap on the numpad from closing itself
          onStartShouldSetResponder={() => true}>
          <Numpad onKeyPress={handleNumpadKeyPress} theme={theme} />
        </View>
      )}
    </View>
  );
}
