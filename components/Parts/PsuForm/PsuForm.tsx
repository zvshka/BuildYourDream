import { NumberInput, Radio, TextInput } from '@mantine/core';

export const psuData = {
  power: '',
  formFactor: '',
  modular: 'No',
};

export const PsuForm = ({ form }: any) => (
  <>
    <NumberInput label="Мощность" {...form.getInputProps('data.power')} />
    <TextInput label="Форм-фактор" {...form.getInputProps('data.formFactor')} />
    <Radio.Group label="Модульный" {...form.getInputProps('data.modular')}>
      <Radio value="Yes" label="Да" />
      <Radio value="No" label="Нет" />
    </Radio.Group>
  </>
);
