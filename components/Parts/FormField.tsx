import {
  ActionIcon,
  Group,
  Input,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { useEffect } from 'react';
import { fieldTypes } from '../../types/Form';
import { Block } from '../Layout/Block/Block';
import { CreateField } from '../../lib/Field';
import { useSortable } from '@dnd-kit/sortable';
import { useFormsFormContext } from './FormContext';
import { CSS } from '@dnd-kit/utilities';

export const FormField = (props) => {
  const { item, index } = props;
  const form = useFormsFormContext();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const field = CreateField(item);
    form.setFieldValue(`fields.${index}`, field);
  }, [form.values.fields[index].type]);

  return (
    <Block key={`field_${index}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Stack mt="xs" spacing="xs">
        <Group>
          <TextInput
            placeholder="Название"
            sx={{ flex: 1 }}
            {...form.getInputProps(`fields.${index}.name`)}
            disabled={!item.editable}
            required
          />
          <Select
            data={fieldTypes}
            {...form.getInputProps(`fields.${index}.type`)}
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
            {...form.getInputProps(`fields.${index}.required`, { type: 'checkbox' })}
          />
          <ActionIcon
            disabled={!item.deletable}
            color="red"
            onClick={() => form.removeListItem('fields', index)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
        <Input.Wrapper>
          <Stack>
            <Switch
              label="Необходимо пояснение?"
              {...form.getInputProps(`fields.${index}.haveDescription`, { type: 'checkbox' })}
            />
            {form.values.fields[index].haveDescription && (
              <Textarea
                placeholder="Опишите на что влияет это поле или что это значит"
                {...form.getInputProps(`fields.${index}.description`)}
              />
            )}
          </Stack>
        </Input.Wrapper>
        {form.values.fields[index].type === 'SELECT' && (
          <MultiSelect
            creatable
            searchable
            mt="xs"
            data={
              form
                .getInputProps(`fields.${index}.options`)
                ?.value?.map((value: any) => ({ value, label: value })) || []
            }
            value={form.getInputProps(`fields.${index}.options`).value}
            getCreateLabel={(query) => `+ Добавить ${query}`}
            onChange={form.getInputProps(`fields.${index}.options`).onChange}
            onCreate={(query) => ({ value: query, label: query })}
          />
        )}
      </Stack>
    </Block>
  );
};
