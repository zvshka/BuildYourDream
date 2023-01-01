import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { NextLink } from '@mantine/next';
import { Form } from '../../components/Parts/Form';
import { FormField } from '../../components/Parts/FormField';
import { Block } from '../../components/Block/Block';
import { CreateField } from '../../lib/Field';
import { FormsFormProvider, useFormsFormContext } from '../../components/Parts/FormContext';
import { ICreateForm } from '../../types/Form';

const MainComponent = () => {
  const modals = useModals();
  const [loading, toggleLoading] = useToggle();
  const form = useFormsFormContext();

  const handleAddField = () => {
    form.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${form.values.fields.length + 1}`,
        type: 'TEXT',
      })
    );
  };

  const openPreview = () => {
    modals.openModal({
      title: 'Предпросмотр',
      size: 'lg',
      children: (
        <FormsFormProvider form={form}>
          <Form />
        </FormsFormProvider>
      ),
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    axios
      .post('/api/forms', {
        name: values.name,
        fields: values.fields,
      })
      .then(() => {
        showNotification({
          title: 'Успех',
          message: 'Форма успешно создана',
          color: 'green',
        });
        toggleLoading();
      })
      .catch(() => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения формы произошла ошибка',
          color: 'red',
        });
        toggleLoading();
      });
  };

  const fields = form.values.fields.map((item, index) => (
    <FormField key={`field_${index}`} form={form} index={index} item={item} />
  ));

  return (
    <Container size="md">
      <Stack>
        <Block>
          <Group position="apart">
            <Title order={2}>Создание группы</Title>
            <Button href="/parts" component={NextLink}>
              Назад
            </Button>
          </Group>
        </Block>
        <Box style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Block>
              <Group position="apart">
                <Group>
                  <Button onClick={handleAddField}>Добавить поле</Button>
                  <Button>Добавить категорию</Button>
                </Group>
                <Group>
                  <Button onClick={openPreview}>Предпросмотр</Button>
                  <Button type="submit">Сохранить</Button>
                </Group>
              </Group>
              <TextInput
                {...form.getInputProps('name')}
                placeholder="Название формы"
                label="Название формы"
                required
                mt="xs"
              />
            </Block>
            <Stack mt="md">{fields}</Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};
export default function createForms() {
  const form = useForm<ICreateForm>({
    initialValues: {
      name: '',
      tier: 0,
      pros: [],
      cons: [],
      fields: [
        CreateField({
          name: 'Название',
          type: 'TEXT',
          deletable: false,
          editable: false,
        }),
        CreateField({
          name: 'Цена',
          type: 'RANGE',
          deletable: false,
          editable: false,
        }),
        CreateField({
          name: 'Описание детали',
          type: 'LARGE_TEXT',
          deletable: false,
          editable: false,
        }),
      ],
    },
  });

  return (
    <FormsFormProvider form={form}>
      <MainComponent />
    </FormsFormProvider>
  );
}
