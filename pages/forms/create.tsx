import {
  ActionIcon,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Form } from '../../components/Parts/Form';

const types = [
  { value: 'TEXT', label: 'Текстовое' },
  { value: 'NUMBER', label: 'Числовое' },
  { value: 'BOOL', label: 'Булевое' },
  { value: 'LARGE_TEXT', label: 'Много текста' },
  { value: 'RANGE', label: 'Промежуток' },
];

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
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Цена',
          type: 'RANGE',
          description: '',
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Описание детали',
          type: 'LARGE_TEXT',
          description: '',
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
      required: false,
      deletable: true,
      editable: true,
    });
  };

  const openPreview = () => {
    modals.openModal({
      title: 'Предпросмотр',
      size: 'lg',
      children: <Form fields={form.values.fields} name={form.values.name} />,
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
    <Stack key={`field_${index}`} mt="xs">
      <Group>
        <TextInput
          placeholder="Название"
          sx={{ flex: 1 }}
          {...form.getInputProps(`fields.${index}.name`)}
          disabled={!item.editable}
          required
        />
        <Select
          data={types}
          {...form.getInputProps(`fields.${index}.type`)}
          disabled={!item.editable}
          required
        />
        <Switch
          label="Обязательное"
          styles={{
            root: {
              display: 'flex',
              alignItems: 'center',
            },
          }}
          disabled={!item.editable}
          {...form.getInputProps(`fields.${index}.required`, { type: 'checkbox' })}
        />
        <ActionIcon
          disabled={!item.deletable}
          color="red"
          onClick={() => form.removeListItem('fields', index)}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
      <Textarea placeholder="Опишите на что влияет это поле или что это значит" />
    </Stack>
  ));

  return (
    <Container size="md">
      <Stack>
        <Paper p="sm" shadow="xl">
          <Title order={4}>Создание формы</Title>
        </Paper>
        <Paper p="sm" style={{ position: 'relative' }}>
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
        </Paper>
      </Stack>
    </Container>
  );
}
