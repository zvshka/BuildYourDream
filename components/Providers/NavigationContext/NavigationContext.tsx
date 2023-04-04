import { createContext, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';

const NavigationContext = createContext<{
  opened: boolean;
  setOpened: () => void;
  setClosed: () => void;
}>({
  opened: false,
  setClosed(): void {},
  setOpened(): void {},
});

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const setOpened = () => {
    if (!opened) open();
  };

  const setClosed = () => {
    if (opened) close();
  };

  return (
    <NavigationContext.Provider value={{ opened, setOpened, setClosed }}>
      {children}
    </NavigationContext.Provider>
  );
};
