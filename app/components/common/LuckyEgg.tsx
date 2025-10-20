import { View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { useColorScheme } from 'react-native';

interface LuckyEggCardProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  className?: string;
}

export function LuckyEggCard({ isActive, onToggle, className = '' }: LuckyEggCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBgColor = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';

  return (
    <Card className={`${cardBgColor} ${cardBorderColor}`}>
      <CardContent className="p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-foreground">Lucky Egg Active</Text>
            <Text className="text-sm text-muted-foreground">Double all XP gains</Text>
          </View>
          <Switch
            checked={isActive}
            onCheckedChange={onToggle}
            className={isActive ? 'bg-red-500' : ''}
          />
        </View>
      </CardContent>
    </Card>
  );
}
