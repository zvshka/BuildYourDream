import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Drawer,
  Flex,
  Grid,
  Group,
  MediaQuery,
  Pagination,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useToggle, useWindowScroll } from '@mantine/hooks';
import { useTemplateData } from '../../../hooks/templates';
import { useComponentsList } from '../../../hooks/components';
import { Filters } from '../../inputs/Filters/Filters';
import { NextLink } from '../../general/NextLink/NextLink';
import { ComponentRow } from '../../general/ComponentRow/ComponentRow';
import { Block } from '../../general/Block/Block';

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
export const ComponentsList = ({
  categoryId,
  onChoose,
  viewport,
}: {
  categoryId: string;
  onChoose?: any;
  viewport?: any;
}) => {
  const [activePage, setPage] = useState(1);
  const { classes } = useStyles();
  const [filters, setFilters] = useState({
    page: activePage,
  });
  const [showFilters, toggleFilters] = useToggle();
  const { data: templateData, isSuccess } = useTemplateData(categoryId);
  const {
    data: componentsData,
    isSuccess: isComponentsSuccess,
    refetch,
  } = useComponentsList(categoryId, filters);

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    if (viewport && viewport.current) {
      viewport.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollTo({ y: 0 });
    }
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <Box sx={{ width: '100%' }} py="xs">
      <Container size="xl" px={!onChoose ? 0 : 'sm'} sx={{ width: '100%' }}>
        <Grid>
          {!onChoose && (
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
          )}
          <Grid.Col lg="auto">
            {onChoose && (
              <Block mb="md">
                <Group position="apart">
                  <Text>Фильтры</Text>
                  <Group>
                    <Button disabled>Сбросить</Button>
                    <Button>Открыть меню</Button>
                  </Group>
                </Group>
              </Block>
            )}
            <Block mb="md" mt={onChoose ? 'md' : 0} shadow={0}>
              <Pagination
                value={activePage}
                total={
                  isComponentsSuccess && componentsData.totalCount > 0
                    ? Math.ceil(componentsData.totalCount / 10)
                    : 1
                }
                onChange={setPage}
              />
            </Block>
            <Stack>
              {isComponentsSuccess &&
                componentsData.totalCount > 0 &&
                componentsData.result.map((component) =>
                  !onChoose ? (
                    <Box
                      href={`/components/${categoryId}/${component.id}`}
                      key={component.id}
                      component={NextLink}
                    >
                      <Block>
                        <ComponentRow
                          component={component.data}
                          templateId={component.templateId}
                          totalComments={component.totalComments}
                        />
                      </Block>
                    </Box>
                  ) : (
                    <Box
                      key={component.id}
                      onClick={() => onChoose(categoryId, component)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Block>
                        <ComponentRow
                          component={component.data}
                          templateId={component.templateId}
                        />
                      </Block>
                    </Box>
                  )
                )}
              {isComponentsSuccess && componentsData.totalCount === 0 && (
                <Block h={150}>
                  <Flex justify="center" h="100%">
                    <Center>
                      <Text>Упс... здесь ничего нет, попросите админа добавить или проверить</Text>
                    </Center>
                  </Flex>
                </Block>
              )}
            </Stack>
            <Block mt="md" shadow={0}>
              <Pagination
                value={activePage}
                total={
                  isComponentsSuccess && componentsData.totalCount > 0
                    ? Math.ceil(componentsData.totalCount / 10)
                    : 1
                }
                onChange={setPage}
              />
            </Block>
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
