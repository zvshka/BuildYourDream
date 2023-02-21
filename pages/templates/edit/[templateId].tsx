import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { QueryBuilder } from 'react-querybuilder';
import { TemplateField } from '../../../components/Components/TemplateField';
import { CreateField, IField } from '../../../types/Field';
import { ITemplate } from '../../../types/Template';
import { TemplateFormProvider } from '../../../components/Components/TemplateContext';
import { Block, PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { SortableList } from '../../../components/SortableList/SortableList';
import { DragHandle } from '../../../components/SortableList/SortableItem';
import { QButton, QInput, QSelect } from '../../../components/QueryBuilderComponents';
import { TEXT } from '../../../types/FieldTypes';

export default function EditForm() {
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();

  const form = useForm<ITemplate & { id?: string }>({
    initialValues: {
      id: '',
      name: '',
      required: false,
      fields: [],
    },
  });

  const { data: templateData, isFetched } = useTemplateData(router.query.templateId as string);

  useEffect(() => {
    if (isFetched) {
      form.setValues(templateData);
    }
  }, [isFetched]);

  const handleAddField = () => {
    form.insertListItem(
      'fields',
      CreateField({
        name: `Поле ${form.values.fields.length + 1}`,
        type: TEXT,
      })
    );
  };

  //TODO: Make mutation
  const handleSubmit = async (values: typeof form.values) => {
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
    <TemplateFormProvider form={form}>
      <Container size="md">
        <Stack>
          <PageHeader title={`Изменение формы: ${isFetched && templateData.name}`} />
          <Box style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Block mb="md">
                <Group position="apart">
                  <Button onClick={handleAddField}>Добавить поле</Button>
                  <Button type="submit">Сохранить</Button>
                </Group>
                <Stack>
                  <TextInput
                    {...form.getInputProps('name')}
                    placeholder="Название формы"
                    label="Название формы"
                    required
                    mt="xs"
                  />
                </Stack>
              </Block>
              {/*<Block mb="md">*/}
              {/*  <QueryBuilder*/}
              {/*    controlElements={{*/}
              {/*      addRuleAction: QButton,*/}
              {/*      combinatorSelector: QSelect,*/}
              {/*      fieldSelector: QSelect,*/}
              {/*      operatorSelector: QSelect,*/}
              {/*      valueSourceSelector: QSelect,*/}
              {/*      addGroupAction: QButton,*/}
              {/*      removeRuleAction: QButton,*/}
              {/*      removeGroupAction: QButton,*/}
              {/*      valueEditor: QInput,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</Block>*/}
              <SortableList<IField>
                items={form.values.fields}
                onChange={(values) => form.setFieldValue('fields', values)}
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
