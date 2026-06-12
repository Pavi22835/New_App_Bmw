import { Tabs } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabItems = [
  { name: 'index', icon: '🏠' },
  { name: 'favorites', icon: '🛒' },
  { name: 'recent-cars', icon: '🕐' },
  { name: 'compare', icon: '⚖️' },
  { name: 'profile', icon: '👤' },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const backgroundColor = scheme === 'dark' ? '#1e1e1e' : '#ffffff';

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { backgroundColor, paddingBottom: insets.bottom }]}
    >
      <View style={[styles.container, { backgroundColor, borderTopColor: '#e0e0e0' }]}> 
        {tabItems.map((tab, index) => {
          const isFocused = state.index === index;
          const route = state.routes[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.button}
            >
              <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <Text style={[styles.icon, { color: isFocused ? '#0066B4' : '#999' }]}>{tab.icon}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name='index' />
      <Tabs.Screen name='favorites' />
      <Tabs.Screen name='recent-cars' />
      <Tabs.Screen name='compare' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 102, 180, 0.12)',
  },
  icon: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
});
