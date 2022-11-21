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
    },
  });

  const [active, setActive] = useState(0);
  const nextStep = () => {
    if (form.validate().hasErrors) return;
    setActive((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (data: typeof form.values) => {
    console.log(data);
  };

  useEffect(() => {
    axios.get('/api/forms').then((res) => {
      setForms(res.data.map((formData: any) => ({ label: formData.name, value: formData })));
    });
  }, []);

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
                onChange={(value) => setSelectedForm(value)}
              />
            </Stepper.Step>
            <Stepper.Step label="Второй шаг" description="Информация">
              <Center>
                <Text>Шаг 2. Заполни форму настолько, насколько возможно</Text>
              </Center>
              <Paper p="sm" shadow="xl" my="sm">
                <Center>
                  <Title order={4}>{selectedForm.name}</Title>
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
            {active === 2 ? (
              <Button type="submit">Сохранить</Button>
            ) : (
              <Button onClick={nextStep}>Далее</Button>
            )}
          </Group>
        </form>
      </Container>
    </>
  );
}
