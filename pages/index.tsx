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
  MediaQuery,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCurrencyRubel,
  IconDownload,
  IconListCheck,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import React, { useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { ComponentsList } from '../components/Layout/specific/ComponentsList/ComponentsList';
import { IComponent } from '../types/Template';
import { storage } from '../lib/utils';
import {
  ErrorMessage,
  SuccessMessage,
  WarnMessage,
} from '../components/Layout/specific/ConfiguratorMessage/ConfiguratorMessage';

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
  const viewport = useRef<HTMLDivElement>(null);

  const theme = useMantineTheme();
  const toggleComponentSearch = (c: string) => {
    !opened ? handlers.open() : c !== categoryId ? false : handlers.close();
    setCategoryId(c);
  };

  const form = useForm<{
    title: string;
    description: string;
    components: Record<string, IComponent>;
  }>({
    initialValues: {
      title: '',
      description: '',
      components: {},
    },
  });

  const onChoose = (c: string, component: { id: string; templateId: string; data: IComponent }) => {
    handlers.close();
    form.setFieldValue(`components.${c}`, component);
  };

  //TODO: Mutation

  const handleSubmit = (values: typeof form.values) => {
    const entries = Object.entries(values.components);
    const notAddedButRequired = templates
      ?.filter((t) => !entries.some((e) => e[0] === t.id && !!e[1]))
      .map((t) => t.name);

    if (notAddedButRequired && notAddedButRequired.length > 0) {
      return showNotification({
        title: 'Ошибка',
        color: 'red',
        message: `Необходимо добавит еще: ${notAddedButRequired?.join(', ')}`,
      });
    }

    if (!user) {
      return showNotification({
        title: 'Ошибка',
        color: 'red',
        message: 'Вы не авторизованы',
      });
    }

    const components = Object.values(values.components).map((c) => c.id);
    return axios
      .post(
        '/api/configs',
        {
          title: values.title,
          description: values.description,
          components,
        },
        {
          headers: {
            authorization: `Bearer ${storage.getToken()}`,
          },
        }
      )
      .then((res) =>
        showNotification({
          title: 'Успех',
          color: 'green',
          message: 'Сборка успешно сохранена',
        })
      )
      .catch((e) =>
        showNotification({
          title: 'Ошибка',
          color: 'red',
          message: 'Что-то пошло не так',
        })
      );
  };

  return (
    <Container size="xl" sx={{ height: '100%' }} px={0}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Block mb="md">
          {/*<Text>Ошибки и совместимость</Text>*/}
          <Group sx={{ overflowX: 'auto' }} noWrap>
            <SuccessMessage title="Все в порядке" description="Вы можете сохранить сборку" />
            <WarnMessage title="Что-то не так" description="Предупреждение" />
            <ErrorMessage title="Ошибка" description="Ошибка совместимости или размеров" />
          </Group>
        </Block>
        <Grid columns={48}>
          <MediaQuery styles={{ display: 'none' }} largerThan="sm">
            <Grid.Col>
              <Block>
                <Tabs defaultValue="info" allowTabDeactivation>
                  <Tabs.List>
                    <Tabs.Tab value="info" icon={<IconListCheck size="1.2rem" />}>
                      Информация
                    </Tabs.Tab>
                    <Tabs.Tab value="save" icon={<IconDownload size="1.2rem" />}>
                      Сохранение
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="info" pt="xs">
                    <Stack spacing="xs">
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
                  </Tabs.Panel>

                  <Tabs.Panel value="save" pt="xs">
                    <Stack>
                      <TextInput
                        label="Название сборки"
                        {...form.getInputProps('title')}
                        required
                        maxLength={50}
                      />
                      <Textarea
                        label="Описание сборки"
                        {...form.getInputProps('description')}
                        required
                        maxLength={500}
                      />
                      <Button disabled={!user} type="submit">
                        Сохранить
                      </Button>
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Block>
            </Grid.Col>
          </MediaQuery>
          <Grid.Col span="auto">
            <Stack>
              {isSuccess &&
                templates.map((t) => (
                  <Box key={t.id}>
                    <Card shadow="xl" p="md" withBorder>
                      <Card.Section
                        inheritPadding
                        withBorder={
                          t.id in form.values.components && !!form.values.components[t.id]
                        }
                        py="md"
                      >
                        <Group position="apart">
                          <Text>
                            {t.name} {t.required ? '*' : ''}
                          </Text>
                          {t.id in form.values.components && !!form.values.components[t.id] ? (
                            <ActionIcon
                              color="red"
                              onClick={() => form.setFieldValue(`components.${t.id}`, null)}
                            >
                              <IconTrash />
                            </ActionIcon>
                          ) : (
                            <ActionIcon color="blue" onClick={() => toggleComponentSearch(t.id)}>
                              {categoryId === t.id && opened ? <IconX /> : <IconPlus />}
                            </ActionIcon>
                          )}
                        </Group>
                      </Card.Section>
                      {t.id in form.values.components && !!form.values.components[t.id] && (
                        <Group align="normal" pt="md">
                          <Image
                            withPlaceholder
                            radius="sm"
                            width={256 / 1.5}
                            height={256 / 1.5}
                            {...(form.values.components[t.id].data.image &&
                            form.values.components[t.id].data.image.url
                              ? { src: `${form.values.components[t.id].data.image.url}?quality=60` }
                              : {})}
                          />
                          <Box>
                            <Title order={3}>{form.values.components[t.id].data['Название']}</Title>
                            <Text>
                              Примерная цена: {form.values.components[t.id].data['Цена'][0]} -{' '}
                              {form.values.components[t.id].data['Цена'][1]} Руб.
                            </Text>
                            <Text>
                              Tier компонента:{' '}
                              {form.values.components[t.id].data.tier.toUpperCase()}
                            </Text>
                          </Box>
                        </Group>
                      )}
                    </Card>
                    <Collapse in={categoryId === t.id && opened}>
                      <Paper sx={{ backgroundColor: theme.colors.gray[4] }}>
                        <ScrollArea.Autosize sx={{ maxHeight: 700 }} viewportRef={viewport}>
                          <ComponentsList
                            categoryId={categoryId as string}
                            onChoose={onChoose}
                            viewport={viewport}
                          />
                        </ScrollArea.Autosize>
                      </Paper>
                    </Collapse>
                  </Box>
                ))}
            </Stack>
          </Grid.Col>
          <MediaQuery styles={{ display: 'none' }} smallerThan="md">
            <Grid.Col md={14}>
              <Stack>
                <Block>
                  <Stack>
                    <TextInput
                      label="Название сборки"
                      {...form.getInputProps('title')}
                      required
                      maxLength={50}
                    />
                    <Textarea
                      label="Описание сборки"
                      {...form.getInputProps('description')}
                      required
                      maxLength={500}
                    />
                    <Button disabled={!user} type="submit">
                      Сохранить
                    </Button>
                  </Stack>
                </Block>
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
              </Stack>
            </Grid.Col>
          </MediaQuery>
        </Grid>
      </form>
    </Container>
  );
}
