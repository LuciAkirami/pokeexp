import { View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'react-native';

export default function ResultCard({ totalXP }: { totalXP: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const borderColor = isDark ? '#7f1d1d' : '#fecaca';
  const backgroundColor = isDark ? 'rgba(42, 26, 26, 1)' : 'rgba(254, 242, 242, 1)';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (

    <Card
      style={{
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: 12,
      }}>
      <CardContent className="p-6">
        <View className="items-center gap-3">
          <Text
            className={`text-center text-lg font-semibold ${
              textColor
            }`}>
            Total XP Earned
          </Text>
          <Text className="text-center text-4xl font-bold text-red-500">
            {totalXP.toLocaleString()}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
