import '../scripts/wdyr';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { RouterTransition } from '../components/RouterTransition/RouterTransition';
import { ColorProvider } from '../components/ColorControl/ColorContext';
import 'dayjs/locale/ru';
import { ReactQueryProvider } from '../components/QueryProvider/QueryProvider';
import { AuthProvider } from '../components/Auth/AuthProvider';

dayjs.extend(relativeTime);

dayjs.locale('ru');

export default function App(props: AppProps & { colorScheme: ColorScheme; primaryColor: string }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [primaryColor, setPrimaryColor] = useState(props.primaryColor);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  const changePrimaryColor = (value: string) => {
    setPrimaryColor(value);
    setCookie('mantine-primary-color', value, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>Build Your Dream</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </Head>

      <ColorProvider value={primaryColor} setValue={changePrimaryColor}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme, primaryColor }} withGlobalStyles withNormalizeCSS>
            <ModalsProvider>
              <NotificationsProvider>
                <ReactQueryProvider>
                  <AuthProvider>
                    <RouterTransition />
                    <Component {...pageProps} />
                  </AuthProvider>
                </ReactQueryProvider>
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ColorProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
  primaryColor: getCookie('mantine-primary-color', ctx) || 'blue',
});

// App.whyDidYouRender = true;
