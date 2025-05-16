import 'styled-components';
import type { ThemeType } from '@/styles/types';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
} 