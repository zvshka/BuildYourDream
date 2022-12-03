import { Button, Container, Group, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Form } from '../../components/Parts/Form';
import { FormField } from '../../components/Parts/FormField';
import { Block } from '../../components/Block/Block';
import { NextLink } from '@mantine/next';

export default function createForms() {
  const modals = useModals();
  const [loading, toggleLoading] = useToggle();
  const form = useForm({
    initialValues: {
      name: '',
      fields: [
        {
          name: 'Название',
          type: 'TEXT',
          description: '',
          haveDescription: false,
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Цена',
          type: 'RANGE',
          description: '',
          haveDescription: false,
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Описание детали',
          type: 'LARGE_TEXT',
          description: '',
          haveDescription: false,
          required: true,
          deletable: false,
          editable: false,
        },
      ],
    },
  });

  const handleAddField = () => {
    form.insertListItem('fields', {
      name: `Поле ${form.values.fields.length + 1}`,
      type: 'TEXT',
      haveDescription: false,
      required: false,
      deletable: true,
      editable: true,
    });
  };

  const openPreview = () => {
    modals.openModal({
      title: 'Предпросмотр',
      size: 'lg',
      children: (
        <Form
          fields={form.values.fields}
          name={form.values.name}
          form={form}
        />
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
        <Block style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group position="apart">
              <Button onClick={handleAddField}>Добавить поле</Button>
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
            {fields}
          </form>
        </Block>
      </Stack>
    </Container>
  );
}
