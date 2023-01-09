import { Box, Button, Container, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { useToggle } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
import { Form } from '../../components/Parts/Form';
import { FormField } from '../../components/Parts/FormField';
import { Block } from '../../components/Layout/Block/Block';
import { CreateField } from '../../lib/Field';
import { FormsFormProvider, useFormsFormContext } from '../../components/Parts/FormContext';
import { ICreateForm } from '../../types/Form';
import { PageHeader } from '../../components/Layout';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const MainComponent = () => {
  const modals = useModals();
  const [loading, toggleLoading] = useToggle();
  const form = useFormsFormContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    // axios
    //   .post('/api/forms', {
    //     name: values.name,
    //     fields: values.fields,
    //   })
    //   .then(() => {
    //     showNotification({
    //       title: 'Успех',
    //       message: 'Форма успешно создана',
    //       color: 'green',
    //     });
    //     toggleLoading();
    //   })
    //   .catch(() => {
    //     showNotification({
    //       title: 'Ошибка',
    //       message: 'Во время сохранения формы произошла ошибка',
    //       color: 'red',
    //     });
    //     toggleLoading();
    //   });
    console.log(values);
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const items = form.values.fields;
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      form.setFieldValue('fields', newItems);
    }
  }

  return (
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
            <Stack mt="md">
              <DndContext
                id="dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={form.values.fields} strategy={verticalListSortingStrategy}>
                  {form.values.fields.map((item, index) => (
                    <FormField key={`field_${index}`} index={index} item={item} />
                  ))}
                </SortableContext>
              </DndContext>
            </Stack>
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
