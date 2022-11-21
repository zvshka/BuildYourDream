import {
  Grid,
  Group,
  Input,
  NumberInput,
  Slider,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';

const getColSpan = (type: string): number => {
  let toReturn = 0;
  switch (type) {
    case 'TEXT':
    case 'RANGE':
      toReturn = 3;
      break;
    case 'LARGE_TEXT':
      toReturn = 6;
      break;
    case 'BOOL':
    case 'NUMBER':
      toReturn = 2;
      break;
  }
  return toReturn;
};

export const Form = ({ fields, name, form }: { fields: any[]; name: string; form?: any }) => {
  return (
    <Stack spacing="md">
      <Grid columns={6}>
        <Grid.Col span={6} mb="md">
          <Input.Wrapper label="Тир компонента">
            <Slider
              step={50}
              label={null}
              marks={[
                { value: 0, label: 'Low' },
                { value: 50, label: 'Medium' },
                { value: 100, label: 'High' },
              ]}
              {...(form ? form.getInputProps('tier') : {})}
            />
          </Input.Wrapper>
        </Grid.Col>
        {fields.map((field, index) => (
          <Grid.Col key={`field_${index}`} span={getColSpan(field.type)}>
            {field.type === 'TEXT' && <TextInput label={field.name} required={field.required} />}
            {field.type === 'NUMBER' && (
              <NumberInput
                label={field.name}
                required={field.required}
                {...(form ? form.getInputProps(field.name) : {})}
              />
            )}
            {field.type === 'BOOL' && (
              <Input.Wrapper label={field.name} required={field.required}>
                <Switch
                  required={field.required}
                  {...(form ? form.getInputProps(field.name) : {})}
                />
              </Input.Wrapper>
            )}
            {field.type === 'RANGE' && (
              <Input.Wrapper label={field.name} required={field.required}>
                <Group grow>
                  <NumberInput placeholder="Цена от" required={field.required} />
                  <NumberInput placeholder="Цена до" required={field.required} />
                </Group>
              </Input.Wrapper>
            )}
            {field.type === 'LARGE_TEXT' && (
              <Textarea
                label={field.name}
                required={field.required}
                {...(form ? form.getInputProps(field.name) : {})}
              />
            )}
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
