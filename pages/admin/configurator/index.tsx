import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  MediaQuery,
  Stack,
  Switch,
  Tabs,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import cuid from 'cuid';
import { IconTrash } from '@tabler/icons-react';
import { deepEqual, storage } from '../../../lib/utils';
import { useTemplatesList } from '../../../components/hooks/templates';
import { Block, PageHeader } from '../../../components/Layout';
import { SortableList } from '../../../components/Layout/general/SortableList/SortableList';
import { ITemplate } from '../../../types/Template';
import { IConstraintFieldValue } from '../../../types/Constraints';
import { useConstraintsList } from '../../../components/hooks/constraints';
import { ConstraintField } from '../../../components/Layout/inputs/ConstraintField/ConstraintField';

const ConfiguratorForm = () => {
  const { data: templates, isSuccess } = useTemplatesList();

  const form = useForm<{
    templates: ITemplate[];
  }>({
    initialValues: {
      templates: [],
    },
  });

  useEffect(() => {
    isSuccess && form.setFieldValue('templates', templates);
  }, [isSuccess]);

  const templatesUpdate = useMutation(
    (templatesData: any) =>
      axios.patch('/api/templates', templatesData, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Конфигуратор успешно обновлен',
          color: 'green',
        });
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения произошла ошибка',
          color: 'red',
        });
      },
      mutationKey: ['templates', 'list'],
    }
  );
  const handleSubmit = (values: typeof form.values) => {
    if (!isSuccess) return;
    const toSend = values.templates
      .map((v, index) => {
        const original = templates.find((template) => template.id === v.id);
        if (!original) return {};
        const isPositionChanged = original.position !== index + 1;
        return {
          id: v.id,
          position: isPositionChanged ? index + 1 : v.position,
          showInConfigurator: v.showInConfigurator,
          required: v.required,
        };
      })
      .filter((v) => {
        const original = templates.find((template) => template.id === v.id);
        if (!original) return false;
        return (
          original.position !== v.position ||
          v.showInConfigurator !== original.showInConfigurator ||
          v.required !== original.required
        );
      });

    templatesUpdate.mutate(toSend);
  };

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <PageHeader
            title="Настройка конфигуратора"
            rightSection={<Button type="submit">Сохранить</Button>}
          />
          <SortableList<ITemplate>
            items={form.values.templates}
            onChange={(values) => form.setFieldValue('templates', values)}
            renderItem={(item, index) => (
              <SortableList.Item id={item.id} key={item.id}>
                <Block>
                  <Group position="apart">
                    <Stack>
                      <Text>{item.name}</Text>
                      <Group>
                        <Switch
                          label="Показывать в конфигураторе"
                          {...form.getInputProps(`templates.${index}.showInConfigurator`, {
                            type: 'checkbox',
                          })}
                        />
                        <Switch
                          label="Обязательный компонент"
                          {...form.getInputProps(`templates.${index}.required`, {
                            type: 'checkbox',
                          })}
                        />
                      </Group>
                    </Stack>
                    <SortableList.DragHandle />
                  </Group>
                </Block>
              </SortableList.Item>
            )}
          />
        </Stack>
      </form>
    </Box>
  );
};

const ConstraintsForm = () => {
  const { data: constraints, isSuccess } = useConstraintsList();
  const form = useForm<{
    constraints: {
      id: string;
      data: IConstraintFieldValue;
    }[];
  }>({
    initialValues: {
      constraints: [],
    },
  });

  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [incomplete, setIncomplete] = useState<any[]>([]);

  useEffect(() => {
    const dupes = form.values.constraints.filter((c) =>
      form.values.constraints
        .filter((cc) => cc.id !== c.id)
        .some((cc) => deepEqual(c.data, cc.data))
    );
    setDuplicates(dupes);
    const notFull = form.values.constraints.filter(
      (c) =>
        !c.data.constraint ||
        !c.data.leftSide ||
        !c.data.leftSide.componentId ||
        !c.data.leftSide.fieldId ||
        !c.data.rightSide ||
        !c.data.rightSide.componentId ||
        !c.data.rightSide.fieldId
    );
    setIncomplete(notFull);
  }, [form.values.constraints]);

  useEffect(() => {
    if (isSuccess) {
      form.setValues({
        constraints,
      });
    }
  }, [isSuccess]);

  const createConstraint = useMutation(
    (constraintData: { id: string; data: IConstraintFieldValue }) =>
      axios.post('/api/constraints', constraintData, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          color: 'green',
          message: 'Ограничение успешно создано',
        });
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'При создании ограничения что-то пошло не так',
        });
      },
      mutationKey: ['constraints', 'list'],
    }
  );
  const updateConstraint = useMutation(
    ({ id, ...data }: any) =>
      axios.patch(`/api/constraints/${id}`, data, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          color: 'green',
          message: 'Ограничение успешно обновлено',
        });
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'При обновлении ограничения что-то пошло не так',
        });
      },
      mutationKey: ['constraints', 'list'],
    }
  );
  const deleteConstraint = useMutation(
    (id: string) =>
      axios.delete(`/api/constraints/${id}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          color: 'green',
          message: 'Ограничение успешно удалено',
        });
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'При удалении ограничения что-то пошло не так',
        });
      },
      mutationKey: ['constraints', 'list'],
    }
  );

  const findById = (arr, id) => arr.find((element) => element.id === id);

  function handleSubmit(values: typeof form.values) {
    if (isSuccess) {
      if (duplicates.length > 1) {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'Существуют дубликаты',
        });
      }
      if (incomplete.length > 0) {
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'Существуют незаполненные записи',
        });
      }
      if (duplicates.length === 0 && incomplete.length === 0) {
        const existConstraints = constraints.map((c) => c.id);
        const toCreate = values.constraints.filter(
          (constraint) => !existConstraints.includes(constraint.id)
        );

        const toEdit = constraints
          .filter((constraint) => findById(values.constraints, constraint.id))
          .filter(
            (constraint) => !deepEqual(constraint, findById(values.constraints, constraint.id))
          );

        const toDelete = constraints.filter(
          (constraint) => !findById(values.constraints, constraint.id)
        );

        for (let i = 0; i < toCreate.length; i += 1) {
          const item = toCreate[i];
          createConstraint.mutate(item);
        }

        for (let i = 0; i < toCreate.length; i += 1) {
          const item = toEdit[i];
          updateConstraint.mutate(item);
        }

        for (let i = 0; i < toCreate.length; i += 1) {
          const item = toDelete[i];
          if (item) {
            deleteConstraint.mutate(item.id);
          }
        }
      }
    }
  }

  return (
    <Box>
      <PageHeader title="Настройка ограничений" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt="md">
          <Group>
            <Button onClick={() => form.insertListItem('constraints', { id: cuid(), data: {} })}>
              Добавить
            </Button>
            <Button type="submit">Сохранить</Button>
          </Group>
          <Stack>
            {form.values.constraints.map((c, index) => (
              <Block
                sx={{
                  outline: duplicates.some((cc) => c.id === cc.id)
                    ? '1px solid red'
                    : incomplete.some((cc) => c.id === cc.id)
                    ? '1px solid orange'
                    : '',
                }}
              >
                <Group position="apart">
                  <ConstraintField
                    key={c.id}
                    {...form.getInputProps(`constraints.${index}.data`)}
                  />
                  <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                    <ActionIcon
                      color="red"
                      onClick={() => form.removeListItem('constraints', index)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </MediaQuery>
                  <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                    <Button
                      color="red"
                      variant="outline"
                      leftIcon={<IconTrash />}
                      onClick={() => form.removeListItem('constraints', index)}
                      sx={{ width: '100%' }}
                    >
                      Удалить
                    </Button>
                  </MediaQuery>
                </Group>
              </Block>
            ))}
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
export default function AdminConfigurator() {
  return (
    <Container size="xl" px={0}>
      <Tabs defaultValue="configurator" variant="pills">
        <Block>
          <Tabs.List>
            <Tabs.Tab value="constraints">Настройки ограничений</Tabs.Tab>
            <Tabs.Tab value="configurator">Настройки конфигуратора</Tabs.Tab>
          </Tabs.List>
        </Block>

        <Tabs.Panel value="constraints" pt="md">
          <ConstraintsForm />
        </Tabs.Panel>

        <Tabs.Panel value="configurator" pt="md">
          <ConfiguratorForm />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
