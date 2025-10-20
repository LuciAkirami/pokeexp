import { MaxMovesXPCalculator } from './components/calculators/max-moves-xp-calculator';

import { useRouter } from 'expo-router';

export default function MaxMovesXPCalculatorScreen() {
  const router = useRouter();

  return <MaxMovesXPCalculator onBack={() => router.back()} />;
}