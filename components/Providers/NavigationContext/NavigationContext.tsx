import { createContext, useContext, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

const NavigationContext = createContext<{
  handleOpen: () => void;
  handleClose: () => void;
  setHandler: (handler: any) => void;
  setCloseAll: (handler: any) => void;
  isOpened: boolean;
}>({
  handleOpen(): void {},
  handleClose(): void {},
  setHandler(): void {},
  setCloseAll(): void {},
  isOpened: false,
});

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [openHandler, setHandler] = useState(() => () => {});
  const [closeAll, setCloseAll] = useState(() => () => {});
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpen = () => {
    openHandler && openHandler();
    open();
  };

  const handleClose = () => {
    closeAll && closeAll();
    close();
  };

  return (
    <NavigationContext.Provider
      value={{
        handleOpen,
        handleClose,
        setHandler,
        setCloseAll,
        isOpened: opened,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
