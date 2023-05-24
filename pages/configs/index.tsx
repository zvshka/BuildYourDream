import {
  Anchor,
  Box,
  Container,
  Flex,
  Grid,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@mantine/hooks';
import { Block, PageHeader } from '../../components/Layout';
import { useConfigsList } from '../../components/hooks/configs';
import { ConfigCard } from '../../components/Layout/specific/ConfigCard/ConfigCard';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';

export default function Configs() {
  const [activePage, setPage] = useState(1);
  const [filters, setFilters] = useState({
    page: activePage,
  });

  const { data: configs, isSuccess: isConfigsSuccess, refetch } = useConfigsList(filters);

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    scrollTo({ y: 0 });
    setFilters((currentFilter) => ({ ...currentFilter, page: activePage }));
  }, [activePage]);

  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <Container size="xl" sx={{ height: '100%' }} px={0}>
      <PageHeader title="Пользовательские сборки" />
      <Grid columns={48} mt="md">
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
            {isConfigsSuccess && configs.result.length > 0 && (
              <SimpleGrid
                cols={1}
                breakpoints={[
                  { minWidth: 'xs', cols: 2 },
                  { minWidth: 'sm', cols: 4 },
                ]}
              >
                {configs.result.map((config) => (
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
            )}
            {isConfigsSuccess && configs.result.length === 0 && (
              <Block h={300}>
                <Flex justify="center" align="center" h="100%">
                  <Stack align="center">
                    <Text>Упс... здесь ничего нет, еще никто не сделал сборку</Text>
                    <Anchor component={NextLink} href="/">
                      К конфигуратору
                    </Anchor>
                  </Stack>
                </Flex>
              </Block>
            )}
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
