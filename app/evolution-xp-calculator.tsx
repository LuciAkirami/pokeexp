import { EvolutionXPCalculator } from './components/calculators/evolution-xp-calculator';

import { useRouter } from 'expo-router';

export default function EvolutionXPCalculatorScreen() {
  const router = useRouter();

  return <EvolutionXPCalculator onBack={() => router.back()} />;
}
