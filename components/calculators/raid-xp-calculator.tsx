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
import { RaidInputs } from '@/types/xp-calculator';

// --- Import your new hook and Numpad ---
import { useAnimatedNumpad } from '@/hooks/useAnimatedNumpad'; // Adjust path as needed
import Numpad from '@/components/common/Numpad'; // Adjust path as needed

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface RaidXPCalculatorProps {
  onBack: () => void;
}

// --- Define ActiveInputField type ---
type ActiveInputField =
  | 'star_1_raids'
  | 'star_3_raids'
  | 'star_5_raids'
  | 'mega_raids'
  | 'shadow_raids'
  | null;

export default function RaidXPCalculator({ onBack }: RaidXPCalculatorProps) {
  // --- Component State (Stays) ---
  const [inputs, setInputs] = useState<RaidInputs>({
    star_1_raids: '',
    star_3_raids: '',
    star_5_raids: '',
    mega_raids: '',
    shadow_raids: '',
  });

  const [luckyEgg, setLuckyEgg] = useState<boolean>(false);

  // --- Refs (Added) ---
  const star1Ref = useRef<TextInput>(null);
  const star3Ref = useRef<TextInput>(null);
  const star5Ref = useRef<TextInput>(null);
  const megaRef = useRef<TextInput>(null);
  const shadowRef = useRef<TextInput>(null);

  // --- Ref Map (Added) ---
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    star_1_raids: star1Ref,
    star_3_raids: star3Ref,
    star_5_raids: star5Ref,
    mega_raids: megaRef,
    shadow_raids: shadowRef,
  };

  // --- Hook Integration (Added) ---
  const { activeInput, setActiveInput, animatedNumpadStyle, animatedPaddingStyle, onNumpadLayout } =
    useAnimatedNumpad(inputRefs);

  // --- Business Logic (Stays) ---
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const oneStarRaids = Number.parseInt(inputs.star_1_raids) || 0;
    const threeStarRaids = Number.parseInt(inputs.star_3_raids) || 0;
    const fiveStarRaids = Number.parseInt(inputs.star_5_raids) || 0;
    const megaRaids = Number.parseInt(inputs.mega_raids) || 0;
    const shadowRaids = Number.parseInt(inputs.shadow_raids) || 0;

    totalXP += oneStarRaids * XP_MULTIPLIERS.raids.star_1;
    totalXP += threeStarRaids * XP_MULTIPLIERS.raids.star_3;
    totalXP += fiveStarRaids * XP_MULTIPLIERS.raids.star_5;
    totalXP += megaRaids * XP_MULTIPLIERS.raids.mega;
    totalXP += shadowRaids * XP_MULTIPLIERS.raids.shadow;

    if (luckyEgg) {
      totalXP *= 2;
    }
    return totalXP;
  };

  const handleNumberInput = (
    field: Exclude<ActiveInputField, null>, // Use the new type
    value: string
  ) => {
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      if (int_value > 100000) {
        value = '100000';
      }
      updateInput(field, value);
    }
  };

  // Logic for lucky_egg is preserved
  const updateInput = (field: keyof RaidInputs | 'lucky_egg', value: string | boolean) => {
    if (field === 'lucky_egg') {
      setLuckyEgg((prev) => !prev);
      return;
    }

    setInputs((prev) => ({
      ...prev,
      [field as keyof RaidInputs]: value, // Safe assertion
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
        title="Raid XP Calculator"
        description="Calculate XP from Raid Battles"
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
                  <Text className="text-lg font-semibold text-foreground">Raid Activities</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* --- Updated all TextInputs --- */}

              {/* 1-Star Raids */}
              <View className="gap-2">
                <Label nativeID="star_1_raids">1-Star Raids</Label>
                <TextInput
                  ref={star1Ref}
                  value={inputs.star_1_raids}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_1_raids' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_1_raids')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_1.toLocaleString()} XP each
                </Text>
              </View>

              {/* 3-Star Raids */}
              <View className="gap-2">
                <Label nativeID="star_3_raids">3-Star Raids</Label>
                <TextInput
                  ref={star3Ref}
                  value={inputs.star_3_raids}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_3_raids' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_3_raids')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_3.toLocaleString()} XP each
                </Text>
              </View>

              {/* 5-Star Raids */}
              <View className="gap-2">
                <Label nativeID="star_5_raids">5-Star Raids</Label>
                <TextInput
                  ref={star5Ref}
                  value={inputs.star_5_raids}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'star_5_raids' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('star_5_raids')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.star_5.toLocaleString()} XP each
                </Text>
              </View>

              {/* Mega Raids */}
              <View className="gap-2">
                <Label nativeID="mega_raids">Mega Raids</Label>
                <TextInput
                  ref={megaRef}
                  value={inputs.mega_raids}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'mega_raids' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('mega_raids')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.mega.toLocaleString()} XP each
                </Text>
              </View>

              {/* Shadow Raids */}
              <View className="gap-2">
                <Label nativeID="shadow_raids">Shadow Raids</Label>
                <TextInput
                  ref={shadowRef}
                  value={inputs.shadow_raids}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'shadow_raids' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('shadow_raids')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.raids.shadow.toLocaleString()} XP each
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
