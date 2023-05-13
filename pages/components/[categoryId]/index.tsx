import { Button, Container, Group, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';
import { PageHeader } from '../../../components/Layout';
import { useTemplateData } from '../../../components/hooks/templates';
import { NextLink } from '../../../components/Layout/general/NextLink/NextLink';
import { ComponentsList } from '../../../components/Layout/specific/ComponentsList/ComponentsList';

export default function Category() {
  const router = useRouter();

  const { user } = useAuth();

  const { data: templateData, isSuccess } = useTemplateData(router.query.categoryId as string);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader
          title={isSuccess ? templateData.name : ''}
          rightSection={
            <Group>
              {user && user.role === 'ADMIN' && (
                <Button href={`/templates/edit/${router.query.categoryId}`} component={NextLink}>
                  Изменить
                </Button>
              )}
              {user && user.role === 'ADMIN' && (
                <Button
                  href={`/components/create?templateId=${router.query.categoryId}`}
                  component={NextLink}
                >
                  Добавить
                </Button>
              )}
              <Button href="/components" component={NextLink}>
                Назад
              </Button>
            </Group>
          }
        />
        <ComponentsList categoryId={router.query.categoryId as string} />
      </Stack>
    </Container>
  );
}
