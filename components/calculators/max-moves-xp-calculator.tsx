import { useState, useRef } from 'react'; // Added useRef
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  Pressable, // Added Pressable
} from 'react-native';
import Animated from 'react-native-reanimated'; // Added Animated
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LuckyEggCard from '@/components/common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import ResultCard from '@/components/common/ResultCard';
import CalculatorHeading from '@/components/common/CalculatorHeading';
import { MaxMovesInputs } from '@/types/xp-calculator';

// --- Import your new hook and Numpad ---
import { useAnimatedNumpad } from '@/hooks/useAnimatedNumpad'; // Adjust path as needed
import Numpad from '@/components/common/Numpad'; // Adjust path as needed

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface MaxMovesXPCalculatorProps {
  onBack: () => void;
}

// --- Define ActiveInputField type ---
type ActiveInputField = 'level_1_moves' | 'level_2_moves' | 'level_max_moves' | null;

export default function MaxMovesXPCalculator({ onBack }: MaxMovesXPCalculatorProps) {
  // --- Component State (Stays) ---
  const [inputs, setInputs] = useState<MaxMovesInputs>({
    level_1_moves: '',
    level_2_moves: '',
    level_max_moves: '',
  });

  const [luckyEgg, setLuckyEgg] = useState<boolean>(false);

  // --- Refs (Added) ---
  const level1MovesRef = useRef<TextInput>(null);
  const level2MovesRef = useRef<TextInput>(null);
  const levelMaxMovesRef = useRef<TextInput>(null);

  // --- Ref Map (Added) ---
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    level_1_moves: level1MovesRef,
    level_2_moves: level2MovesRef,
    level_max_moves: levelMaxMovesRef,
  };

  // --- Hook Integration (Added) ---
  const { activeInput, setActiveInput, animatedNumpadStyle, animatedPaddingStyle, onNumpadLayout } =
    useAnimatedNumpad(inputRefs);

  // --- Business Logic (Stays) ---
  const handleNumberInput = (
    field: Exclude<ActiveInputField, null>, // Use the new type
    value: string
  ) => {
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
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

    if (luckyEgg) {
      totalXP *= 2;
    }
    return totalXP;
  };

  // Logic for lucky_egg is preserved
  const updateInput = (field: keyof MaxMovesInputs | 'lucky_egg', value: string | boolean) => {
    if (field === 'lucky_egg') {
      setLuckyEgg((prev) => !prev);
      return;
    }

    setInputs((prev) => ({
      ...prev,
      [field as keyof MaxMovesInputs]: value, // Safe assertion
    }));
  };

  // --- Numpad "Glue" Function (Added) ---
  const handleNumpadKeyPress = (key: string) => {
    if (!activeInput) return;

    const activeField = activeInput as Exclude<ActiveInputField, null>;
    const currentValue = inputs[activeField];

    if (key === 'backspace') {
      const newValue = currentValue.slice(0, -1);
      handleNumberInput(activeField, newValue);
    } else {
      const newValue = currentValue + key;
      handleNumberInput(activeField, newValue);
    }
  };

  // --- Theme & Styles (Stays) ---
  const totalXP = calculateTotalXP();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';
  const placeholderTextColor = '#9ca3af';

  // --- Theme Object (Added) ---
  const theme = {
    cardBg,
    cardBorderColor,
    inputBg,
    textPrimary,
    textSecondary,
    borderColor,
    bg,
    primaryColor: '#ef4444',
  };

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header (No change) */}
      <CalculatorHeading
        title="Max Moves XP Calculator"
        description="Calculate XP from Max Moves"
        onBack={onBack}
      />

      {/* --- Swapped ScrollView for AnimatedScrollView --- */}
      <AnimatedScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* --- Added Pressable Wrapper --- */}
        <Pressable
          onPress={() => {
            if (activeInput && inputRefs[activeInput as keyof typeof inputRefs]) {
              inputRefs[activeInput as keyof typeof inputRefs]?.current?.blur();
            }
            setActiveInput(null);
          }}
          className="gap-6 px-6">
          {/* Lucky Egg Toggle (No change) */}
          <LuckyEggCard
            isActive={luckyEgg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          />

          {/* Input Fields Card */}
          <Card className={`${cardBg} ${cardBorderColor}`}>
            <CardHeader className="pb-4">
              {/* ... (Card Header content, no change) ... */}
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
              {/* --- Updated all TextInputs --- */}

              {/* Level 1 Moves */}
              <View className="gap-2">
                <Label nativeID="level_1_moves">Level 1 Moves</Label>
                <TextInput
                  ref={level1MovesRef}
                  value={inputs.level_1_moves}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'level_1_moves' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('level_1_moves')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* Level 2 Moves */}
              <View className="gap-2">
                <Label nativeID="level_2_moves">Level 2 Moves</Label>
                <TextInput
                  ref={level2MovesRef}
                  value={inputs.level_2_moves}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'level_2_moves' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('level_2_moves')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_2.toLocaleString()} XP each
                </Text>
              </View>

              {/* Level Max Moves */}
              <View className="gap-2">
                <Label nativeID="level_max_moves">Level Max Moves</Label>
                <TextInput
                  ref={levelMaxMovesRef}
                  value={inputs.level_max_moves}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'level_max_moves' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('level_max_moves')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxMoves.level_max.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card (No change) */}
          <ResultCard totalXP={totalXP} luckEggStatus={luckyEgg} />

          {/* --- Added Animated Spacer --- */}
          <Animated.View style={animatedPaddingStyle} />
        </Pressable>
      </AnimatedScrollView>

      {/* --- Added Numpad Component --- */}
      <Animated.View
        style={animatedNumpadStyle}
        className={`absolute bottom-0 left-0 right-0 border-t ${borderColor} ${bg}`}
        onStartShouldSetResponder={() => true}
        onLayout={onNumpadLayout} // Use layout handler from hook
      >
        <Numpad onKeyPress={handleNumpadKeyPress} theme={theme} />
      </Animated.View>
    </View>
  );
}
