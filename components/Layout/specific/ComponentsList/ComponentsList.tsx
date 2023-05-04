import {
  Box,
  Button,
  Container,
  createStyles,
  Drawer,
  Grid,
  MediaQuery,
  Paper,
  Stack,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import { useTemplateData } from '../../../hooks/templates';
import { useComponentsList } from '../../../hooks/components';
import { Filters } from '../../inputs/Filters/Filters';
import { NextLink } from '../../general/NextLink/NextLink';
import { Block } from '../../general/Block/Block';
import { ComponentRow } from '../../general/ComponentRow/ComponentRow';

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
}));
export const ComponentsList = ({ categoryId }: { categoryId: string }) => {
  const { classes } = useStyles();
  const [filters, setFilters] = useState({});
  const [showFilters, toggleFilters] = useToggle();
  const { data: templateData, isSuccess } = useTemplateData(categoryId);
  const {
    data: components,
    isFetched: isComponentsFetched,
    isSuccess: isComponentsSuccess,
    refetch,
  } = useComponentsList(categoryId, filters);

  // useEffect(() => {
  //   const { categoryId, ...f } = router.query;
  //   setFilters(f);
  // }, [router.query]);

  // useEffect(() => {
  //   refetch();
  // }, [filters]);

  return (
    <Box>
      <Container size="xl" p={0}>
        <Grid>
          <Grid.Col lg={3.5}>
            <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
              <Box>
                <Filters fields={isSuccess ? templateData?.fields : []} />
              </Box>
            </MediaQuery>
            <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
              <Paper className={classes.container} shadow="xl">
                <Button onClick={() => toggleFilters()} className={classes.drawerButton}>
                  Показать фильтры
                </Button>
              </Paper>
            </MediaQuery>
          </Grid.Col>
          <Grid.Col lg="auto">
            <Stack>
              {isComponentsSuccess &&
                components.map((component) => (
                  <Box
                    href={`/components/${categoryId}/${component.id}`}
                    key={component.id}
                    component={NextLink}
                  >
                    <ComponentRow component={component} />
                  </Box>
                ))}
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Drawer
        opened={showFilters}
        onClose={() => toggleFilters()}
        title="Фильтры и поиск"
        padding="xl"
        size="xl"
      >
        <Filters fields={isSuccess ? templateData?.fields : []} />
      </Drawer>
    </Box>
  );
};
