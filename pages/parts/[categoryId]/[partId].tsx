import {
  Box,
  Button,
  Center,
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
import { Block } from '../../../components/Block/Block';
import { IField } from '../../../lib/Field';

interface IPart {
  data: Record<string, any>;
  formId: string;
  id: string;
}

interface IFormData {
  id: string;
  name: string;
  fields: IField[];
}

const Field = ({ data }) => (
  <Fragment key={data.name}>
    <Grid.Col span={4}>
      <Box sx={{ borderBottom: '1px solid #aaa' }}>
        <Text size={16} weight={700}>
          {data.name}:
        </Text>
      </Box>
    </Grid.Col>
    <Grid.Col span={2}>
      <Box sx={{ borderBottom: '1px solid #aaa' }}>
        {['NUMBER', 'TEXT', 'SELECT'].includes(data.type) && <Text>{data.value}</Text>}
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

export default function partPage() {
  const router = useRouter();
  const [partData, setPartData] = useState<IPart>();
  const [formData, setFormData] = useState<IFormData>();

  useEffect(() => {
    axios.get(`/api/parts/${router.query.partId}`).then((res) => setPartData(res.data));
    axios.get(`/api/forms/${router.query.categoryId}`).then((res) => setFormData(res.data));
  }, []);

  return (
    <Stack>
      <Block>
        <Group position="apart">
          <Title order={2}>{partData && partData.data['Название']}</Title>
          <Group>
            <Button href={`/parts/edit/${router.query.partId}`} component={NextLink}>
              Изменить
            </Button>
            <Button href={`/parts/${router.query.categoryId}`} component={NextLink}>
              Назад
            </Button>
          </Group>
        </Group>
      </Block>
      <Box>
        <Grid columns={3}>
          <Grid.Col span={1}>
            <Stack>
              <Block sx={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  withPlaceholder
                  {...(partData?.data.image
                    ? { src: `${partData.data?.image.url}?quality=60` }
                    : {})}
                />
              </Block>
              <Block>
                <Stack align="center">
                  <Text weight={700} size={16}>
                    Примерная цена:
                  </Text>
                  <Text size={20}>
                    {partData?.data['Цена'][0]} - {partData?.data['Цена'][1]}
                  </Text>
                </Stack>
              </Block>
              <Block>
                <Stack align="center">
                  <Text weight={700} size={16}>
                    Наша оценка
                  </Text>
                  <Text size={20}>
                    {partData &&
                      (partData.data.tier > 0
                        ? partData.data.tier > 50
                          ? 'High'
                          : 'Medium'
                        : 'Low')}{' '}
                    tier
                  </Text>
                </Stack>
              </Block>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Grid columns={4}>
              <Grid.Col>
                <Block>
                  <Spoiler maxHeight={100} hideLabel="Спрятать" showLabel="Показать больше">
                    {partData?.data['Описание детали']}
                  </Spoiler>
                </Block>
              </Grid.Col>
              <Grid.Col span={2}>
                <Block>
                  <Grid columns={6}>
                    {formData &&
                      partData &&
                      formData.fields
                        .filter(
                          (field) => !['Название', 'Описание детали', 'Цена'].includes(field.name)
                        )
                        .map((field) => (
                          <Field
                            data={{
                              name: field.name,
                              value:
                                field.name in partData.data
                                  ? partData.data[field.name]
                                  : 'Нет данных',
                              type: field.name in partData.data ? field.type : 'TEXT',
                            }}
                          />
                        ))}
                  </Grid>
                </Block>
              </Grid.Col>
              <Grid.Col span={2}>
                <Block>
                  <Grid columns={40}>
                    <Grid.Col span={18}>
                      <Stack>
                        {partData &&
                          (partData.data.pros.length > 0 ? (
                            partData.data.pros.map((pros: string) => (
                              <Text color="green" weight={600}>
                                {pros}
                              </Text>
                            ))
                          ) : (
                            <Center>
                              <Text>Нет плюсов</Text>
                            </Center>
                          ))}
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <Divider
                        size="lg"
                        orientation="vertical"
                        style={{ maxWidth: 10, height: '100%' }}
                      />
                    </Grid.Col>
                    <Grid.Col span={18}>
                      <Stack>
                        {partData &&
                          (partData.data.cons.length > 0 ? (
                            partData.data.cons.map((cons: string) => (
                              <Text color="red" weight={600}>
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
  );
}
