import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ArrowLeft, Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { LuckyEggCard } from '@/components/common/lucky-egg-card';
import { XP_MULTIPLIERS, GAME_CONSTANTS } from '@/types/xp-constants';
import { Button } from '@/components/ui/button';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FriendshipInputs {
  good_friends: string;
  great_friends: string;
  ultra_friends: string;
  best_friends: string;
  lucky_egg: boolean;
}

interface FriendshipXPCalculatorProps {
  onBack: () => void;
}

export function FriendshipXPCalculator({ onBack }: FriendshipXPCalculatorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [inputs, setInputs] = useState<FriendshipInputs>({
    good_friends: '',
    great_friends: '',
    ultra_friends: '',
    best_friends: '',
    lucky_egg: false,
  });

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const goodFriends = Number.parseInt(inputs.good_friends) || 0;
    const greatFriends = Number.parseInt(inputs.great_friends) || 0;
    const ultraFriends = Number.parseInt(inputs.ultra_friends) || 0;
    const bestFriends = Number.parseInt(inputs.best_friends) || 0;

    totalXP += goodFriends * XP_MULTIPLIERS.friendship.good_friends;
    totalXP += greatFriends * XP_MULTIPLIERS.friendship.great_friends;
    totalXP += ultraFriends * XP_MULTIPLIERS.friendship.ultra_friends;
    totalXP += bestFriends * XP_MULTIPLIERS.friendship.best_friends;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const handleNumberInput = (
    field: keyof Pick<
      FriendshipInputs,
      'good_friends' | 'great_friends' | 'ultra_friends' | 'best_friends'
    >,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      // Limit to 450
      if (int_value > GAME_CONSTANTS.MAX_FRIENDSHIP) {
        value = GAME_CONSTANTS.MAX_FRIENDSHIP.toString();
      }
      updateInput(field, value);
    }
  };

  const updateInput = (field: keyof FriendshipInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalXP = calculateTotalXP();

  const styles = createStyles(isDark);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Button onPress={onBack} size="icon" variant="ghost" className="rounded-full">
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={20} color="#ef4444" />
            </TouchableOpacity>
          </Button>
          <View style={{ flex: 1 }}>
            <MaskedView
              maskElement={
                <Text className="bg-transparent text-xl font-bold">Friendship XP Calculator</Text>
              }>
              <LinearGradient
                colors={['#FF5722', '#E60073']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text className="text-xl font-bold opacity-0">Friendship XP Calculator</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="mt-1 text-sm text-muted-foreground">
              Calculate XP from friendship levels
            </Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Calculator Content */}
        <View style={styles.main}>
          {/* Lucky Egg Toggle */}
          {/* <LuckyEggCard
            isActive={inputs.lucky_egg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          /> */}

          {/* Input Fields */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={styles.cardTitle}>
                <Calculator size={20} color="#ef4444" />
                <Text style={styles.cardTitleText}>Friendship Activities</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.inputGrid}>
                {/* Good Friends */}
                <View style={styles.inputWrapper}>
                  <Label>Good Friends</Label>
                  <TextInput
                    keyboardType="numeric"
                    value={inputs.good_friends}
                    onChangeText={(value) => handleNumberInput('good_friends', value)}
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text style={styles.helperText}>
                    +{XP_MULTIPLIERS.friendship.good_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Great Friends */}
                <View style={styles.inputWrapper}>
                  <Label>Great Friends</Label>
                  <TextInput
                    keyboardType="numeric"
                    value={inputs.great_friends}
                    onChangeText={(value) => handleNumberInput('great_friends', value)}
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text style={styles.helperText}>
                    +{XP_MULTIPLIERS.friendship.great_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Ultra Friends */}
                <View style={styles.inputWrapper}>
                  <Label>Ultra Friends</Label>
                  <TextInput
                    keyboardType="numeric"
                    value={inputs.ultra_friends}
                    onChangeText={(value) => handleNumberInput('ultra_friends', value)}
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text style={styles.helperText}>
                    +{XP_MULTIPLIERS.friendship.ultra_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Best Friends */}
                <View style={styles.inputWrapper}>
                  <Label>Best Friends</Label>
                  <TextInput
                    keyboardType="numeric"
                    value={inputs.best_friends}
                    onChangeText={(value) => handleNumberInput('best_friends', value)}
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  />
                  <Text style={styles.helperText}>
                    +{XP_MULTIPLIERS.friendship.best_friends.toLocaleString()} XP each
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card style={styles.resultsCard}>
            <CardContent style={styles.resultsContent}>
              <View style={styles.resultsInner}>
                <Text style={styles.resultsLabel}>Total XP Earned</Text>
                <Text style={styles.resultsValue}>{totalXP.toLocaleString()}</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
    },
    scrollContent: {
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      paddingBottom: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ef4444',
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginTop: 4,
    },
    main: {
      paddingHorizontal: 24,
      gap: 24,
    },
    card: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 12,
      marginBottom: 24,
    },
    cardTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardTitleText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    inputGrid: {
      gap: 16,
    },
    inputWrapper: {
      gap: 8,
    },
    input: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
      padding: 12,
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 16,
    },
    helperText: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    resultsCard: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.4)',
      borderRadius: 12,
    },
    resultsContent: {
      padding: 24,
    },
    resultsInner: {
      alignItems: 'center',
      gap: 8,
    },
    resultsLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    resultsValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#ef4444',
    },
  });
