import { Box, createStyles, Flex, Group, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useCallback } from 'react';
import { useToggle } from '@mantine/hooks';
import { Block, PageHeader } from '../components/Layout';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/Auth/AuthWrapper';
import ReactFlow, {
  addEdge,
  Connection,
  Edge,
  useEdgesState,
  useNodesState,
  Node,
  ConnectionLineType,
  Background,
} from 'reactflow';

// const useStyles = createStyles((theme) => ({
//   container: {
//     padding: theme.spacing.sm,
//   },
//   box: {
//     position: 'relative',
//     width: '100%',
//     borderRadius: theme.radius.md,
//     '&:before': {
//       content: "''",
//       display: 'block',
//       paddingTop: '100%',
//     },
//   },
//   boxContent: {
//     position: 'absolute',
//     padding: theme.spacing.sm,
//     top: 0,
//     bottom: 0,
//     right: 0,
//     left: 0,
//     display: 'flex',
//     flexDirection: 'column',
//     height: '100%',
//   },
//   drawerButton: {
//     width: '100%',
//   },
//   componentRow: {
//     '&:hover': {
//       cursor: 'pointer',
//       boxShadow: '5px 5px 5px gray',
//     },
//   },
// }));

export default function HomePage() {
  const { data: templates, isFetched: isTemplatesFetched, isSuccess } = useTemplatesList();
  const [modalVisible, toggleModal] = useToggle();

  const { user } = useAuth();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <Stack sx={{ height: '100%' }}>
      <PageHeader title="Конфигуратор" />
      <Flex direction="column" gap={16} sx={{ flexFlow: 'column', height: '100%' }}>
        <Block sx={{ flex: '0 1 auto' }}>
          <ScrollArea offsetScrollbars>
            <Group noWrap>
              {isTemplatesFetched &&
                isSuccess &&
                templates.map((template) => (
                  <Box sx={{ flex: '0 0 auto', width: 'auto', maxWidth: '100%' }}>
                    <Text color={template.required ? 'red' : 'dimmed'}>{template.name}</Text>
                  </Box>
                ))}
            </Group>
          </ScrollArea>
        </Block>
        <Block sx={{ height: '100%', flex: '1 1 auto' }}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            <Background />
          </ReactFlow>
        </Block>
      </Flex>
    </Stack>
  );
}
