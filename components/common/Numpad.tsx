import { View, Text, TouchableOpacity } from 'react-native';
import { Delete } from 'lucide-react-native';

interface NumpadProps {
  onKeyPress: (key: string) => void;
  theme: {
    inputBg: string;
    textPrimary: string;
    primaryColor: string;
  };
}

// Define the layout of the numpad keys
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

export default function Numpad({ onKeyPress, theme }: NumpadProps) {
  return (
    <View className="w-full flex-row flex-wrap justify-center p-2 mb-2">
      {keys.map((key) => (
        <TouchableOpacity
          key={key}
          onPress={() => onKeyPress(key)}
          className={`w-1/3 items-center justify-center p-4`}
          activeOpacity={0.6}>
          <View className={`h-16 w-16 items-center justify-center rounded-full ${theme.inputBg}`}>
            {key === 'backspace' ? (
              <Delete size={28} color={theme.primaryColor} />
            ) : (
              <Text className={`text-3xl font-semibold ${theme.textPrimary}`}>{key}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
