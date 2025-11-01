import FriendshipXPCalculator from '@/components/calculators/friendship-xp-calculator';

import { useRouter } from 'expo-router';

export default function FriendshipXPCalculatorScreen() {
  const router = useRouter();

  return <FriendshipXPCalculator onBack={() => router.back()} />;
}