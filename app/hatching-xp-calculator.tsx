import { HatchingXPCalculator } from './components/calculators/hatching-xp-calculator';

import { useRouter } from 'expo-router';

export default function HatchingXPCalculatorScreen() {
  const router = useRouter();

  return <HatchingXPCalculator onBack={() => router.back()} />;
}