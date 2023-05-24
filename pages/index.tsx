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
  Skeleton,
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
import { IComponent, IComponentBody, ITemplate } from '../types/Template';
import { useConstraintsList } from '../components/hooks/constraints';
import { ErrorMessage } from '../components/Layout/specific/ConfiguratorMessage/ConfiguratorMessage';
import { useComponentData } from '../components/hooks/components';
import { configErrors, getCount, storage } from '../lib/utils';

//TODO: Добавить помощник выбора в несколько шагов
/**
 * Пример работы:
 * Пользователь нажимает на кнопку -> ему показывается помощник по сборкам
 * Далее он заполняет форму в несколько этапов
 * После ему подбираются комплектующие по указанным критериям
 **/

const ComponentRow = ({ componentId, onLoad }: { componentId: string; onLoad?: any }) => {
  const { data: componentData, isSuccess, isFetched } = useComponentData(componentId);

  useEffect(() => {
    if (isFetched) {
      onLoad && onLoad(componentData);
    }
  }, [isFetched]);

  return (
    <MediaQuery styles={{ flexWrap: 'wrap' }} smallerThan="sm">
      <Group align="normal" sx={{ flexWrap: 'initial' }}>
        <Image
          withPlaceholder
          radius="sm"
          width={256 / 1.5}
          height={256 / 1.5}
          {...(isSuccess && componentData.data.imageUrl && componentData.data.imageUrl
            ? {
                src: `${componentData.data.imageUrl}?quality=60`,
              }
            : {})}
        />
        <Stack spacing={0}>
          {isSuccess && <Title order={3}>{componentData.data['Название']}</Title>}
          {!isSuccess && (
            <Skeleton maw={400}>
              <Title order={3}>Loading</Title>
            </Skeleton>
          )}
          <Group spacing={4}>
            <Text>Примерная цена:</Text>
            {isSuccess && componentData.data['Цена'][0]}
            {!isSuccess && (
              <Skeleton maw={100}>
                <Text>9999</Text>
              </Skeleton>
            )}
            <Text>-</Text>
            {isSuccess && componentData.data['Цена'][1]}
            {!isSuccess && (
              <Skeleton maw={100}>
                <Text>9999</Text>
              </Skeleton>
            )}
          </Group>
          <Group spacing={4}>
            <Text>Tier компонента:</Text>
            {isSuccess && <Text>{componentData.data.tier.toUpperCase()}</Text>}
            {!isSuccess && (
              <Skeleton maw={150}>
                <Text>LOADING</Text>
              </Skeleton>
            )}
          </Group>
        </Stack>
      </Group>
    </MediaQuery>
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

  const [templatesObject, setTemplatesObject] = useState<Record<string, Omit<ITemplate, 'id'>>>({});

  useEffect(() => {
    if (isSuccess) {
      const mapped = templates.map(({ id, ...data }) => [id, data]);
      const object = Object.fromEntries(mapped);
      setTemplatesObject(object);
    }
  }, [isSuccess]);

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
    if (isSuccess) {
      const ids = templates.map((t) => [t.id, []]);
      const object = Object.fromEntries(ids);
      form.setFieldValue('components', object);
    }
  }, [isSuccess]);

  const onLoad = (templateId: string, componentData: IComponent, index: number) => {
    if (componentData) {
      const alreadyExist = form.values.components[templateId][index]?.data;
      if (!alreadyExist) {
        form.setFieldValue(`components.${templateId}.${index}.data`, componentData);
      }
    } else {
      // form.setFieldValue(`components.${templateId}`, null);
      // storage.updateConfig(templateId, '');
    }
  };

  // useEffect(() => {
  //   const configData = storage.getConfig();
  //   if (isSuccess) {
  //     const entries = Object.entries(configData)
  //       .filter(([_, value]) => (value as string).length > 0)
  //       .map(([key, value]) => [key, { id: value, data: {} }]);
  //     const result = Object.fromEntries(entries);
  //     form.setFieldValue('components', result);
  //   }
  // }, [isSuccess]);

  useEffect(() => {
    const price = Object.values(form.values.components)
      .flat()
      .reduce(
        (prev, next) => [
          prev[0] + (next && next.data['Цена'] ? next.data['Цена'][0] : 0),
          prev[1] + (next && next.data['Цена'] ? next.data['Цена'][1] : 0),
        ],
        [0, 0]
      );
    setTotalPrice(price);
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
  };

  const onChoose = (
    templateId: string,
    component: { id: string; templateId: string; data: IComponentBody }
  ) => {
    form.insertListItem(`components.${templateId}`, component);
    if (isSuccess) {
      const currentState = [...Object.values(form.values.components).flat(), component];
      const [currentCount, maxCount] = getCount(
        templatesObject,
        templates.find((t) => t.id === templateId)!,
        currentState
      );
      if (currentCount === maxCount) {
        handlers.close();
      }
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
      onError: () => {
        showNotification({
          title: 'Ошибка',
          message: 'Что-то пошло не так',
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
    const components = Object.values(values.components)
      .map((arr) =>
        arr.map((c) => ({
          componentId: c.id,
          count: arr.length,
        }))
      )
      .flat();

    return createConfigMutation.mutate({
      components,
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
                        Категория сборки: <Text weight={600}>High end (High tier)</Text>
                      </Text>
                      <Text>
                        Примерное потребление: <Text weight={600}>450w</Text>
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
                          <Group position="apart" align="normal" pt="md">
                            <ComponentRow
                              componentId={component.id}
                              onLoad={(data) => onLoad(t.id, data, index)}
                            />
                            {form.values.components[t.id].length > 1 && (
                              <Button
                                color="red"
                                variant="outline"
                                onClick={() => onRemove(t.id, index)}
                              >
                                Удалить
                              </Button>
                            )}
                          </Group>
                        ))}
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
                        <Text weight={600}>{totalPrice.join(' - ')}</Text>
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
