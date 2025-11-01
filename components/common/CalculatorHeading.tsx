import { View } from "react-native";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CalculatorHeading({ title, description, onBack }: { title: string; description: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 16,
      }}
      className="px-6 pb-4">
      <View className="flex-row items-center gap-4">
        <BlurView intensity={10} tint="dark" className="h-10 w-10 overflow-hidden rounded-full">
          <TouchableOpacity
            onPress={onBack}
            className="h-full w-full items-center justify-center active:opacity-70">
            <ArrowLeft size={20} color="#ef4444" />
          </TouchableOpacity>
        </BlurView>
        <View className="flex-1">
          <MaskedView
            maskElement={<Text className="bg-transparent text-xl font-bold">{title}</Text>}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text className="text-xl font-bold opacity-0">{title}</Text>
            </LinearGradient>
          </MaskedView>
          <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
        </View>
      </View>
    </View>
  );
}