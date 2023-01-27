import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Center, Container, Group, Stack, Title } from '@mantine/core';
import { TemplateFormProvider, useTemplateForm } from '../../../components/Parts/TemplateContext';
import { ComponentForm } from '../../../components/Parts/ComponentForm';
import { Block } from '../../../components/Layout/Block/Block';
import { IField } from '../../../lib/Field';
import { IComponent } from '../../../types/Template';

export default function editComponentPage() {
  const router = useRouter();
  const [componentData, setComponentData] = useState<IComponent>();
  const [formData, setFormData] = useState<any>();
  const [formIsReady, setFormIsReady] = useState<boolean>(false);
  const form = useTemplateForm({
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
    axios.get(`/api/parts/${router.query.componentId}`).then((res) => setComponentData(res.data));
  }, []);

  useEffect(() => {
    if (componentData?.formId) {
      axios.get(`/api/templates/${componentData.templateId}`).then((res) => setFormData(res.data));
    }
  }, [componentData]);

  useEffect(() => {
    if (formData) {
      formData.fields.forEach((field: IField) => {
        switch (field.type) {
          case 'TEXT':
          case 'LARGE_TEXT':
            form.setFieldValue(field.name, componentData?.data[field.name] || '');
            break;
          case 'NUMBER':
            form.setFieldValue(field.name, componentData?.data[field.name] || 0);
            break;
          case 'BOOL':
            form.setFieldValue(field.name, componentData?.data[field.name] || false);
            break;
          case 'RANGE':
            form.setFieldValue(field.name, componentData?.data[field.name] || [0, 0]);
            break;
          case 'SELECT':
            form.setFieldValue(field.name, componentData?.data[field.name] || '');
            break;
        }
      });

      form.setFieldValue('pros', componentData?.data.pros || []);
      form.setFieldValue('cons', componentData?.data.cons || []);
      form.setFieldValue('image.base64', componentData?.data?.image?.url);

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
    axios.patch(`/api/parts/${componentData?.id}`, {
      data: {
        ...data,
        image,
      },
      formId: componentData?.formId,
    });

  const handleSubmit = (data: typeof form.values) => {
    if (data.image.file) {
      uploadImage(data.image.file).then((res) => saveData(data, res.data));
    } else {
      saveData(data, { url: form.values.image.base64 }).then((res) => {});
    }
  };

  return (
    <TemplateFormProvider form={form}>
      <Container size="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Block>
              <Center mb="md">
                <Title order={2}>Изменение компонента: {componentData?.data['Название']}</Title>
              </Center>
            </Block>
            <Block>{formData && formIsReady && <ComponentForm />}</Block>
            <Group position="center">
              <Button type="submit">Сохранить</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </TemplateFormProvider>
  );
}
