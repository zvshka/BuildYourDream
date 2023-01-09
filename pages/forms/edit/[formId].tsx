import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Form } from '../../../components/Parts/Form';
import { FormField } from '../../../components/Parts/FormField';
import { Block } from '../../../components/Layout/Block/Block';
import { CreateField, IField } from '../../../lib/Field';

interface IForm {
  name: string;
  id: string;
  fields: IField[];
}

export default function EditForm() {
  const modals = useModals();
  const [formData, setFormData] = useState<IForm>();
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();

  const form = useForm<IForm>({
    initialValues: {
      id: '',
      name: '',
      fields: [],
    },
  });

  useEffect(() => {
    axios.get(`/api/forms/${router.query.formId}`).then((res) => setFormData(res.data));
  }, []);

  useEffect(() => {
    if (formData) {
      form.setValues(formData);
    }
  }, [formData]);

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
      children: <Form />,
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    axios
      .patch(`/api/forms/${router.query.formId}`, {
        name: values.name,
        fields: values.fields,
      })
      .then(() => {
        showNotification({
          title: 'Успех',
          message: 'Форма успешно создана',
          color: 'green',
        });
        toggleLoading();
      })
      .catch(() => {
        showNotification({
          title: 'Ошибка',
          message: 'Во время сохранения формы произошла ошибка',
          color: 'red',
        });
        toggleLoading();
      });
  };

  const fields = form.values.fields.map((item, index) => (
    <FormField key={`field_${index}`} form={form} index={index} item={item} />
  ));

  return (
    <Container size="md">
      <Stack>
        <Block>
          <Title order={4}>Изменение формы: {formData && formData.name}</Title>
        </Block>
        <Box style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Block>
              <Group position="apart">
                <Button onClick={handleAddField}>Добавить поле</Button>
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
            <Stack mt="md">{fields}</Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
