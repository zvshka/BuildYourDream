import {
  Box,
  Button,
  Collapse,
  Container,
  createStyles,
  Drawer,
  Grid,
  Group,
  Image,
  MediaQuery,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';
import { useToggle } from '@mantine/hooks';
import { Block, PageHeader } from '../components/Layout';
import { useTemplateData, useTemplatesList } from '../components/hooks/templates';
import { IComponent, ITemplate } from '../types/Template';
import { useComponentData, useComponentsList } from '../components/hooks/components';
import { useAuth } from '../components/Providers/Auth/AuthWrapper';
import { Filters } from '../components/Layout/Filters/Filters';
import { ComponentRow } from '../components/Layout/ComponentRow/ComponentRow';

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
  box: {
    position: 'relative',
    width: '100%',
    borderRadius: theme.radius.md,
    '&:before': {
      content: "''",
      display: 'block',
      paddingTop: '100%',
    },
  },
  boxContent: {
    position: 'absolute',
    padding: theme.spacing.sm,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  drawerButton: {
    width: '100%',
  },
  componentRow: {
    '&:hover': {
      cursor: 'pointer',
      boxShadow: '5px 5px 5px gray',
    },
  },
}));

export default function HomePage() {
  const { data: templates, isFetched: isTemplatesFetched } = useTemplatesList();
  const [modalVisible, toggleModal] = useToggle();

  const { user } = useAuth();

  return (
    <Stack>
      <PageHeader title="Конфигуратор" />
      <Block>
        <Stack>
          <ScrollArea offsetScrollbars>
            <Group noWrap>
              {isTemplatesFetched &&
                templates.map((template) => (
                  <Box sx={{ flex: '0 0 auto', width: 'auto', maxWidth: '100%' }}>
                    <Text color={template.required ? 'red' : 'dimmed'}>{template.name}</Text>
                  </Box>
                ))}
            </Group>
          </ScrollArea>
        </Stack>
      </Block>
    </Stack>
  );
}
