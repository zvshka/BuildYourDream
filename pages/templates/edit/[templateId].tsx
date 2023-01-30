import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { TemplateField } from '../../../components/Components/TemplateField';
import { Block } from '../../../components/Layout/Block/Block';
import { CreateField } from '../../../lib/Field';
import { ITemplate } from '../../../types/Template';
import { TemplateFormProvider } from '../../../components/Components/TemplateContext';
import { PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';

export default function EditForm() {
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();

  const form = useForm<ITemplate & { id?: string }>({
    initialValues: {
      id: '',
      name: '',
      required: false,
      fields: [],
    },
  });

  const { data: templateData, isFetched } = useTemplateData(router.query.templateId as string);

  useEffect(() => {
    if (isFetched) {
      form.setValues(templateData);
    }
  }, [isFetched]);

  const handleAddField = () => {
    form.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${form.values.fields.length + 1}`,
        type: 'TEXT',
      })
    );
  };

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    axios
      .patch(`/api/templates/${router.query.templateId}`, {
        name: values.name,
        fields: values.fields,
        required: values.required,
      })
      .then(() => {
        showNotification({
          title: 'Успех',
          message: 'Шаблон успешно создан',
          color: 'green',
        });
        toggleLoading();
      })
      .catch(() => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения шаблона произошла ошибка',
          color: 'red',
        });
        toggleLoading();
      });
  };

  const fields = form.values.fields.map((item, index) => (
    <TemplateField key={`field_${index}`} index={index} item={item} />
  ));

  return (
    <TemplateFormProvider form={form}>
      <Container size="md">
        <Stack>
          <PageHeader title={`Изменение формы: ${isFetched && templateData.name}`} />
          <Box style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Block>
                <Group position="apart">
                  <Button onClick={handleAddField}>Добавить поле</Button>
                  <Button type="submit">Сохранить</Button>
                </Group>
                <Stack>
                  <TextInput
                    {...form.getInputProps('name')}
                    placeholder="Название формы"
                    label="Название формы"
                    required
                    mt="xs"
                  />
                  <Switch
                    label="Обязательный компонент"
                    {...form.getInputProps('required', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </Block>
              <Stack mt="md">{fields}</Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </TemplateFormProvider>
  );
}
