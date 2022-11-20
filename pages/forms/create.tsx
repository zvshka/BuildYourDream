import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons';
import { useModals } from '@mantine/modals';

const types = [
  { value: 'TEXT', label: 'Текстовое' },
  { value: 'NUMBER', label: 'Числовое' },
  { value: 'BOOL', label: 'Булевое' },
];

export default function createForms() {
  const modals = useModals();
  const form = useForm({
    initialValues: {
      name: '',
      fields: [
        {
          name: 'Название',
          type: 'TEXT',
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Цена',
          type: 'NUMBER',
          required: true,
          deletable: false,
          editable: false,
        },
        {
          name: 'Просто выбор',
          type: 'BOOL',
          required: false,
          deletable: true,
          editable: true,
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

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  const openPreview = () => {
    modals.openModal({
      title: 'Предпросмотр',
      size: 'lg',
      children: (
        <Stack spacing="xs">
          <SimpleGrid cols={3}>
            {form.values.fields.map((field, index) => (
              <Box
                key={`field_${index}`}
                display="flex"
                sx={{ alignItems: 'center', width: '100%' }}
              >
                {field.type === 'TEXT' && (
                  <TextInput label={field.name} required={field.required} />
                )}
                {field.type === 'NUMBER' && (
                  <NumberInput label={field.name} required={field.required} />
                )}
                {field.type === 'BOOL' && <Switch label={field.name} required={field.required} />}
              </Box>
            ))}
          </SimpleGrid>
          <Button>Сохранить</Button>
        </Stack>
      ),
    });
  };

  const fields = form.values.fields.map((item, index) => (
    <Group key={`field_${index}`} mt="xs">
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
  ));

  return (
    <Container size="md">
      <Stack>
        <Paper p="sm" shadow="xl">
          <Title order={4}>Создание формы</Title>
        </Paper>
        <Paper p="sm">
          <form>
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
