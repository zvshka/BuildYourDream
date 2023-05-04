import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconCurrencyRubel, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { ComponentsList } from '../components/Layout/specific/ComponentsList/ComponentsList';

export default function HomePage() {
  const { data: templates, isSuccess } = useTemplatesList();
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState<string | null>();
  const [opened, handlers] = useDisclosure(false);

  const chooseComponent = (c: string) => {
    setCategoryId(c);
    handlers.open();
  };

  return (
    <Container size="xl" sx={{ height: '100%' }}>
      <Modal opened={opened} onClose={handlers.close} size="calc(80vw)">
        <ComponentsList categoryId={categoryId as string} />
      </Modal>

      <Grid>
        <Grid.Col span="auto">
          <Stack>
            {isSuccess &&
              templates.map((t) => (
                <Block key={t.id}>
                  <Group position="apart">
                    <Text>{t.name}</Text>
                    <ActionIcon color="blue" onClick={() => chooseComponent(t.id)}>
                      <IconPlus />
                    </ActionIcon>
                  </Group>
                </Block>
              ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Block>
            <Stack spacing="xs">
              <Title order={3}>Информация</Title>
              <Text>
                Категория сборки: <Text weight={600}>High end (High tier)</Text>
              </Text>
              <Text>
                Примерное потребление: <Text weight={600}>450w</Text>
              </Text>
              <Text>
                <Text>Примерная цена:</Text>
                <Group spacing={4}>
                  <Text weight={600}>150000</Text>
                  <IconCurrencyRubel size={15} />
                </Group>
              </Text>
            </Stack>
          </Block>
          <Block mt="md">
            <Stack>
              <TextInput label="Название сборки" />
              <Textarea label="Описание сборки" />
              <Button>Сохранить</Button>
            </Stack>
          </Block>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
