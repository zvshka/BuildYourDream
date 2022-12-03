import {
  ActionIcon,
  Box,
  createStyles,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import {
  IconBrandDiscord,
  IconBrandVk,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from '@tabler/icons';
import { useAuth } from '../components/Auth/AuthProvider';
import { Block } from '../components/Block/Block';

const useStyles = createStyles((theme) => ({
  avatar: {
    width: 256,
    borderRadius: theme.radius.sm,
  },
}));

export default function Profile() {
  const { classes } = useStyles();
  const { user } = useAuth();

  return (
    <>
      <Flex gap="sm">
        <Paper p="sm" shadow="xl">
          <Stack align="center" spacing="xs">
            <Box className={classes.avatar}>
              <Image
                radius="sm"
                src="https://cdn.discordapp.com/avatars/263349725099458566/18993e33fb027e11af9d826d74b37fab.png?size=512"
                alt="avatar"
              />
            </Box>
            <Text weight={600} size="lg">
              {user?.username}
            </Text>
            <Text size="sm">{user?.role}</Text>
            <Group>
              <ActionIcon>
                <IconBrandDiscord />
              </ActionIcon>
              <ActionIcon>
                <IconBrandVk />
              </ActionIcon>
            </Group>
          </Stack>
        </Paper>
        <Block>
          <Tabs radius="xs" defaultValue="gallery">
            <Tabs.List>
              <Tabs.Tab value="general" icon={<IconPhoto size={14} />}>
                Общая информация
              </Tabs.Tab>
              <Tabs.Tab value="messages" icon={<IconMessageCircle size={14} />}>
                Комментарии
              </Tabs.Tab>
              <Tabs.Tab value="configs" icon={<IconSettings size={14} />}>
                Сборки
              </Tabs.Tab>
              <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>
                Настройки
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general" pt="xs">
              Да
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
              Messages tab content
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
              Settings tab content
            </Tabs.Panel>
          </Tabs>
        </Block>
      </Flex>
    </>
  );
}
