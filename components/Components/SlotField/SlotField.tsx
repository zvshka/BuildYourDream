import { Group, Select, Stack } from '@mantine/core';
import { Block } from '../../Layout';
import { useTemplateData, useTemplatesList } from '../../hooks/templates';
import { useTemplateFormContext } from '../TemplateContext';
import { ISlot } from '../../../types/Template';

export const SlotField = ({ index, item }: { index: number; item?: ISlot }) => {
  const { data: templates, isSuccess: isTemplatesLoaded } = useTemplatesList();
  const template = useTemplateFormContext();
  const { data: templateData, isSuccess: isTemplateLoaded } = useTemplateData(
    template.values.slots[index].componentId as string
  );

  return (
    <Block>
      <Stack>
        <Select
          data={
            isTemplatesLoaded
              ? templates.map((t) => ({
                  label: t.name,
                  value: t.id,
                }))
              : []
          }
          {...template.getInputProps(`slots.${index}.componentId`)}
          label="Компонент"
        />
        <Group>
          <Select
            label="Поле ЭТОГО компонента"
            data={template.values.fields
              .filter((f) => f.editable)
              .map((f) => ({
                label: f.name,
                value: f.id,
              }))}
            {...template.getInputProps(`slots.${index}.innerField`)}
          />
          <Select
            label="Условие"
            data={[
              { label: 'Одно из', value: 'IN' },
              { label: 'Эквивалентно', value: 'EQUALS' },
            ]}
          />
          <Select
            label="Поле ДРУГОГО компонента"
            data={
              isTemplateLoaded
                ? templateData.fields
                    .filter((f) => f.editable)
                    .map((f) => ({ label: f.name, value: f.id }))
                : []
            }
            {...template.getInputProps(`slots.${index}.outerField`)}
          />
        </Group>
      </Stack>
    </Block>
  );
};
