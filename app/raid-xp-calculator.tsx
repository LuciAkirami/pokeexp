import RaidXPCalculator from '@/components/calculators/raid-xp-calculator';

import { useRouter } from 'expo-router';

export default function RaidXPCalculatorScreen() {
  const router = useRouter();

  return <RaidXPCalculator onBack={() => router.back()} />;
}