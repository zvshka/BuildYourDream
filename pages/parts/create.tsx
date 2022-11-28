import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  Select,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { Form } from '../../components/Parts/Form';

export default function CreatePart() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState<any>({});
  const form = useForm<Record<any, any>>({
    initialValues: {
      tier: 0,
      pros: [],
      cons: [],
    },
  });

  const [active, setActive] = useState(0);
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (data: typeof form.values) => {
    if (active < 2) return setActive((current) => (current < 3 ? current + 1 : current));
    axios
      .post('/api/parts', {
        data,
        formId: selectedForm.id,
      })
      .then((res) => console.log(res.data));
  };

  useEffect(() => {
    axios.get('/api/forms').then((res) => {
      setForms(res.data.map((formData: any) => ({ label: formData.name, value: formData })));
    });
  }, []);

  const handleSelectForm = (value: any) => {
    setSelectedForm(value);
    value.fields.forEach((field: any) => {
      switch (field.type) {
        case 'TEXT':
        case 'LARGE_TEXT':
          form.setFieldValue(field.name, form.values[field.name] || '');
          break;
        case 'NUMBER':
          form.setFieldValue(field.name, form.values[field.name] || 0);
          break;
        case 'BOOL':
          form.setFieldValue(field.name, form.values[field.name] || false);
          break;
        case 'RANGE':
          form.setFieldValue(field.name, form.values[field.name] || [0, 0]);
          break;
        case 'SELECT':
          form.setFieldValue(field.name, form.values[field.name] || '');
          break;
      }
    });
  };

  return (
    <>
      <Container size="sm">
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
              <Paper p="sm" shadow="xl" my="sm">
                <Center>
                  <Title order={4}>Добавление компонента: {selectedForm.name}</Title>
                </Center>
              </Paper>
              <Paper p="sm" shadow="xl">
                <Form fields={selectedForm.fields} name={selectedForm.name} form={form} />
              </Paper>
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Назад
            </Button>
            <Button type="submit">{active === 2 ? 'Сохранить' : 'Далее'}</Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
