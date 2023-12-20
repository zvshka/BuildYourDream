import React, { useEffect, useState } from 'react';
import {
  Anchor,
  Box,
  Flex,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue, useWindowScroll } from '@mantine/hooks';
import { Block, NextLink } from '../../general';
import { ConfigCard } from './ConfigCard/ConfigCard';
import { useConfigsList, useLikedConfigsList, useUserConfigsList } from '../../../hooks/configs';

export const ConfigsList = ({ username, liked }: { username?: string; liked?: boolean }) => {
  const [activePage, setPage] = useState(1);
  const [pos, scrollTo] = useWindowScroll();
  const [sortField, setSortField] = useState<'createdAt' | 'liked' | 'comments'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebouncedValue(search, 200);

  const {
    data: configs,
    isSuccess: isConfigsSuccess,
    refetch,
  } = username
    ? useUserConfigsList(
        {
          page: activePage,
          orderBy: sortField,
          orderDir: sortDirection,
          search: debouncedSearch,
        },
        username
      )
    : !liked
    ? useConfigsList({
        page: activePage,
        orderBy: sortField,
        orderDir: sortDirection,
        search: debouncedSearch,
      })
    : useLikedConfigsList({
        page: activePage,
        orderBy: sortField,
        orderDir: sortDirection,
        search: debouncedSearch,
      });

  useEffect(() => {
    if (pos.y > 100 && isConfigsSuccess) {
      scrollTo({ y: 0 });
    }
  }, [isConfigsSuccess]);

  useEffect(() => {
    refetch();
  }, [activePage, sortDirection, sortField, debouncedSearch]);

  return (
    <Stack>
      <Block>
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'sm', cols: 2 },
            { minWidth: 'md', cols: 3 },
          ]}
        >
          <TextInput
            label="Поиск"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Select
            label="Поле сортировки"
            data={[
              { value: 'createdAt', label: 'По дате создания' },
              { value: 'liked', label: 'По лайкам' },
              { value: 'comments', label: 'По активности' },
            ]}
            value={sortField}
            onChange={(value) => setSortField(value as 'createdAt' | 'liked' | 'comments')}
          />
          <Select
            label="Направление сортировки"
            data={[
              { value: 'desc', label: 'По убыванию' },
              { value: 'asc', label: 'По возрастанию' },
            ]}
            value={sortDirection}
            onChange={(value) => setSortDirection(value as 'desc' | 'asc')}
          />
        </SimpleGrid>
      </Block>
      <Block shadow={0}>
        <Pagination
          value={activePage}
          total={
            isConfigsSuccess && configs.totalCount > 0 ? Math.ceil(configs.totalCount / 15) : 1
          }
          onChange={setPage}
        />
      </Block>
      {isConfigsSuccess && configs.result.length > 0 && (
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'xs', cols: 2 },
            { minWidth: 'sm', cols: username || liked ? 3 : 4 },
          ]}
        >
          {configs.result.map((config) => (
            <Box sx={{ height: '100%' }} key={config.id}>
              <ConfigCard link={`/configs/${config.id}`} configData={config} />
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
            isConfigsSuccess && configs.totalCount > 0 ? Math.ceil(configs.totalCount / 15) : 1
          }
          onChange={setPage}
        />
      </Block>
    </Stack>
  );
};
