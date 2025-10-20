import { BlurView } from 'expo-blur';
import { Card, CardContent } from '@/components/ui/card';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';
import { useColorScheme, View, StyleSheet } from 'react-native';

export default function ResultCard({
  totalXP,
}: {
  totalXP: number;
}) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
  return (
    <BlurView 
    intensity={30} 
    tint={isDark ? 'dark' : 'light'} 
    // style={{
    //   ...StyleSheet.absoluteFillObject,
    // //   zIndex: 1,
    // }} 
    className="overflow-hidden rounded-xl">
      <Card
        className="border-red-400/40 bg-transparent"
        style={{
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
          borderWidth: 1,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          borderRadius: 12,
        }}>
        <CardContent className="p-6">
          <View className="items-center gap-2">
            <Text className="text-lg font-semibold text-foreground">Total XP Earned</Text>
            <MaskedView
              maskElement={
                <Text className="bg-transparent text-4xl font-bold">
                  {totalXP.toLocaleString()}
                </Text>
              }>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text className="text-4xl font-bold opacity-0">{totalXP.toLocaleString()}</Text>
              </LinearGradient>
            </MaskedView>
          </View>
        </CardContent>
      </Card>
    </BlurView>
  );
}