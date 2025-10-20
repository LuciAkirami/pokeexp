import { View, StyleSheet } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'react-native';

interface LuckyEggCardProps {
  isActive: boolean;
  onToggle: (checked: boolean) => void;
  className?: string;
}

export function LuckyEggCard({ isActive, onToggle, className = '' }: LuckyEggCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <BlurView
      intensity={30}
      tint={isDark ? 'dark' : 'light'}
      className={`overflow-hidden rounded-xl ${className}`}>
      <Card
        className="border-primary/40 bg-transparent"
        style={{
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
          borderWidth: 1,
          borderColor: 'rgba(59, 130, 246, 0.4)',
          borderRadius: 12,
        }}>
        <CardContent className="p-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground">Lucky Egg Active</Text>
              <Text className="text-sm text-muted-foreground">Double all XP gains</Text>
            </View>
            <Switch checked={isActive} onCheckedChange={onToggle} />
          </View>
        </CardContent>
      </Card>
    </BlurView>
  );
}
