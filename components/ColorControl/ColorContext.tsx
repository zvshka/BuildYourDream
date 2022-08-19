import { createContext, useMemo } from 'react';

export const ColorContext = createContext<{
  value?: string;
  setValue?: (value: string) => void;
}>({});

export const ColorProvider = ({
  children,
  value,
  setValue,
}: {
  children: any;
  value: any;
  setValue: any;
}) =>
  useMemo(
    () => <ColorContext.Provider value={{ value, setValue }}>{children}</ColorContext.Provider>,
    [value]
  );
