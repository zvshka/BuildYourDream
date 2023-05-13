import {
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Select,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useToggle } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { ComponentForm } from '../../components/Layout/forms/ComponentForm/ComponentForm';
import { Block } from '../../components/Layout';
import {
  ComponentFormProvider,
  useComponentForm,
} from '../../components/Layout/forms/TemplateForm/TemplateContext';
import { IField } from '../../types/Field';
import { BOOL, DEPENDS_ON, LARGE_TEXT, NUMBER, RANGE, SELECT, TEXT } from '../../types/FieldTypes';
import { useTemplatesList } from '../../components/hooks/templates';
import { IComponentBody, ITemplate } from '../../types/Template';
import { storage } from '../../lib/utils';

export default function CreatePart() {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string>();
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>();
  const form = useComponentForm({
    initialValues: {
      pros: [],
      cons: [],
      tier: 'low',
      image: {
        base64: '',
        file: null,
      },
    },
  });
  const [loading, toggleLoading] = useToggle();

  const [active, setActive] = useState(0);
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('upload', file);
    return axios.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const saveComponent = useMutation(
    (componentData: IComponentBody) =>
      axios.post(
        '/api/components',
        {
          data: componentData,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      ),
    {
      onSuccess: () => {
        toggleLoading();
        showNotification({
          title: 'Успех',
          message: 'Компонент успешно сохранен',
          color: 'green',
        });
      },
      onError: () => {
        toggleLoading();
        showNotification({
          title: 'Ошибка',
          message: 'При сохранении что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (data: typeof form.values) => {
    toggleLoading();
    if (data.image?.file) {
      uploadImage(data.image.file).then((res) =>
        saveComponent.mutate({ ...data, image: res.data })
      );
    } else {
      saveComponent.mutate({ ...data });
    }
  };

  const { data: templates, isSuccess } = useTemplatesList();

  const handleSelectTemplate = (value: string) => {
    setTemplateId(value);
    if (!isSuccess) return;
    const template = templates.find((t) => t.id === value);
    if (!template) return;
    setSelectedTemplate(template);
    template.fields.forEach((field: IField) => {
      switch (field.type) {
        case TEXT:
        case LARGE_TEXT:
          form.setFieldValue(field.name, form.values[field.name] || '');
          break;
        case NUMBER:
          form.setFieldValue(field.name, form.values[field.name] || 0);
          break;
        case BOOL:
          form.setFieldValue(field.name, form.values[field.name] || false);
          break;
        case RANGE:
          form.setFieldValue(field.name, form.values[field.name] || [0, 0]);
          break;
        case SELECT:
          form.setFieldValue(field.name, form.values[field.name] || '');
          break;
        case DEPENDS_ON:
          form.setFieldValue(
            field.name,
            form.values[field.name] || {
              template: '',
              field: '',
            }
          );
          break;
      }
    });
  };

  useEffect(() => {
    if (
      isSuccess &&
      templates.length > 0 &&
      router.query &&
      router.query.templateId &&
      templates.map((t: any) => t.id).includes(router.query.templateId as string)
    ) {
      const possibleTemplate = templates.find((t: ITemplate) => t.id === router.query.templateId);
      if (possibleTemplate) {
        handleSelectTemplate(possibleTemplate.id as string);
      }
    }
  }, [isSuccess, templates]);

  return (
    <ComponentFormProvider form={form}>
      <Container size="sm" px={0}>
        <Block sx={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm" iconPosition="left">
              <Stepper.Step label="Первый шаг" description="Выбор типа">
                <Center>
                  <Text>Шаг 1. Выбери форму того компонента, который хочешь добавить</Text>
                </Center>
                <Select
                  data={
                    isSuccess
                      ? templates.map((t) => ({ label: t.name, value: t.id as string }))
                      : []
                  }
                  label="Тип"
                  searchable
                  required
                  value={templateId}
                  onChange={handleSelectTemplate}
                />
              </Stepper.Step>
              <Stepper.Step label="Второй шаг" description="Информация">
                <Center>
                  <Text>Шаг 2. Заполни форму настолько, насколько возможно</Text>
                </Center>
                <Center mb="md">
                  <Title order={2}>Добавление компонента: {selectedTemplate?.name}</Title>
                </Center>
                <ComponentForm fields={selectedTemplate?.fields || []} />
              </Stepper.Step>
              <Stepper.Completed>
                <Center py="xl">
                  <Title order={3}>Отлично! Можно сохранять</Title>
                </Center>
              </Stepper.Completed>
            </Stepper>
            <Group position="center" mt="xl">
              {active !== 0 && (
                <Button variant="default" onClick={prevStep}>
                  Назад
                </Button>
              )}
              {active !== 2 && <Button onClick={nextStep}>Далее</Button>}
              {active === 2 && <Button type="submit">Сохранить</Button>}
            </Group>
          </form>
        </Block>
      </Container>
    </ComponentFormProvider>
  );
}
