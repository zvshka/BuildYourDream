import { Button, Container, Stack, Text, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import dayjs from 'dayjs';
import { IconBan } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { storage } from '../../../lib/utils';
import { User } from '../../../types/User';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';
import { Block, PageHeader } from '../../../components/Layout';
import { useUsersList } from '../../../components/hooks/users';
import { queryClient } from '../../../components/Providers/QueryProvider/QueryProvider';

export default function AdminUsers() {
  const { user, isLoggingIn } = useAuth();
  const router = useRouter();

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'createdAt',
    direction: 'asc',
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const [activePage, setPage] = useState(1);
  const { data: users, refetch } = useUsersList({
    page: activePage,
    sortColumn: sortStatus.columnAccessor,
    sortDirection: sortStatus.direction,
    search: debouncedSearch,
  });

  useEffect(() => {
    if (!isLoggingIn && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user]);

  useEffect(() => {
    refetch();
  }, [activePage, sortStatus, debouncedSearch]);

  const changeStatusMutation = useMutation(
    ({ username, status }: { username: string; status: 'ban' | 'unban' }) =>
      axios.get(`/api/users/${username}/${status}`, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Вы успешно изменили статус пользователя',
          color: 'green',
        });
        queryClient.invalidateQueries(['users', 'list']);
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleUnban = (record: User) => {
    changeStatusMutation.mutate({
      username: record.username as string,
      status: 'unban',
    });
  };

  const handleBan = (record: User) => {
    changeStatusMutation.mutate({
      username: record.username as string,
      status: 'ban',
    });
  };

  return (
    <Container size="xl">
      <Stack>
        <PageHeader title="Пользователи" />
        <Block>
          <TextInput
            label="Поиск"
            placeholder="Email или юзернейм"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
        </Block>
        <Block>
          <DataTable
            withBorder
            withColumnBorders
            borderRadius="sm"
            recordsPerPage={10}
            records={users?.result || []}
            totalRecords={users?.totalCount || 0}
            onPageChange={setPage}
            page={activePage}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            columns={[
              { accessor: 'username', title: 'Юзернейм' },
              { accessor: 'email', title: 'Email' },
              { accessor: 'totalConfigs', title: 'Сборок', sortable: true },
              { accessor: 'totalComments', title: 'Комментариев', sortable: true },
              { accessor: 'totalReports', title: 'Жалоб', sortable: true },
              { accessor: 'totalWarns', title: 'Варнов', sortable: false },
              {
                accessor: 'createdAt',
                title: 'Создан',
                sortable: true,
                render: (record: User) => (
                  <Text>{dayjs(record.createdAt).format('DD.MM.YYYY hh:mm')}</Text>
                ),
              },
              { accessor: 'role', title: 'Роль' },
              {
                accessor: 'isBanned',
                title: 'Забанен',
                render: (record: User) => <Text>{record.isBanned ? 'Да' : 'Нет'}</Text>,
              },
              {
                accessor: 'actions',
                title: 'Действия',
                render: (record: User) =>
                  !record.isBanned ? (
                    <Button
                      color="red"
                      leftIcon={<IconBan size="1rem" />}
                      onClick={() => handleBan(record)}
                    >
                      Забанить
                    </Button>
                  ) : (
                    <Button onClick={() => handleUnban(record)}>Разбанить</Button>
                  ),
              },
            ]}
          />
        </Block>
      </Stack>
    </Container>
  );
}
