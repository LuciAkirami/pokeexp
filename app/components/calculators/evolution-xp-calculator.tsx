import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  Pressable,
  BackHandler,
} from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Calculator } from 'lucide-react-native';
// Import custom UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS } from '@/types/xp-constants';
import ResultCard from '../common/ResultCard';
import CalculatorHeading from '../common/CalculatorHeading';
import { Numpad } from '../common/Numpad';

// Create an animated version of the ScrollView component
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// --- Component Interfaces ---

// Describes the shape of the calculator's input data
interface EvolutionInputs {
  normal_evolutions: string;
  new_pokemon_evolutions: string;
  lucky_egg: boolean;
}

// Props for the main calculator component
interface EvolutionXPCalculatorProps {
  onBack: () => void; // Function to handle navigating back
}

// Type definition for tracking which input field is currently active
type ActiveInputField = 'normal_evolutions' | 'new_pokemon_evolutions' | null;

export function EvolutionXPCalculator({ onBack }: EvolutionXPCalculatorProps) {
  // --- State Management ---

  // Holds the string values from the text inputs and the lucky egg toggle state
  const [inputs, setInputs] = useState<EvolutionInputs>({
    normal_evolutions: '',
    new_pokemon_evolutions: '',
    lucky_egg: false,
  });

  // Tracks which input field is currently active to show the numpad
  // This is the main "on/off" switch for the numpad animation
  const [activeInput, setActiveInput] = useState<ActiveInputField>(null);

  // Refs to the TextInput components to allow blurring them programmatically
  const normalInputRef = useRef<TextInput>(null);
  const newPokemonInputRef = useRef<TextInput>(null);

  // Stores the measured height of the Numpad component once it renders
  // This is crucial for knowing how far to animate and pad
  const [numpadHeight, setNumpadHeight] = useState(0);

  // --- Animation Shared Values (Reanimated) ---

  // Controls the Y-translation (vertical position) of the Numpad
  // 0 = Visible, numpadHeight = Hidden (off-screen)
  const numpadTranslateY = useSharedValue(0);

  // Controls the height of the invisible spacer view at the bottom of the ScrollView
  // This "pushes" the content up when the numpad is active
  // 32 = Default padding, numpadHeight = Active padding
  const paddingBottom = useSharedValue(32);

  // A map to easily access the correct input ref based on the activeInput state
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    normal_evolutions: normalInputRef,
    new_pokemon_evolutions: newPokemonInputRef,
  };

  // --- Hardware Back Button Handler ---
  /*
   * useEffect Hook to handle the hardware back button press (Android)
   *
   * GOAL: Dismiss the custom Numpad when the user presses the hardware back button,
   * instead of navigating to the previous screen.
   *
   * DEPENDENCY: [activeInput] - This effect re-subscribes its listener
   * whenever 'activeInput' changes, ensuring 'onBackPress' always
   * has the latest state.
   */
  useEffect(() => {
    // 1. Define the event handler for the 'hardwareBackPress' event
    const onBackPress = () => {
      // Check if the numpad is currently active
      if (activeInput !== null) {
        // If an input is active, blur it (removes cursor)
        if (inputRefs[activeInput].current) {
          inputRefs[activeInput].current.blur();
        }
        // Dismiss the numpad by resetting the activeInput state
        setActiveInput(null); // This will trigger the "Animate OUT" useEffect

        // Return TRUE to tell the BackHandler that the event has been handled,
        // which PREVENTS the default action (screen navigation).
        return true;
      }

      // Return FALSE if no input is active, allowing the default back action (navigation) to proceed.
      return false;
    };

    // 2. Add the event listener when the component mounts or dependencies change
    /*
     * BackHandler.addEventListener() is used to listen for hardware back button presses.
     * It returns a subscription object that can be used to remove the listener when the component unmounts.
     */
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // 3. Return the cleanup function
    // This runs when the component unmounts or *before* the effect re-runs
    return () => {
      // Remove the event listener to prevent memory leaks
      subscription.remove();
    };
  }, [activeInput]); // Dependency array

  // --- Calculation Logic ---

  /**
   * Calculates the total XP based on the current 'inputs' state.
   */
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    // Parse string inputs to numbers, defaulting to 0 if invalid or empty
    const normalEvolutions = Number.parseInt(inputs.normal_evolutions) || 0;
    const newPokemonEvolutions = Number.parseInt(inputs.new_pokemon_evolutions) || 0;

    // Add XP for each evolution type
    totalXP += normalEvolutions * XP_MULTIPLIERS.evolution.normal;
    totalXP += newPokemonEvolutions * XP_MULTIPLIERS.evolution.new_pokemon;

    // Double the total if the Lucky Egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }
    return totalXP;
  };

  // --- Helper Functions ---

  /**
   * A generic state updater for the 'inputs' object.
   * @param field The key of the 'inputs' state to update.
   * @param value The new value for that key.
   */
  const updateInput = (field: keyof EvolutionInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handles key presses from the custom Numpad component.
   * @param key The key that was pressed (e.g., '1', '2', 'backspace').
   */
  const handleNumpadKeyPress = (key: string) => {
    // Do nothing if no input is active
    if (!activeInput) return;

    const currentValue = inputs[activeInput];

    if (key === 'backspace') {
      // Handle backspace: remove the last character
      const newValue = currentValue.slice(0, -1);
      handleNumberInput(activeInput, newValue);
    } else {
      // Handle number press: append the new digit
      const newValue = currentValue + key;
      handleNumberInput(activeInput, newValue);
    }
  };

  /**
   * Validates and sets the new value for a number input field.
   * Includes business logic (e.g., new evos <= normal evos).
   */
  const handleNumberInput = (
    field: keyof Pick<EvolutionInputs, 'normal_evolutions' | 'new_pokemon_evolutions'>,
    value: string
  ) => {
    // Allow empty strings or strings that are only digits
    if (value === '' || /^\d+$/.test(value)) {
      const normal_evolutions = parseInt(inputs.normal_evolutions) || 0;
      const new_pokemon_evolutions = parseInt(inputs.new_pokemon_evolutions) || 0;
      let int_value = parseInt(value) || 0; // Use 'let' to allow modification

      // Enforce a maximum value
      if (int_value > 1000000) {
        value = '1000000'; // Update the string value to be set
        int_value = 1000000; // Update the int value for logic checks
      }

      // Business logic: New evos cannot be more than normal evos
      if (field === 'new_pokemon_evolutions') {
        if (int_value > normal_evolutions) {
          // If new evos exceed normal, cap it at the normal evo count
          updateInput(field, normal_evolutions.toString());
        } else {
          updateInput(field, int_value.toString());
        }
      } else if (field === 'normal_evolutions') {
        // Business logic: If normal evos are reduced below new evos, reduce new evos too
        if (int_value < new_pokemon_evolutions) {
          updateInput('new_pokemon_evolutions', int_value.toString());
        }
        updateInput(field, int_value.toString());
        // If normal evos are set to 0, reset new evos
        if (int_value === 0) {
          updateInput('new_pokemon_evolutions', '');
        }
      }
    }
  };

  // Calculate the total XP on every render
  const totalXP = calculateTotalXP();

  // --- Theme & Styles ---

  // Detect the user's system color scheme (light/dark)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Define theme colors for NativeWind (Tailwind) classes
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

  // --- Animation Logic ---

  /**
   * This is the main animation conductor.
   * It triggers animations based on the `activeInput` state (numpad shown/hidden)
   * and `numpadHeight` (ensuring we know the height before animating).
   */
  useEffect(() => {
    // 1. Guard Clause: Wait until the numpad's height is measured.
    if (numpadHeight === 0) {
      return; // Do nothing if height is unknown
    }

    // 2. Animate IN (Show Numpad)
    if (activeInput !== null) {
      // Slide numpad UP to position 0 (visible)
      numpadTranslateY.value = withTiming(0, { duration: 250 });
      // Grow the spacer's height to match the numpad's height
      // +12 to account for spacing at the bottom of the result card and top of the numpad
      // If its not added, the Result Card will be attached to the top of the numpad
      paddingBottom.value = withTiming(numpadHeight + 12, { duration: 250 });
    }
    // 3. Animate OUT (Hide Numpad)
    else {
      // Slide numpad DOWN by its full height (off-screen)
      numpadTranslateY.value = withTiming(numpadHeight, { duration: 250 });
      // Shrink the spacer's height back to the default
      paddingBottom.value = withTiming(32, { duration: 250 });
    }
  }, [activeInput, numpadHeight]); // Dependencies: Re-run on change

  /**
   * Animated style for the Numpad container.
   * This style is applied to the `<Animated.View>` wrapping the `Numpad`.
   */
  const animatedNumpadStyle = useAnimatedStyle(() => {
    return {
      // Start with opacity 0 to prevent flash of content on load
      // Becomes 1 as soon as numpadHeight is measured
      opacity: numpadHeight === 0 ? 0 : 1,
      // Apply the animated vertical translation
      transform: [{ translateY: numpadTranslateY.value }],
    };
  }, [numpadHeight]); // Dependency: Re-calculate if numpadHeight changes

  /**
   * Animated style for the invisible spacer view.
   * This style is applied to the `<Animated.View>` at the end of the `AnimatedScrollView`.
   */
  const animatedPaddingStyle = useAnimatedStyle(() => {
    return {
      // Apply the animated height
      height: paddingBottom.value,
    };
  }, []); // No dependencies needed as it reads from a shared value

  // --- JSX Render ---
  return (
    <View className={`flex-1 ${theme.bg}`}>
      {/* 1. Header Component */}
      <CalculatorHeading
        title="Evolution XP Calculator"
        description="Calculate XP from Evolving Pokemon"
        onBack={onBack}
      />

      {/* 2. Scrollable Content Area */}
      <AnimatedScrollView
        className="flex-1"
        // Ensures taps inside the ScrollView are handled correctly,
        // allowing the Pressable wrapper to work.
        keyboardShouldPersistTaps="handled">
        {/*
         * This Pressable wrapper covers the entire content area.
         * Tapping on it (e.g., on a card) will dismiss the numpad.
         */}
        <Pressable
          onPress={() => {
            // If an input is active, blur it
            if (activeInput && inputRefs[activeInput]) {
              inputRefs[activeInput]?.current?.blur();
            }
            // Set activeInput to null, triggering the "Animate OUT"
            setActiveInput(null);
          }}
          className="gap-6 px-6">
          {/* --- Content Cards --- */}

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
              {/* Normal Evolutions Input */}
              <View className="gap-2">
                <Label nativeID="normal_evolutions">Normal Evolutions</Label>
                <TextInput
                  ref={normalInputRef}
                  value={inputs.normal_evolutions}
                  className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${
                    // Apply a primary border color when active
                    activeInput === 'normal_evolutions' ? 'border-primary' : theme.borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  // Prevents the default system keyboard from showing
                  showSoftInputOnFocus={false}
                  // When focused, set this as the active input
                  onFocus={() => setActiveInput('normal_evolutions')}
                  // Prevents the Pressable wrapper from firing when tapping the input
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${theme.textSecondary}`}>
                  +{XP_MULTIPLIERS.evolution.normal.toLocaleString()} XP each
                </Text>
              </View>

              {/* New Pokemon Evolutions Input */}
              <View className="gap-2">
                <Label nativeID="new_pokemon_evolutions">New Pokemon Evolutions</Label>
                <TextInput
                  ref={newPokemonInputRef}
                  value={inputs.new_pokemon_evolutions}
                  className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${
                    // Apply a primary border color when active
                    activeInput === 'new_pokemon_evolutions' ? 'border-primary' : theme.borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  // Prevents the default system keyboard from showing
                  showSoftInputOnFocus={false}
                  // When focused, set this as the active input
                  onFocus={() => setActiveInput('new_pokemon_evolutions')}
                  // Prevents the Pressable wrapper from firing when tapping the input
                  onTouchStart={(e) => e.stopPropagation()}
                />
                <Text className={`text-xs ${theme.textSecondary}`}>
                  +{XP_MULTIPLIERS.evolution.new_pokemon.toLocaleString()} XP each
                </Text>
              </View>

              {/* Note about business logic */}
              <View>
                <Text className={`text-xs font-semibold ${theme.textSecondary}`}>Note:</Text>
                <Text className={`text-xs ${theme.textSecondary}`}>
                  New Pokemon Evolutions can't be more than Normal Evolutions
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Result Card Component */}
          <ResultCard totalXP={totalXP} luckEggStatus={inputs.lucky_egg} />
        </Pressable>

        {/* 3. The Animated Spacer View */}
        {/*
         * This invisible view grows and shrinks its height.
         * It's placed *inside* the ScrollView to push all the content above it.
         */}
        <Animated.View style={animatedPaddingStyle} />
      </AnimatedScrollView>

      {/* 4. The Numpad Component */}
      {/*
       * This view is positioned absolutely to float over the ScrollView.
       * Its position is controlled by 'animatedNumpadStyle'.
       */}
      <Animated.View
        style={animatedNumpadStyle}
        className={`absolute bottom-0 left-0 right-0 border-t ${theme.borderColor} ${theme.bg}`}
        // Allows this view to intercept touch events, preventing
        // the Pressable wrapper underneath from firing
        onStartShouldSetResponder={() => true}
        // This 'onLayout' event is critical for the initial animation setup
        onLayout={(event) => {
          const height = event.nativeEvent.layout.height;
          // This code runs only ONCE when the height is first measured
          if (height > 0 && numpadHeight === 0) {
            // 1. Save the height to state for animations
            setNumpadHeight(height);
            // 2. Instantly move the numpad off-screen to its "hidden" position
            numpadTranslateY.value = height;
          }
        }}>
        <Numpad onKeyPress={handleNumpadKeyPress} theme={theme} />
      </Animated.View>
    </View>
  );
}
