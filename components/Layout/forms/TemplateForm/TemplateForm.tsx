import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  MediaQuery,
  Stack,
  Switch,
  Tabs,
  TextInput,
} from '@mantine/core';
import { IconApps, IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { Block, PageHeader } from '../../index';
import { NextLink } from '../../general/NextLink/NextLink';
import { SortableList } from '../../general/SortableList/SortableList';
import { CreateField, IField } from '../../../../types/Field';
import { DragHandle } from '../../general/SortableList/SortableItem';
import { TemplateField } from './TemplateField';
import { useTemplateFormContext } from './TemplateContext';
import { TEXT } from '../../../../types/FieldTypes';

export const TemplateForm = ({ handleSubmit, loading }) => {
  const template = useTemplateFormContext();
  const [activeTab, setActiveTab] = useState<string | null>('info');

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
    <Container size="md" px={0}>
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
                        <Grid>
                          <Grid.Col span="content">
                            <Block px="xs" py="xs">
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
                    {/*TODO: Refactor*/}
                    <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                      <Group grow>
                        <Button leftIcon={<IconApps />} onClick={handleAddField}>
                          Добавить поле
                        </Button>
                        <Button leftIcon={<IconDeviceFloppy />} type="submit">
                          Сохранить
                        </Button>
                      </Group>
                    </MediaQuery>
                    <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                      <Stack>
                        <Button leftIcon={<IconApps />} onClick={handleAddField}>
                          Добавить поле
                        </Button>
                        <Button leftIcon={<IconDeviceFloppy />} type="submit">
                          Сохранить
                        </Button>
                      </Stack>
                    </MediaQuery>
                  </Container>
                </Block>
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </form>
    </Container>
  );
};
