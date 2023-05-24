import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Image,
  Input,
  NumberInput,
  Radio,
  Select,
  Stack,
  Switch,
  Tabs,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { IconCircleMinus, IconCirclePlus, IconTrashX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import { RangeInput } from '../../index';
import { useComponentFormContext } from '../TemplateForm/TemplateContext';
import { IField } from '../../../../types/Field';
import {
  BOOL,
  DEPENDS_ON,
  LARGE_TEXT,
  NUMBER,
  RANGE,
  SELECT,
  TEXT,
} from '../../../../types/FieldTypes';
import { useTemplatesList } from '../../../hooks/templates';
import { uploadImageMutation } from '../../../hooks/images';

const getColSpan = (type: string): number => {
  let toReturn = 0;
  switch (type) {
    case TEXT:
    case RANGE:
    case SELECT:
    case DEPENDS_ON:
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
  const theme = useMantineTheme();
  const template = useComponentFormContext();
  const { data: templates, isFetched, isSuccess } = useTemplatesList();

  const media = useMediaQuery(theme.fn.largerThan('md').replace('@media', ''));

  const handleAddCons = () => {
    template.insertListItem('cons', '');
  };

  const handleAddPros = () => {
    template.insertListItem('pros', '');
  };

  const imageUpload = useMutation(uploadImageMutation);

  const handleImageUpload = async (files: FileWithPath[]) => {
    const formData = new FormData();
    formData.append('upload', files[0]);
    const response = await imageUpload.mutateAsync(formData);
    if (response) {
      template.setFieldValue('imageUrl', response.data.url);
    }
  };

  return (
    <Stack spacing="md">
      <Grid columns={6}>
        <Grid.Col span={6}>
          <Stack align="center">
            <Dropzone maxFiles={1} onDrop={handleImageUpload} accept={IMAGE_MIME_TYPE} p={0}>
              <Image height={200} width={300} withPlaceholder src={template.values.imageUrl} />
            </Dropzone>
            <Button
              disabled={!template.values.imageUrl || template.values.imageUrl.length < 1}
              onClick={() => template.setFieldValue('imageUrl', '')}
            >
              Сбросить
            </Button>
          </Stack>
        </Grid.Col>
        {fields.map((field, index) => (
          <Grid.Col key={`field_${index}`} {...(media ? { span: getColSpan(field.type) } : {})}>
            {field.type === TEXT && (
              <TextInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === NUMBER && (
              <NumberInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === BOOL && (
              <Input.Wrapper label={field.name} required={field.required}>
                <Switch
                  required={field.required}
                  {...(template ? template.getInputProps(field.name, { type: 'checkbox' }) : {})}
                />
              </Input.Wrapper>
            )}
            {field.type === RANGE && (
              <RangeInput
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === LARGE_TEXT && (
              <Textarea
                label={field.name}
                required={field.required}
                autosize
                minRows={4}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === SELECT && (
              <Select
                data={field.options!.map((data: string) => ({ value: data, label: data }))}
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
            {field.type === DEPENDS_ON && (
              <Select
                data={
                  isFetched && isSuccess
                    ? (templates
                        .find((t) => t.id === field.depends_on?.template)
                        ?.fields.find((f) => f.id === field.depends_on?.field)
                        ?.options?.map((data) => ({ value: data, label: data })) as Array<{
                        value: string;
                        label: string;
                      }>)
                    : []
                }
                label={field.name}
                required={field.required}
                {...(template ? template.getInputProps(field.name) : {})}
              />
            )}
          </Grid.Col>
        ))}
        <Grid.Col span={6} mb="md">
          <Radio.Group
            label="Тир компонента"
            required
            {...(template ? template.getInputProps('tier') : {})}
          >
            <Group spacing="xs" mt="xs">
              <Radio value="low" label="Low" />
              <Radio value="medium" label="Medium" />
              <Radio value="high" label="High" />
            </Group>
          </Radio.Group>
        </Grid.Col>
        <Grid.Col span={6} mb="md">
          <Input.Wrapper label="Плюсы и минусы">
            <Tabs defaultValue="pros">
              <Tabs.List>
                <Tabs.Tab icon={<IconCirclePlus size={20} color="green" />} value="pros">
                  Плюсы
                </Tabs.Tab>
                <Tabs.Tab icon={<IconCircleMinus size={20} color="red" />} value="cons">
                  Минусы
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="pros" mt="xs">
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
              </Tabs.Panel>
              <Tabs.Panel value="cons" mt="xs">
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
              </Tabs.Panel>
            </Tabs>
            {/*<Group grow align="normal" display="none">*/}
            {/*  <Stack>*/}
            {/*    {template.values &&*/}
            {/*      template.values.pros &&*/}
            {/*      template.values.pros.map((value: string, index: number) => (*/}
            {/*        <TextInput*/}
            {/*          key={`pros_${index}`}*/}
            {/*          required*/}
            {/*          {...template.getInputProps(`pros.${index}`)}*/}
            {/*          rightSection={*/}
            {/*            <ActionIcon*/}
            {/*              style={{ maxWidth: 28 }}*/}
            {/*              color="red"*/}
            {/*              variant="filled"*/}
            {/*              onClick={() => template.removeListItem('pros', index)}*/}
            {/*            >*/}
            {/*              <IconTrashX />*/}
            {/*            </ActionIcon>*/}
            {/*          }*/}
            {/*        />*/}
            {/*      ))}*/}
            {/*    <Button onClick={handleAddPros}>Добавить плюс</Button>*/}
            {/*  </Stack>*/}
            {/*  <Stack>*/}
            {/*    {template.values &&*/}
            {/*      template.values.cons &&*/}
            {/*      template.values.cons.map((value: string, index: number) => (*/}
            {/*        <TextInput*/}
            {/*          key={`cons_${index}`}*/}
            {/*          required*/}
            {/*          {...template.getInputProps(`cons.${index}`)}*/}
            {/*          rightSection={*/}
            {/*            <ActionIcon*/}
            {/*              style={{ maxWidth: 28 }}*/}
            {/*              color="red"*/}
            {/*              variant="filled"*/}
            {/*              onClick={() => template.removeListItem('cons', index)}*/}
            {/*            >*/}
            {/*              <IconTrashX />*/}
            {/*            </ActionIcon>*/}
            {/*          }*/}
            {/*        />*/}
            {/*      ))}*/}
            {/*    <Button onClick={handleAddCons}>Добавить минус</Button>*/}
            {/*  </Stack>*/}
            {/*</Group>*/}
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
