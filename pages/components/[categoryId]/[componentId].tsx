import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Grid,
  Group,
  HoverCard,
  Image,
  List,
  MediaQuery,
  Spoiler,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import {
  IconCircleMinus,
  IconCirclePlus,
  IconCurrencyRubel,
  IconInfoCircle,
  IconMinus,
  IconPencil,
  IconPlus,
} from '@tabler/icons-react';
import { Block, PageHeader } from '../../../components/Layout';
import { useComponentData } from '../../../components/hooks/components';
import { useTemplateData } from '../../../components/hooks/templates';
import {
  BOOL,
  DEPENDS_ON,
  LARGE_TEXT,
  NUMBER,
  RANGE,
  SELECT,
  TEXT,
} from '../../../types/FieldTypes';
import { useAuth } from '../../../components/Providers/AuthContext/AuthWrapper';
import { NextLink } from '../../../components/Layout/general/NextLink/NextLink';
import { Comments } from '../../../components/Layout/specific/Comments/Comments';

const Field = ({ data }) => (
  <Fragment key={data.name}>
    <Grid.Col span={4}>
      <Box sx={{ borderBottom: '1px solid #aaa' }}>
        <Group spacing={0} align="center" sx={{ height: '110%' }}>
          <Text size={16} weight={700}>
            {data.name}:
          </Text>
          {data.description && (
            <HoverCard width={200}>
              <HoverCard.Target>
                <ActionIcon size="md">
                  <IconInfoCircle />
                </ActionIcon>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">{data.description}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          )}
        </Group>
      </Box>
    </Grid.Col>
    <Grid.Col span={2}>
      <Box
        sx={{
          borderBottom: '1px solid #aaa',
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          alignItems: 'center',
        }}
      >
        {[NUMBER, TEXT, SELECT, LARGE_TEXT, DEPENDS_ON].includes(data.type) && (
          <Text>{data.value}</Text>
        )}
        {data.type === BOOL && <Text>{data.value ? 'Да' : 'Нет'}</Text>}
        {data.type === RANGE && (
          <Text>
            {data.value[0]} - {data.value[1]}
          </Text>
        )}
      </Box>
    </Grid.Col>
  </Fragment>
);

export default function ComponentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: componentData, isSuccess: isComponentDataFetched } = useComponentData(
    router.query.componentId as string
  );

  if (isComponentDataFetched && !componentData) router.back();

  const { data: templateData, isSuccess: isTemplateDataFetched } = useTemplateData(
    router.query.categoryId as string
  );

  return (
    <Container size="xl" px={0}>
      <Stack>
        <PageHeader
          title={isComponentDataFetched && componentData.data['Название']}
          addBack
          rightSection={
            user && (
              <Group sx={{ height: '100%' }}>
                <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                  <Button
                    href={`/components/edit/${router.query.componentId}`}
                    component={NextLink}
                  >
                    Изменить
                  </Button>
                </MediaQuery>
                <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                  <ActionIcon
                    color="blue"
                    variant="filled"
                    href={`/components/edit/${router.query.componentId}`}
                    component={NextLink}
                  >
                    <IconPencil />
                  </ActionIcon>
                </MediaQuery>
              </Group>
            )
          }
        />
        <Box>
          <Grid columns={3}>
            <Grid.Col span="auto">
              <Stack>
                <Block>
                  <Image
                    withPlaceholder
                    {...(isComponentDataFetched &&
                    componentData?.data.imageUrl &&
                    componentData?.data.imageUrl.length > 0
                      ? { src: `${componentData?.data.imageUrl}?quality=60` }
                      : { height: 256 })}
                  />
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Примерная цена:
                    </Text>
                    <Group spacing={0}>
                      <Text size={20}>
                        {componentData?.data['Цена'][0]} - {componentData?.data['Цена'][1]}{' '}
                      </Text>
                      <IconCurrencyRubel />
                    </Group>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Наша оценка
                    </Text>
                    <Text size={20}>
                      {isComponentDataFetched &&
                        (componentData.data.tier
                          ? componentData.data.tier === 'high'
                            ? 'High'
                            : 'Medium'
                          : 'Low')}{' '}
                      tier
                    </Text>
                  </Stack>
                </Block>
              </Stack>
            </Grid.Col>
            <Grid.Col xs={3} sm={2}>
              <Tabs defaultValue="info">
                <Block>
                  <Tabs.List>
                    <Tabs.Tab value="info">Информация</Tabs.Tab>
                    <Tabs.Tab value="comments">Комментарии</Tabs.Tab>
                  </Tabs.List>
                </Block>
                <Tabs.Panel value="info">
                  <Stack spacing="xs" mt="xs">
                    <Block>
                      <Spoiler maxHeight={100} hideLabel="Спрятать" showLabel="Показать все">
                        <Text>{componentData?.data['Описание детали']}</Text>
                      </Spoiler>
                    </Block>
                    <Block>
                      <Spoiler
                        maxHeight={200}
                        hideLabel="Спрятать"
                        showLabel="Показать все"
                        styles={() => ({
                          control: {
                            marginTop: '1rem',
                            textAlign: 'center',
                            width: '100%',
                          },
                        })}
                      >
                        <Grid columns={6}>
                          {isTemplateDataFetched &&
                            isComponentDataFetched &&
                            templateData.fields
                              .filter(
                                (field) =>
                                  !['Название', 'Описание детали', 'Цена'].includes(field.name)
                              )
                              .map((field) => (
                                <Field
                                  key={field.name}
                                  data={{
                                    name: field.name,
                                    value:
                                      field.name in componentData.data
                                        ? componentData.data[field.name]
                                        : 'Нет данных',
                                    type: field.name in componentData.data ? field.type : 'TEXT',
                                    description: field.description,
                                  }}
                                />
                              ))}
                        </Grid>
                      </Spoiler>
                    </Block>
                    <Block>
                      <Tabs defaultValue="pros">
                        <Tabs.List>
                          <Tabs.Tab icon={<IconCirclePlus size={20} color="green" />} value="pros">
                            Плюсы
                          </Tabs.Tab>
                          <Tabs.Tab icon={<IconCircleMinus size={20} color="red" />} value="cons">
                            Минусы
                          </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="pros" mt="xs">
                          <List
                            icon={<IconPlus size={24} color="green" />}
                            spacing="xs"
                            size="sm"
                            center
                          >
                            {isComponentDataFetched &&
                              (componentData.data?.pros?.length > 0 ? (
                                componentData.data.pros.map((pros: string, index) => (
                                  <List.Item key={index}>
                                    <Text weight={600}>{pros}</Text>
                                  </List.Item>
                                ))
                              ) : (
                                <Center>
                                  <Text sx={{ textAlign: 'center' }}>Нет плюсов</Text>
                                </Center>
                              ))}
                          </List>
                        </Tabs.Panel>
                        <Tabs.Panel value="cons" mt="xs">
                          <List
                            icon={<IconMinus size={24} color="red" />}
                            spacing="xs"
                            size="sm"
                            center
                          >
                            {isComponentDataFetched &&
                              (componentData.data?.cons?.length > 0 ? (
                                componentData.data.cons.map((cons: string, index) => (
                                  <List.Item key={index}>
                                    <Text weight={600}>{cons}</Text>
                                  </List.Item>
                                ))
                              ) : (
                                <Center>
                                  <Text>Нет минусов</Text>
                                </Center>
                              ))}
                          </List>
                        </Tabs.Panel>
                      </Tabs>
                    </Block>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="comments">
                  <Comments componentId={router.query.componentId as string} />
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
