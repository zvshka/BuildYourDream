import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Center, Container, Group, Stack, Title, Button } from '@mantine/core';
import { FormsFormProvider, useFormsForm } from '../../../components/Parts/FormContext';
import { IFormValues } from '../../../types/Form';
import { Form } from '../../../components/Parts/Form';
import { Block } from '../../../components/Layout/Block/Block';
import { IField } from '../../../lib/Field';

interface IPart {
  id: string;
  formId: string;
  data: IFormValues;
}

export default function editPartPage() {
  const router = useRouter();
  const [partData, setPartData] = useState<IPart>();
  const [formData, setFormData] = useState<any>();
  const [formIsReady, setFormIsReady] = useState<boolean>(false);
  const form = useFormsForm({
    initialValues: {
      tier: 0,
      pros: [],
      cons: [],
      image: {
        base64: '',
        file: null,
      },
    },
  });
  useEffect(() => {
    axios.get(`/api/parts/${router.query.partId}`).then((res) => setPartData(res.data));
  }, []);

  useEffect(() => {
    if (partData?.formId) {
      axios.get(`/api/forms/${partData.formId}`).then((res) => setFormData(res.data));
    }
  }, [partData]);

  useEffect(() => {
    if (formData) {
      formData.fields.forEach((field: IField) => {
        switch (field.type) {
          case 'TEXT':
          case 'LARGE_TEXT':
            form.setFieldValue(field.name, partData?.data[field.name] || '');
            break;
          case 'NUMBER':
            form.setFieldValue(field.name, partData?.data[field.name] || 0);
            break;
          case 'BOOL':
            form.setFieldValue(field.name, partData?.data[field.name] || false);
            break;
          case 'RANGE':
            form.setFieldValue(field.name, partData?.data[field.name] || [0, 0]);
            break;
          case 'SELECT':
            form.setFieldValue(field.name, partData?.data[field.name] || '');
            break;
        }
      });

      form.setFieldValue('pros', partData?.data.pros || []);
      form.setFieldValue('cons', partData?.data.cons || []);
      form.setFieldValue('image.base64', partData?.data?.image?.url);

      setFormIsReady(true);
    }
  }, [formData]);

  const uploadImage = (file: File) => {
    const fd = new FormData();
    fd.append('upload', file);
    return axios.post('/api/images', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const saveData = (data: typeof form.values, image: null | Record<string, string>) =>
    axios.patch(`/api/parts/${partData?.id}`, {
      data: {
        ...data,
        image,
      },
      formId: partData?.formId,
    });

  const handleSubmit = (data: typeof form.values) => {
    if (data.image.file) {
      uploadImage(data.image.file).then((res) => saveData(data, res.data));
    } else {
      saveData(data, { url: form.values.image.base64 }).then((res) => {});
    }
  };

  return (
    <FormsFormProvider form={form}>
      <Container size="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Block>
              <Center mb="md">
                <Title order={2}>Изменение компонента: {partData?.data['Название']}</Title>
              </Center>
            </Block>
            <Block>{formData && formIsReady && <Form formFields={formData?.fields} />}</Block>
            <Group position="center">
              <Button type="submit">Сохранить</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </FormsFormProvider>
  );
}
