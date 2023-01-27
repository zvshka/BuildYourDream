import { Box, Button, Container, Group, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { useToggle } from '@mantine/hooks';
import { NextLink } from '@mantine/next';
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
import { TemplateField } from '../../components/Parts/TemplateField';
import { Block } from '../../components/Layout/Block/Block';
import { CreateField } from '../../lib/Field';
import { ITemplate } from '../../types/Template';
import { PageHeader } from '../../components/Layout';
import { TemplateFormProvider } from '../../components/Parts/TemplateContext';

export default function createTemplate() {
  const [loading, toggleLoading] = useToggle();
  const template = useForm<ITemplate>({
    initialValues: {
      name: '',
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
    // axios
    //   .post('/api/templates', {
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
      const items = template.values.fields;
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      template.setFieldValue('fields', newItems);
    }
  }

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
                  <Group>
                    <Button onClick={handleAddField}>Добавить поле</Button>
                    <Button>Добавить категорию</Button>
                  </Group>
                  <Group>
                    <Button type="submit">Сохранить</Button>
                  </Group>
                </Group>
                <TextInput
                  {...template.getInputProps('name')}
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
                  <SortableContext
                    items={template.values.fields}
                    strategy={verticalListSortingStrategy}
                  >
                    {template.values.fields.map((item, index) => (
                      <TemplateField key={`field_${index}`} index={index} item={item} />
                    ))}
                  </SortableContext>
                </DndContext>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </TemplateFormProvider>
  );
}
