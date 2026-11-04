import { Platform } from 'react-native';

export const colors = {
  bg: '#F3F6F5',
  surface: '#FFFFFF',
  ink: '#0B2B2A',
  muted: '#5E7472',
  line: '#E1E9E7',
  primary: '#0F5E59',
  primaryDark: '#0A3F3C',
  primarySoft: '#DDF1EC',
  accent: '#E9B949',
  danger: '#B42318',
  dangerSoft: '#FEF3F2',
  dangerLine: '#FECDCA',
  body: '#3E9C8F',
  mind: '#7A8FD6',
  gut: '#E9B949',
};

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

export const shadow = Platform.select({
  web: { boxShadow: '0 8px 30px rgba(11,43,42,0.08)' } as any,
  default: {
    shadowColor: '#0B2B2A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});