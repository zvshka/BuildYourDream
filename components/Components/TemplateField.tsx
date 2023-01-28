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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fieldTypes } from '../../types/Template';
import { Block } from '../Layout/Block/Block';
import { CreateField } from '../../lib/Field';
import { useTemplateFormContext } from './TemplateContext';

export const TemplateField = (props) => {
  const { item, index } = props;
  const template = useTemplateFormContext();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    const field = CreateField(item);
    template.setFieldValue(`fields.${index}`, field);
  }, [template.values.fields[index].type]);

  return (
    <Block key={`field_${index}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
            {template.values.fields[index].haveDescription && (
              <Textarea
                placeholder="Опишите на что влияет это поле или что это значит"
                {...template.getInputProps(`fields.${index}.description`)}
              />
            )}
          </Stack>
        </Input.Wrapper>
        {template.values.fields[index].type === 'SELECT' && (
          <MultiSelect
            creatable
            searchable
            mt="xs"
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
      </Stack>
    </Block>
  );
};
