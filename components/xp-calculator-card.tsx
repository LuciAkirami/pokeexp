import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
interface EnhancedCalculatorCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradientColors: readonly [string, string, ...string[]];
  colorScheme: 'light' | 'dark' | null | undefined;
  href: string;
}

export default function EnhancedCalculatorCard({
  title,
  subtitle,
  description,
  icon: IconComponent,
  gradientColors,
  colorScheme,
  href,
}: EnhancedCalculatorCardProps) {
  return (
    <Link href={href as any} asChild>
      <Pressable className="mb-4">
        {({ pressed }) => (

          <View
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
              borderWidth: 1,
              borderColor:
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
            }}>
            {/* Blur background */}
            <BlurView
              intensity={60} // Adjust from 10–100
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 0,
                // backdropFilter: 'blur(20px)',
                backgroundColor:
                  colorScheme === 'dark' ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
              }}
            />

            {/* Gradient overlay */}
            <LinearGradient
              // colors={[
              //   'rgba(255, 255, 255, 0.08)',
              //   'rgba(255, 255, 255, 0.03)',
              //   'rgba(255, 255, 255, 0.01)',
              // ]}
              colors={
                colorScheme === 'dark'
                  ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
                  : ['rgba(0,0,0,0.03)', 'rgba(0,0,0,0.02)', 'rgba(0,0,0,0.01)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
              }}
            />

            {/* Card Content */}
            <View style={{ padding: 24, zIndex: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {/* Icon Container */}
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor:
                      colorScheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(255, 255, 255, 0.18)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon as={IconComponent} className="text-foreground" size={24} />
                </LinearGradient>

                {/* Text Content */}
                <View style={{ flex: 1 }}>
                  <Text className="mb-1 text-lg font-semibold text-foreground">{title}</Text>
                  <Text className="mb-1 text-sm font-medium text-muted-foreground">{subtitle}</Text>
                  <Text className="text-xs text-muted-foreground/80">{description}</Text>
                </View>

                {/* Chevron */}
                <Icon as={ChevronRight} className="text-muted-foreground" size={20} />
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
