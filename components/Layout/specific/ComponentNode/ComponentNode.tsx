import { Box, Image, Stack, Text, Title } from '@mantine/core';
import { Handle, Position } from 'reactflow';
import { memo } from 'react';
import { Block } from '../../general/Block/Block';
import { useTemplateData } from '../../../hooks/templates';
import { useContextMenu } from 'mantine-contextmenu';
import { IconCopy, IconDownload, IconTrash } from '@tabler/icons-react';

const handleStyleVertical = {
  width: '14px',
  height: '30px',
  borderRadius: '3px',
  backgroundColor: 'gray',
};

const handleStyleHorizontal = {
  width: '30px',
  height: '14px',
  borderRadius: '3px',
  backgroundColor: 'gray',
};

const Slot = ({ slotData }) => {
  const { data, isSuccess } = useTemplateData(slotData.componentId);
  return (
    <Block style={{ position: 'relative' }}>
      <Text>{isSuccess && data.name} 0/1</Text>
      <Handle
        type="source"
        position={Position.Right}
        id={`slot-${slotData.id}-r`}
        style={handleStyleVertical}
      />
      <Handle
        type="source"
        position={Position.Left}
        id={`slot-${slotData.id}-l`}
        style={handleStyleVertical}
      />
    </Block>
  );
};

const Component = ({ id, data }) => {
  const { componentData, templateData } = data;

  const showContextMenu = useContextMenu();

  return (
    <Stack
      spacing={4}
      sx={{ position: 'relative' }}
      onContextMenu={showContextMenu([
        {
          key: 'remove',
          icon: <IconTrash size={16} />,
          title: 'Убрать с доски',
          style: { color: 'red' },
          onClick: () => {},
        },
      ])}
    >
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
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-r`}
            style={handleStyleVertical}
          />
          <Handle
            type="source"
            position={Position.Left}
            id={`${id}-l`}
            style={handleStyleVertical}
          />
          <Handle
            type="source"
            position={Position.Top}
            id={`${id}-t`}
            style={handleStyleHorizontal}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${id}-b`}
            style={handleStyleHorizontal}
          />
        </Box>
      )}
    </Stack>
  );
};

export const ComponentNode = memo(Component);
