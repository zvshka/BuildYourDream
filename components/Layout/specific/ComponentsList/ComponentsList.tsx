import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Drawer,
  Flex,
  Grid,
  MediaQuery,
  Pagination,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDebouncedValue, useToggle, useWindowScroll } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useTemplateData } from '../../../hooks/templates';
import { useComponentsList, useUserComponentsList } from '../../../hooks/components';
import { Filters } from '../../inputs/Filters/Filters';
import { NextLink } from '../../general/NextLink/NextLink';
import { ComponentRow } from './ComponentRow/ComponentRow';
import { Block } from '../../general/Block/Block';

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.sm,
  },
  drawerButton: {
    width: '100%',
  },
}));
export const ComponentsList = ({
  categoryId,
  onChoose,
  viewport,
  username,
}: {
  categoryId?: string;
  onChoose?: any;
  viewport?: any;
  username?: string;
}) => {
  const router = useRouter();
  const [activePage, setPage] = useState(1);
  const { classes } = useStyles();
  const [filters, setFilters] = useState<{
    page: number;
    search: string;
    tiers: string[];
  }>({
    page: activePage,
    search: '',
    tiers: [],
  });
  const [showFilters, toggleFilters] = useToggle();
  const { data: templateData, isSuccess } = useTemplateData(categoryId);
  const {
    data: componentsData,
    isSuccess: isComponentsSuccess,
    refetch,
  } = !username
    ? useComponentsList(categoryId as string, filters)
    : useUserComponentsList(username, filters);

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    router.replace({
      query: {
        ...router.query,
        search: debouncedSearch,
      },
    });
  }, [debouncedSearch]);

  useEffect(() => {
    if (viewport && viewport.current) {
      viewport.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollTo({ y: 0 });
    }
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    setFilters((currentFilter) => ({
      ...currentFilter,
      search: (router.query.search as string) || '',
      tiers: (router.query.tiers as string[]) || [],
    }));
  }, [router.query]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <Box sx={{ width: '100%' }}>
      <Container size="xl" px={!onChoose ? 0 : 'sm'} sx={{ width: '100%' }}>
        <Grid>
          {!onChoose && !username && (
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
            {(onChoose || username) && (
              <Block mb="md">
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.currentTarget.value)}
                />
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
                      href={`/components/${component.templateId}/${component.id}`}
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
                      onClick={() => onChoose(component)}
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
