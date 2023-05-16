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
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { useUnapprovedList } from '../../components/hooks/components';
import { Block } from '../../components/Layout';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { storage } from '../../lib/utils';
import { ApiError } from '../../lib/ApiError';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';

const RejectForm = ({ componentId, refetch, toggle }) => {
  const form = useForm({
    initialValues: {
      componentId,
      reason: '',
    },
  });

  const rejectComponent = useMutation(
    (data: any) =>
      axios.post(
        '/api/components/reject',
        {
          componentId: data.componentId,
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

  const handleSubmit = (values: typeof form.values) => {
    rejectComponent.mutate(values);
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

  const root = useRef(null);

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

  const handleReject = (componentId: string) => {
    toggle();
  };

  return (
    <Box sx={{ width: '100%' }} py="xs" ref={root}>
      <Container size="xl" px={0} sx={{ width: '100%' }}>
        <Grid>
          <Grid.Col lg="auto">
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
                      <RejectForm componentId={component.id} refetch={refetch} toggle={toggle} />,
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
                                <Button onClick={() => handleApprove(component.id)}>
                                  Одобрить
                                </Button>
                                <Button onClick={() => handleReject(component.id)}>
                                  Отколонить
                                </Button>
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
                              <Button onClick={() => handleReject(component.id)}>Отколонить</Button>
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
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default function Community() {
  return (
    <Container size="xl" px={0}>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="components">Компоненты</Tabs.Tab>
          <Tabs.Tab value="updateRequests">Запросы на изменение</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="components">
          <ComponentsPanel />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
