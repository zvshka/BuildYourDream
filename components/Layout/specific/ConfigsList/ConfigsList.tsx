import React, { useEffect, useState } from 'react';
import { Anchor, Box, Flex, Pagination, SimpleGrid, Stack, Text } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { Block } from '../../general/Block/Block';
import { ConfigCard } from '../ConfigCard/ConfigCard';
import { NextLink } from '../../general/NextLink/NextLink';
import { useConfigsList, useLikedConfigsList, useUserConfigsList } from '../../../hooks/configs';

export const ConfigsList = ({ username, liked }: { username?: string; liked?: boolean }) => {
  const [activePage, setPage] = useState(1);
  const [pos, scrollTo] = useWindowScroll();

  const {
    data: configs,
    isSuccess: isConfigsSuccess,
    refetch,
  } = username
    ? useUserConfigsList(
        {
          page: activePage,
        },
        username
      )
    : !liked
    ? useConfigsList({
        page: activePage,
      })
    : useLikedConfigsList({
        page: activePage,
      });

  useEffect(() => {
    if (pos.y > 100 && isConfigsSuccess) {
      scrollTo({ y: 0 });
    }
  }, [isConfigsSuccess]);

  useEffect(() => {
    refetch();
  }, [activePage]);

  return (
    <Stack>
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
