import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Switch,
  Tabs,
  TextInput,
} from '@mantine/core';
import { IconApps, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import cuid from 'cuid';
import { Block, PageHeader } from '../Layout';
import { NextLink } from '../Layout/NextLink/NextLink';
import { SortableList } from '../SortableList/SortableList';
import { CreateField, IField } from '../../types/Field';
import { DragHandle } from '../SortableList/SortableItem';
import { TemplateField } from '../Components/TemplateField';
import { ISlot } from '../../types/Template';
import { SlotField } from '../Components/SlotField/SlotField';
import { useTemplateFormContext } from '../Components/TemplateContext';
import { TEXT } from '../../types/FieldTypes';

export const TemplateForm = ({ handleSubmit, loading }) => {
  const template = useTemplateFormContext();
  const [activeTab, setActiveTab] = useState<string | null>('info');

  const handleAddSlot = () => {
    template.insertListItem('slots', {
      id: cuid(),
      componentId: '',
      innerField: '',
      outerField: '',
      compatibilityCondition: 'EQUALS',
    });
  };

  const handleRemoveSlot = () => {
    return false;
  };

  const handleAddField = () => {
    template.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${template.values.fields.length + 1}`,
        type: TEXT,
      })
    );
  };

  return (
    <Container size="md">
      <form onSubmit={template.onSubmit(handleSubmit)}>
        <Stack spacing="xs">
          <PageHeader
            title="Форма группы"
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
                  items={template.values.fields || []}
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
                  items={template.values.slots || []}
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
                                <ActionIcon color="red" onClick={handleRemoveSlot}>
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
  );
};
