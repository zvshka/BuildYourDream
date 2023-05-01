import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDisclosure, useToggle } from '@mantine/hooks';
import ReactFlow, {
  addEdge,
  Background,
  ConnectionLineType,
  ConnectionMode,
  MarkerType,
  Panel,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { Block, PageHeader } from '../components/Layout';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/Auth/AuthWrapper';
import { ComponentNode } from '../components/Configurator/ComponentNode/ComponentNode';
import { useComponentsList } from '../components/hooks/components';
import simpleFloatingEdge from '../components/Configurator/SimpleFloatingEdge/SimpleFloatingEdge';

const nodeTypes = {
  component: ComponentNode,
};

const edgeTypes = {
  floating: simpleFloatingEdge,
};

const AddNodeForm = ({ nodes, setNodes }) => {
  const { data: templates, isSuccess } = useTemplatesList();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('');
  const { data: componentsList, isSuccess: isComponentsFetched } = useComponentsList(
    selectedTemplate as string
  );
  const [selectedComponent, setSelectedComponent] = useState<string | null>('');

  const handleAddNode = () => {
    if (isComponentsFetched && isSuccess) {
      const component = componentsList.find((c) => c.id === selectedComponent);
      const template = templates.find((t) => t.id === selectedTemplate);
      if (component && template) {
        setNodes(
          nodes.concat({
            id: component.id,
            data: {
              componentData: component.data,
              templateData: template,
            },
            type: 'component',
            position: {
              x: 0,
              y: 0,
            },
          })
        );
      }
    }
  };

  return (
    <Stack>
      <Select
        label="Группа"
        data={isSuccess ? templates.map((t) => ({ value: t.id, label: t.name })) : []}
        value={selectedTemplate}
        onChange={(v) => setSelectedTemplate(v)}
      />
      <Select
        data={
          isComponentsFetched
            ? componentsList.map((c) => ({ value: c.id, label: c.data['Название'] }))
            : []
        }
        value={selectedComponent}
        onChange={(v) => setSelectedComponent(v)}
      />
      <Button onClick={handleAddNode}>Добавить компонент</Button>
    </Stack>
  );
};
export default function HomePage() {
  const { data: templates, isFetched: isTemplatesFetched, isSuccess } = useTemplatesList();
  const [modalVisible, toggleModal] = useToggle();

  const { user } = useAuth();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
      ),
    []
  );

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    console.log(edges);
  }, [edges]);

  return (
    <Container size="xl" sx={{ height: '100%' }}>
      <Modal title="Добавление компонента на стол" opened={opened} onClose={close}>
        <AddNodeForm nodes={nodes} setNodes={setNodes} />
      </Modal>
      <Stack sx={{ height: '100%' }}>
        <PageHeader title="Конфигуратор" />
        <Flex direction="column" gap={16} sx={{ flexFlow: 'column', height: '100%' }}>
          <Block sx={{ flex: '0 1 auto' }}>
            <ScrollArea offsetScrollbars>
              <Group noWrap>
                {isTemplatesFetched &&
                  isSuccess &&
                  templates.map((template) => (
                    <Box
                      sx={{ flex: '0 0 auto', width: 'auto', maxWidth: '100%' }}
                      key={template.id}
                    >
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
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              connectionLineType={ConnectionLineType.SmoothStep}
              connectionMode={ConnectionMode.Loose}
              fitView
            >
              <Panel position="top-left">
                <Button onClick={open}>Добавить компонент</Button>
              </Panel>
              <Background />
            </ReactFlow>
          </Block>
        </Flex>
      </Stack>
    </Container>
  );
}
