import { ActionIcon, Group, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { useContext } from 'react';
import { ColorControl } from '../ColorControl/ColorControl';
import { ColorContext } from '../ColorControl/ColorContext';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { setValue: changeColor } = useContext(ColorContext);

  return (
    <Group position="center">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="md"
        sx={(th) => ({
          backgroundColor: th.colorScheme === 'dark' ? th.colors.dark[6] : th.colors.gray[0],
          color: th.colorScheme === 'dark' ? th.colors.yellow[4] : th.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoonStars size={20} stroke={1.5} />
        )}
      </ActionIcon>
      <ColorControl onChange={changeColor!} value={theme.primaryColor} />
    </Group>
  );
}
