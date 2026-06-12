import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ style, ...props }: ThemedViewProps) {
  return <View style={[{ backgroundColor: '#fff' }, style]} {...props} />;
}