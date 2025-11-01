Here’s your **README** converted into clean, well-formatted **Markdown**:

---

# FriendshipXPCalculator Component

## 1. Overview

This document details the **FriendshipXPCalculator** component.
Its primary purpose is to provide a user interface for calculating the total **Experience Points (XP)** a player can gain from achieving friendship milestones in *Pokémon GO*.

The component displays input fields for each of the four friendship levels, a **"Lucky Egg"** toggle, and a **ResultCard** to show the final calculation.
It uses a custom **Numpad** component for all user input.

---

## 2. Component Responsibility

The **FriendshipXPCalculator** is responsible for:

* Displaying four distinct input fields for each friendship level (**Good**, **Great**, **Ultra**, **Best**).
* Providing a toggle for the **"Lucky Egg"** 2× multiplier via the `LuckyEggCard` component.
* Validating user input against game-specific rules (e.g., maximum friend limit).
* Calculating the total XP based on all inputs.
* Displaying the final `totalXP` in the `ResultCard` component.

---

## 3. Core State Management

The component's primary data is managed in a single `useState` object.
This `inputs` state holds the raw string values from the `TextInput` fields and the boolean state of the `LuckyEggCard`.

```tsx
const [inputs, setInputs] = useState<FriendshipInputs>({
  good_friends: '',
  great_friends: '',
  ultra_friends: '',
  best_friends: '',
  lucky_egg: false,
});
```

The component also uses state to manage the custom numpad’s visibility (`activeInput`) and layout (`numpadHeight`), but the core data for the calculation is stored in `inputs`.

---

## 4. Core Logic & Functionality

The component’s logic is split into two main parts: **input validation** and **final calculation**.

### Input Validation (`handleNumberInput`)

When the user types using the Numpad, the `handleNumpadKeyPress` function builds a string, which is passed to `handleNumberInput` for validation.

This function performs two key checks:

1. **Numeric Check:** Uses a regex (`/^\d+$/`) to ensure the input is either empty or contains only digits.
2. **Game Constant Check:** Ensures the numeric value does not exceed `GAME_CONSTANTS.MAX_FRIENDSHIP` (e.g., `450`).
   If it does, the value is capped at the maximum.

```tsx
const handleNumberInput = (
  field: keyof Pick<...>,
  value: string
) => {
  // Allow empty string or valid numbers only
  if (value === '' || /^\d+$/.test(value)) {
    const int_value = parseInt(value) || 0;
    
    // Limit to 450 (or other constant)
    if (int_value > GAME_CONSTANTS.MAX_FRIENDSHIP) {
      value = GAME_CONSTANTS.MAX_FRIENDSHIP.toString();
    }
    updateInput(field, value);
  }
};
```

### Calculation Logic (`calculateTotalXP`)

The total XP is computed on every render by the `calculateTotalXP` function:

1. Parses each input field into a number (defaults to `0` if empty or invalid).
2. Multiplies each number by its corresponding XP constant from `XP_MULTIPLIERS.friendship`.
3. Sums all values to get `totalXP`.
4. If `inputs.lucky_egg` is `true`, doubles the total XP.

```tsx
// Simplified calculation logic
const calculateTotalXP = (): number => {
  let totalXP = 0;
  const goodFriends = Number.parseInt(inputs.good_friends) || 0;
  const greatFriends = Number.parseInt(inputs.great_friends) || 0;
  const ultraFriends = Number.parseInt(inputs.ultra_friends) || 0;
  const bestFriends = Number.parseInt(inputs.best_friends) || 0;

  totalXP += goodFriends * XP_MULTIPLIERS.friendship.good_friends; // +3,000 XP
  totalXP += greatFriends * XP_MULTIPLIERS.friendship.great_friends; // +10,000 XP
  totalXP += ultraFriends * XP_MULTIPLIERS.friendship.ultra_friends; // +50,000 XP
  totalXP += bestFriends * XP_MULTIPLIERS.friendship.best_friends; // +100,000 XP

  // Double XP if lucky egg is active
  if (inputs.lucky_egg) {
    totalXP *= 2;
  }

  return totalXP;
};
```

---

## 5. Component Inputs (Props)

The `<FriendshipXPCalculator>` component accepts one prop:

| Prop     | Type         | Description                                                     |
| -------- | ------------ | --------------------------------------------------------------- |
| `onBack` | `() => void` | Callback triggered by the `CalculatorHeading` to navigate back. |

---

## 6. UI Components & Interaction

The UI is built from several key imported components and standard `TextInput` fields.

* **CalculatorHeading:** Displays the title and back button.
* **LuckyEggCard:** Toggles the `inputs.lucky_egg` boolean.
* **Card & TextInput:** Renders four custom numpad-enabled `TextInput` fields.

  * `showSoftInputOnFocus={false}` prevents the system keyboard from appearing.
  * `onFocus={() => setActiveInput(...)}` activates the numpad.
* **ResultCard:** Displays the calculated `totalXP` and `lucky_egg` status.

### Note on Numpad Interaction

This component **does not use the standard system keyboard**.
It employs a **custom animated Numpad component** shared across multiple calculators in the app.

The Numpad handles all numeric input and passes it to `handleNumpadKeyPress`, which updates state.

**Note on Animation:**
The Numpad’s appearance (slide-in), content shifting, and dismissal (via tap-away or Android back button) are part of a shared animation system.

For detailed numpad animation behavior, see the `EvolutionXPCalculator` documentation.

---

## 7. Simplified JSX Structure

The following shows how the components are assembled in the render method:

```tsx
<View className="flex-1 ...">
  {/* 1. Header */}
  <CalculatorHeading ... onBack={onBack} />

  {/* 2. Scrollable Content Area */}
  <AnimatedScrollView ...>
    {/* "Tap away" dismiss wrapper */}
    <Pressable onPress={() => setActiveInput(null)} ...>
      
      {/* Content Cards */}
      <LuckyEggCard ... />

      <Card ...>
        <CardContent ...>
          {/* Good Friends Input */}
          <TextInput ref={goodFriendsRef} onFocus={() => setActiveInput('good_friends')} ... />
          
          {/* Great Friends Input */}
          <TextInput ref={greatFriendsRef} onFocus={() => setActiveInput('great_friends')} ... />
          
          {/* Ultra Friends Input */}
          <TextInput ref={ultraFriendsRef} onFocus={() => setActiveInput('ultra_friends')} ... />
          
          {/* Best Friends Input */}
          <TextInput ref={bestFriendsRef} onFocus={() => setActiveInput('best_friends')} ... />
        </CardContent>
      </Card>

      <ResultCard totalXP={totalXP} ... />

      {/* 3. Animated Spacer View (Pushes content up) */}
      <Animated.View style={animatedPaddingStyle} />
    </Pressable>
  </AnimatedScrollView>

  {/* 4. Numpad Component (Floats on top) */}
  <Animated.View style={animatedNumpadStyle} onLayout={...}>
    <Numpad onKeyPress={handleNumpadKeyPress} ... />
  </Animated.View>
</View>
```