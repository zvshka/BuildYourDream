import { Container, Stack } from '@mantine/core';
import { PageHeader } from '../../../components/Layout';
import { ReportsList } from '../../../components/Layout/specific/ReportsList/ReportsList';

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
