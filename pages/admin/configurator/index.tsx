import { Button, Container, Group, Stack } from '@mantine/core';
import { Block, PageHeader } from '../../../components/Layout';
import { useTemplatesList } from '../../../components/hooks/templates';

export default function configuratorPage() {
  const { data: templates } = useTemplatesList();

  return (
    <Stack>
      <PageHeader title="Настройка конфигуратора" />
      <Block>
        <Group>
          <Button>Добавить компонент</Button>
        </Group>
      </Block>
      <Container>
        <Block>Выбор</Block>
      </Container>
    </Stack>
  );
}
