import { ActionIcon, Group, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import { ColorControl } from '../ColorControl/ColorControl';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const handlePrimaryColorChange = (color: string) => {
    theme.primaryColor = color;
  };

  return (
    <Group position="center" mt="xl">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="xl"
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
      <ColorControl onChange={handlePrimaryColorChange} value={theme.primaryColor} />
    </Group>
  );
}
