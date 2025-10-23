import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import { useColorScheme, View } from 'react-native';
import { cn } from '@/lib/utils';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function ResultCard({
  totalXP,
  luckEggStatus,
}: {
  totalXP: number;
  luckEggStatus: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const gradientColors = isDark ? ['#2a1a1a', '#1a1a1a'] : ['#fef2f2', '#fee2e2'];
  const borderColor = isDark ? '#7f1d1d' : '#fca5a5';

  // --- This is the animation logic ---
  const animatedStyle = useAnimatedStyle(() => {
    return {
      // Animate maxHeight from 0 to 50 (a num larger than the text height)
      maxHeight: withTiming(luckEggStatus ? 50 : 0, { duration: 300 }),
      // Animate opacity from 0 to 1
      opacity: withTiming(luckEggStatus ? 1 : 0, { duration: 300 }),
      // This is crucial to hide the content as it collapses
      overflow: 'hidden',
    };
  });

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

        {/* --- Animated View --- */}
        <Animated.View style={animatedStyle}>
          <Text className="pt-1 text-center text-sm font-semibold text-red-500">
            Lucky Egg Active
          </Text>
        </Animated.View>
        {/* --- End of Animated View --- */}
      </View>
    </LinearGradient>
  );
}
