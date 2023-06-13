import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Image,
  MediaQuery,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { IconCurrencyRubel, IconFlag, IconPencil, IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { Block, Comments, ComponentRow, PageHeader } from '../../components/Layout';
import { useConfigData } from '../../components/hooks/configs';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { storage } from '../../lib/utils';
import { queryClient } from '../../components/Providers/QueryProvider/QueryProvider';
import { ReportForm } from '../../components/Layout/forms';

const UpdateConfigForm = ({ configData }: { configData: any }) => {
  const form = useForm({
    initialValues: {
      title: configData.title || '',
      description: configData.description || '',
    },
  });

  const updateConfigMutation = useMutation(
    (data: typeof form.values) =>
      axios.patch(`/api/configs/${configData.id}`, data, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно изменили сборку',
          color: 'green',
        });
        queryClient.invalidateQueries(['configs', 'list', configData.id]);
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

  const handleSubmit = (values: typeof form.values) => {
    updateConfigMutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Название сборки"
          maxLength={50}
          required
          {...form.getInputProps('title')}
          description={`${form.values.title.length} / 50`}
        />
        <Textarea
          minRows={4}
          autosize
          maxLength={500}
          required
          {...form.getInputProps('description')}
          description={`${form.values.description.length} / 500`}
        />
        <Button type="submit">Отправить</Button>
      </Stack>
    </form>
  );
};

export default function ConfigPage() {
  const router = useRouter();
  const { openModal, openConfirmModal } = useModals();
  const { data: configData, isSuccess } = useConfigData(router.query.configId as string);

  const { user } = useAuth();

  if (isSuccess && !configData) router.push('/configs');

  const deleteConfigMutation = useMutation(
    () =>
      axios.delete(`/api/configs/${router.query.configId}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно удалили сборку',
          color: 'green',
        });
        queryClient.invalidateQueries(['configs', 'lsit']);
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

  const handleUpdate = () => {
    openModal({
      title: 'Изменение сборки',
      children: <UpdateConfigForm configData={configData} />,
    });
  };

  const handleReport = () => {
    openModal({
      title: 'Жалоба на сборку',
      children: <ReportForm configId={configData?.id} />,
    });
  };

  const handleDelete = () => {
    openConfirmModal({
      title: 'Удаление сборки',
      children: (
        <Text>Вы собираетесь удалить сборку с названием {configData?.title}, продолжить?</Text>
      ),
      labels: {
        confirm: 'Да',
        cancel: 'Нет',
      },
      onConfirm() {
        deleteConfigMutation.mutate();
      },
    });
  };

  return (
    isSuccess &&
    !!configData && (
      <Container size="xl" px={0}>
        <Stack>
          <PageHeader
            title={isSuccess ? configData.title : ''}
            addBack
            rightSection={
              isSuccess &&
              user && (
                <Box sx={{ height: '100%' }}>
                  <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                    <Group>
                      {user.id !== configData.authorId && (
                        <Button color="red" leftIcon={<IconFlag />} onClick={handleReport}>
                          Пожаловаться
                        </Button>
                      )}
                      {user.id === configData.authorId && (
                        <Button leftIcon={<IconPencil />} onClick={handleUpdate}>
                          Изменить
                        </Button>
                      )}
                      {(user.id === configData.authorId || user.role !== 'USER') && (
                        <Button leftIcon={<IconTrash />} color="red" onClick={handleDelete}>
                          Удалить
                        </Button>
                      )}
                    </Group>
                  </MediaQuery>
                  <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                    <Group>
                      {user.id !== configData.authorId && (
                        <ActionIcon variant="filled" color="red" onClick={handleReport}>
                          <IconFlag />
                        </ActionIcon>
                      )}
                      {user.id === configData.authorId && (
                        <ActionIcon color="blue" variant="filled" onClick={handleUpdate}>
                          <IconPencil />
                        </ActionIcon>
                      )}
                      {(user.id === configData.authorId || user.role !== 'USER') && (
                        <ActionIcon color="red" onClick={handleDelete}>
                          <IconTrash />
                        </ActionIcon>
                      )}
                    </Group>
                  </MediaQuery>
                </Box>
              )
            }
          />
          <Grid columns={3}>
            <Grid.Col span="auto">
              <Stack>
                <Block>
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
                    src={configData.author.avatarUrl}
                    alt="avatar"
                    withPlaceholder
                  />
                </Block>
                <Block>
                  <Center>
                    <Title order={3}>{configData.author.username}</Title>
                  </Center>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Примерная цена:
                    </Text>
                    <Group spacing={2}>
                      <Text size={20}>{configData.price.join(' - ')}</Text>
                      <IconCurrencyRubel size={18} />
                    </Group>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Наша оценка
                    </Text>
                    <Text size={20}>{configData.configTier}</Text>
                  </Stack>
                </Block>
              </Stack>
            </Grid.Col>
            <Grid.Col xs={3} sm={2}>
              <Tabs defaultValue="info">
                <Block>
                  <Tabs.List>
                    <Tabs.Tab value="info">Информация</Tabs.Tab>
                    <Tabs.Tab value="comments">Комментарии</Tabs.Tab>
                  </Tabs.List>
                </Block>
                <Tabs.Panel value="info" mt="xs">
                  <Stack>
                    <Block>
                      <Text>{isSuccess && configData.description}</Text>
                    </Block>
                    <Stack>
                      {isSuccess &&
                        configData.components.map((c) => (
                          <Block key={c.id}>
                            <ComponentRow
                              component={c.component.data}
                              templateId={c.component.templateId}
                              avgRating={c.component.avgRating || 0}
                            />
                          </Block>
                        ))}
                    </Stack>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="comments" mt="xs">
                  <Comments configId={router.query.configId as string} />
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    )
  );
}
