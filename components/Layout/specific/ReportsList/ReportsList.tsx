import { Center, Pagination, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { Block } from '../../general/Block/Block';
import { DatePickerInput } from '@mantine/dates';
import { ReportCard } from './ReportCard/ReportCard';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { useMyReportsList, useReportsList } from '../../../hooks/reports';

export const ReportsList = ({ username }: { username?: string }) => {
  const [activePage, setPage] = useState(1);

  const filterForm = useForm<{
    search: string;
    status: 'all' | 'approved' | 'rejected' | 'waiting';
    createdAt: [Date | null, Date | null];
    reviewAt: [Date | null, Date | null];
  }>({
    initialValues: {
      search: '',
      status: 'all',
      createdAt: [null, null],
      reviewAt: [null, null],
    },
  });

  const [debouncedSearch] = useDebouncedValue(filterForm.values.search, 300);

  const {
    data: reportsData,
    isSuccess,
    refetch,
  } = !username
    ? useReportsList({
        page: activePage,
        search: debouncedSearch,
        createdAt: filterForm.values.createdAt,
        reviewAt: filterForm.values.reviewAt,
        status: filterForm.values.status,
      })
    : useMyReportsList({
        page: activePage,
        search: debouncedSearch,
        createdAt: filterForm.values.createdAt,
        reviewAt: filterForm.values.reviewAt,
        status: filterForm.values.status,
      });

  useEffect(() => {
    refetch();
  }, [
    activePage,
    debouncedSearch,
    filterForm.values.status,
    filterForm.values.createdAt,
    filterForm.values.reviewAt,
  ]);
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
          <TextInput label="Поиск" {...filterForm.getInputProps('search')} />
          <Select
            data={[
              { value: 'all', label: 'Все' },
              { value: 'approved', label: 'Рассмотрено' },
              { value: 'rejected', label: 'Отклонено' },
              { value: 'waiting', label: 'Ожидает рассмотрения' },
            ]}
            label="Статус"
            {...filterForm.getInputProps('status')}
          />
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
            <ReportCard reportData={report} key={report.id} />
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
