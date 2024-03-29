import {
  Button,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { Block, ComponentsList, PageHeader, ReportsList } from '../../components/Layout';
import { uploadImageMutation } from '../../components/hooks/images';
import { storage } from '../../lib/utils';
import { ConfigsList } from '../../components/Layout/specific/ConfigsList';
import { ViolationsList } from '../../components/Layout/specific/ViolationsList/ViolationsList';
import { ReviewsList } from '../../components/Layout/specific/ReviewsList/ReviewsList';

export default function ProfilePage() {
  const { user, refetch } = useAuth();

  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setBio(user.bio as string);
    }
  }, [user]);

  const imageUpload = useMutation(uploadImageMutation);

  const updateProfileMutation = useMutation(
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

  const verifyEmailMutation = useMutation(
    () =>
      axios.get('/api/auth/verify/send', {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Письмо с ссылкой успшешно отправлено на почту',
          color: 'green',
        });
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

  const resetMutation = useMutation(
    () =>
      axios.post('/api/auth/reset/send', {
        toFind: user?.username,
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'На почту была выслана ссылка',
          color: 'green',
        });
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
      updateProfileMutation.mutate({
        avatarUrl: response.data.url,
      });
    }
  };

  const handleResetImage = () => {
    updateProfileMutation.mutate({
      avatarUr: null,
    });
  };

  const handleSaveBio = () => {
    updateProfileMutation.mutate({
      avatarUrl: user?.avatarUrl,
      bio,
    });
  };

  const handleSendVerify = () => {
    verifyEmailMutation.mutate();
  };
  const handleSendReset = () => {
    resetMutation.mutate();
  };

  return (
    <Container size="xl" px={0}>
      <PageHeader title="Ваш профиль" addBack />
      <Grid mt="sm">
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
                <Text>
                  {user?.role === 'ADMIN'
                    ? 'Администратор'
                    : user?.role === 'MODERATOR'
                    ? 'Модератор'
                    : 'Пользователь'}
                </Text>
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
                <Tabs.Tab value="likedConfigs">Понравившиеся сборки</Tabs.Tab>
                <Tabs.Tab value="components">Мои компоненты</Tabs.Tab>
                <Tabs.Tab value="reviews">Мои отзывы</Tabs.Tab>
                <Tabs.Tab value="reports">Мои жалобы</Tabs.Tab>
                <Tabs.Tab value="warns">История нарушений</Tabs.Tab>
              </Tabs.List>
            </Block>
            <Tabs.Panel value="info" mt="md">
              <Stack>
                <Block>
                  <Group>
                    <Button
                      onClick={handleSendVerify}
                      disabled={!user || user.emailVerification?.doneAt}
                    >
                      Подтвердить Email
                    </Button>
                    <Button
                      onClick={handleSendReset}
                      disabled={!user || !user.emailVerification?.doneAt}
                    >
                      Поменять пароль
                    </Button>
                  </Group>
                </Block>
                <Block>
                  <Stack>
                    <Textarea
                      autosize
                      minRows={7}
                      maxRows={15}
                      label="Биография"
                      value={bio || undefined}
                      maxLength={1200}
                      description={`${bio?.length || 0} / 1200`}
                      onChange={(event) => setBio(event.currentTarget.value)}
                    />
                    <Button onClick={handleSaveBio}>Сохранить</Button>
                  </Stack>
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
            <Tabs.Panel value="configs" mt="md">
              {user && <ConfigsList username={user.username} />}
            </Tabs.Panel>
            <Tabs.Panel value="reports" mt="md">
              {user && <ReportsList username={user.username} />}
            </Tabs.Panel>
            <Tabs.Panel value="components" mt="md">
              {user && <ComponentsList username={user.username} />}
            </Tabs.Panel>
            <Tabs.Panel value="likedConfigs" mt="md">
              {user && <ConfigsList liked />}
            </Tabs.Panel>
            <Tabs.Panel value="warns" mt="md">
              {user && <ViolationsList username={user.username} />}
            </Tabs.Panel>
            <Tabs.Panel value="reviews" mt="md">
              {user && <ReviewsList username={user.username} />}
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
