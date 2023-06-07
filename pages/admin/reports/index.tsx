import { Container, Stack } from '@mantine/core';
import { PageHeader, ReportsList } from '../../../components/Layout';

export default function ReportsPage() {
  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader title="Жалобы пользователей" addBack />
        <ReportsList />
      </Stack>
    </Container>
  );
}
