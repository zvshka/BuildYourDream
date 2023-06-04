import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  MediaQuery,
  NumberInput,
  Select,
  Stack,
  Switch,
  Tabs,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { IconApps, IconDeviceFloppy } from '@tabler/icons-react';
import { useState } from 'react';
import { Block, PageHeader } from '../../index';
import { SortableList } from '../../general';
import { CreateField, IField } from '../../../../types/Field';
import { DragHandle } from '../../general/SortableList/SortableItem';
import { TemplateField } from './TemplateField';
import { useTemplateFormContext } from './TemplateContext';
import { NUMBER, TEXT } from '../../../../types/FieldTypes';
import { useTemplatesList } from '../../../hooks/templates';

const ConstraintForm = () => {
  const template = useTemplateFormContext();

  const { data: templates, isSuccess } = useTemplatesList();

  return (
    <Block>
      <Input.Wrapper label="Максимальное количетсво в сборке">
        <Stack>
          <Select
            data={[
              { label: 'Число', value: 'number' },
              { label: 'Зависит от другого компонента', value: 'depends_on' },
            ]}
            {...template.getInputProps('maxCount.type')}
          />
          {'maxCount' in template.values && template.values.maxCount.type === 'number' && (
            <NumberInput {...template.getInputProps('maxCount.count')} />
          )}
          {'maxCount' in template.values && template.values.maxCount.type === 'depends_on' && (
            <Group>
              <Group align="end">
                <Select
                  label="Компонент"
                  data={isSuccess ? templates.map((t) => ({ value: t.id, label: t.name })) : []}
                  {...template.getInputProps('maxCount.templateId')}
                />
                <Select
                  label="Его поле"
                  data={
                    isSuccess && template.values.maxCount.templateId
                      ? templates
                          .find((t) => t.id === template.values.maxCount.templateId)!
                          .fields.filter((f) => f.type === NUMBER)
                          .map((f) => ({ value: f.id, label: f.name }))
                      : []
                  }
                  {...template.getInputProps('maxCount.fieldId')}
                />
              </Group>
              <Select
                label="Множитель этого компонента"
                data={template.values.fields
                  .filter((f) => f.type === NUMBER)
                  .map((f) => ({ value: f.id, label: f.name }))}
                {...template.getInputProps('maxCount.multiplierId')}
              />
            </Group>
          )}
        </Stack>
      </Input.Wrapper>
    </Block>
  );
};

export const TemplateForm = ({ handleSubmit, loading }) => {
  const theme = useMantineTheme();
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
          <PageHeader addBack title="Форма группы" />

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
                <Block mt="md" sx={{ position: 'sticky', bottom: theme.spacing.md }}>
                  <Container>
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
            <Tabs.Panel value="constraints">
              <ConstraintForm />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </form>
    </Container>
  );
};
