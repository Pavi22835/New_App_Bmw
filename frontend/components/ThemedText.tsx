import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'defaultSemiBold';
}

export function ThemedText({ style, type, ...props }: ThemedTextProps) {
  let defaultStyle = {};
  
  if (type === 'title') {
    defaultStyle = { fontSize: 28, fontWeight: 'bold', color: '#333' };
  } else if (type === 'subtitle') {
    defaultStyle = { fontSize: 20, fontWeight: '600', color: '#333' };
  } else if (type === 'defaultSemiBold') {
    defaultStyle = { fontSize: 16, fontWeight: '600', color: '#333' };
  } else {
    defaultStyle = { fontSize: 16, color: '#333' };
  }
  
  return <Text style={[defaultStyle, style]} {...props} />;
}