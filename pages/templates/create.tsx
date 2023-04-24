import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Select,
  Stack,
  Switch,
  Tabs,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import cuid from 'cuid';
import { IconApps, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { TemplateField } from '../../components/Components/TemplateField';
import { Block, PageHeader } from '../../components/Layout';
import { CreateField, IField } from '../../types/Field';
import { ISlot, ITemplate } from '../../types/Template';
import { TemplateFormProvider } from '../../components/Components/TemplateContext';
import { SortableList } from '../../components/SortableList/SortableList';
import { DragHandle } from '../../components/SortableList/SortableItem';
import { LARGE_TEXT, RANGE, TEXT } from '../../types/FieldTypes';
import { SlotField } from '../../components/Components/SlotField/SlotField';
import { NextLink } from '../../components/Layout/NextLink/NextLink';

export default function createTemplatePage() {
  const [loading, toggleLoading] = useToggle();
  const [activeTab, setActiveTab] = useState<string | null>('info');
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
      slots: [],
    },
  });

  const createTemplate = useMutation(
    (templateData: ITemplate) =>
      axios.post('/api/templates', {
        name: templateData.name,
        fields: templateData.fields,
        slots: templateData.slots,
        //TODO: Ограничения?
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

  const handleAddSlot = () => {
    template.insertListItem('slots', {
      id: cuid(),
      componentId: '',
      innerField: '',
      outerField: '',
      compatibilityCondition: 'EQUALS',
    });
  };

  const handleSubmit = async (values: typeof template.values) => {
    toggleLoading();
    createTemplate.mutate(values);
    // console.log(values);
    // toggleLoading();
  };

  return (
    <TemplateFormProvider form={template}>
      <Container size="md">
        <form onSubmit={template.onSubmit(handleSubmit)}>
          <Stack spacing="xs">
            <PageHeader
              title="Создание группы"
              rightSection={
                <Button href="/components" component={NextLink}>
                  Назад
                </Button>
              }
            />

            <Block>
              <Stack>
                <TextInput
                  {...template.getInputProps('name')}
                  placeholder="Название формы"
                  label="Название формы"
                  required
                />
                <Switch
                  label="Обязательный компонент"
                  {...template.getInputProps('required', {
                    type: 'checkbox',
                  })}
                />
              </Stack>
            </Block>

            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List>
                <Block style={{ display: 'flex', width: '100%' }} mb="md">
                  <Tabs.Tab value="info">Информация</Tabs.Tab>
                  <Tabs.Tab value="slots">Слоты</Tabs.Tab>
                  <Tabs.Tab value="constraints">Ограничения</Tabs.Tab>
                </Block>
              </Tabs.List>

              <Tabs.Panel value="info">
                <Box pt="md" style={{ position: 'relative' }}>
                  <LoadingOverlay visible={loading} overlayBlur={2} />
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
                  <Block mt="md">
                    <Container>
                      <Group grow>
                        <Button leftIcon={<IconApps />} onClick={handleAddField}>
                          Добавить поле
                        </Button>
                        <Button leftIcon={<IconDeviceFloppy />} type="submit">
                          Сохранить
                        </Button>
                      </Group>
                    </Container>
                  </Block>
                </Box>
              </Tabs.Panel>
              <Tabs.Panel value="slots">
                <Box pt="md" style={{ position: 'relative' }}>
                  <LoadingOverlay visible={loading} overlayBlur={2} />
                  <SortableList<ISlot>
                    items={template.values.slots}
                    onChange={(values) => template.setFieldValue('slots', values)}
                    renderItem={(item, index) => (
                      <SortableList.Item id={item.id} key={item.id}>
                        <Grid columns={32}>
                          <Grid.Col span={2}>
                            <Stack>
                              <Block p={4}>
                                <Group position="center">
                                  <DragHandle />
                                </Group>
                              </Block>
                              <Block p={4}>
                                <Group position="center">
                                  <ActionIcon color="red">
                                    <IconTrash size={18} />
                                  </ActionIcon>
                                </Group>
                              </Block>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span="auto">
                            <SlotField index={index as number} item={item} />
                          </Grid.Col>
                        </Grid>
                      </SortableList.Item>
                    )}
                  />
                  <Block mt="md">
                    <Container>
                      <Group grow>
                        <Button leftIcon={<IconApps />} onClick={handleAddSlot}>
                          Добавить слот
                        </Button>
                        <Button leftIcon={<IconDeviceFloppy />} type="submit">
                          Сохранить
                        </Button>
                      </Group>
                    </Container>
                  </Block>
                </Box>
              </Tabs.Panel>
              <Tabs.Panel value="constraints">Ограничения</Tabs.Panel>
            </Tabs>
          </Stack>
        </form>
      </Container>
    </TemplateFormProvider>
  );
}
