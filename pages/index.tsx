import {
  ActionIcon,
  Box,
  Button,
  Card,
  Collapse,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { IconCurrencyRubel, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { ComponentsList } from '../components/Layout/specific/ComponentsList/ComponentsList';
import { IComponent } from '../types/Template';

//TODO: Добавить помощник выбора в несколько шагов
/**
 * Пример работы:
 * Пользователь нажимает на кнопку -> ему показывается помощник по сборкам
 * Далее он заполняет форму в несколько этапов
 * После ему подбираются комплектующие по указанным критериям
 **/
export default function HomePage() {
  const { data: templates, isSuccess } = useTemplatesList();
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState<string | null>();
  const [opened, handlers] = useDisclosure(false);

  const toggleComponentSearch = (c: string) => {
    !opened ? handlers.open() : c !== categoryId ? false : handlers.close();
    setCategoryId(c);
  };

  const form = useForm({
    initialValues: {},
  });

  const onChoose = (c: string, component: { id: string; templateId: string; data: IComponent }) => {
    handlers.close();
    form.setFieldValue(c, component);
  };

  return (
    <Container size="xl" sx={{ height: '100%' }}>
      <Block mb="md">
        <Text>Ошибки и совместимость</Text>
      </Block>
      <Grid columns={48}>
        <Grid.Col span={34}>
          <Stack>
            {isSuccess &&
              templates.map((t) => (
                <Box key={t.id}>
                  <Card shadow="xl" p="md" withBorder>
                    <Card.Section
                      inheritPadding
                      withBorder={t.id in form.values && !!form.values[t.id]}
                      py="md"
                    >
                      <Group position="apart">
                        <Text>
                          {t.name} {t.required ? '*' : ''}
                        </Text>
                        {t.id in form.values && !!form.values[t.id] ? (
                          <ActionIcon color="red" onClick={() => form.setFieldValue(t.id, null)}>
                            <IconTrash />
                          </ActionIcon>
                        ) : (
                          <ActionIcon color="blue" onClick={() => toggleComponentSearch(t.id)}>
                            {categoryId === t.id && opened ? <IconX /> : <IconPlus />}
                          </ActionIcon>
                        )}
                      </Group>
                    </Card.Section>
                    {t.id in form.values && !!form.values[t.id] && (
                      <Group align="normal" pt="md">
                        <Image
                          withPlaceholder
                          radius="sm"
                          width={256 / 1.5}
                          height={256 / 1.5}
                          {...(form.values[t.id].data.image
                            ? { src: `${form.values[t.id].data.image.url}?quality=60` }
                            : {})}
                        />
                        <Box>
                          <Title order={3}>{form.values[t.id].data['Название']}</Title>
                          <Text>
                            Примерная цена: {form.values[t.id].data['Цена'][0]} -{' '}
                            {form.values[t.id].data['Цена'][1]} Руб.
                          </Text>
                          <Text>Tier компонента: {form.values[t.id].data.tier.toUpperCase()}</Text>
                        </Box>
                      </Group>
                    )}
                  </Card>
                  <Collapse in={categoryId === t.id && opened}>
                    <Paper sx={(theme) => ({ backgroundColor: theme.colors.gray[4] })}>
                      <ScrollArea.Autosize sx={{ maxHeight: 700 }}>
                        <ComponentsList categoryId={categoryId as string} onChoose={onChoose} />
                      </ScrollArea.Autosize>
                    </Paper>
                  </Collapse>
                </Box>
              ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={14}>
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
              <Button disabled={!user}>Сохранить</Button>
            </Stack>
          </Block>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
