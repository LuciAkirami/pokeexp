import React from 'react';
import { View, Text, TextInput } from 'react-native';
// Assuming your Label is also a component
import { Label } from '@/components/ui/label';
import { DetailedXPInputs } from '@/types/xp-calculator';

// Define the component's props with TypeScript
type XpInputBlockProps = {
  label: string;
  inputKey: keyof DetailedXPInputs;
  value: string;
  xpAmount: number;
  onInputChange: (field: keyof DetailedXPInputs, value: string) => void;
  // Pass in the theme/style variables as props
  inputBg: string;
  textPrimary: string;
  borderColor: string;
  placeholderTextColor: string;
  textSecondary: string;
};

// Use React.FC (Functional Component) and type its props
const XpInputBlock: React.FC<XpInputBlockProps> = ({
  label,
  inputKey,
  value,
  xpAmount,
  onInputChange,
  inputBg,
  textPrimary,
  borderColor,
  placeholderTextColor,
  textSecondary,
}) => {
  return (
    <View className="mb-4 w-[48%] gap-2">
      <Label>{label}</Label>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={(val) => onInputChange(inputKey, val)}
        className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
        placeholder="0"
        placeholderTextColor={placeholderTextColor}
      />
      <Text className={`text-xs ${textSecondary}`}>+{xpAmount} XP each</Text>
    </View>
  );
};

export default XpInputBlock;
