import { useState, useEffect, useRef } from 'react'; // Import React hooks
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  Pressable, // For "tap away" to dismiss
  BackHandler, // For handling Android back button
} from 'react-native';
// Import Animated components from Reanimated
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { ScrollText } from 'lucide-react-native';
// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS, GAME_CONSTANTS } from '@/types/xp-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResultCard from '../common/ResultCard';
import CalculatorHeading from '../common/CalculatorHeading';
import { Numpad } from '../common/Numpad'; // Import the custom Numpad

// Create an animated version of the ScrollView component
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// --- Interfaces ---
interface FriendshipInputs {
  good_friends: string;
  great_friends: string;
  ultra_friends: string;
  best_friends: string;
  lucky_egg: boolean;
}

interface FriendshipXPCalculatorProps {
  onBack: () => void;
}

// Type definition for tracking which input field is currently active
type ActiveInputField = 'good_friends' | 'great_friends' | 'ultra_friends' | 'best_friends' | null; // null means no input is active

export function FriendshipXPCalculator({ onBack }: FriendshipXPCalculatorProps) {
  // --- State Management ---

  // Holds the string values from the text inputs and the lucky egg toggle state
  const [inputs, setInputs] = useState<FriendshipInputs>({
    good_friends: '',
    great_friends: '',
    ultra_friends: '',
    best_friends: '',
    lucky_egg: false,
  });

  // Tracks which input field is active to show the numpad. This is the main "on/off" switch.
  const [activeInput, setActiveInput] = useState<ActiveInputField>(null);

  // Stores the measured height of the Numpad component once it renders
  const [numpadHeight, setNumpadHeight] = useState(0);

  // Refs to the TextInput components to allow blurring them programmatically
  const goodFriendsRef = useRef<TextInput>(null);
  const greatFriendsRef = useRef<TextInput>(null);
  const ultraFriendsRef = useRef<TextInput>(null);
  const bestFriendsRef = useRef<TextInput>(null);

  // A map to easily access the correct input ref based on the activeInput state
  const inputRefs: Record<Exclude<ActiveInputField, null>, React.RefObject<TextInput | null>> = {
    good_friends: goodFriendsRef,
    great_friends: greatFriendsRef,
    ultra_friends: ultraFriendsRef,
    best_friends: bestFriendsRef,
  };

  // --- Animation Shared Values (Reanimated) ---

  // Controls the Y-translation (vertical position) of the Numpad
  // 0 = Visible, numpadHeight = Hidden (off-screen)
  const numpadTranslateY = useSharedValue(0);

  // Controls the height of the invisible spacer view at the bottom of the ScrollView
  // 32 = Default padding, numpadHeight = Active padding (to push content up)
  const paddingBottom = useSharedValue(32);

  // --- Hardware Back Button Handler ---
  /*
   * useEffect Hook to handle the hardware back button press (Android)
   *
   * GOAL: Dismiss the custom Numpad when the user presses the hardware back button,
   * instead of navigating to the previous screen.
   */
  useEffect(() => {
    // 1. Define the event handler
    const onBackPress = () => {
      // Check if the numpad is currently active
      if (activeInput !== null) {
        // If an input is active, blur it (removes cursor)
        if (inputRefs[activeInput].current) {
          inputRefs[activeInput].current.blur();
        }
        // Dismiss the numpad by resetting the activeInput state
        setActiveInput(null); // This triggers the "Animate OUT" useEffect

        // Return TRUE: We've handled the back press. Do not navigate.
        return true;
      }
      // Return FALSE: Numpad is not active. Proceed with default navigation.
      return false;
    };

    // 2. Add the event listener
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // 3. Return cleanup function to remove the listener on unmount
    return () => subscription.remove();
  }, [activeInput]); // Re-run if activeInput changes

  // --- Calculation Logic ---

  /**
   * Calculates the total XP based on the current 'inputs' state.
   */
  const calculateTotalXP = (): number => {
    let totalXP = 0;
    // Parse string inputs to numbers, defaulting to 0
    const goodFriends = Number.parseInt(inputs.good_friends) || 0;
    const greatFriends = Number.parseInt(inputs.great_friends) || 0;
    const ultraFriends = Number.parseInt(inputs.ultra_friends) || 0;
    const bestFriends = Number.parseInt(inputs.best_friends) || 0;

    // Sum XP from all sources
    totalXP += goodFriends * XP_MULTIPLIERS.friendship.good_friends;
    totalXP += greatFriends * XP_MULTIPLIERS.friendship.great_friends;
    totalXP += ultraFriends * XP_MULTIPLIERS.friendship.ultra_friends;
    totalXP += bestFriends * XP_MULTIPLIERS.friendship.best_friends;

    // Apply Lucky Egg multiplier
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }
    return totalXP;
  };

  // --- Helper Functions ---

  /**
   * Validates and sets the new value for a number input field.
   * This is called by the Numpad key press handler.
   */
  const handleNumberInput = (
    field: keyof Pick<
      FriendshipInputs,
      'good_friends' | 'great_friends' | 'ultra_friends' | 'best_friends'
    >,
    value: string
  ) => {
    // Allow empty strings or strings that are only digits
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      // Enforce a maximum value based on game constants
      if (int_value > GAME_CONSTANTS.MAX_FRIENDSHIP) {
        value = GAME_CONSTANTS.MAX_FRIENDSHIP.toString();
      }
      updateInput(field, value);
    }
  };

  /**
   * A generic state updater for the 'inputs' object.
   */
  const updateInput = (field: keyof FriendshipInputs, value: string | boolean) => {
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

  // Calculate total XP on every render
  const totalXP = calculateTotalXP();

  // --- Theme & Styles ---
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  // Define theme colors for NativeWind (Tailwind) classes
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';

  // Create a theme object to pass to the Numpad component
  const theme = {
    cardBg,
    cardBorderColor,
    inputBg,
    textPrimary,
    textSecondary,
    borderColor,
    bg,
    primaryColor: '#ef4444', // Set your primary color
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
      return;
    }
    // 2. Animate IN (Show Numpad)
    if (activeInput !== null) {
      // Slide numpad UP to position 0 (visible)
      numpadTranslateY.value = withTiming(0, { duration: 250 });
      // Grow the spacer's height to match the numpad's height
      paddingBottom.value = withTiming(numpadHeight, { duration: 250 });
    } else {
      // 3. Animate OUT (Hide Numpad)
      // Slide numpad DOWN by its full height (off-screen)
      numpadTranslateY.value = withTiming(numpadHeight, { duration: 250 });
      // Shrink the spacer's height back to the default
      paddingBottom.value = withTiming(32, { duration: 250 });
    }
  }, [activeInput, numpadHeight]); // Dependencies: Re-run on change

  /**
   * Animated style for the Numpad container.
   * This style is applied to the <Animated.View> wrapping the Numpad.
   */
  const animatedNumpadStyle = useAnimatedStyle(() => {
    return {
      // Becomes 1 as soon as numpadHeight is measured
      opacity: numpadHeight === 0 ? 0 : 1,
      // Apply the animated vertical translation
      transform: [{ translateY: numpadTranslateY.value }],
    };
  }, [numpadHeight]); // Dependency: Re-calculate if numpadHeight changes

  /**
   * Animated style for the invisible spacer view.
   * This style is applied to the <Animated.View> at the end of the AnimatedScrollView.
   */
  const animatedPaddingStyle = useAnimatedStyle(() => {
    return {
      // Apply the animated height
      height: paddingBottom.value,
    };
  }, []); // No dependencies needed as it reads from a shared value

  // --- JSX Render ---
  return (
    <View className={`flex-1 ${bg}`}>
      {/* 1. Header Component */}
      <CalculatorHeading
        title="Friendship XP Calculator"
        description="Calculate XP from friendship levels"
        onBack={onBack}
      />

      {/* 2. Scrollable Content Area */}
      <AnimatedScrollView
        className="flex-1" // Ensures ScrollView takes available space
        keyboardShouldPersistTaps="handled" // Important for Pressable wrapper
      >
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
                  <ScrollText color="#ef4444" className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold text-foreground">
                    Friendship Activities
                  </Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Good Friends Input */}
              <View className="gap-2">
                <Label nativeID="good_friends">Good Friends</Label>
                <TextInput
                  ref={goodFriendsRef} // Assign the ref
                  value={inputs.good_friends}
                  // Apply active border color
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'good_friends' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  showSoftInputOnFocus={false} // Prevent system keyboard
                  onFocus={() => setActiveInput('good_friends')} // Set as active
                  onTouchStart={(e) => e.stopPropagation()} // Stop pressable
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.good_friends.toLocaleString()} XP each
                </Text>
              </View>

              {/* Great Friends Input */}
              <View className="gap-2">
                <Label nativeID="great_friends">Great Friends</Label>
                <TextInput
                  ref={greatFriendsRef} // Assign the ref
                  value={inputs.great_friends}
                  // Apply active border color
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'great_friends' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  showSoftInputOnFocus={false} // Prevent system keyboard
                  onFocus={() => setActiveInput('great_friends')} // Set as active
                  onTouchStart={(e) => e.stopPropagation()} // Stop pressable
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.great_friends.toLocaleString()} XP each
                </Text>
              </View>

              {/* Ultra Friends Input */}
              <View className="gap-2">
                <Label nativeID="ultra_friends">Ultra Friends</Label>
                <TextInput
                  ref={ultraFriendsRef} // Assign the ref
                  value={inputs.ultra_friends}
                  // Apply active border color
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'ultra_friends' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  showSoftInputOnFocus={false} // Prevent system keyboard
                  onFocus={() => setActiveInput('ultra_friends')} // Set as active
                  onTouchStart={(e) => e.stopPropagation()} // Stop pressable
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.ultra_friends.toLocaleString()} XP each
                </Text>
              </View>

              {/* Best Friends Input */}
              <View className="gap-2">
                <Label nativeID="best_friends">Best Friends</Label>
                <TextInput
                  ref={bestFriendsRef} // Assign the ref
                  value={inputs.best_friends}
                  // Apply active border color
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${
                    activeInput === 'best_friends' ? 'border-primary' : borderColor
                  }`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  showSoftInputOnFocus={false} // Prevent system keyboard
                  onFocus={() => setActiveInput('best_friends')} // Set as active
                  onTouchStart={(e) => e.stopPropagation()} // Stop pressable
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.best_friends.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card */}
          <ResultCard totalXP={totalXP} luckEggStatus={inputs.lucky_egg} />

          {/* 3. The Animated Spacer View */}
          {/*
           * This invisible view grows and shrinks its height.
           * It's placed *inside* the ScrollView to push all the content above it.
           */}
          <Animated.View style={animatedPaddingStyle} />
        </Pressable>
      </AnimatedScrollView>

      {/* 4. The Numpad Component */}
      {/*
       * This view is positioned absolutely to float over the ScrollView.
       * Its position is controlled by 'animatedNumpadStyle'.
       */}
      <Animated.View
        style={animatedNumpadStyle}
        className={`absolute bottom-0 left-0 right-0 border-t ${borderColor} ${bg}`}
        // Allows this view to intercept touch events
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
