import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

export function ReactQueryProvider({
  children,
}: {
  children?: ReactElement[] | ReactElement | string;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {/*<ReactQueryDevtools />*/}
      {children}
    </QueryClientProvider>
  );
}
