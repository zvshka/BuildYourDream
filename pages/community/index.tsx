import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  MediaQuery,
  Modal,
  Pagination,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMediaQuery, useToggle } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { useUnapprovedList } from '../../components/hooks/components';
import { Block } from '../../components/Layout';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { storage } from '../../lib/utils';
import { ApiError } from '../../lib/ApiError';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';
import { useUpdatesList } from '../../components/hooks/updates';
import { DEPENDS_ON, RANGE, SELECT } from '../../types/FieldTypes';

const ReactDiffViewer = dynamic(() => import('react-diff-viewer'), {
  ssr: false,
});

const RejectForm = ({ id, onSubmit }) => {
  const form = useForm({
    initialValues: {
      id,
      reason: '',
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Textarea label="Введите причину отказа" {...form.getInputProps('reason')} />
        <Button type="submit">Отправить</Button>
      </Stack>
    </form>
  );
};

const ComponentsPanel = () => {
  const { user } = useAuth();
  const [activePage, setPage] = useState(1);
  const [filters, setFilters] = useState({
    page: activePage,
  });

  const [showReject, toggle] = useToggle();

  const {
    data: componentsData,
    isSuccess: isComponentsSuccess,
    refetch,
  } = useUnapprovedList(filters);

  useEffect(() => {
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    refetch();
  }, [filters]);

  const rejectComponent = useMutation(
    (data: any) =>
      axios.post(
        '/api/components/reject',
        {
          componentId: data.id,
          reason: data.reason,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно отклонили компонент',
          color: 'green',
        });
        toggle();
        refetch();
      },
      onError: (err: ApiError) => {
        showNotification({
          title: 'Ошибка',
          message: err.stack,
          color: 'red',
        });
      },
    }
  );

  const approveComponent = useMutation(
    (componentId: string) =>
      axios.post(
        '/api/components/approve',
        {
          componentId,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно одобрили компонент',
          color: 'green',
        });
        refetch();
      },
      onError: (err: ApiError) => {
        showNotification({
          title: 'Ошибка',
          message: err.stack,
          color: 'red',
        });
      },
    }
  );

  const handleApprove = (componentId: string) => {
    approveComponent.mutate(componentId);
  };

  const handleReject = () => {
    toggle();
  };

  return (
    <Box sx={{ width: '100%' }} py="xs">
      <Container size="xl" px={0} sx={{ width: '100%' }}>
        <Block my="md" shadow={0}>
          <Pagination
            value={activePage}
            total={
              isComponentsSuccess && componentsData.totalCount > 0
                ? Math.ceil(componentsData.totalCount / 10)
                : 1
            }
            onChange={setPage}
          />
        </Block>
        <Stack>
          {isComponentsSuccess &&
            componentsData.totalCount > 0 &&
            componentsData.result.map((component) => (
              <Box key={component.id}>
                <Modal
                  opened={showReject}
                  onClose={toggle}
                  title="Отклонение добавления компонента"
                >
                  <RejectForm id={component.id} onSubmit={rejectComponent.mutate} />,
                </Modal>
                <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                  <Grid>
                    <Grid.Col span="auto">
                      <Box
                        href={`/components/${component.templateId}/${component.id}`}
                        key={component.id}
                        component={NextLink}
                      >
                        <ComponentRow component={component.data} />
                      </Box>
                    </Grid.Col>
                    {user && user.role === 'ADMIN' && (
                      <Grid.Col span="content">
                        <Block>
                          <Stack>
                            <Button onClick={() => handleApprove(component.id)}>Одобрить</Button>
                            <Button onClick={() => handleReject()}>Отколонить</Button>
                          </Stack>
                        </Block>
                      </Grid.Col>
                    )}
                  </Grid>
                </MediaQuery>
                <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                  <Stack>
                    <Box
                      href={`/components/${component.templateId}/${component.id}`}
                      key={component.id}
                      component={NextLink}
                    >
                      <ComponentRow component={component.data} />
                    </Box>
                    {user && user.role === 'ADMIN' && (
                      <Block>
                        <Stack>
                          <Button onClick={() => handleApprove(component.id)}>Одобрить</Button>
                          <Button onClick={() => handleReject()}>Отколонить</Button>
                        </Stack>
                      </Block>
                    )}
                  </Stack>
                </MediaQuery>
              </Box>
            ))}
          {isComponentsSuccess && componentsData.totalCount === 0 && (
            <Block h={150}>
              <Flex justify="center" h="100%">
                <Center>
                  <Text>Упс... здесь ничего нет</Text>
                </Center>
              </Flex>
            </Block>
          )}
        </Stack>
        <Block mt="md" shadow={0}>
          <Pagination
            value={activePage}
            total={
              isComponentsSuccess && componentsData.totalCount > 0
                ? Math.ceil(componentsData.totalCount / 10)
                : 1
            }
            onChange={setPage}
          />
        </Block>
      </Container>
    </Box>
  );
};

const UpdateRow = ({
  updateData,
  onApprove,
  onReject,
}: {
  updateData: any;
  onApprove: any;
  onReject: any;
}) => {
  const [oldDataText, setOldDataText] = useState('');
  const [newDataText, setNewDataText] = useState('');
  const theme = useMantineTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (updateData.templateToUpdate) {
      const asyncHook = async () => {
        const templateData = updateData.templateToUpdate;
        const oldData = await Promise.all(
          await templateData.fields.map(async (field) => {
            if (field.type === DEPENDS_ON) {
              const { data } = await axios.get(
                `/api/templates/${field.type.depends_on.templateId}`
              );
              const f = data.fields.find((fi) => fi.id === field.type.depends_on.fieldId);
              return `${field.name}: ${field.type} / Зависит от ${data.name} -> ${f.name}`;
            }
            if (field.type === SELECT) {
              return `${field.name}: ${field.type} / ${field.options.join(', ')}`;
            }

            return `${field.name}: ${field.type}`;
          })
        );

        const newData = await Promise.all(
          updateData.data.fields.map(async (field) => {
            if (field.type === DEPENDS_ON) {
              const { data } = await axios.get(
                `/api/templates/${field.type.depends_on.templateId}`
              );
              const f = data.fields.find((fi) => fi.id === field.type.depends_on.fieldId);
              return `${field.name}: ${field.type} / Зависит от ${data.name} -> ${f.name}`;
            }
            if (field.type === SELECT) {
              return `${field.name}: ${field.type} / ${field.options.join(', ')}`;
            }

            return `${field.name}: ${field.type}`;
          })
        );

        setOldDataText(
          `Название: ${templateData.name}\nОбязательное: ${
            templateData.required ? 'Да' : 'Нет'
          }\n${oldData.join('\n')}`
        );
        setNewDataText(
          `Название: ${updateData.data.name}\nОбязательное: ${
            updateData.data.required ? 'Да' : 'Нет'
          }\n${newData.join('\n')}`
        );
      };

      asyncHook();
    } else {
      const componentData = updateData.componentToUpdate;
      const oldData = componentData.template.fields
        .map((field) =>
          field.type === RANGE
            ? `${field.name}: ${componentData.data[field.name][0]} - ${
                componentData.data[field.name][1]
              }`
            : `${field.name}: ${componentData.data[field.name]}`
        )
        .join('\n');
      const newData = componentData.template.fields
        .map((field) =>
          field.type === RANGE
            ? `${field.name}: ${updateData.data[field.name][0]} - ${updateData.data[field.name][1]}`
            : `${field.name}: ${updateData.data[field.name]}`
        )
        .join('\n');

      const oldDataPros = componentData.data.pros.join('\n');
      const oldDataCons = componentData.data.cons.join('\n');

      const newDataPros = updateData.data.pros.join('\n');
      const newDataCons = updateData.data.cons.join('\n');

      setOldDataText(
        `Тир: ${componentData.data.tier}\n${oldData}\nПлюсы:\n${oldDataPros}\nМинусы:\n${oldDataCons}`
      );

      setNewDataText(
        `Тир: ${updateData.data.tier}\n${newData}\nПлюсы:${newDataPros}\nМинусы:${newDataCons}`
      );
    }
  }, []);

  const isSmall = useMediaQuery(theme.fn.smallerThan('sm').replace('@media', ''));

  const [opened, toggle] = useToggle();

  return (
    <Box>
      <Modal opened={opened} onClose={toggle} size={1200} centered title="Изменения">
        <Box sx={{ height: '100%', width: '100%', overflowX: 'auto', display: 'flex' }}>
          <Box sx={{ flex: '1 0 auto', maxWidth: 1800 }}>
            <ReactDiffViewer
              oldValue={oldDataText}
              newValue={newDataText}
              showDiffOnly
              splitView={!isSmall}
            />
          </Box>
        </Box>
      </Modal>
      {updateData.templateToUpdate ? (
        <Block>
          <Grid sx={{ height: '100%' }}>
            <Grid.Col span="auto">
              <Stack>
                <Title mb="sm" order={3}>
                  {updateData.templateToUpdate.name}
                </Title>
                <Text>Изменение категории</Text>
                <Text>Подробности в диалоговом окне по кнопке Изменения</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={12} md="content">
              <Stack justify="center" sx={{ height: '100%' }}>
                <Button onClick={() => toggle()}>Изменения</Button>
                {user && user.role === 'ADMIN' && (
                  <>
                    <Button onClick={() => onApprove(updateData.id)} color="green">
                      Одобрить
                    </Button>
                    <Button onClick={() => onReject(updateData.id)} color="red">
                      Отклонить
                    </Button>
                  </>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Block>
      ) : (
        <Stack spacing="xs">
          <ComponentRow
            component={updateData.componentToUpdate.data}
            rightSide={
              <Stack justify="center" sx={{ height: '100%' }}>
                <Button onClick={() => toggle()}>Изменения</Button>
                {user && user.role === 'ADMIN' && (
                  <>
                    <Button onClick={() => onApprove(updateData.id)} color="green">
                      Одобрить
                    </Button>
                    <Button onClick={() => onReject(updateData.id)} color="red">
                      Отклонить
                    </Button>
                  </>
                )}
              </Stack>
            }
          />
        </Stack>
      )}
    </Box>
  );
};

const UpdatesPanel = () => {
  const { user } = useAuth();
  const [activePage, setPage] = useState(1);
  const [filters, setFilters] = useState({
    page: activePage,
  });

  const [showReject, toggle] = useToggle();

  const { data: updatesData, isSuccess, refetch } = useUpdatesList(filters);

  useEffect(() => {
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    refetch();
  }, [filters]);

  const approveUpdate = useMutation(
    (id: string) =>
      axios.post(
        '/api/updates/approve',
        {
          updateId: id,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно одобрили изменения',
          color: 'green',
        });
        refetch();
      },
      onError: (err: ApiError) => {
        showNotification({
          title: 'Ошибка',
          message: err.stack,
          color: 'red',
        });
      },
    }
  );

  const rejectUpdate = useMutation(
    ({ id, reason }: { id: string; reason: string }) =>
      axios.post(
        '/api/updates/reject',
        {
          updateId: id,
          reason,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно отклонили изменения',
          color: 'green',
        });
        refetch();
      },
      onError: (err: ApiError) => {
        showNotification({
          title: 'Ошибка',
          message: err.stack,
          color: 'red',
        });
      },
    }
  );

  const handleApprove = (id: string) => {
    approveUpdate.mutate(id);
  };
  const handleReject = () => {
    toggle();
  };

  return (
    <Box sx={{ width: '100%' }} py="xs">
      <Container size="xl" px={0} sx={{ width: '100%' }}>
        <Block my="md" shadow={0}>
          <Pagination
            value={activePage}
            total={
              isSuccess && updatesData.totalCount > 0 ? Math.ceil(updatesData.totalCount / 10) : 1
            }
            onChange={setPage}
          />
        </Block>
        <Stack spacing="xl">
          {isSuccess &&
            updatesData.totalCount > 0 &&
            updatesData.result.map((r) => (
              <Box>
                <Modal opened={showReject} onClose={toggle} title="Форма отказа изменений">
                  <RejectForm id={r.id} onSubmit={rejectUpdate.mutate} />
                </Modal>
                <UpdateRow updateData={r} onApprove={handleApprove} onReject={handleReject} />
              </Box>
            ))}
          {isSuccess && updatesData.totalCount === 0 && (
            <Block h={150}>
              <Flex justify="center" h="100%">
                <Center>
                  <Text>Упс... здесь ничего нет</Text>
                </Center>
              </Flex>
            </Block>
          )}
        </Stack>

        <Block mt="md" shadow={0}>
          <Pagination
            value={activePage}
            total={
              isSuccess && updatesData.totalCount > 0 ? Math.ceil(updatesData.totalCount / 10) : 1
            }
            onChange={setPage}
          />
        </Block>
      </Container>
    </Box>
  );
};
export default function Community() {
  return (
    <Container size="xl" px={0}>
      <Tabs defaultValue="components">
        <Tabs.List>
          <Tabs.Tab value="components">Запросы на добавление</Tabs.Tab>
          <Tabs.Tab value="updateRequests">Запросы на изменение</Tabs.Tab>
          <Tabs.Tab value="guides">Гайды</Tabs.Tab>
          <Tabs.Tab value="posts">Статьи</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="components">
          <ComponentsPanel />
        </Tabs.Panel>
        <Tabs.Panel value="updateRequests">
          <UpdatesPanel />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
