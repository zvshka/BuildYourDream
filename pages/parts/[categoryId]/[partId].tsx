import { Box, Button, Center, Divider, Group, Image, Stack, Text, Title } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Block } from '../../../components/Block/Block';
import { IField } from '../../../types/Form';
import { IconCircleMinus, IconCirclePlus } from '@tabler/icons';

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
  <Group grow align="normal">
    <Box sx={{ borderBottom: '1px solid #aaa', flex: '1 1 auto' }} style={{ maxWidth: 600 }}>
      <Text size={16} weight={700}>
        {data.name}:
      </Text>
    </Box>
    <Box sx={{ borderBottom: '1px solid #aaa', maxWidth: 120, width: 120 }}>
      {['NUMBER', 'TEXT', 'SELECT'].includes(data.type) && <Text>{data.value}</Text>}
      {data.type === 'BOOL' && <Text>{data.value ? 'Да' : 'Нет'}</Text>}
      {data.type === 'RANGE' && (
        <Text>
          {data.value[0]} - {data.value[1]}
        </Text>
      )}
    </Box>
  </Group>
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
      <Group align="normal" grow>
        <Box style={{ flexGrow: 0 }}>
          <Stack>
            <Block>
              <Image
                width={256 * 1.5}
                height={256 * 1.5}
                withPlaceholder
                {...(partData?.data.image ? { src: `${partData.data?.image.url}?quality=60` } : {})}
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
        </Box>
        <Stack style={{ maxWidth: '100%', flex: 1 }}>
          <Block sx={{ display: 'flex', flex: 1 }}>{partData?.data['Описание детали']}</Block>
          <Group align="normal" grow>
            <Block sx={{ maxWidth: 620 }}>
              <Stack>
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
                            field.name in partData.data ? partData.data[field.name] : 'Нет данных',
                          type: field.name in partData.data ? field.type : 'TEXT',
                        }}
                      />
                    ))}
              </Stack>
            </Block>
            <Box sx={{ flex: 1 }}>
              <Block>
                <Group align="normal" grow spacing={0}>
                  <Stack style={{ flex: 1, maxWidth: '100%' }}>
                    {partData &&
                      (partData.data.pros.length > 0 ? (
                        partData.data.pros.map((pros: string) => (
                          <Group spacing="xs" align="normal" sx={{ flexWrap: 'nowrap' }}>
                            <IconCirclePlus color="green" />
                            <Text>{pros}</Text>
                          </Group>
                        ))
                      ) : (
                        <Center>
                          <Text>Нет плюсов</Text>
                        </Center>
                      ))}
                  </Stack>
                  <Divider size="lg" orientation="vertical" style={{ maxWidth: 10 }} />
                  <Stack style={{ flex: 1, maxWidth: '100%' }}>
                    {partData &&
                      (partData.data.cons.length > 0 ? (
                        partData.data.cons.map((cons: string) => (
                          <Group spacing="xs" align="normal" sx={{ flexWrap: 'nowrap' }}>
                            <IconCircleMinus color="red" />
                            <Text>{cons}</Text>
                          </Group>
                        ))
                      ) : (
                        <Center>
                          <Text>Нет минусов</Text>
                        </Center>
                      ))}
                  </Stack>
                </Group>
              </Block>
            </Box>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}
