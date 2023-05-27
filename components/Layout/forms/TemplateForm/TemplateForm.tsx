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
// import { useForm } from '@mantine/form';
import { Block, PageHeader } from '../../index';
import { SortableList } from '../../general/SortableList/SortableList';
import { CreateField, IField } from '../../../../types/Field';
import { DragHandle } from '../../general/SortableList/SortableItem';
import { TemplateField } from './TemplateField';
import { useTemplateFormContext } from './TemplateContext';
import { NUMBER, TEXT } from '../../../../types/FieldTypes';
import { useTemplatesList } from '../../../hooks/templates';
// import { operators } from '../../../../lib/reactQuery';
// import { randomId } from '@mantine/hooks';

// const OtherTemplateField = ({ onChange }: { onChange?: any }) => {
//   const { data: templates, isSuccess } = useTemplatesList();
//
//   const form = useForm({
//     initialValues: {
//       templateId: '',
//       fieldId: '',
//     },
//   });
//
//   useEffect(() => {
//     onChange && onChange(form.values);
//   }, [form.values]);
//
//   return (
//     <Stack>
//       <Select
//         data={isSuccess ? templates.map((t) => ({ label: t.name, value: t.id })) : []}
//         {...form.getInputProps('templateId')}
//       />
//       <Select
//         data={
//           isSuccess && form.values.templateId.length > 0
//             ? templates!
//                 .find((t) => t.id === form.values.templateId)!
//                 .fields.map((f) => ({ value: f.id, label: f.name }))
//             : []
//         }
//         disabled={form.values.templateId.length === 0}
//         {...form.getInputProps('fieldId')}
//       />
//     </Stack>
//   );
// };
//
// const FieldValues = ({ onChange }) => {
//   const template = useTemplateFormContext();
//   const form = useForm({
//     initialValues: {
//       fieldId: '',
//       values: [],
//     },
//   });
//
//   useEffect(() => {
//     onChange && onChange(form.values);
//   }, [form.values]);
//
//   return (
//     <Stack>
//       <Select
//         data={template.values.fields
//           .filter((f) => f.type === 'SELECT')
//           .map((t) => ({ label: `Значения поля ${t.name}`, value: t.id }))}
//         {...form.getInputProps('fieldId')}
//       />
//       <MultiSelect
//         data={
//           form.values.fieldId
//             ? template.values
//                 .fields!.find((f) => f.id === form.values.fieldId)!
//                 .options!.map((v) => ({
//                   value: v,
//                   label: v,
//                 }))
//             : []
//         }
//         {...form.getInputProps('values')}
//       />
//     </Stack>
//   );
// };
// const BlocksMenu = ({ form, toInsert }: { form: any; toInsert?: string }) => {
//   console.log(toInsert);
//   return (
//     <Menu>
//       <Menu.Target>
//         <ActionIcon variant="outline">
//           <IconPlus />
//         </ActionIcon>
//       </Menu.Target>
//       <Menu.Dropdown>
//         {!toInsert && (
//           <Menu.Item
//             onClick={() => {
//               form.insertListItem('blocks', {
//                 type: 'statement',
//                 key: randomId(),
//                 value: {
//                   if: [],
//                   then: [],
//                   else: [],
//                 },
//               });
//             }}
//           >
//             Условие
//           </Menu.Item>
//         )}
//         <Menu.Item
//           onClick={() =>
//             form.insertListItem(toInsert || 'blocks', { type: 'operator', key: randomId() })
//           }
//         >
//           Оператор
//         </Menu.Item>
//         <Menu.Item
//           onClick={() =>
//             form.insertListItem(toInsert || 'blocks', { type: 'this.field', key: randomId() })
//           }
//         >
//           Поле этого компонента
//         </Menu.Item>
//         <Menu.Item
//           onClick={() =>
//             form.insertListItem(toInsert || 'blocks', { type: 'other.field', key: randomId() })
//           }
//         >
//           Поле другого компонента
//         </Menu.Item>
//         <Menu.Item
//           onClick={() =>
//             form.insertListItem(toInsert || 'blocks', {
//               type: 'this.count',
//               key: randomId(),
//               value: 'count',
//             })
//           }
//         >
//           Кол-во этого компонента
//         </Menu.Item>
//         <Menu.Item
//           onClick={() => {
//             form.insertListItem(toInsert || 'blocks', {
//               type: 'this.field.values',
//               key: randomId(),
//               value: [],
//             });
//           }}
//         >
//           Значения поля этого компонента
//         </Menu.Item>
//       </Menu.Dropdown>
//     </Menu>
//   );
// };
//
// function getBlock(form, template, templates, index, block, inputProps?: string) {
//   if (block.type === 'statement') {
//     return (
//       <Stack align="start">
//         <Group align="normal">
//           <Group align="normal">
//             <TextInput value="ЕСЛИ" readOnly />
//             {block.value.if.map((ifb, ifi) =>
//               getBlock(form, template, templates, ifi, ifb, `blocks.${index}.value.if.${ifi}.value`)
//             )}
//             <BlocksMenu form={form} toInsert={`blocks.${index}.value.if`} />
//           </Group>
//           <TextInput value="ТО" readOnly />
//           {block.value.then.map((ifb, ifi) =>
//             getBlock(form, template, templates, ifi, ifb, `blocks.${index}.value.then.${ifi}.value`)
//           )}
//           <BlocksMenu form={form} toInsert={`blocks.${index}.value.then`} />
//         </Group>
//         <Group>
//           <TextInput value="ИНАЧЕ" readOnly />
//           <BlocksMenu form={form} toInsert={`blocks.${index}.value.else`} />
//         </Group>
//       </Stack>
//     );
//   }
//
//   if (block.type === 'this.field') {
//     return (
//       <Select
//         data={template.values.fields.map((f) => ({
//           value: f.id,
//           label: `Это.${f.name}`,
//         }))}
//         rightSection={
//           <ActionIcon
//             color="red"
//             variant="filled"
//             onClick={() => form.removeListItem('blocks', index)}
//           >
//             <IconTrash />
//           </ActionIcon>
//         }
//         {...form.getInputProps(inputProps || `blocks.${index}.value`)}
//       />
//     );
//   }
//
//   if (block.type === 'operator') {
//     return (
//       <Select
//         data={operators}
//         rightSection={
//           <ActionIcon
//             color="red"
//             variant="filled"
//             onClick={() => form.removeListItem('blocks', index)}
//           >
//             <IconTrash />
//           </ActionIcon>
//         }
//         {...form.getInputProps(inputProps || `blocks.${index}.value`)}
//       />
//     );
//   }
//
//   if (block.type === 'other.field') {
//     return <OtherTemplateField {...form.getInputProps(inputProps || `blocks.${index}.value`)} />;
//   }
//
//   if (block.type === 'this.count') {
//     return <TextInput value="Количество" readOnly />;
//   }
//
//   if (block.type === 'this.field.values') {
//     return <FieldValues {...form.getInputProps(inputProps || `blocks.${index}.value`)} />;
//   }
//   return false;
// }

const ConstraintForm = () => {
  const template = useTemplateFormContext();

  const { data: templates, isSuccess } = useTemplatesList();

  // const form = useForm<{
  //   blocks: {
  //     type: string;
  //     value: any;
  //     key: string;
  //   }[];
  // }>({
  //   initialValues: {
  //     blocks: [],
  //   },
  // });
  //
  // useEffect(() => {
  //   console.log(form.values.blocks);
  // }, [form.values.blocks]);

  return (
    <Block>
      {/*   <Group align="normal" sx={{ overflowX: 'auto' }} noWrap>*/}
      {/*     {isSuccess &&*/}
      {/*       form.values.blocks.map((block, index) => (*/}
      {/*         <Box sx={{ flex: '0 0 auto' }} key={block.key}>*/}
      {/*           {getBlock(form, template, templates, index, block)}*/}
      {/*         </Box>*/}
      {/*       ))}*/}
      {/*     {(form.values.blocks.length === 0 ||*/}
      {/*       (form.values.blocks[0] && form.values.blocks[0].type !== 'statement')) && (*/}
      {/*       <BlocksMenu form={form} />*/}
      {/*     )}*/}
      {/*   </Group>*/}
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
