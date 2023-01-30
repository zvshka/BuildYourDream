import {
  ActionIcon,
  Button,
  FileButton,
  Grid,
  Group,
  Image,
  Input,
  NumberInput,
  Select,
  Slider,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconTrashX } from '@tabler/icons';
import { useEffect, useRef } from 'react';
import { RangeInput } from '../Layout';
import { useComponentFormContext, useTemplateFormContext } from './TemplateContext';
import { BOOL, LARGE_TEXT, NUMBER, RANGE, SELECT, TEXT } from '../../types/Template';
import { IField } from '../../lib/Field';

const getColSpan = (type: string): number => {
  let toReturn = 0;
  switch (type) {
    case TEXT:
    case RANGE:
    case SELECT:
      toReturn = 3;
      break;
    case LARGE_TEXT:
      toReturn = 6;
      break;
    case BOOL:
    case NUMBER:
      toReturn = 2;
      break;
  }
  return toReturn;
};

export const ComponentForm = ({ fields }: { fields: IField[] }) => {
  const template = useComponentFormContext();
  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    resetRef.current?.();
    template.setFieldValue('image.base64', '');
    template.setFieldValue('image.file', null);
  };

  const handleAddCons = () => {
    template.insertListItem('cons', '');
  };

  const handleAddPros = () => {
    template.insertListItem('pros', '');
  };

  useEffect(() => {
    if (!template.values.image?.file) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(template.values.image.file);
    fileReader.onload = () => {
      template.setFieldValue('image.base64', fileReader.result);
    };
  }, [template.values.image]);

  return (
    <Stack spacing="md">
      <Grid columns={6}>
        <Grid.Col span={6}>
          <Stack align="center">
            <Image withPlaceholder width={256} height={256} src={template.values?.image?.base64} />
            <Group spacing="xs">
              <FileButton
                resetRef={resetRef}
                onChange={(file) => template.setFieldValue('image.file', file)}
                accept="image/png,image/jpeg"
              >
                {(props) => <Button {...props}>Загрузить изображение</Button>}
              </FileButton>
              <Button disabled={!template.values?.image?.file} color="red" onClick={clearFile}>
                Сбросить
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
        {fields.map((field, index) => (
          <Grid.Col key={`field_${index}`} span={getColSpan(field.type)}>
            {field.type === 'TEXT' && (
              <TextInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === 'NUMBER' && (
              <NumberInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === 'BOOL' && (
              <Input.Wrapper label={field.name} required={field.required}>
                <Switch
                  required={field.required}
                  {...(template ? template.getInputProps(field.name, { type: 'checkbox' }) : {})}
                />
              </Input.Wrapper>
            )}
            {field.type === 'RANGE' && (
              <RangeInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === 'LARGE_TEXT' && (
              <Textarea
                label={field.name}
                required={field.required}
                autosize
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === 'SELECT' && (
              <Select
                data={field.options!.map((data: string) => ({ value: data, label: data }))}
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
          </Grid.Col>
        ))}
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
              {...(template ? template.getInputProps('tier') : {})}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={6} mb="md">
          <Input.Wrapper label="Плюсы и минусы">
            <Group grow align="normal">
              <Stack>
                {template.values &&
                  template.values.pros &&
                  template.values.pros.map((value: string, index: number) => (
                    <TextInput
                      key={`pros_${index}`}
                      required
                      {...template.getInputProps(`pros.${index}`)}
                      rightSection={
                        <ActionIcon
                          style={{ maxWidth: 28 }}
                          color="red"
                          variant="filled"
                          onClick={() => template.removeListItem('pros', index)}
                        >
                          <IconTrashX />
                        </ActionIcon>
                      }
                    />
                  ))}
                <Button onClick={handleAddPros}>Добавить плюс</Button>
              </Stack>
              <Stack>
                {template.values &&
                  template.values.cons &&
                  template.values.cons.map((value: string, index: number) => (
                    <TextInput
                      key={`cons_${index}`}
                      required
                      {...template.getInputProps(`cons.${index}`)}
                      rightSection={
                        <ActionIcon
                          style={{ maxWidth: 28 }}
                          color="red"
                          variant="filled"
                          onClick={() => template.removeListItem('cons', index)}
                        >
                          <IconTrashX />
                        </ActionIcon>
                      }
                    />
                  ))}
                <Button onClick={handleAddCons}>Добавить минус</Button>
              </Stack>
            </Group>
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
