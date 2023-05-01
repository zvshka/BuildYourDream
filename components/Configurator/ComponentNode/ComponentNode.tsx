import { Box, Image, Stack, Text, Title } from '@mantine/core';
import { Handle, Position } from 'reactflow';
import { memo } from 'react';
import { Block } from '../../Layout/Block/Block';
import { useTemplateData } from '../../hooks/templates';

const Slot = ({ slotData }) => {
  const { data, isSuccess } = useTemplateData(slotData.componentId);
  return (
    <Block style={{ position: 'relative' }}>
      <Text>{isSuccess && data.name} 0/1</Text>
      <Handle type="source" position={Position.Right} id={`slot-${slotData.id}-r`} />
      <Handle type="source" position={Position.Left} id={`slot-${slotData.id}-l`} />
    </Block>
  );
};

const Component = ({ id, data }) => {
  const { componentData, templateData } = data;
  // Картинка
  // Слоты/коннекторы
  // Доп. информация

  return (
    <Stack spacing={4} sx={{ position: 'relative' }}>
      <Block>
        <Image width={300} height={200} withPlaceholder />
        <Title mt="xs" order={2}>
          {componentData['Название']}
        </Title>
      </Block>
      {/* Map slots of component */}
      {templateData.slots &&
        templateData.slots.map((slot) => <Slot slotData={slot} key={slot.id} />)}

      {(!templateData.slots || templateData.slots.length === 0) && (
        <Box>
          <Handle type="source" position={Position.Right} id={`${id}-r`} />
          <Handle type="source" position={Position.Left} id={`${id}-l`} />
          <Handle type="source" position={Position.Top} id={`${id}-t`} />
          <Handle type="source" position={Position.Bottom} id={`${id}-b`} />
        </Box>
      )}
    </Stack>
  );
};

export const ComponentNode = memo(Component);
