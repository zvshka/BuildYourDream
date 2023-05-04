import { Container } from '@mantine/core';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';

export default function HomePage() {
  const { data: templates, isFetched: isTemplatesFetched, isSuccess } = useTemplatesList();
  const { user } = useAuth();
  return <Container size="xl" sx={{ height: '100%' }}></Container>;
}
