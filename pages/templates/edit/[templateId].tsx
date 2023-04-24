import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Stack, Switch, Tabs,
  TextInput,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import cuid from 'cuid';
import { IconApps, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { TemplateField } from '../../../components/Components/TemplateField';
import { CreateField, IField } from '../../../types/Field';
import { ISlot, ITemplate } from '../../../types/Template';
import { TemplateFormProvider } from '../../../components/Components/TemplateContext';
import { Block, PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { SortableList } from '../../../components/SortableList/SortableList';
import { DragHandle } from '../../../components/SortableList/SortableItem';
import { TEXT } from '../../../types/FieldTypes';
import { NextLink } from '../../../components/Layout/NextLink/NextLink';
import { SlotField } from '../../../components/Components/SlotField/SlotField';

export default function EditForm() {
  const [loading, toggleLoading] = useToggle();
  const [activeTab, setActiveTab] = useState<string | null>('info');

  const router = useRouter();

  const template = useForm<ITemplate & { id?: string }>({
    initialValues: {
      id: '',
      name: '',
      required: false,
      fields: [],
      slots: [],
      showInConfigurator: false,
      position: -1,
    },
  });

  const { data: templateData, isSuccess } = useTemplateData(router.query.templateId as string);

  useEffect(() => {
    if (isSuccess) {
      template.setValues(templateData);
    }
  }, [isSuccess]);

  const handleAddField = () => {
    template.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${template.values.fields.length + 1}`,
        type: TEXT,
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

  //TODO: Make mutation
  const handleSubmit = async (values: typeof template.values) => {
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
          message: 'Шаблон успешно обновлен',
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
