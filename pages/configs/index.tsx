import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  Image,
  MediaQuery,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@mantine/hooks';
import { Block, PageHeader } from '../../components/Layout';
import { useConfigsList } from '../../components/hooks/configs';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { ConfigCard } from '../../components/Layout/specific/ConfigCard/ConfigCard';

export default function Configs() {
  const [activePage, setPage] = useState(1);
  const [filters, setFilters] = useState({
    page: activePage,
  });

  const { user } = useAuth();
  const { data: configs, isSuccess: isConfigsSuccess, refetch } = useConfigsList(filters);

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    // if (viewport && viewport.current) {
    //   viewport.current.scrollTo({ top: 0, behavior: 'smooth' });
    // } else {
    scrollTo({ y: 0 });
    // }
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <Container size="xl" sx={{ height: '100%' }} px={0}>
      <PageHeader title="Пользовательские сборки" />
      <Grid columns={48} mt="md">
        {/*<MediaQuery styles={{ display: 'none' }} smallerThan="md">*/}
        {/*  <Grid.Col span={12} sx={{ height: '100%' }}>*/}
        {/*    <Block sx={{ height: '45rem' }}>Filters</Block>*/}
        {/*  </Grid.Col>*/}
        {/*</MediaQuery>*/}
        <Grid.Col span="auto">
          <Stack>
            <Block shadow={0}>
              <Pagination
                value={activePage}
                total={
                  isConfigsSuccess && configs.totalCount > 0
                    ? Math.ceil(configs.totalCount / 15)
                    : 1
                }
                onChange={setPage}
              />
            </Block>
            <SimpleGrid
              cols={1}
              breakpoints={[
                { minWidth: 'xs', cols: 2 },
                { minWidth: 'sm', cols: 4 },
              ]}
            >
              {isConfigsSuccess &&
                configs.result.map((config) => (
                  <Box sx={{ height: '100%' }}>
                    <ConfigCard
                      author={{ name: config.author.username as string, image: '' }}
                      title={config.title}
                      description={config.description}
                      //TODO: Add something to configure image
                      image=""
                      link={`/configs/${config.id}`}
                      rating="High tier"
                    />
                  </Box>
                ))}
            </SimpleGrid>
            <Block shadow={0}>
              <Pagination
                value={activePage}
                total={
                  isConfigsSuccess && configs.totalCount > 0
                    ? Math.ceil(configs.totalCount / 15)
                    : 1
                }
                onChange={setPage}
              />
            </Block>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
