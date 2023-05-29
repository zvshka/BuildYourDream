import { Container, Stack, Table } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Block, PageHeader } from '../../../components/Layout';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';

export default function AdminUsers() {
  const { user, isLoggingIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggingIn && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user]);

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
          </Table>
        </Block>
      </Stack>
    </Container>
  );
}
