import { View, ScrollView, useColorScheme } from 'react-native';
import type { DetailedXPCalculatorProps } from '@/types/xp-calculator';
import CalculatorHeading from '../../common/CalculatorHeading';

// 1. Import hook
import { useDetailedXPCalculator } from './useDetailedXPCalculator';

// 2. Import sub-components
import { LevelProgressForm } from './components/LevelProgressForm';
import { CalculationSettings } from './components/CalculationSettings';
import { XPInputTabs } from './components/XPInputTabs';
import { XPResults } from './components/XPResults';

// 3. Import theme hook or define styles locally
import { useThemeStyles } from '@/hooks/useThemeStyles'; 

export function DetailedXPCalculator({ onBack }: DetailedXPCalculatorProps) {
  // 4. Use the hooks
  const { inputs, updateInput, handleNumberInput, progress, timeToTarget, dailyReq } = useDetailedXPCalculator();

  const theme = useThemeStyles();

  return (
    <View className={`flex-1 ${theme.bg}`}>
      <CalculatorHeading
        title="Detailed XP Calculator"
        description="Comprehensive XP calculation"
        onBack={onBack}
      />

      <ScrollView contentContainerClassName="pb-8">
        <View className="gap-6 px-6">
          {/* 5. Render the sub-components and pass props */}

          <LevelProgressForm inputs={inputs} handleNumberInput={handleNumberInput} theme={theme} />

          <CalculationSettings
            inputs={inputs}
            updateInput={updateInput}
            handleNumberInput={handleNumberInput}
            theme={theme}
          />

          <XPInputTabs inputs={inputs} handleNumberInput={handleNumberInput} theme={theme} />

          <XPResults progress={progress} luckyEggActive={inputs.lucky_egg} theme={theme} timeToTarget={timeToTarget} dailyReq={dailyReq} inputs={inputs} />
        </View>
      </ScrollView>
    </View>
  );
}
