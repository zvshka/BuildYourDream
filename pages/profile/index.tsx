import {
  Button,
  Center,
  Container,
  createStyles,
  Grid,
  Image,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../../components/Layout';
import { uploadImageMutation } from '../../components/hooks/images';
import { storage } from '../../lib/utils';

export default function ProfilePage() {
  const { user, refetch } = useAuth();

  const imageUpload = useMutation(uploadImageMutation);

  const updateProfileMutattion = useMutation(
    (data: any) =>
      axios.patch('/api/auth/me', data, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно изменили профиль',
          color: 'green',
        });
        refetch();
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleImageUpload = async (files: FileWithPath[]) => {
    const formData = new FormData();
    formData.append('upload', files[0]);
    const response = await imageUpload.mutateAsync(formData);
    if (response && response.data.url) {
      updateProfileMutattion.mutate({
        avatarUrl: response.data.url,
      });
    }
  };

  const handleResetImage = () => {
    updateProfileMutattion.mutate({
      avatarUr: null,
    });
  };

  //TODO: Refactor

  return (
    <Container size="xl" px={0}>
      <Grid>
        <Grid.Col span="auto">
          <Stack>
            <Block>
              <Stack>
                <Dropzone p={0} onDrop={handleImageUpload} maxFiles={1} accept={IMAGE_MIME_TYPE}>
                  <Image
                    styles={{
                      image: {
                        position: 'absolute',
                      },
                      imageWrapper: {
                        '&::after': {
                          content: "''",
                          display: 'block',
                          paddingBottom: '100%',
                        },
                      },
                    }}
                    width="100%"
                    height="100%"
                    src={user?.avatarUrl}
                    alt="avatar"
                    withPlaceholder
                  />
                </Dropzone>
                <Button onClick={handleResetImage} disabled={user?.avatarUrl?.length === 0}>
                  Сбросить
                </Button>
              </Stack>
            </Block>
            <Block>
              <Center>
                <Title order={3}>{user?.username}</Title>
              </Center>
            </Block>
            <Block>
              <Center>
                <Text>{user?.role}</Text>
              </Center>
            </Block>
          </Stack>
        </Grid.Col>
        <Grid.Col sm={8}>
          <Tabs variant="pills" defaultValue="info">
            <Block>
              <Tabs.List>
                <Tabs.Tab value="info">Информация обо мне</Tabs.Tab>
                <Tabs.Tab value="configs">Мои сборки</Tabs.Tab>
                <Tabs.Tab value="reports">Мои жалобы</Tabs.Tab>
                <Tabs.Tab value="components">Мои компоненты</Tabs.Tab>
                <Tabs.Tab value="likedConfigs">Понравившиеся сборки</Tabs.Tab>
              </Tabs.List>
            </Block>
            <Tabs.Panel value="info" mt="md">
              <Stack>
                <Block>
                  <Textarea minRows={7} label="Биография" />
                </Block>
                <Block h={200}>
                  <Center h="100%">
                    <Stack>
                      <Title order={3}>Ваша сборка</Title>
                      <Button>Выбрать</Button>
                    </Stack>
                  </Center>
                </Block>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
