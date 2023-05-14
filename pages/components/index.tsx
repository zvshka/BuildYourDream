import {
  ActionIcon,
  Box,
  Container,
  createStyles,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React from 'react';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { PageHeader } from '../../components/Layout';
import { ITemplate } from '../../types/Template';
import { useTemplatesList } from '../../components/hooks/templates';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';
import {
  IconCirclePlus,
  IconCircleSquare,
  IconDotsVertical,
  IconPackage,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  box: {
    position: 'relative',
    width: '100%',
    borderRadius: theme.radius.md,
    '&:before': {
      content: "''",
      display: 'block',
      paddingTop: '100%',
    },
    cursor: 'pointer',
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
    textAlign: 'center',
    justifyContent: 'center',
  },
}));

//TODO: Make separate component
const Category = React.memo(({ data }: { data: any }) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.box} shadow="xl" component={NextLink} href={`/components/${data.id}`}>
      <Box className={classes.boxContent}>
        <Text weight={700} size={24}>
          {data.name}
        </Text>
      </Box>
    </Paper>
  );
});

export default function Parts() {
  const { user } = useAuth();
  const { data: templates, isLoading, isError } = useTemplatesList();

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader
          title="Комплектующие"
          rightSection={
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={NextLink}
                  href="/components/create"
                  icon={<IconCircleSquare size={18} />}
                >
                  Добавить деталь
                </Menu.Item>
                <Menu.Item
                  component={NextLink}
                  href="/templates/create"
                  icon={<IconPackage size={18} />}
                >
                  Добавить группу
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
        />
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'lg', cols: 5 },
            { minWidth: 'md', cols: 4 },
            { minWidth: 'sm', cols: 2 },
          ]}
        >
          {!isLoading &&
            !isError &&
            templates.map((template: ITemplate & { id: string }) => (
              <Category key={template.id} data={template} />
            ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
