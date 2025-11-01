import { View, Text, TextInput } from 'react-native';
import { Target } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { DetailedXPInputs } from '@/types/xp-calculator';

// Define theme props
type ThemeProps = {
  cardBg: string;
  cardBorderColor: string;
  inputBg: string;
  textPrimary: string;
  borderColor: string;
  placeholderTextColor: string;
  primaryColor: string;
};

interface LevelProgressFormProps {
  inputs: DetailedXPInputs;
  handleNumberInput: (field: keyof DetailedXPInputs, value: string) => void;
  theme: ThemeProps;
}

export default function LevelProgressForm({ inputs, handleNumberInput, theme }: LevelProgressFormProps) {
  return (
    <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Target color={theme.primaryColor} size={20} />
            <Text className={`text-lg font-semibold ${theme.textPrimary}`}>Level Progress</Text>
          </View>
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
            <Label nativeID="currentLevel">Current Level</Label>
            <TextInput
              keyboardType="numeric"
              value={inputs.currentLevel}
              onChangeText={(val) => handleNumberInput('currentLevel', val)}
              className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor}`}
              placeholder="1"
              placeholderTextColor={theme.placeholderTextColor}
            />
          </View>
          <View className="flex-1 gap-2">
            <Label nativeID="currentXP">Current XP</Label>
            <TextInput
              keyboardType="numeric"
              value={inputs.currentXP}
              onChangeText={(val) => handleNumberInput('currentXP', val)}
              className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor}`}
              placeholder="0"
              placeholderTextColor={theme.placeholderTextColor}
            />
          </View>
          <View className="flex-1 gap-2">
            <Label nativeID="targetLevel">Target Level</Label>
            <TextInput
              keyboardType="numeric"
              value={inputs.targetLevel}
              onChangeText={(val) => handleNumberInput('targetLevel', val)}
              className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor}`}
              placeholder="50"
              placeholderTextColor={theme.placeholderTextColor}
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
