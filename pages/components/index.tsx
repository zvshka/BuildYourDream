import {
  Box,
  Button,
  Container,
  createStyles,
  Group,
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
            // TODO: Make menu instead buttons
            <Group>
              {user && user.role === 'ADMIN' && (
                <Button component={NextLink} href="/components/create">
                  Добавить деталь
                </Button>
              )}
              {user && user.role === 'ADMIN' && (
                <Button component={NextLink} href="/templates/create">
                  Добавить группу/форму
                </Button>
              )}
            </Group>
          }
        />
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'lg', cols: 6 },
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
