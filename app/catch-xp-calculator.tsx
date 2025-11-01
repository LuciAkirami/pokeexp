import CatchXPCalculator from '@/components/calculators/catch-xp-calculator';

import { useRouter } from 'expo-router';

export default function CatchXPCalculatorScreen() {
  const router = useRouter();

  return <CatchXPCalculator onBack={() => router.back()} />;
}