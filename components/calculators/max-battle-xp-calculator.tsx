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
import { MaxBattleInputs } from '@/types/xp-calculator';

// --- Import your new hook and Numpad ---
import { useAnimatedNumpad } from '@/hooks/useAnimatedNumpad'; // Adjust path as needed
import Numpad from '@/components/common/Numpad'; // Adjust path as needed

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface MaxBattleXPCalculatorProps {
  onBack: () => void;
}

// --- Define ActiveInputField type ---
type ActiveInputField =
  | 'star_1_battles'
  | 'star_2_battles'
  | 'star_3_battles'
  | 'star_4_battles'
  | 'star_5_battles'
  | 'star_6_battles'
  | 'in_person_bonus'
  | null;

export default function MaxBattleXPCalculator({ onBack }: MaxBattleXPCalculatorProps) {
  // --- Component State (Stays) ---
  const [inputs, setInputs] = useState<MaxBattleInputs>({
    star_1_battles: '',
    star_2_battles: '',
    star_3_battles: '',
    star_4_battles: '',
    star_5_battles: '',
    star_6_battles: '',
    in_person_bonus: '',
  });

  // LuckyEgg state is handled separately in this component, which is fine.
  const [luckyEgg, setLuckyEgg] = useState<boolean>(false);

  // --- Refs (Added) ---
  const star1Ref = useRef<TextInput>(null);
  const star2Ref = useRef<TextInput>(null);
  const star3Ref = useRef<TextInput>(null);
  const star4Ref = useRef<TextInput>(null);
  const star5Ref = useRef<TextInput>(null);
  const star6Ref = useRef<TextInput>(null);
  const inPersonRef = useRef<TextInput>(null);

  // --- Ref Map (Added) ---
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    star_1_battles: star1Ref,
    star_2_battles: star2Ref,
    star_3_battles: star3Ref,
    star_4_battles: star4Ref,
    star_5_battles: star5Ref,
    star_6_battles: star6Ref,
    in_person_bonus: inPersonRef,
  };

  // --- Hook Integration (Added) ---
  const { activeInput, setActiveInput, animatedNumpadStyle, animatedPaddingStyle, onNumpadLayout } =
    useAnimatedNumpad(inputRefs);

  // --- Business Logic (Stays) ---
  const handleNumberInput = (
    field: Exclude<ActiveInputField, null>, // Use the new type
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

  // This function's logic for handling lucky_egg is preserved
  const updateInput = (field: keyof MaxBattleInputs | 'lucky_egg', value: string | boolean) => {
    if (field === 'lucky_egg') {
      setLuckyEgg((prev) => !prev);
      return;
    }

    // This assertion is safe because we've handled 'lucky_egg'
    setInputs((prev) => ({
      ...prev,
      [field as keyof MaxBattleInputs]: value,
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

  // --- Calculation Logic (Stays) ---
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const oneStarBattles = Number.parseInt(inputs.star_1_battles) || 0;
    const twoStarBattles = Number.parseInt(inputs.star_2_battles) || 0;
    const threeStarBattles = Number.parseInt(inputs.star_3_battles) || 0;
    const fourStarBattles = Number.parseInt(inputs.star_4_battles) || 0;
    const fiveStarBattles = Number.parseInt(inputs.star_5_battles) || 0;
    const sixStarBattles = Number.parseInt(inputs.star_6_battles) || 0;
    const inPersonBonusBattles = Number.parseInt(inputs.in_person_bonus) || 0;

    totalXP += oneStarBattles * XP_MULTIPLIERS.maxBattle.star_1;
    totalXP += twoStarBattles * XP_MULTIPLIERS.maxBattle.star_2;
    totalXP += threeStarBattles * XP_MULTIPLIERS.maxBattle.star_3;
    totalXP += fourStarBattles * XP_MULTIPLIERS.maxBattle.star_4;
    totalXP += fiveStarBattles * XP_MULTIPLIERS.maxBattle.star_5;
    totalXP += sixStarBattles * XP_MULTIPLIERS.maxBattle.star_6;
    totalXP += inPersonBonusBattles * XP_MULTIPLIERS.maxBattle.in_person_bonus;

    // Correctly reads from the separate luckyEgg state
    if (luckyEgg) {
      totalXP *= 2;
    }

    return totalXP;
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
        title="Max Battle XP Calculator"
        description="Calculate XP from Max Battles"
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
          {/* Lucky Egg Toggle (No change, logic is preserved) */}
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
                    Max Battle Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* --- Updated all TextInputs --- */}

              {/* 1-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_1_battles">1-Star Battles</Label>
                <TextInput
                  ref={star1Ref}
                  value={inputs.star_1_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_1_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_1_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* 2-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_2_battles">2-Star Battles</Label>
                <TextInput
                  ref={star2Ref}
                  value={inputs.star_2_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_2_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_2_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_2.toLocaleString()} XP each
                </Text>
              </View>

              {/* 3-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_3_battles">3-Star Battles</Label>
                <TextInput
                  ref={star3Ref}
                  value={inputs.star_3_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_3_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_3_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_3.toLocaleString()} XP each
                </Text>
              </View>

              {/* 4-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_4_battles">4-Star Battles</Label>
                <TextInput
                  ref={star4Ref}
                  value={inputs.star_4_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_4_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_4_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_4.toLocaleString()} XP each
                </Text>
              </View>

              {/* 5-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_5_battles">5-Star Battles</Label>
                <TextInput
                  ref={star5Ref}
                  value={inputs.star_5_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_5_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_5_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_5.toLocaleString()} XP each
                </Text>
              </View>

              {/* 6-Star Battles */}
              <View className="gap-2">
                <Label nativeID="star_6_battles">6-Star Battles</Label>
                <TextInput
                  ref={star6Ref}
                  value={inputs.star_6_battles}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_6_battles' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_6_battles')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.star_6.toLocaleString()} XP each
                </Text>
              </View>

              {/* In-Person Bonus Battles */}
              <View className="gap-2">
                <Label nativeID="in_person_bonus">In-Person Bonus Battles</Label>
                <TextInput
                  ref={inPersonRef}
                  value={inputs.in_person_bonus}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'in_person_bonus' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('in_person_bonus')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.maxBattle.in_person_bonus.toLocaleString()} XP each
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
