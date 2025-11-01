# EvolutionXPCalculator Component

This document provides a detailed breakdown of the `EvolutionXPCalculator` component. Its primary feature is a custom, animated `Numpad` that replaces the default system keyboard, providing a seamless user experience.

## 1\. High-Level Goal

The main objective is to replace the standard mobile keyboard with a custom, theme-able `Numpad` component.

To make this feel professional, we must solve two distinct problems:

1.  **Show/Hide the Numpad:** When a user taps an input field, the `Numpad` must smoothly slide in from the bottom of the screen. When dismissed, it must slide back out.
2.  **Prevent Content Overlap:** When the `Numpad` slides in, it will cover the content at the bottom of the screen (like the "Result" card). The screen content must be "pushed up" to ensure the active input and results remain visible.

This component solves both problems using a **synchronized two-part animation** managed by **React Native Reanimated**.

-----

## 2\. The Core Animation Strategy

The animation is a coordinated "dance" between two separate components:

1.  **The Numpad (`<Animated.View style={animatedNumpadStyle}>`)**
      * This component floats on top of the screen (using `position: 'absolute'`).
      * Its animation consists of sliding up and down. This is controlled by changing its vertical `translateY` transform.
2.  **The Spacer (`<Animated.View style={animatedPaddingStyle}>`)**
      * This is an *invisible view* placed at the very bottom of the `AnimatedScrollView`.
      * Its animation consists of growing and shrinking its `height`.
      * When it grows, it pushes all the `ScrollView` content (like the `Card` and `ResultCard`) upwards.

When the user taps an input:

  * The **Numpad slides up** into view.
  * Simultaneously, the **Spacer grows in height** by the *exact* height of the numpad.

This creates a smooth, unified effect where the content appears to be pushed up *by* the numpad.

-----

## 3\. State and Animation Values (The "Brain")

The component's behavior is managed by a combination of standard React `useState` and Reanimated `useSharedValue` hooks.

| Variable | Hook | Purpose |
| :--- | :--- | :--- |
| `inputs` | `useState` | Stores the *data* from the input fields (e.g., `{ normal_evolutions: '12', ... }`). |
| `activeInput` | `useState` | **The main "on/off" switch.** It's `null` when the numpad is hidden and holds the ID (e.g., `'normal_evolutions'`) of the active input when shown. |
| `numpadHeight` | `useState` | Stores the measured height of the `Numpad`. We can't animate correctly until we know this value. |
| `numpadTranslateY` | `useSharedValue` | **Controls the Numpad's slide.** This value is used in a `translateY` transform. |
| `paddingBottom` | `useSharedValue` | **Controls the Spacer's height.** This is applied directly to the `height` style of the spacer view. |

### The "Gotcha": `numpadTranslateY` Explained

A common point of confusion is how `numpadTranslateY` works.

  * `translateY: 0`: This means **no translation**. The component is at its default position. Since our `Numpad` is positioned at `bottom: 0`, a `translateY` of `0` makes it **fully visible**.
  * `translateY: numpadHeight`: This means **translate (move) down by the numpad's full height**. This pushes it completely off-screen, making it **invisible**.

<!-- end list -->

```javascript
// This is the animation state and shared value setup
const [numpadHeight, setNumpadHeight] = useState(0);

// Controls the Numpad's vertical position
// 0 = Visible, numpadHeight = Hidden
const numpadTranslateY = useSharedValue(0); 

// Controls the spacer view's height
// 32 = Hidden (default padding), numpadHeight = Visible
const paddingBottom = useSharedValue(32); 
```

-----

## 4\. The Animation Conductor (`useEffect`)

This `useEffect` hook is the "orchestra conductor." It watches for changes in `activeInput` or `numpadHeight` and triggers the animations.

```javascript
useEffect(() => {
    // 1. GUARD CLAUSE:
    // Don't run any animations until we have measured the numpad's height.
    if (numpadHeight === 0) {
      return;
    }

    // 2. ANIMATE IN: (User tapped an input)
    if (activeInput !== null) {
      // Slide numpad UP to position 0 (visible)
      numpadTranslateY.value = withTiming(0, { duration: 250 });
      // Grow spacer's height to match the numpad's height
      paddingBottom.value = withTiming(numpadHeight, { duration: 250 });
    } 
    // 3. ANIMATE OUT: (User dismissed the numpad)
    else {
      // Slide numpad DOWN by its height (invisible)
      numpadTranslateY.value = withTiming(numpadHeight, { duration: 250 });
      // Shrink spacer's height back to the default
      paddingBottom.value = withTiming(32, { duration: 250 });
    }
  }, [activeInput, numpadHeight]); // Dependencies
```

The `useAnimatedStyle` hooks are what apply these changing values to the component styles:

```javascript
// --- Numpad style ---
const animatedNumpadStyle = useAnimatedStyle(() => {
  return {
    // This opacity is critical for the initial load sequence
    opacity: numpadHeight === 0 ? 0 : 1, 
    transform: [{ translateY: numpadTranslateY.value }],
  };
}, [numpadHeight]);

// --- Spacer style ---
const animatedPaddingStyle = useAnimatedStyle(() => {
  return {
    height: paddingBottom.value,
  };
}, []); 
```

-----

## 5\. The Initial Load Sequence (The "Gotcha" Solved)

You might ask: "If `numpadTranslateY` starts at `0`, why isn't the numpad visible when the component first loads?"

This is solved by a clever sequence of events using the `onLayout` prop of the `Numpad`'s container:

```javascript
<Animated.View
    style={animatedNumpadStyle}
    ...
    onLayout={(event) => {
      const height = event.nativeEvent.layout.height;
      // This 'if' block runs only ONCE
      if (height > 0 && numpadHeight === 0) {
        // 1. Save the height for all future animations
        setNumpadHeight(height);
        // 2. Instantly move the numpad off-screen
        numpadTranslateY.value = height; 
      }
    }}>
  <Numpad ... />
</Animated.View>
```

Here is the step-by-step load sequence (takes a fraction of a second):

1.  **Mount:** Component renders. `numpadHeight` is `0`, `numpadTranslateY` is `0`.
2.  **Style:** `animatedNumpadStyle` runs. Since `numpadHeight === 0`, it sets `opacity: 0`. The numpad is now in the layout, but fully invisible.
3.  **Layout:** React Native measures the invisible numpad. The `onLayout` prop fires with its `height`.
4.  **`onLayout` Fires:** The code inside `onLayout` runs.
      * `setNumpadHeight(height)` saves the height (e.g., 300).
      * `numpadTranslateY.value = height` **instantly** moves the invisible numpad to its "hidden" position (`translateY: 300`).
5.  **Ready:** The component is now in its stable, "hidden" state. The numpad is off-screen, and `numpadHeight` is set. The animation `useEffect` can now run correctly, but since `activeInput` is `null`, it just confirms the "Animate OUT" state.

Now, the first time the user taps an input, `activeInput` changes, and the `useEffect` correctly animates `numpadTranslateY` from `height` (hidden) to `0` (visible).

-----

## 6\. Event Handling (The "Triggers")

The animations are triggered by changes to the `activeInput` state. Here’s how that state is changed:

### 1\. Show Numpad (Tap Input)

The `TextInput` components are configured to set the `activeInput` state `onFocus`. `showSoftInputOnFocus={false}` is crucial for preventing the default system keyboard.

```javascript
<TextInput
  ...
  // Prevents the system keyboard
  showSoftInputOnFocus={false} 
  // Sets this input as active, triggering the "Animate IN"
  onFocus={() => setActiveInput('normal_evolutions')} 
  ...
/>
```

### 2\. Hide Numpad (Tap Away)

The entire `ScrollView` content is wrapped in a `<Pressable>`. If the user taps anywhere *outside* an input (e.g., on a card or the background), this `onPress` fires.

```javascript
<AnimatedScrollView ...>
  <Pressable
    // Sets activeInput to null, triggering the "Animate OUT"
    onPress={() => {
      if (activeInput && inputRefs[activeInput]) {
        inputRefs[activeInput]?.current?.blur(); // Manually blur the text input
      }
      setActiveInput(null);
    }}
    ...
  >
    {/* All content cards go here */}
  </Pressable>
  
  {/* The animated spacer */}
  <Animated.View style={animatedPaddingStyle} />
</AnimatedScrollView>
```

### 3\. Hide Numpad (Android Back Button)

This `useEffect` intercepts the hardware back button press. This ensures that pressing "back" dismisses the numpad instead of navigating to the previous screen.

```javascript
useEffect(() => {
    const onBackPress = () => {
      // 1. Is the numpad currently active?
      if (activeInput !== null) {
        // 2. Blur the active input field - Removes focus and cursor from the input field
        if (inputRefs[activeInput].current) {
          inputRefs[activeInput].current.blur();
        }

        // 3. Yes: Dismiss the numpad
        setActiveInput(null); // This triggers the "Animate OUT"
        
        // 4. Return TRUE: This tells React Native
        // "We have handled the back press. Do not navigate."
        return true;
      }

      // 5. Return FALSE: The numpad is not active.
      // "We did not handle this. Proceed with default behavior (navigate back)."
      return false;
    };

    // Add the listener
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Remove the listener on unmount
    return () => subscription.remove();
}, [activeInput]); // Re-subscribes when activeInput changes
```

-----

## 7\. Component JSX Structure (Simplified)

This is the simplified layout showing how all the pieces fit together.

```jsx
<View className="flex-1 ...">
  {/* 1. The Header */}
  <CalculatorHeading ... />

  {/* 2. The Content Area */}
  <AnimatedScrollView ...>
    {/* This pressable handles "tap away" to dismiss */}
    <Pressable onPress={() => setActiveInput(null)} ...>
      
      {/* All your content cards and inputs go here */}
      <LuckyEggCard ... />
      <Card>
        <TextInput onFocus={() => setActiveInput('normal_evolutions')} ... />
        <TextInput onFocus={() => setActiveInput('new_pokemon_evolutions')} ... />
      </Card>
      <ResultCard ... />

    </Pressable>

    {/* 3. THE ANIMATED SPACER */}
    {/* This is the invisible view that grows and shrinks */}
    <Animated.View style={animatedPaddingStyle} />

  </AnimatedScrollView>

  {/* 4. THE FLOATING NUMPAD */}
  {/* This is positioned absolutely at the bottom, floating OVER the ScrollView */}
  <Animated.View
    style={animatedNumpadStyle}
    onLayout={...} // This is what measures the height
  >
    <Numpad onKeyPress={handleNumpadKeyPress} ... />
  </Animated.View>
  
</View>
```