import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import { useColorScheme, View } from 'react-native';
import { cn } from '@/lib/utils';

export default function ResultCard({ totalXP }: { totalXP: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // const gradientColors = isDark ? ['#2a1a1a', '#1a1a1a'] : ['#fef2f2', '#ffffff'];
  const gradientColors = isDark ? ['#2a1a1a', '#1a1a1a'] : ['#fef2f2', '#fee2e2'];

  // const borderColor = isDark ? '#7f1d1d' : '#fecaca';
  const borderColor = isDark ? '#7f1d1d' : '#fca5a5';

  
  return (
    <LinearGradient
      colors={gradientColors as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: borderColor,
      }}>
      <View className="p-6">
        <View className="items-center gap-3">
          <Text
            className={`text-center text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Total XP Earned
          </Text>
          <Text className="text-center text-4xl font-bold text-red-500">
            {totalXP.toLocaleString()}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
