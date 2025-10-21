// src/components/GlassCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type GlassCardProps = {
  label: string;
  value: number;
  isDarkMode: boolean;
};

const GlassCard: React.FC<GlassCardProps> = ({ label, value, isDarkMode }) => {
  // --- Define styles based on mode ---
  const gradientColors = isDarkMode
    ? [
        // .dark .glass-card background
        'rgba(255, 255, 255, 0.08)',
        'rgba(255, 255, 255, 0.03)',
        'rgba(255, 255, 255, 0.01)',
      ]
    : [
        // .glass-card background
        'rgba(255, 255, 255, 0.1)',
        'rgba(255, 255, 255, 0.05)',
        'rgba(255, 255, 255, 0.02)',
      ];

  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.18)';

  const shadowStyle = isDarkMode
    ? styles.darkShadow // Use StyleSheet for cleaner shadow props
    : {};

  // --- Expo-Blur Props ---
  // 'backdrop-blur-2xl' is strong. `intensity` is 0-100.
  const intensity = 80;
  const tint = isDarkMode ? 'dark' : 'light';

  return (
    // 1. Outer View for shadow (works on iOS & Android)
    <View style={shadowStyle}>
      {/* 2. Main container for border, rounded corners, and clipping */}
      <View style={[styles.cardContainer, { borderColor: borderColor }]}>
        {/* 3. Blur Layer (absolute positioned) */}
        <BlurView style={StyleSheet.absoluteFill} tint={tint} intensity={intensity} />

        {/* 4. Gradient Layer (absolute positioned) */}
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }} // 135deg
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 5. Content Layer */}
        {/* 'text-center' on the web maps to `items-center` for a View in Nativewind */}
        <View className="items-center p-3">
          {/* Ensure 'text-muted-foreground' and 'text-primary' are
              defined in your tailwind.config.js
          */}
          <Text className="text-sm text-muted-foreground">{label}</Text>
          <Text className="text-lg font-semibold text-primary">{value.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8, // 'rounded-lg'
    overflow: 'hidden', // Clips the BlurView and Gradient
    borderWidth: 1,
  },
  darkShadow: {
    // iOS Shadow (from your CSS: 0 8px 32px 0 rgba(0, 0, 0, 0.6))
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    // Android Shadow (elevation)
    elevation: 16,
  },
});

export default GlassCard;
