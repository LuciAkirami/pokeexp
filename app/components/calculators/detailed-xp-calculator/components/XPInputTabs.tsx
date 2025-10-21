import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import XpInputBlock from '../../../common/XpInputBlock'; // Adjusted path
import { TABS } from '../constants'; // Adjusted path
import {
  catchingInputsConfig,
  evolutionInputsConfig,
  hatchingInputsConfig,
  raidInputsConfig,
  maxBattleInputsConfig,
  maxMovesInputsConfig,
  friendshipInputsConfig,
} from '@/config/xp-ui-configs';
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
  tabTextColor: string;
};

interface XPInputTabsProps {
  inputs: DetailedXPInputs;
  handleNumberInput: (field: keyof DetailedXPInputs, value: string) => void;
  theme: ThemeProps;
}

export function XPInputTabs({ inputs, handleNumberInput, theme }: XPInputTabsProps) {
  const [activeTab, setActiveTab] = useState('catching');

  return (
    <View className="gap-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className={`flex-row rounded-lg p-1 ${theme.inputBg}`}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`rounded-md px-4 py-2 ${activeTab === tab.key ? 'bg-primary' : ''}`}>
              <Text
                className={
                  activeTab === tab.key
                    ? `font-semibold ${theme.tabTextColor}`
                    : theme.textSecondary
                }>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Render Active Tab Content */}
      {activeTab === 'catching' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary}`}>Catching Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap justify-between">
              {catchingInputsConfig.map((input) => (
                <XpInputBlock
                  key={input.stateKey}
                  label={input.label}
                  inputKey={input.stateKey}
                  value={inputs[input.stateKey]}
                  xpAmount={input.xp}
                  onInputChange={handleNumberInput}
                  inputBg={theme.inputBg}
                  textPrimary={theme.textPrimary}
                  borderColor={theme.borderColor}
                  placeholderTextColor={theme.placeholderTextColor}
                  textSecondary={theme.textSecondary}
                />
              ))}
            </View>
          </CardContent>
        </Card>
      )}
      {activeTab === 'evolution' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={`${theme.textPrimary}`}>Evolution Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row flex-wrap justify-between">
              {evolutionInputsConfig.map((input) => (
                <XpInputBlock
                  key={input.stateKey}
                  label={input.label}
                  inputKey={input.stateKey}
                  value={inputs[input.stateKey]}
                  xpAmount={input.xp}
                  onInputChange={handleNumberInput}
                  inputBg={theme.inputBg}
                  textPrimary={theme.textPrimary}
                  borderColor={theme.borderColor}
                  placeholderTextColor={theme.placeholderTextColor}
                  textSecondary={theme.textSecondary}
                />
              ))}
            </View>
          </CardContent>
        </Card>
      )}
      {activeTab === 'hatching' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>Egg Hatching</CardTitle>
          </CardHeader>
          <CardContent className="flex-row flex-wrap justify-between">
            {hatchingInputsConfig.map((input) => (
              <XpInputBlock
                key={input.stateKey}
                label={input.label}
                inputKey={input.stateKey}
                value={inputs[input.stateKey]}
                xpAmount={input.xp}
                onInputChange={handleNumberInput}
                inputBg={theme.inputBg}
                textPrimary={theme.textPrimary}
                borderColor={theme.borderColor}
                placeholderTextColor={theme.placeholderTextColor}
                textSecondary={theme.textSecondary}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {activeTab === 'raids' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>Raids</CardTitle>
          </CardHeader>
          <CardContent className="flex-row flex-wrap justify-between">
            {raidInputsConfig.map((input) => (
              <XpInputBlock
                key={input.stateKey}
                label={input.label}
                inputKey={input.stateKey}
                value={inputs[input.stateKey]}
                xpAmount={input.xp}
                onInputChange={handleNumberInput}
                inputBg={theme.inputBg}
                textPrimary={theme.textPrimary}
                borderColor={theme.borderColor}
                placeholderTextColor={theme.placeholderTextColor}
                textSecondary={theme.textSecondary}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {activeTab === 'battles' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>Max Battles</CardTitle>
          </CardHeader>
          <CardContent className="flex-row flex-wrap justify-between">
            {maxBattleInputsConfig.map((input) => (
              <XpInputBlock
                key={input.stateKey}
                label={input.label}
                inputKey={input.stateKey}
                value={inputs[input.stateKey]}
                xpAmount={input.xp}
                onInputChange={handleNumberInput}
                inputBg={theme.inputBg}
                textPrimary={theme.textPrimary}
                borderColor={theme.borderColor}
                placeholderTextColor={theme.placeholderTextColor}
                textSecondary={theme.textSecondary}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {activeTab === 'moves' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>Max Moves</CardTitle>
          </CardHeader>
          <CardContent className="flex-row flex-wrap justify-between">
            {maxMovesInputsConfig.map((input) => (
              <XpInputBlock
                key={input.stateKey}
                label={input.label}
                inputKey={input.stateKey}
                value={inputs[input.stateKey]}
                xpAmount={input.xp}
                onInputChange={handleNumberInput}
                inputBg={theme.inputBg}
                textPrimary={theme.textPrimary}
                borderColor={theme.borderColor}
                placeholderTextColor={theme.placeholderTextColor}
                textSecondary={theme.textSecondary}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {activeTab === 'friendship' && (
        <Card className={`${theme.cardBg} ${theme.cardBorderColor}`}>
          <CardHeader>
            <CardTitle className={theme.textPrimary}>Friendship Levels</CardTitle>
          </CardHeader>
          <CardContent className="flex-row flex-wrap justify-between">
            {friendshipInputsConfig.map((input) => (
              <XpInputBlock
                key={input.stateKey}
                label={input.label}
                inputKey={input.stateKey}
                value={inputs[input.stateKey]}
                xpAmount={input.xp}
                onInputChange={handleNumberInput}
                inputBg={theme.inputBg}
                textPrimary={theme.textPrimary}
                borderColor={theme.borderColor}
                placeholderTextColor={theme.placeholderTextColor}
                textSecondary={theme.textSecondary}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </View>
  );
}
