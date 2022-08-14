import { createContext } from 'react';

export const ColorContext = createContext<{
  value?: string;
  setValue?: (value: string) => void;
}>({});
