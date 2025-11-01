import MaxBattleXPCalculator from '@/components/calculators/max-battle-xp-calculator';

import { useRouter } from 'expo-router';

export default function MaxBattleXPCalculatorScreen() {
  const router = useRouter();

  return <MaxBattleXPCalculator onBack={() => router.back()} />;
}