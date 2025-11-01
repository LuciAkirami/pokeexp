import DetailedXPCalculator from '@/components/calculators/detailed-xp-calculator/index';

import { useRouter } from 'expo-router';

export default function DetailedXPCalculatorScreen() {
  const router = useRouter();

  return <DetailedXPCalculator onBack={() => router.back()} />;
}