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
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { TemplateField } from '../../components/Components/TemplateField';
import { Block, PageHeader } from '../../components/Layout';
import { CreateField } from '../../lib/Field';
import { ITemplate, LARGE_TEXT, RANGE, TEXT } from '../../types/Template';
import { TemplateFormProvider } from '../../components/Components/TemplateContext';

export default function createTemplatePage() {
  const [loading, toggleLoading] = useToggle();
  const template = useForm<ITemplate>({
    initialValues: {
      name: '',
      required: false,
      fields: [
        CreateField({
          name: 'Название',
          type: TEXT,
          deletable: false,
          editable: false,
        }),
        CreateField({
          name: 'Цена',
          type: RANGE,
          deletable: false,
          editable: false,
        }),
        CreateField({
          name: 'Описание детали',
          type: LARGE_TEXT,
          deletable: false,
          editable: false,
        }),
      ],
    },
  });

  const createTemplate = useMutation(
    (templateData: ITemplate) =>
      axios.post('/api/templates', {
        name: templateData.name,
        fields: templateData.fields,
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Форма успешно создана',
          color: 'green',
        });
        toggleLoading();
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения формы произошла ошибка',
          color: 'red',
        });
        toggleLoading();
      },
    }
  );

  const handleAddField = () => {
    template.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${template.values.fields.length + 1}`,
        type: 'TEXT',
      })
    );
  };

  const handleSubmit = async (values: typeof template.values) => {
    toggleLoading();
    createTemplate.mutate(values);
  };

  return (
    <TemplateFormProvider form={template}>
      <Container size="md">
        <Stack>
          <PageHeader
            title="Создание группы"
            rightSection={
              <Button href="/parts" component={NextLink}>
                Назад
              </Button>
            }
          />
          <Box style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <form onSubmit={template.onSubmit(handleSubmit)}>
              <Block>
                <Group position="apart">
                  <Button onClick={handleAddField}>Добавить поле</Button>
                  <Group>
                    <Button type="submit">Сохранить</Button>
                  </Group>
                </Group>
                <Stack>
                  <TextInput
                    {...template.getInputProps('name')}
                    placeholder="Название формы"
                    label="Название формы"
                    required
                    mt="xs"
                  />
                  <Switch
                    label="Обязательный компонент"
                    {...template.getInputProps('required', {
                      type: 'checkbox',
                    })}
                  />
                </Stack>
              </Block>
              <Stack mt="md">
                {template.values.fields.map((item, index) => (
                  <TemplateField key={`field_${index}`} index={index} item={item} />
                ))}
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </TemplateFormProvider>
  );
}
