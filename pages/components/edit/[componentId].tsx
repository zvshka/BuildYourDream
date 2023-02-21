import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Container, Group, LoadingOverlay, Stack } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import {
  ComponentFormProvider,
  useComponentForm,
} from '../../../components/Components/TemplateContext';
import { ComponentForm } from '../../../components/Components/ComponentForm';
import { Block, PageHeader } from '../../../components/Layout';
import { IField } from '../../../types/Field';
import { IComponent, ITemplate } from '../../../types/Template';
import { showNotification } from '@mantine/notifications';
import { BOOL, LARGE_TEXT, NUMBER, RANGE, SELECT, TEXT } from '../../../types/FieldTypes';

export default function editComponentPage() {
  const router = useRouter();
  const [componentData, setComponentData] = useState<IComponent>();
  const [templateData, setTemplateData] = useState<ITemplate>();
  const [templateIsReady, setTemplateIsReady] = useState<boolean>(false);
  const [loading, toggleLoading] = useToggle();
  const form = useComponentForm({
    initialValues: {
      tier: 'low',
      pros: [],
      cons: [],
      image: {
        base64: '',
        file: null,
      },
    },
  });

  useEffect(() => {
    toggleLoading();
    axios
      .get(`/api/components/${router.query.componentId}`)
      .then((res) => setComponentData(res.data));
  }, []);

  useEffect(() => {
    if (componentData?.templateId) {
      axios
        .get(`/api/templates/${componentData.templateId}`)
        .then((res) => setTemplateData(res.data));
    }
  }, [componentData]);

  useEffect(() => {
    if (templateData) {
      templateData.fields.forEach((field: IField) => {
        switch (field.type) {
          case TEXT:
          case LARGE_TEXT:
            form.setFieldValue(field.name, componentData?.data[field.name] || '');
            break;
          case NUMBER:
            form.setFieldValue(field.name, componentData?.data[field.name] || 0);
            break;
          case BOOL:
            form.setFieldValue(field.name, componentData?.data[field.name] || false);
            break;
          case RANGE:
            form.setFieldValue(field.name, componentData?.data[field.name] || [0, 0]);
            break;
          case SELECT:
            form.setFieldValue(field.name, componentData?.data[field.name] || '');
            break;
        }
      });

      form.setFieldValue('pros', componentData?.data.pros || []);
      form.setFieldValue('cons', componentData?.data.cons || []);
      form.setFieldValue('image', { base64: componentData?.data?.image?.url, file: null });

      setTemplateIsReady(true);
      toggleLoading();
    }
  }, [templateData]);

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
    axios.patch(`/api/components/${componentData?.id}`, {
      data: {
        ...data,
        image,
      },
      formId: componentData?.formId,
    });

  const handleSubmit = (data: typeof form.values) => {
    toggleLoading();
    if (data.image?.file) {
      uploadImage(data.image.file)
        .then((res) => saveData(data, res.data))
        .then(() => {
          showNotification({
            title: 'Успех',
            message: 'Компонент успешно сохранен',
            color: 'green',
          });
          toggleLoading();
        });
    } else {
      saveData(data, { url: form.values.image?.base64 as string }).then(() => {
        showNotification({
          title: 'Успех',
          message: 'Компонент успешно сохранен',
          color: 'green',
        });
        toggleLoading();
      });
    }
  };

  return (
    <ComponentFormProvider form={form}>
      <Container size="sm">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PageHeader title={`Изменение компонента: ${componentData?.data['Название']}`} />
            <Block sx={{ position: 'relative' }}>
              <LoadingOverlay visible={loading} overlayBlur={2} />
              {templateData && templateIsReady && <ComponentForm fields={templateData.fields} />}
            </Block>
            <Group position="center">
              <Button type="submit">Сохранить</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </ComponentFormProvider>
  );
}
