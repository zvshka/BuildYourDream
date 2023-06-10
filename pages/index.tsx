import {
  ActionIcon,
  Box,
  Button,
  Card,
  Collapse,
  Container,
  Divider,
  Grid,
  Group,
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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useTemplatesList } from '../components/hooks/templates';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { ComponentsList } from '../components/Layout/specific/ComponentsList/ComponentsList';
import { IComponent, ITemplate } from '../types/Template';
import { useConstraintsList } from '../components/hooks/constraints';
import { ErrorMessage } from '../components/Layout/specific/ConfiguratorMessage/ConfiguratorMessage';
import { configErrors, getCount, storage } from '../lib/utils';
import { ComponentRow } from '../components/Layout/specific/ComponentsList/ComponentRow/ComponentRow';
import { useComponentData } from '../components/hooks/components';

//TODO: Добавить помощник выбора в несколько шагов
/**
 * Пример работы:
 * Пользователь нажимает на кнопку -> ему показывается помощник по сборкам
 * Далее он заполняет форму в несколько этапов
 * После ему подбираются комплектующие по указанным критериям
 **/

const ComponentRowWithReload = ({ component, onRemove, onLoad }) => {
  const { data: componentData, isSuccess } = useComponentData(component.id);
  useEffect(() => {
    if (isSuccess && component.refetch) {
      onLoad && onLoad(componentData);
    }
  }, [isSuccess]);

  return (
    <ComponentRow
      component={isSuccess ? componentData.data : component.data}
      templateId={component.templateId}
      onRemove={onRemove}
      totalComments={isSuccess ? componentData.totalComments : 0}
      avgRating={isSuccess ? componentData.avgRating : 0}
    />
  );
};

export default function HomePage() {
  const { data: templates, isSuccess, refetch } = useTemplatesList();
  const { data: constraints, isSuccess: constraintsLoaded } = useConstraintsList();
  const [totalPrice, setTotalPrice] = useState([0, 0]);
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState<string | null>();
  const [opened, handlers] = useDisclosure(false);
  const viewport = useRef<HTMLDivElement>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [tier, setTier] = useState('Low tier');

  const [templatesObject, setTemplatesObject] = useState<Record<string, Omit<ITemplate, 'id'>>>({});

  const theme = useMantineTheme();
  const toggleComponentSearch = (c: string) => {
    !opened ? handlers.open() : c !== categoryId ? false : handlers.close();
    setCategoryId(c);
  };

  const form = useForm<{
    title: string;
    description: string;
    components: Record<string, IComponent[]>;
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
    const configData = storage.getConfig();
    if (isSuccess) {
      const mapped = templates.map(({ id, ...data }) => [id, data]);
      const tObject = Object.fromEntries(mapped);
      setTemplatesObject(tObject);

      const ids = templates.map((t) => [
        t.id,
        configData[t.id] ? configData[t.id].map((item) => ({ ...item, refetch: true })) : [],
      ]);
      const formData = Object.fromEntries(ids);
      form.setFieldValue('components', formData);
    }
  }, [isSuccess]);

  useEffect(() => {
    const components = Object.values(form.values.components).flat();
    const price = components.reduce(
      (prev, next) => [
        prev[0] + (next && next.data['Цена'] ? next.data['Цена'][0] : 0),
        prev[1] + (next && next.data['Цена'] ? next.data['Цена'][1] : 0),
      ],
      [0, 0]
    );
    setTotalPrice(price);

    const componentsTierSummary =
      components
        .map((c) => c.data.tier)
        .reduce((prev, next) => prev + (next === 'high' ? 3 : next === 'medium' ? 2 : 1), 0) /
      (components.length || 1);

    const configTier =
      componentsTierSummary >= 0 && componentsTierSummary < 1.5
        ? 'Low tier'
        : componentsTierSummary >= 1.5 && componentsTierSummary < 2.2
        ? 'Medium tier'
        : 'High tier';

    setTier(configTier);
  }, [form.values.components]);

  useEffect(() => {
    if (constraintsLoaded && isSuccess) {
      const errors = configErrors(
        constraints,
        templates,
        Object.values(form.values.components).flat()
      );

      setChecks(errors);
    }
  }, [constraintsLoaded, isSuccess, form.values.components]);

  const onRemove = (templateId: string, index?: number) => {
    if (index === undefined) {
      form.setFieldValue(`components.${templateId}`, []);
    } else {
      form.removeListItem(`components.${templateId}`, index);
    }
    storage.updateConfig(
      templateId,
      form.values.components[templateId].filter(
        (item, i) => i !== index && item.templateId === templateId
      )
    );
  };

  const onChoose = (component: IComponent) => {
    form.insertListItem(`components.${component.templateId}`, component);
    if (isSuccess) {
      const currentState = [...Object.values(form.values.components).flat(), component];
      const [currentCount, maxCount] = getCount(
        templatesObject,
        templates.find((t) => t.id === component.templateId)!,
        currentState
      );
      if (currentCount === maxCount) {
        handlers.close();
      }
      storage.updateConfig(
        component.templateId,
        currentState.filter((i) => i.templateId === component.templateId)
      );
    }
  };

  const onLoad = (component: IComponent, index) => {
    if (isSuccess) {
      const currentState = [...Object.values(form.values.components).flat()];

      storage.updateConfig(
        component.templateId,
        currentState
          .filter((i) => i.templateId === component.templateId)
          .map((item, i) => (item.id === component.id && index === i ? component : item))
      );
    }
  };

  const createConfigMutation = useMutation(
    (configData: {
      title: string;
      description: string;
      components: { componentId: string; count: number }[];
    }) =>
      axios.post('/api/configs', configData, {
        headers: {
          authorization: `Bearer ${storage.getToken()}`,
        },
      }),
    {
      onSuccess: () => {
        showNotification({
          title: 'Успех',
          message: 'Сборка успешно создана',
          color: 'green',
        });
        refetch();
      },
      onError: (err: any) => {
        showNotification({
          title: 'Ошибка',
          message: err.response.data.message || 'Что-то пошло не так',
          color: 'red',
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    const entries = Object.entries(values.components);
    const notAddedButRequired = templates
      ?.filter((t) => t.required)
      ?.filter((t) => entries.find((e) => e[0] === t.id)?.[1].length === 0)
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

    const allComponents = Object.values(values.components);
    const mappedComponents = allComponents
      .map((arr) => {
        const counted: Record<string, number> = {};
        for (let i = 0; i < arr.length; i += 1) {
          counted[arr[i].id] ? (counted[arr[i].id] += 1) : (counted[arr[i].id] = 1);
        }
        return Object.entries(counted).map(([id, count]) => ({ componentId: id, count }));
      })
      .flat();

    return createConfigMutation.mutate({
      components: mappedComponents,
      title: values.title,
      description: values.description,
    });
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
                        Категория сборки: <Text weight={600}>{tier}</Text>
                      </Text>
                      <Text>
                        <Text>Примерная цена:</Text>
                        <Group spacing={4}>
                          <Text weight={600}>{totalPrice.join(' - ')}</Text>
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
                          <Group>
                            <Text>
                              {t.name} {t.required ? '*' : ''}
                            </Text>
                            {t.maxCount.type === 'depends_on' &&
                              getCount(
                                templatesObject,
                                t,
                                Object.values(form.values.components).flat()
                              ).join(' / ')}
                          </Group>
                          <Group>
                            {t.id in form.values.components &&
                              form.values.components[t.id].length > 0 && (
                                <ActionIcon color="red" onClick={() => onRemove(t.id)}>
                                  <IconTrash />
                                </ActionIcon>
                              )}
                            {t.id in form.values.components &&
                              getCount(
                                templatesObject,
                                t,
                                Object.values(form.values.components).flat()
                              )[0] <
                                getCount(
                                  templatesObject,
                                  t,
                                  Object.values(form.values.components).flat()
                                )[1] && (
                                <ActionIcon
                                  color="blue"
                                  onClick={() => toggleComponentSearch(t.id)}
                                >
                                  {categoryId === t.id && opened ? <IconX /> : <IconPlus />}
                                </ActionIcon>
                              )}
                          </Group>
                        </Group>
                      </Card.Section>
                      {t.id in form.values.components &&
                        !!form.values.components[t.id] &&
                        form.values.components[t.id].map((component, index) => (
                          <Stack pt={index === 0 ? 'md' : 0} key={`${component.id}_${index}`}>
                            {/*<ComponentRow*/}
                            {/*  component={component.data}*/}
                            {/*  templateId={component.templateId}*/}
                            {/*  onRemove={*/}
                            {/*    form.values.components[t.id].length > 1*/}
                            {/*      ? () => onRemove(t.id, index)*/}
                            {/*      : undefined*/}
                            {/*  }*/}
                            {/*/>*/}
                            <ComponentRowWithReload
                              component={component}
                              onLoad={(c) => onLoad(c, index)}
                              onRemove={
                                form.values.components[t.id].length > 1
                                  ? () => onRemove(t.id, index)
                                  : undefined
                              }
                            />
                            {index !== form.values.components[t.id].length - 1 && (
                              <Divider mb="md" />
                            )}
                          </Stack>
                        ))}
                    </Card>
                    <Collapse in={categoryId === t.id && opened}>
                      <Paper sx={{ backgroundColor: theme.colors.gray[4] }} pt="md">
                        <ScrollArea.Autosize sx={{ maxHeight: 700 }} viewportRef={viewport}>
                          <ComponentsList
                            categoryId={categoryId && categoryId === t.id ? t.id : ''}
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
                  <Stack spacing="xs">
                    <Title order={3}>Информация</Title>
                    <Text>
                      Категория сборки: <Text weight={600}>{tier}</Text>
                    </Text>
                    <Text>
                      <Text>Примерная цена:</Text>
                      <Group spacing={4}>
                        <Text weight={600}>{totalPrice.join(' - ')}</Text>
                        <IconCurrencyRubel size={15} />
                      </Group>
                    </Text>
                  </Stack>
                </Block>
                <Block>
                  <Stack>
                    <TextInput
                      label="Название сборки"
                      {...form.getInputProps('title')}
                      required
                      maxLength={50}
                      description={`${form.values.title.length} / 50`}
                    />
                    <Textarea
                      label="Описание сборки"
                      {...form.getInputProps('description')}
                      required
                      description={`${form.values.description.length} / 500`}
                      maxLength={500}
                    />
                    <Button disabled={!user} type="submit">
                      Сохранить
                    </Button>
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
