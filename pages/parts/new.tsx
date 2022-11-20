import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  NumberInput,
  Select,
  Stepper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons';
import { psuData, PsuForm } from '../../components/Parts/PsuForm/PsuForm';

const initialShop = () => ({ name: '', price: 0, url: '', key: randomId() });
const options = [{ label: 'Блок питания', value: 'psu' }];
export default function CreatePart() {
  const form = useForm({
    initialValues: {
      type: '',
      shops: [{ name: '', price: 0, url: '', key: randomId() }],
      data: {},
    },
    validate: {
      type: (value) => (value ? null : 'Выбери тип'),
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
    form.setFieldValue('data', {
      name: '',
      ...psuData,
    });
  }, [form.values.type]);

  return (
    <>
      <Container size="xs">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm" iconPosition="left">
            <Stepper.Step label="Первый шаг" description="Выбор типа">
              <Center>
                <Text>Шаг 1. Выбери тип того, что хочешь добавить</Text>
              </Center>
              <Select
                data={options}
                label="Тип"
                searchable
                clearable
                creatable
                required
                getCreateLabel={(query) => `+ Create ${query}`}
                {...form.getInputProps('type')}
              />
            </Stepper.Step>
            <Stepper.Step label="Второй шаг" description="Информация">
              <Center>
                <Text>Шаг 2. Заполни форму настолько, насколько возможно</Text>
              </Center>
              <Center>
                <Title order={4}>
                  {options.find((opt) => opt.value === form.values.type)?.label}
                </Title>
              </Center>
              <TextInput label="Название" {...form.getInputProps('data.name')} />
              {form.values.type === 'psu' && <PsuForm form={form} />}
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            {active === 2 ? (
              <Button type="submit">Save</Button>
            ) : (
              <Button onClick={nextStep}>Next step</Button>
            )}
          </Group>
        </form>
      </Container>
    </>
  );
}
