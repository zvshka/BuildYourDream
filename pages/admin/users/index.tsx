import { Avatar, Container, Group, Stack, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Block, PageHeader } from '../../../components/Layout';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';

function useUsersList(accessToken) {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/users');
      return data;
    },
  });
}

export default function AdminUsers() {
  const { user, isLoggingIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggingIn && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user]);

  const [accessToken, setAccessToken] = useState<string | null>();

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  const { data, isLoading, isFetched, isError } = useUsersList(accessToken);

  const rows =
    isFetched &&
    !isError &&
    data.map((item) => (
      <tr key={item.id}>
        <td>
          <Group spacing="sm">
            <Avatar size={26} src={item.avatarUrl} radius={26} />
            <Text size="sm" weight={500}>
              {item.username}
            </Text>
          </Group>
        </td>
        <td>
          {item.email} {item.emailVerified ? '(Подтвержден)' : ''}
        </td>
        <td>{item.role}</td>
        <td>{item._count.configs}</td>
        <td>10</td>
        <td>0</td>
        <td>{dayjs(item.createdAt).format('hh:mm:ss DD.MM.YYYY')}</td>
      </tr>
    ));

  return (
    <Container size="xl">
      <Stack>
        <PageHeader title="Пользователи" />
        <Block>
          <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Сборок</th>
                <th>Рейтинг</th>
                <th>Жалоб</th>
                <th>Создан</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Block>
      </Stack>
    </Container>
  );
}
