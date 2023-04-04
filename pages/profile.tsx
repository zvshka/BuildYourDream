import {
  ActionIcon,
  Box,
  Container,
  createStyles,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Tabs,
  Text,
  Textarea,
} from '@mantine/core';
import {
  IconBrandDiscord,
  IconBrandVk,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react';
import { useAuth } from '../components/Providers/Auth/AuthWrapper';
import { Block } from '../components/Layout';
import { PopupEdit } from '../components/Layout/PopupEdit/PopupEdit';

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
    <Container size="xl">
      <Flex gap="sm">
        <Box>
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
        </Box>
        <Block
          sx={{
            maxWidth: '1400px',
            width: '100%',
          }}
        >
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
              <Box sx={{ height: '100%' }}>
                <Textarea autosize minRows={12} label="Опиши себя" sx={{ height: '100%' }} />
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
              <Box>
                <PopupEdit />
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
              Settings
            </Tabs.Panel>
          </Tabs>
        </Block>
      </Flex>
    </Container>
  );
}
