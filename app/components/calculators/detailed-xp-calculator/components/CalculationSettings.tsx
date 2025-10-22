import { useState } from 'react';
import { View, Text, Switch, Pressable, Platform, TextInput } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DetailedXPInputs } from '@/types/xp-calculator';

// Define theme props
type ThemeProps = {
  cardBg: string;
  cardBorderColor: string;
  inputBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  placeholderTextColor: string;
  primaryColor: string;
};

interface CalculationSettingsProps {
  inputs: DetailedXPInputs;
  updateInput: (field: keyof DetailedXPInputs, value: string | boolean) => void;
  handleNumberInput: (field: keyof DetailedXPInputs, value: string) => void;
  theme: ThemeProps;
}

export function CalculationSettings({
  inputs,
  updateInput,
  handleNumberInput,
  theme,
}: CalculationSettingsProps) {
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      updateInput('target_date', selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
      <CardContent className="gap-4 pt-6">
        {/* Target Timeline Toggle */}
        <View className="gap-4">
          <View
            collapsable={false}
            className={`flex-row items-center justify-between rounded-lg p-4 ${theme.inputBg} border ${theme.borderColor}`}>
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-2">
                <Calendar color={theme.primaryColor} size={20} />
                <Text
                  className={`flex-row items-center text-base font-semibold ${theme.textPrimary}`}>
                  Set Target Timeline
                </Text>
              </View>
              <Text className={`text-sm ${theme.textSecondary}`}>
                Calculate daily XP needed for a target
              </Text>
            </View>
            <Switch
              value={inputs.use_target_timeline}
              onValueChange={(val) => updateInput('use_target_timeline', val)}
              trackColor={{ false: '#767577', true: '#fca5a5' }}
              thumbColor={inputs.use_target_timeline ? theme.primaryColor : '#f4f3f4'}
            />
          </View>

          {inputs.use_target_timeline && (
            <>
              <View className="flex-row items-center justify-between">
                <Label>Target Timeline</Label>
                <View className="flex-row items-center gap-2">
                  <Text
                    className={
                      inputs.target_type === 'date' ? 'text-primary' : theme.textSecondary
                    }>
                    Date
                  </Text>
                  <Switch
                    value={inputs.target_type === 'days'}
                    onValueChange={(val) => updateInput('target_type', val ? 'days' : 'date')}
                    trackColor={{ false: '#767577', true: '#fca5a5' }}
                    thumbColor={inputs.target_type === 'days' ? theme.primaryColor : '#f4f3f4'}
                  />
                  <Text
                    className={
                      inputs.target_type === 'days' ? 'text-primary' : theme.textSecondary
                    }>
                    Days
                  </Text>
                </View>
              </View>

              {inputs.target_type === 'days' && (
                <TextInput
                  keyboardType="numeric"
                  value={inputs.target_days}
                  onChangeText={(val) => handleNumberInput('target_days', val)}
                  className={`rounded-lg p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor}`}
                  placeholder="Number of days"
                  placeholderTextColor={theme.placeholderTextColor}
                />
              )}
              {inputs.target_type === 'date' && (
                <View>
                  <Pressable
                    onPress={() => setShowPicker(true)}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 8,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}>
                    <Text className={`${theme.textPrimary}`}>{inputs.target_date}</Text>
                  </Pressable>

                  {showPicker && (
                    <DateTimePicker
                      value={new Date(inputs.target_date)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDateChange}
                    />
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* Lucky Egg Toggle */}
        <View
          collapsable={false}
          className={`flex-row items-center justify-between rounded-lg p-4 ${theme.inputBg} border ${theme.borderColor}`}>
          <View className="flex-1 gap-1">
            <Text className={`text-base font-semibold ${theme.textPrimary}`}>Lucky Egg Active</Text>
            <Text className={`text-sm ${theme.textSecondary}`}>Double XP for daily activities</Text>
          </View>
          <Switch
            value={inputs.lucky_egg}
            onValueChange={(val) => updateInput('lucky_egg', val)}
            trackColor={{ false: '#767577', true: '#fca5a5' }}
            thumbColor={inputs.lucky_egg ? theme.primaryColor : '#f4f3f4'}
          />
        </View>
      </CardContent>
    </Card>
  );
}
