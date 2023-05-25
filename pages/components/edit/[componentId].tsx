import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Container, Group, LoadingOverlay, Stack } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import {
  ComponentFormProvider,
  useComponentForm,
} from '../../../components/Layout/forms/TemplateForm/TemplateContext';
import { ComponentForm } from '../../../components/Layout/forms/ComponentForm/ComponentForm';
import { Block, PageHeader } from '../../../components/Layout';
import { IField } from '../../../types/Field';
import { IComponentBody } from '../../../types/Template';
import {
  BOOL,
  DEPENDS_ON,
  LARGE_TEXT,
  NUMBER,
  RANGE,
  SELECT,
  TEXT,
} from '../../../types/FieldTypes';
import { storage } from '../../../lib/utils';
import { useTemplateData } from '../../../components/hooks/templates';
import { useComponentData } from '../../../components/hooks/components';

export default function EditComponentPage() {
  const router = useRouter();
  const { data: componentData, isSuccess: isComponentLoaded } = useComponentData(
    router.query.componentId as string
  );
  const { data: templateData, isSuccess: isTemplateLoaded } = useTemplateData(
    componentData?.templateId
  );
  const [templateIsReady, setTemplateIsReady] = useState<boolean>(false);
  const [loading, toggleLoading] = useToggle();
  const form = useComponentForm({
    initialValues: {
      tier: 'low',
      pros: [],
      cons: [],
      imageUrl: '',
    },
  });

  useEffect(() => {
    // toggleLoading();
    if (isComponentLoaded && isTemplateLoaded) {
      templateData.fields.forEach((field: IField) => {
        switch (field.type) {
          case TEXT:
          case LARGE_TEXT:
            form.setFieldValue(field.name, componentData.data[field.name] || '');
            break;
          case NUMBER:
            form.setFieldValue(field.name, componentData.data[field.name] || 0);
            break;
          case BOOL:
            form.setFieldValue(field.name, componentData.data[field.name] || false);
            break;
          case RANGE:
            form.setFieldValue(field.name, componentData.data[field.name] || [0, 0]);
            break;
          case SELECT:
          case DEPENDS_ON:
            form.setFieldValue(field.name, componentData.data[field.name] || '');
            break;
        }
      });

      form.setFieldValue('tier', componentData.data.tier);
      form.setFieldValue('pros', componentData.data.pros || []);
      form.setFieldValue('cons', componentData.data.cons || []);
      form.setFieldValue('imageUrl', componentData.data.imageUrl);

      setTemplateIsReady(true);
      // toggleLoading();
    }
  }, [templateData]);

  const updateComponent = useMutation(
    (newComponentData: IComponentBody) =>
      axios.patch(
        `/api/components/${componentData?.id}`,
        {
          data: newComponentData,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Компонент успешно сохранен',
          color: 'green',
        });
        // toggleLoading();
      },
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Что-то пошло не так',
          color: 'red',
        });
        // toggleLoading();
      },
    }
  );

  const handleSubmit = (data: typeof form.values) => {
    updateComponent.mutate(data);
  };

  return (
    <ComponentFormProvider form={form}>
      <Container size="sm" px={0}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PageHeader
              addBack
              title={`Изменение компонента: ${componentData?.data['Название']}`}
            />
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
