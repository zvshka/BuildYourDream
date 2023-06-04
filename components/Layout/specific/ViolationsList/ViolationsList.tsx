import { Center, Pagination, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Block } from '../../general';
import { useUserViolationsList } from '../../../hooks/reports';
import { ViolationCard } from './ViolationCard/ViolationCard';

export const ViolationsList = ({ username }: { username: string }) => {
  const [activePage, setPage] = useState(1);

  const filterForm = useForm<{
    createdAt: [Date | null, Date | null];
    reviewAt: [Date | null, Date | null];
  }>({
    initialValues: {
      createdAt: [null, null],
      reviewAt: [null, null],
    },
  });

  const {
    data: reportsData,
    isSuccess,
    refetch,
  } = useUserViolationsList(username, {
    page: activePage,
    ...filterForm.values,
  });

  useEffect(() => {
    refetch();
  }, [activePage, filterForm.values.createdAt, filterForm.values.reviewAt]);

  return (
    <Stack>
      <Block>
        <SimpleGrid
          cols={1}
          breakpoints={[
            {
              cols: 2,
              minWidth: 'sm',
            },
            {
              cols: 3,
              minWidth: 'md',
            },
            {
              cols: 4,
              minWidth: 'lg',
            },
          ]}
        >
          <DatePickerInput
            type="range"
            label="Дата создания жалобы"
            locale="ru"
            {...filterForm.getInputProps('createdAt')}
          />
          <DatePickerInput
            type="range"
            label="Дата рассмотрения жалобы"
            locale="ru"
            {...filterForm.getInputProps('reviewAt')}
          />
        </SimpleGrid>
      </Block>
      <Block>
        <Pagination
          value={activePage}
          total={
            isSuccess && reportsData.totalCount > 0 ? Math.ceil(reportsData.totalCount / 10) : 1
          }
          onChange={setPage}
        />
      </Block>
      {isSuccess && reportsData.totalCount === 0 && (
        <Block h={200}>
          <Center h={170}>
            <Text>Здесь ничего нет...</Text>
          </Center>
        </Block>
      )}
      {isSuccess && reportsData.totalCount > 0 && (
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: 'xs', cols: 2 },
            { minWidth: 'sm', cols: username ? 3 : 4 },
          ]}
        >
          {reportsData.result.map((report) => (
            <ViolationCard reportData={report} key={report.id} />
          ))}
        </SimpleGrid>
      )}
      <Block>
        <Pagination
          value={activePage}
          total={
            isSuccess && reportsData.totalCount > 0 ? Math.ceil(reportsData.totalCount / 10) : 1
          }
          onChange={setPage}
        />
      </Block>
    </Stack>
  );
};
