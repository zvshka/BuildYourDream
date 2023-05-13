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
import React, { useEffect, useRef, useState } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { ComponentsList } from '../components/Layout/specific/ComponentsList/ComponentsList';
import { IComponentBody } from '../types/Template';
import { storage } from '../lib/utils';
import { useConstraintsList } from '../components/hooks/constraints';
import { ErrorMessage } from '../components/Layout/specific/ConfiguratorMessage/ConfiguratorMessage';

//TODO: Добавить помощник выбора в несколько шагов
/**
 * Пример работы:
 * Пользователь нажимает на кнопку -> ему показывается помощник по сборкам
 * Далее он заполняет форму в несколько этапов
 * После ему подбираются комплектующие по указанным критериям
 **/
export default function HomePage() {
  const { data: templates, isSuccess } = useTemplatesList();
  const { data: constraints, isSuccess: constraintsLoaded } = useConstraintsList();
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState<string | null>();
  const [opened, handlers] = useDisclosure(false);
  const viewport = useRef<HTMLDivElement>(null);
  const [checks, setChecks] = useState<any[]>([]);

  const theme = useMantineTheme();
  const toggleComponentSearch = (c: string) => {
    !opened ? handlers.open() : c !== categoryId ? false : handlers.close();
    setCategoryId(c);
  };

  const form = useForm<{
    title: string;
    description: string;
    components: Record<
      string,
      {
        id: string;
        data: IComponentBody;
        createdAt: string;
      }
    >;
  }>({
    initialValues: {
      title: '',
      description: '',
      components: {},
    },
    validate: {
      title: isNotEmpty('Не должно быть пустым'),
      description: isNotEmpty('Не должно быть пустым'),
    },
  });

  useEffect(() => {
    if (constraintsLoaded && isSuccess) {
      const checksArray = constraints.map((c) => {
        const { leftSide, rightSide, constraint } = c.data;
        const leftTemplate = templates.find((t) => t.id === leftSide.componentId);
        const rightTemplate = templates.find((t) => t.id === rightSide.componentId);

        const leftComponent = form.values.components[leftSide.componentId as string];
        const rightComponent = form.values.components[rightSide.componentId as string];

        const leftFieldName = leftTemplate?.fields.find((f) => f.id === leftSide.fieldId)?.name;
        const rightFieldName = rightTemplate?.fields.find((f) => f.id === rightSide.fieldId)?.name;

        const leftValue = leftComponent && leftComponent.data[leftFieldName as string];
        const rightValue = rightComponent && rightComponent.data[rightFieldName as string];

        if (!leftValue || !rightValue) return false;

        if (constraint === 'EQUALS') {
          return leftValue === rightValue
            ? false
            : {
                title: 'Ошибка совместимости',
                description: `${leftComponent.data['Название']} не совместимо с ${rightComponent.data['Название']}`,
                type: 'error',
              };
        }

        return false;
      });

      setChecks(checksArray.filter((check) => check));
    }
  }, [constraintsLoaded, isSuccess, form.values.components]);

  const onChoose = (
    c: string,
    component: { id: string; templateId: string; data: IComponentBody }
  ) => {
    handlers.close();
    form.setFieldValue(`components.${c}`, component);
  };

  //TODO: Mutation
  const handleSubmit = (values: typeof form.values) => {
    const entries = Object.entries(values.components);
    const notAddedButRequired = templates
      ?.filter((t) => t.required)
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
      .then(() =>
        showNotification({
          title: 'Успех',
          color: 'green',
          message: 'Сборка успешно сохранена',
        })
      )
      .catch(() =>
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
        {checks.length > 0 && (
          <Block mb="md">
            <Group sx={{ overflowX: 'auto' }} noWrap>
              {checks.map((check) => (
                <ErrorMessage title={check.title} description={check.description} />
              ))}
            </Group>
          </Block>
        )}
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
                      {/*TODO: Refactor*/}
                      <Text>
                        <Text>Примерная цена:</Text>
                        <Group spacing={4}>
                          <Text weight={600}>
                            {Object.values(form.values.components)
                              .reduce(
                                (prev, next) => [
                                  prev[0] + (next ? next.data['Цена'][0] : 0),
                                  prev[1] + (next ? next.data['Цена'][1] : 0),
                                ],
                                [0, 0]
                              )
                              .join(' - ')}
                          </Text>
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
                            form.values.components[t.id].data.image?.url
                              ? {
                                  src: `${form.values.components[t.id].data.image?.url}?quality=60`,
                                }
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
                        <Text weight={600}>
                          {Object.values(form.values.components)
                            .reduce(
                              (prev, next) => [
                                prev[0] + (next ? next.data['Цена'][0] : 0),
                                prev[1] + (next ? next.data['Цена'][1] : 0),
                              ],
                              [0, 0]
                            )
                            .join(' - ')}
                        </Text>
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
