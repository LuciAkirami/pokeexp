import { useColorScheme } from 'react-native';

export function useThemeStyles() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    cardBg: isDark ? 'bg-[#1a1a1a]' : 'bg-white',
    cardBorderColor: isDark ? 'border-[#2a2a2a]' : 'border-gray-200',
    inputBg: isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    borderColor: isDark ? 'border-[#2a2a2a]' : 'border-gray-200',
    bg: isDark ? 'bg-black' : 'bg-background',
    placeholderTextColor: isDark ? '#555' : '#ccc',
    primaryColor: '#ef4444', // Red-500
    tabTextColor: isDark ? 'text-black' : 'text-white',
  };
}