import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Block } from '../../../components/Layout/Block/Block';
import { IComponent, ITemplate } from '../../../types/Template';

const Field = ({ data }) => {
  console.log(data);
  return (
    <Fragment key={data.name}>
      <Grid.Col span={4}>
        <Box sx={{ borderBottom: '1px solid #aaa' }}>
          <Text size={16} weight={700}>
            {data.name}:
          </Text>
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
          {['NUMBER', 'TEXT', 'SELECT', 'LARGE_TEXT'].includes(data.type) && (
            <Text>{data.value}</Text>
          )}
          {data.type === 'BOOL' && <Text>{data.value ? 'Да' : 'Нет'}</Text>}
          {data.type === 'RANGE' && (
            <Text>
              {data.value[0]} - {data.value[1]}
            </Text>
          )}
        </Box>
      </Grid.Col>
    </Fragment>
  );
};

export default function partPage() {
  const router = useRouter();
  const [componentData, setComponentData] = useState<IComponent>();
  const [templateData, setTemplateData] = useState<ITemplate & { id: string }>();

  useEffect(() => {
    axios
      .get(`/api/components/${router.query.componentId}`)
      .then((res) => setComponentData(res.data));
    axios.get(`/api/templates/${router.query.categoryId}`).then((res) => setTemplateData(res.data));
  }, []);

  console.log(componentData);

  return (
    <Container size="xl" p={0}>
      <Stack>
        <Block>
          <Group position="apart">
            <Title order={2}>{componentData && componentData.data['Название']}</Title>
            <Group>
              <Button href={`/components/edit/${router.query.componentId}`} component={NextLink}>
                Изменить
              </Button>
              <Button href={`/components/${router.query.categoryId}`} component={NextLink}>
                Назад
              </Button>
            </Group>
          </Group>
        </Block>
        <Box>
          <Grid columns={3}>
            <Grid.Col md={3} lg={1}>
              <Stack>
                <Block sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box>
                    <Image
                      withPlaceholder
                      height={256}
                      {...(componentData?.data.image
                        ? { src: `${componentData.data?.image.url}?quality=60` }
                        : {})}
                    />
                  </Box>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Примерная цена:
                    </Text>
                    <Text size={20}>
                      {componentData?.data['Цена'][0]} - {componentData?.data['Цена'][1]}
                    </Text>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Наша оценка
                    </Text>
                    <Text size={20}>
                      {componentData &&
                        (componentData.data.tier > 0
                          ? componentData.data.tier > 50
                            ? 'High'
                            : 'Medium'
                          : 'Low')}{' '}
                      tier
                    </Text>
                  </Stack>
                </Block>
              </Stack>
            </Grid.Col>
            <Grid.Col md={3} lg={2}>
              <Grid columns={4}>
                <Grid.Col>
                  <Block>
                    <Spoiler maxHeight={100} hideLabel="Спрятать" showLabel="Показать все">
                      {componentData?.data['Описание детали']}
                    </Spoiler>
                  </Block>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Block>
                    <Spoiler
                      maxHeight={200}
                      hideLabel={<Button>Спрятать</Button>}
                      showLabel={<Button>Показать все</Button>}
                      styles={(theme) => ({
                        control: {
                          marginTop: '1rem',
                        },
                      })}
                    >
                      <Grid columns={6}>
                        {templateData &&
                          componentData &&
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
                                }}
                              />
                            ))}
                      </Grid>
                    </Spoiler>
                  </Block>
                </Grid.Col>
                <Grid.Col span="auto">
                  <Block>
                    <Grid columns={40} grow>
                      <Grid.Col span={18}>
                        <Stack>
                          {componentData &&
                            (componentData.data?.pros?.length > 0 ? (
                              componentData.data.pros.map((pros: string, index) => (
                                <Text key={index} color="green" weight={600}>
                                  {pros}
                                </Text>
                              ))
                            ) : (
                              <Center>
                                <Text sx={{ textAlign: 'center' }}>Нет плюсов</Text>
                              </Center>
                            ))}
                        </Stack>
                      </Grid.Col>
                      <Grid.Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Divider
                          size="lg"
                          orientation="vertical"
                          style={{ maxWidth: 10, height: '100%' }}
                        />
                      </Grid.Col>
                      <Grid.Col span={18}>
                        <Stack>
                          {componentData &&
                            (componentData.data?.cons?.length > 0 ? (
                              componentData.data.cons.map((cons: string, index) => (
                                <Text key={index} color="red" weight={600}>
                                  {cons}
                                </Text>
                              ))
                            ) : (
                              <Center>
                                <Text>Нет минусов</Text>
                              </Center>
                            ))}
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Block>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
