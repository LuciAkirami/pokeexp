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
import ResultCard from '@/components/common/ResultCard';
import CalculatorHeading from '@/components/common/CalculatorHeading';

// --- Import your new hook and Numpad ---
import { useAnimatedNumpad } from '@/hooks/useAnimatedNumpad'; // Adjust path as needed
import Numpad from '@/components/common/Numpad'; // Adjust path as needed
import { HatchingInputs } from '@/types/xp-calculator';
import { XP_MULTIPLIERS } from '@/types/xp-constants';

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface HatchingXPCalculatorProps {
  onBack: () => void;
}

// --- Define ActiveInputField type ---
type ActiveInputField =
  | 'km_2_eggs'
  | 'km_5_eggs'
  | 'km_7_eggs'
  | 'km_10_eggs'
  | 'km_12_eggs'
  | null;

export default function HatchingXPCalculator({ onBack }: HatchingXPCalculatorProps) {
  // --- Component State (Stays) ---
  const [inputs, setInputs] = useState<HatchingInputs>({
    km_2_eggs: '',
    km_5_eggs: '',
    km_7_eggs: '',
    km_10_eggs: '',
    km_12_eggs: '',
  });

  const [luckyEgg, setLuckyEgg] = useState<boolean>(false);

  // --- Refs (Added) ---
  const twoKmRef = useRef<TextInput>(null);
  const fiveKmRef = useRef<TextInput>(null);
  const sevenKmRef = useRef<TextInput>(null);
  const tenKmRef = useRef<TextInput>(null);
  const twelveKmRef = useRef<TextInput>(null);

  // --- Ref Map (Added) ---
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    km_2_eggs: twoKmRef,
    km_5_eggs: fiveKmRef,
    km_7_eggs: sevenKmRef,
    km_10_eggs: tenKmRef,
    km_12_eggs: twelveKmRef,
  };

  // --- Hook Integration (Added) ---
  // All animation logic is now handled by the hook
  const { activeInput, setActiveInput, animatedNumpadStyle, animatedPaddingStyle, onNumpadLayout } =
    useAnimatedNumpad(inputRefs);

  // --- Business Logic (Stays) ---
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const km_2_eggs = Number.parseInt(inputs.km_2_eggs) || 0;
    const km_5_eggs = Number.parseInt(inputs.km_5_eggs) || 0;
    const km_7_eggs = Number.parseInt(inputs.km_7_eggs) || 0;
    const km_10_eggs = Number.parseInt(inputs.km_10_eggs) || 0;
    const km_12_eggs = Number.parseInt(inputs.km_12_eggs) || 0;

    totalXP += km_2_eggs * XP_MULTIPLIERS.hatching.km_2;
    totalXP += km_5_eggs * XP_MULTIPLIERS.hatching.km_5;
    totalXP += km_7_eggs * XP_MULTIPLIERS.hatching.km_7;
    totalXP += km_10_eggs * XP_MULTIPLIERS.hatching.km_10;
    totalXP += km_12_eggs * XP_MULTIPLIERS.hatching.km_12;

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

  const updateInput = (field: keyof HatchingInputs | 'lucky_egg', value: string | boolean) => {
    // If lucky egg is clicked, toggle the lucky egg state
    if (field === 'lucky_egg') {
      setLuckyEgg((prev) => !prev);
      return;
    }

    setInputs((prev) => ({
      ...prev,
      [field]: value,
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
    primaryColor: '#ef4444', // Your app's primary color
  };

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header (No change) */}
      <CalculatorHeading
        title="Hatching XP Calculator"
        description="Calculate XP from Hatching Eggs"
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
                    Egg Hatching Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* --- Updated all TextInputs --- */}

              {/* 2km Eggs */}
              <View className="gap-2">
                <Label nativeID="km_2_eggs">2km Eggs</Label>
                <TextInput
                  ref={twoKmRef}
                  value={inputs.km_2_eggs}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'km_2_eggs' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('km_2_eggs')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.hatching.km_2.toLocaleString()} XP each
                </Text>
              </View>

              {/* 5km Eggs */}
              <View className="gap-2">
                <Label nativeID="km_5_eggs">5km Eggs</Label>
                <TextInput
                  ref={fiveKmRef}
                  value={inputs.km_5_eggs}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'km_5_eggs' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('km_5_eggs')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.hatching.km_5.toLocaleString()} XP each
                </Text>
              </View>

              {/* 7km Eggs */}
              <View className="gap-2">
                <Label nativeID="km_7_eggs">7km Eggs</Label>
                <TextInput
                  ref={sevenKmRef}
                  value={inputs.km_7_eggs}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'km_7_eggs' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('km_7_eggs')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.hatching.km_7.toLocaleString()} XP each
                </Text>
              </View>

              {/* 10km Eggs */}
              <View className="gap-2">
                <Label nativeID="km_10_eggs">10km Eggs</Label>
                <TextInput
                  ref={tenKmRef}
                  value={inputs.km_10_eggs}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'km_10_eggs' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('km_10_eggs')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.hatching.km_10.toLocaleString()} XP each
                </Text>
              </View>

              {/* 12km Eggs */}
              <View className="gap-2">
                <Label nativeID="km_12_eggs">12km Eggs</Label>
                <TextInput
                  ref={twelveKmRef}
                  value={inputs.km_12_eggs}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'km_12_eggs' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('km_12_eggs')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.hatching.km_12.toLocaleString()} XP each
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