import { useState, useRef } from 'react'; // Removed useEffect
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  Pressable,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LuckyEggCard from '@/components/common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import ResultCard from '@/components/common/ResultCard';
import CalculatorHeading from '@/components/common/CalculatorHeading';
import Numpad from '@/components/common/Numpad';
import { useAnimatedNumpad } from '@/hooks/useAnimatedNumpad';
import { CatchingInputs } from '@/types/xp-calculator';

// Create an animated version of the ScrollView component
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface CatchXPCalculatorProps {
  onBack: () => void;
}

// Type definition remains the same
type ActiveInputField =
  | 'normal_catches'
  | 'new_pokemon_catches'
  | 'excellent_throws'
  | 'curve_balls'
  | 'first_throws'
  | 'great_throws'
  | 'nice_throws'
  | null;

export default function CatchXPCalculator({ onBack }: CatchXPCalculatorProps) {
  // --- State Management ---
  // This state is specific to this component and stays
  const [inputs, setInputs] = useState<CatchingInputs>({
    normal_catches: '',
    new_pokemon_catches: '',
    excellent_throws: '',
    curve_balls: '',
    first_throws: '',
    great_throws: '',
    nice_throws: ''
  });
  
  const [luckyEgg, setLuckyEgg] = useState(false);

  // --- State and animation logic for numpad is now GONE ---
  // const [activeInput, setActiveInput] = useState<ActiveInputField>(null);
  // const [numpadHeight, setNumpadHeight] = useState(0);
  // const numpadTranslateY = useSharedValue(0);
  // const paddingBottom = useSharedValue(32);

  // --- Refs ---
  // These are still needed to pass to the hook
  const normalCatchesRef = useRef<TextInput>(null);
  const newPokemonCatchesRef = useRef<TextInput>(null);
  const excellentThrowsRef = useRef<TextInput>(null);
  const curveBallsRef = useRef<TextInput>(null);
  const firstThrowsRef = useRef<TextInput>(null);
  const greatThrowsRef = useRef<TextInput>(null);
  const niceThrowsRef = useRef<TextInput>(null);

  // This map is still needed to pass to the hook
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    normal_catches: normalCatchesRef,
    new_pokemon_catches: newPokemonCatchesRef,
    excellent_throws: excellentThrowsRef,
    curve_balls: curveBallsRef,
    first_throws: firstThrowsRef,
    great_throws: greatThrowsRef,
    nice_throws: niceThrowsRef,
  };

  // --- HOOK INTEGRATION ---
  // Call the hook here, passing in the refs
  // We get back all the state and styles we need
  const { activeInput, setActiveInput, animatedNumpadStyle, animatedPaddingStyle, onNumpadLayout } =
    useAnimatedNumpad(inputRefs);

  // --- Hardware Back Button Handler is GONE (it's in the hook) ---
  // --- Animation Logic useEffect is GONE (it's in the hook) ---

  // --- Helper Functions (Component-specific) ---
  // All this business logic stays
  const updateInput = (field: keyof CatchingInputs | 'lucky_egg', value: string | boolean) => {
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

  const handleNumberInput = (
    field: Exclude<ActiveInputField, null>, // Use the type
    value: string
  ) => {
    // ... (Your existing complex logic for handleNumberInput)
    // No changes needed inside this function
    if (value === '' || /^\d+$/.test(value)) {
      const normal_catches = parseInt(inputs.normal_catches) || 0;
      const curve_balls = parseInt(inputs.curve_balls) || 0;
      const first_throws = parseInt(inputs.first_throws) || 0;
      const excellent_throws = parseInt(inputs.excellent_throws) || 0;
      const great_throws = parseInt(inputs.great_throws) || 0;
      const nice_throws = parseInt(inputs.nice_throws) || 0;
      const new_pokemon_catches = parseInt(inputs.new_pokemon_catches) || 0;
      const int_value = parseInt(value) || 0;

      if (int_value > 10000000) {
        value = '10000000';
      }

      if (field === 'normal_catches') {
        if (int_value < curve_balls) updateInput('curve_balls', value);
        if (int_value < first_throws) updateInput('first_throws', value);
        if (int_value < new_pokemon_catches) updateInput('new_pokemon_catches', value);
        if (int_value < excellent_throws) updateInput('excellent_throws', value);
        if (int_value < great_throws) updateInput('great_throws', value);
        if (int_value < nice_throws) updateInput('nice_throws', value);
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
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      } else if (field === 'first_throws') {
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      } else if (field === 'new_pokemon_catches') {
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      } else if (field === 'nice_throws') {
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      } else if (field === 'great_throws') {
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      } else if (field === 'excellent_throws') {
        if (int_value > normal_catches) updateInput(field, normal_catches.toString());
        else updateInput(field, int_value.toString());
      }

      /** -------------- Why are we using int_value.toString() instead of value? --------------
       * So, we know that user cannot input anything in any fields if normal_catches is empty. 
       * But if still, user tries to add any input to anything other than normal_catches, we will see the value 0 on screen
       * Now, if we change the normal_catches to any value, and then we try to update the other field, it it already contains 0
       * it will be like 054, 032, etc. That is it will have that 0 in the front, this is because value is a string and it treats 032 and 32 as different
       * To prevent that, we are using int_value.toString() instead of value, so if user enters anything after 0, like 45, 32, the variable
       * value will become 045, 032, then we convert it to int_value which becomes 45, 32 and then we convert this int value to string
       * and update the input field. This way, we prevent the 0 from being added in front of the number
       */
    }
  };

  // This "glue" function also stays
  const handleNumpadKeyPress = (key: string) => {
    if (!activeInput) return;

    // Cast activeInput to the correct type for handleNumberInput
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
    // ... (Your existing calculation logic)
    // No changes needed
    let totalXP = 0;
    const normalCatches = Number.parseInt(inputs.normal_catches) || 0;
    const newPokemonCatches = Number.parseInt(inputs.new_pokemon_catches) || 0;
    const excellentThrows = Number.parseInt(inputs.excellent_throws) || 0;
    const curveBalls = Number.parseInt(inputs.curve_balls) || 0;
    const firstThrows = Number.parseInt(inputs.first_throws) || 0;
    const greatThrows = Number.parseInt(inputs.great_throws) || 0;
    const niceThrows = Number.parseInt(inputs.nice_throws) || 0;

    totalXP += normalCatches * XP_MULTIPLIERS.catching.normal;
    totalXP += newPokemonCatches * XP_MULTIPLIERS.catching.new_pokemon;
    totalXP += excellentThrows * XP_MULTIPLIERS.catching.excellent_throw;
    totalXP += curveBalls * XP_MULTIPLIERS.catching.curve_ball;
    totalXP += firstThrows * XP_MULTIPLIERS.catching.first_throw;
    totalXP += greatThrows * XP_MULTIPLIERS.catching.great_throw;
    totalXP += niceThrows * XP_MULTIPLIERS.catching.nice_throw;

    if (luckyEgg) {
      totalXP *= 2;
    }
    return totalXP;
  };

  const totalXP = calculateTotalXP();

  // --- Theme & Styles (Stays) ---
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';
  const placeholderTextColor = isDark ? '#555' : '#9ca3af';

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

  // --- Animated style definitions are GONE (they come from the hook) ---

  // --- JSX Render ---
  return (
    <View className={`flex-1 ${bg}`}>
      {/* 1. Header (No change) */}
      <CalculatorHeading
        title="Catch XP Calculator"
        description="Calculate XP from catching Pokemon"
        onBack={onBack}
      />

      {/* 2. Scrollable Content Area */}
      <AnimatedScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Pressable wrapper logic is simplified */}
        <Pressable
          onPress={() => {
            // Use activeInput and setActiveInput from the hook
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

          {/* Input Fields Card (TextInputs are updated) */}
          <Card className={`${cardBg} ${cardBorderColor}`}>
            <CardHeader className="pb-4">
              {/* ... (Header content, no change) ... */}
              <CardTitle>
                <View className="flex-row items-center gap-2">
                  <Calculator color="#ef4444" className="h-5 w-5" />
                  <Text className={`text-lg font-semibold ${textPrimary}`}>
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
                  ref={normalCatchesRef}
                  value={inputs.normal_catches}
                  // Use activeInput from hook
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'normal_catches' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  // Use setActiveInput from hook
                  onFocus={() => setActiveInput('normal_catches')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.normal.toLocaleString()} XP each
                </Text>
              </View>

              {/* New Pokémon Catches */}
              <View className="gap-2">
                <Label nativeID="new_pokemon_catches">New Pokémon Catches</Label>
                <TextInput
                  ref={newPokemonCatchesRef}
                  value={inputs.new_pokemon_catches}
                  // Use activeInput from hook
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'new_pokemon_catches' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  // Use setActiveInput from hook
                  onFocus={() => setActiveInput('new_pokemon_catches')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.new_pokemon.toLocaleString()} XP each
                </Text>
              </View>

              {/* Excellent Throws */}
              <View className="gap-2">
                <Label nativeID="excellent_throws">Excellent Throws</Label>
                <TextInput
                  ref={excellentThrowsRef}
                  value={inputs.excellent_throws}
                  // Use activeInput from hook
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'excellent_throws' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  // Use setActiveInput from hook
                  onFocus={() => setActiveInput('excellent_throws')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.excellent_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* ... (Rest of the TextInputs: great_throws, nice_throws, curve_balls, first_throws) ... */}
              {/* Apply the same pattern as above: */}

              {/* Great Throws */}
              <View className="gap-2">
                <Label nativeID="great_throws">Great Throws</Label>
                <TextInput
                  ref={greatThrowsRef}
                  value={inputs.great_throws}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'great_throws' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('great_throws')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.great_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* Nice Throws */}
              <View className="gap-2">
                <Label nativeID="nice_throws">Nice Throws</Label>
                <TextInput
                  ref={niceThrowsRef}
                  value={inputs.nice_throws}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'nice_throws' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('nice_throws')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.nice_throw.toLocaleString()} XP each
                </Text>
              </View>

              {/* Curve Balls */}
              <View className="gap-2">
                <Label nativeID="curve_balls">Curve Balls</Label>
                <TextInput
                  ref={curveBallsRef}
                  value={inputs.curve_balls}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'curve_balls' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('curve_balls')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.curve_ball.toLocaleString()} XP each
                </Text>
              </View>

              {/* First Throws */}
              <View className="gap-2">
                <Label nativeID="first_throws">First Throws</Label>
                <TextInput
                  ref={firstThrowsRef}
                  value={inputs.first_throws}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'first_throws' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor={placeholderTextColor}
                  showSoftInputOnFocus={false}
                  onFocus={() => setActiveInput('first_throws')}
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${textSecondary}`}>
                  +{XP_MULTIPLIERS.catching.first_throw.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card (No change) */}
          <ResultCard totalXP={totalXP} luckEggStatus={luckyEgg} />

          {/* 3. The Animated Spacer View */}
          {/* Use the animated style from the hook */}
          <Animated.View style={animatedPaddingStyle} />
        </Pressable>
      </AnimatedScrollView>

      {/* 4. The Numpad Component */}
      <Animated.View
        // Use the animated style from the hook
        style={animatedNumpadStyle}
        className={`absolute bottom-0 left-0 right-0 border-t ${borderColor} ${bg}`}
        onStartShouldSetResponder={() => true}
        // Use the layout handler from the hook
        onLayout={onNumpadLayout}>
        <Numpad onKeyPress={handleNumpadKeyPress} theme={theme} />
      </Animated.View>
    </View>
  );
}
