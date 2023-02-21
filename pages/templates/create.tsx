import {
  Box,
  Button,
  Container,
  Grid,
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
import { CreateField, IField } from '../../types/Field';
import { ITemplate } from '../../types/Template';
import { TemplateFormProvider } from '../../components/Components/TemplateContext';
import { SortableList } from '../../components/SortableList/SortableList';
import { DragHandle } from '../../components/SortableList/SortableItem';
import { LARGE_TEXT, RANGE, TEXT } from '../../types/FieldTypes';

export default function createTemplatePage() {
  const [loading, toggleLoading] = useToggle();
  const template = useForm<ITemplate>({
    initialValues: {
      id: '',
      position: -1,
      showInConfigurator: true,
      name: '',
      required: false,
      fields: [
        CreateField({
          name: 'Название',
          type: TEXT,
          deletable: false,
          editable: false,
          required: true,
        }),
        CreateField({
          name: 'Цена',
          type: RANGE,
          deletable: false,
          editable: false,
          required: true,
        }),
        CreateField({
          name: 'Описание детали',
          type: LARGE_TEXT,
          deletable: false,
          editable: false,
          required: true,
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
              <Button href="/components" component={NextLink}>
                Назад
              </Button>
            }
          />
          <Box style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <form onSubmit={template.onSubmit(handleSubmit)}>
              <Block mb="md">
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
              <SortableList<IField>
                items={template.values.fields}
                onChange={(values) => template.setFieldValue('fields', values)}
                renderItem={(item, index) =>
                  item.editable ? (
                    <SortableList.Item id={item.id} key={item.id}>
                      <Grid columns={32}>
                        <Grid.Col span={2}>
                          <Block>
                            <Group position="center">
                              <DragHandle />
                            </Group>
                          </Block>
                        </Grid.Col>
                        <Grid.Col span="auto">
                          <Block>
                            <TemplateField index={index} item={item} />
                          </Block>
                        </Grid.Col>
                      </Grid>
                    </SortableList.Item>
                  ) : (
                    <Block key={item.id}>
                      <TemplateField index={index} item={item} />
                    </Block>
                  )
                }
              />
            </form>
          </Box>
        </Stack>
      </Container>
    </TemplateFormProvider>
  );
}
