import { useState, useEffect } from 'react';
import { BackHandler, TextInput, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

// Define the type for the refs map the hook will accept
// This allows the hook to blur the correct input
type InputRefMap = Record<string, React.RefObject<TextInput | null>>;

// Define configuration constants
const DEFAULT_PADDING = 32; // Default bottom padding when numpad is hidden
const ANIMATION_DURATION = 250; // Animation speed in ms

/**
 * A custom hook to manage the state and animations for a custom numpad.
 *
 * @param inputRefs A map of input field IDs (strings) to their TextInput refs.
 * Used to blur the active input on back press.
 * @returns An object with state, handlers, and animated styles to apply to your component.
 */
export function useAnimatedNumpad(inputRefs: InputRefMap) {
  // --- State ---
  
  // Tracks which input field is active (e.g., 'normal_evolutions')
  // We use a generic `string | null` type to make the hook reusable.
  const [activeInput, setActiveInput] = useState<string | null>(null);
  
  // Stores the measured height of the numpad
  const [numpadHeight, setNumpadHeight] = useState(0);

  // --- Shared Values (for Reanimated) ---
  
  // Controls the numpad's vertical slide. 0 = visible, height = hidden.
  const numpadTranslateY = useSharedValue(0);
  
  // Controls the spacer view's height. DEFAULT_PADDING = hidden, height = visible.
  const paddingBottom = useSharedValue(DEFAULT_PADDING);

  // --- Effect: Hardware Back Button ---
  // Handles the Android back button to dismiss the numpad
  useEffect(() => {
    const onBackPress = () => {
      // Check if the numpad is active
      if (activeInput !== null) {
        // If an input is active, try to blur it
        if (inputRefs[activeInput] && inputRefs[activeInput].current) {
          inputRefs[activeInput].current.blur();
        }
        // Dismiss the numpad
        setActiveInput(null);
        // Prevent default back navigation
        return true;
      }
      // No active input, allow default back behavior
      return false;
    };

    // Add the listener
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
    // Cleanup: remove the listener on unmount or when dependencies change
    return () => subscription.remove();
  }, [activeInput, inputRefs]); // Dependency: re-subscribe if activeInput or refs map changes

  // --- Effect: Main Animation Controller ---
  // Triggers animations when activeInput or numpadHeight changes
  useEffect(() => {
    // Wait until height is measured (numpadHeight > 0)
    if (numpadHeight === 0) {
      return;
    }

    if (activeInput !== null) {
      // Animate IN
      numpadTranslateY.value = withTiming(0, { duration: ANIMATION_DURATION });
      paddingBottom.value = withTiming(numpadHeight, { duration: ANIMATION_DURATION });
    } else {
      // Animate OUT
      numpadTranslateY.value = withTiming(numpadHeight, { duration: ANIMATION_DURATION });
      paddingBottom.value = withTiming(DEFAULT_PADDING, { duration: ANIMATION_DURATION });
    }
  }, [activeInput, numpadHeight]); // Dependencies: re-run on change

  // --- Animated Styles ---
  
  // Style for the Numpad's container view
  const animatedNumpadStyle = useAnimatedStyle(() => {
    return {
      opacity: numpadHeight === 0 ? 0 : 1, // Prevent flash on load
      transform: [{ translateY: numpadTranslateY.value }],
    };
  }, [numpadHeight]);

  // Style for the spacer view at the bottom of the ScrollView
  const animatedPaddingStyle = useAnimatedStyle(() => {
    return {
      height: paddingBottom.value,
    };
  }, []); // No dependencies needed, it reads a shared value

  // --- Layout Handler ---
  /**
   * Call this from the Numpad container's onLayout prop.
   * It measures the numpad height and sets its initial off-screen position.
   */
  const onNumpadLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    // This should only run once
    if (height > 0 && numpadHeight === 0) {
      setNumpadHeight(height);
      numpadTranslateY.value = height; // Set initial position off-screen
    }
  };

  // --- Return Values ---
  // Expose all the necessary values and handlers for the component to use
  return {
    activeInput,
    setActiveInput,
    animatedNumpadStyle,
    animatedPaddingStyle,
    onNumpadLayout,
  };
}
