import { GetServerSidePropsContext } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import duration from 'dayjs/plugin/duration';
import calendar from 'dayjs/plugin/calendar';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { useRouter } from 'next/router';
import { RouterTransition } from '../components/Layout/general/RouterTransition/RouterTransition';
import { ColorProvider } from '../components/Layout/general/ColorControl/ColorContext';
import 'dayjs/locale/ru';
import { ReactQueryProvider } from '../components/Providers/QueryProvider/QueryProvider';
import { AuthProvider } from '../components/Providers/AuthContext/AuthWrapper';

// import 'react-querybuilder/dist/query-builder.css';
import { NavigationProvider } from '../components/Providers/NavigationContext/NavigationContext';
// eslint-disable-next-line import/order
import { ContextMenuProvider } from 'mantine-contextmenu';
import Layout from '../components/Layout/Layout';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(calendar);

// dayjs.locale('ru');

export default function App(props: AppProps & { colorScheme: ColorScheme; primaryColor: string }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [primaryColor, setPrimaryColor] = useState(props.primaryColor);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };
  //
  const changePrimaryColor = useCallback(
    (value: string) => {
      setPrimaryColor(value);
      setCookie('mantine-primary-color', value, { maxAge: 60 * 60 * 24 * 30 });
    },
    [primaryColor]
  );

  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'ononline' in window && 'onoffline' in window) {
      setIsOnline(window.navigator.onLine);
      if (!window.ononline) {
        window.addEventListener('online', () => {
          setIsOnline(true);
        });
      }
      if (!window.onoffline) {
        window.addEventListener('offline', () => {
          setIsOnline(false);
        });
      }
    }
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      // @ts-ignore
      window.workbox !== undefined &&
      isOnline
    ) {
      // skip index route, because it's already cached under `start-url` caching object
      if (router.route !== '/') {
        // @ts-ignore
        const wb = window.workbox;
        wb.active.then((worker: any) => {
          wb.messageSW({ action: 'CACHE_NEW_ROUTE' });
        });
      }
    }
  }, [isOnline, router.route]);

  return (
    <>
      <Head>
        <title>Build Your Dream</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="theme-color" content={colorScheme === 'dark' ? '#1A1B1E' : '#FFF'} />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="yandex-verification" content="2e9aaf631b46fef3" />
      </Head>

      <ColorProvider value={primaryColor} setValue={changePrimaryColor}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme, primaryColor }} withGlobalStyles withNormalizeCSS>
            <ContextMenuProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  {/*<DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>*/}
                  <NavigationProvider>
                    <ModalsProvider>
                      <Notifications />
                      <RouterTransition />
                      {/*@ts-ignore*/}
                      {Component.noShell ? (
                        <Component {...pageProps} />
                      ) : (
                        <Layout>
                          <Component {...pageProps} />
                        </Layout>
                      )}
                    </ModalsProvider>
                  </NavigationProvider>
                  {/*</DevSupport>*/}
                </AuthProvider>
              </ReactQueryProvider>
            </ContextMenuProvider>
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
