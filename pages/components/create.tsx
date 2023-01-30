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
import { ComponentForm } from '../../components/Components/ComponentForm';
import { Block } from '../../components/Layout';
import {
  ComponentFormProvider,
  useComponentForm,
} from '../../components/Components/TemplateContext';
import { IField } from '../../lib/Field';
import { BOOL, LARGE_TEXT, NUMBER, RANGE, SELECT, TEXT } from '../../types/Template';

export default function CreatePart() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState<any>({});
  const form = useComponentForm({
    initialValues: {
      pros: [],
      cons: [],
      tier: 0,
      image: {
        base64: '',
        file: null,
      },
    },
  });
  const [loading, toggleLoading] = useToggle();

  const [active, setActive] = useState(0);
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('upload', file);
    return axios.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const saveData = (data: typeof form.values, image = null) =>
    axios.post('/api/components', {
      data: {
        ...data,
        image,
      },
      templateId: selectedForm?.id,
    });

  const handleSubmit = (data: typeof form.values) => {
    if (active < 2) return setActive((current) => (current < 3 ? current + 1 : current));
    toggleLoading();
    if (data.image?.file) {
      uploadImage(data.image.file)
        .then((res) => saveData(data, res.data))
        .then((res) => {
          toggleLoading();
          showNotification({
            title: 'Успех',
            message: 'Компонент успешно сохранен',
            color: 'green',
          });
        });
    } else {
      saveData(data).then((res) => {
        toggleLoading();
        showNotification({
          title: 'Успех',
          message: 'Компонент успешно сохранен',
          color: 'green',
        });
      });
    }
    return true;
  };

  useEffect(() => {
    axios.get('/api/templates').then((res) => {
      setForms(res.data.map((formData: any) => ({ label: formData.name, value: formData })));
    });
  }, []);

  const handleSelectForm = (value: any) => {
    setSelectedForm(value);
    value.fields.forEach((field: IField) => {
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
      }
    });
  };

  useEffect(() => {
    if (
      forms &&
      forms.length > 0 &&
      router.query &&
      router.query.templateId &&
      forms.map((f: any) => f.value.id).includes(router.query.templateId as string)
    ) {
      const possibleForm: any = forms.find((f: any) => f.value.id === router.query.templateId);
      if (possibleForm) {
        handleSelectForm(possibleForm.value);
      }
    }
  }, [forms]);

  return (
    <ComponentFormProvider form={form}>
      <Container size="sm">
        <Block sx={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm" iconPosition="left">
              <Stepper.Step label="Первый шаг" description="Выбор типа">
                <Center>
                  <Text>Шаг 1. Выбери форму того компонента, который хочешь добавить</Text>
                </Center>
                <Select
                  data={forms}
                  label="Тип"
                  searchable
                  required
                  value={selectedForm}
                  onChange={handleSelectForm}
                />
              </Stepper.Step>
              <Stepper.Step label="Второй шаг" description="Информация">
                <Center>
                  <Text>Шаг 2. Заполни форму настолько, насколько возможно</Text>
                </Center>
                <Center mb="md">
                  <Title order={2}>Добавление компонента: {selectedForm?.name}</Title>
                </Center>
                <ComponentForm fields={selectedForm.fields} />
              </Stepper.Step>
              <Stepper.Completed>
                <Text>Отлично! Можно сохранять</Text>
              </Stepper.Completed>
            </Stepper>
            <Group position="center" mt="xl">
              <Button variant="default" onClick={prevStep}>
                Назад
              </Button>
              <Button type="submit">{active === 2 ? 'Сохранить' : 'Далее'}</Button>
            </Group>
          </form>
        </Block>
      </Container>
    </ComponentFormProvider>
  );
}
