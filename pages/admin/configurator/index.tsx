import { Button, Container, Group, Stack, Switch, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { storage } from '../../../lib/utils';
import { useTemplatesList } from '../../../components/hooks/templates';
import { Block, PageHeader } from '../../../components/Layout';
import { queryClient } from '../../../components/Providers/QueryProvider/QueryProvider';
import { SortableList } from '../../../components/Layout/general/SortableList/SortableList';
import { ITemplate } from '../../../types/Template';

export default function AdminConfigurator() {
  const { data: templates, isFetched, isSuccess } = useTemplatesList();

  const form = useForm<{
    templates: ITemplate[];
  }>({
    initialValues: {
      templates: [],
    },
  });

  useEffect(() => {
    isSuccess && form.setFieldValue('templates', templates);
  }, [isSuccess, isFetched]);

  const templatesUpdate = useMutation(
    (templatesData: any) =>
      axios.patch('/api/templates', templatesData, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: (data) => {
        showNotification({
          title: 'Успех',
          message: 'Конфигуратор успешно обновлен',
          color: 'green',
        });
        queryClient.invalidateQueries(['templates', 'list']);
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения произошла ошибка',
          color: 'red',
        });
      },
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
      .filter((v, index) => {
        const original = templates.find((template) => template.id === v.id);
        if (!original) return false;
        if (
          original.position !== v.position ||
          v.showInConfigurator !== original.showInConfigurator ||
          v.required !== original.required
        ) {
          return true;
        }
        return false;
      });

    templatesUpdate.mutate(toSend);
  };

  return (
    <Container size="xl" px={0}>
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
    </Container>
  );
}
