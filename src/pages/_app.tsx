import { AppProps } from 'next/app';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import GlobalStyle from '@/styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  const manifestUrl = '/tonconnect-manifest.json';

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}

export default MyApp; 