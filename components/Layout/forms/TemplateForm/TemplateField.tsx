import {
  ActionIcon,
  Box,
  Group,
  Input,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { ITemplate } from '../../../../types/Template';
import { CreateField } from '../../../../types/Field';
import { useTemplateFormContext } from './TemplateContext';
import { useTemplatesList } from '../../../hooks/templates';
import { DEPENDS_ON, fieldTypes, SELECT } from '../../../../types/FieldTypes';

export const TemplateField = (props) => {
  const { item, index } = props;
  const template = useTemplateFormContext();
  const { data: templates, isSuccess } = useTemplatesList();

  useEffect(() => {
    const field = CreateField(item);
    template.setFieldValue(`fields.${index}`, field);
  }, [template.values.fields[index]?.type]);

  return (
    <Box>
      <Stack mt="xs" spacing="xs">
        <Group>
          <TextInput
            placeholder="Название"
            sx={{ flex: 1 }}
            {...template.getInputProps(`fields.${index}.name`)}
            disabled={!item.editable}
            required
          />
          <Select
            data={fieldTypes}
            {...template.getInputProps(`fields.${index}.type`)}
            disabled={!item.editable}
            required
          />
          <Switch
            label="Обязательное"
            styles={{
              root: {
                display: 'flex',
                alignItems: 'center',
              },
            }}
            disabled={!item.editable}
            {...template.getInputProps(`fields.${index}.required`, { type: 'checkbox' })}
          />
          <ActionIcon
            disabled={!item.deletable}
            color="red"
            onClick={() => template.removeListItem('fields', index)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
        <Input.Wrapper>
          <Stack>
            <Switch
              label="Необходимо пояснение?"
              {...template.getInputProps(`fields.${index}.haveDescription`, { type: 'checkbox' })}
            />
            {template.values.fields[index]?.haveDescription && (
              <Textarea
                placeholder="Опишите на что влияет это поле или что это значит"
                {...template.getInputProps(`fields.${index}.description`)}
              />
            )}
          </Stack>
        </Input.Wrapper>
        {template.values.fields[index]?.type === SELECT && (
          <MultiSelect
            creatable
            searchable
            label="Элементы для выбора"
            data={
              template
                .getInputProps(`fields.${index}.options`)
                ?.value?.map((value: any) => ({ value, label: value })) || []
            }
            value={template.getInputProps(`fields.${index}.options`).value}
            getCreateLabel={(query) => `+ Добавить ${query}`}
            onChange={template.getInputProps(`fields.${index}.options`).onChange}
            onCreate={(query) => ({ value: query, label: query })}
          />
        )}
        {template.values.fields[index]?.type === DEPENDS_ON && (
          <Stack spacing={0}>
            <Select
              data={
                isSuccess ? templates.map((t: ITemplate) => ({ label: t.name, value: t.id })) : []
              }
              label="Шаблон от корого зависят значения"
              {...template.getInputProps(`fields.${index}.depends_on.template`)}
            />
            <Select
              disabled={!template.values.fields[index]?.depends_on?.template}
              data={
                isSuccess && template.values.fields[index]?.depends_on?.template
                  ? (templates
                      ?.find((t) => t.id === template.values.fields[index]?.depends_on?.template)
                      ?.fields.filter((f) => f.type === SELECT)
                      .map((f) => ({ label: f.name, value: f.id })) as Array<{
                      value: string;
                      label: string;
                    }>)
                  : []
              }
              label="Поле от корого зависят значения"
              {...template.getInputProps(`fields.${index}.depends_on.field`)}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
