import { Box, Grid, Group, Image, Input, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IconCircleMinus, IconCirclePlus } from '@tabler/icons';

const Field = ({ data }: any) => {
  console.log(data);
  return (
    <Grid.Col span={3}>
      <Input.Wrapper label={data.name}>
        {['NUMBER', 'TEXT', 'SELECT'].includes(data.type) && <Text>{data.value}</Text>}
        {data.type === 'BOOL' && <Text>{data.value ? 'Да' : 'Нет'}</Text>}
        {data.type === 'RANGE' && (
          <Text>
            {data.value[0]} - {data.value[1]}
          </Text>
        )}
      </Input.Wrapper>
    </Grid.Col>
  );
};

export default function PartPage() {
  const router = useRouter();
  const [partData, setPartData] = useState<Record<any, any>>();
  const [formData, setFormData] = useState<Record<any, any>>();

  useEffect(() => {
    axios.get(`/api/parts/details/${router.query.partId}`).then((res) => setPartData(res.data));
  }, []);

  useEffect(() => {
    if (partData) {
      axios.get(`/api/forms/${partData?.formId}`).then((res) => setFormData(res.data));
    }
  }, [partData]);

  return (
    <>
      <Group align="normal">
        <Box>
          <Paper p="md" shadow="xl">
            <Image width={256} height={256} withPlaceholder />
          </Paper>
        </Box>
        <Paper p="md" shadow="xl" sx={{ width: '60%' }}>
          <Stack spacing="sm">
            <Title order={3}>{partData && partData.data?.['Название']}</Title>
            <Text>{partData && partData.data?.['Описание детали']}</Text>
            <Title order={4}>
              Наша оценка:{' '}
              {partData &&
                (partData.data.tier > 0
                  ? partData.data.tier > 50
                    ? 'High'
                    : 'Medium'
                  : 'Low')}{' '}
              tier
            </Title>
            <Box>
              <Grid columns={9}>
                {partData &&
                  formData &&
                  formData.fields
                    .filter((field: any) => !['Название', 'Описание детали'].includes(field.name))
                    .map((field: any) => (
                      <Field
                        data={{
                          name: field.name,
                          value:
                            field.name in partData.data ? partData.data[field.name] : 'Нет данных',
                          type: field.name in partData.data ? field.type : 'TEXT',
                        }}
                      />
                    ))}
              </Grid>
            </Box>
            <Input.Wrapper label="Плюсы и минусы">
              <Group align="normal">
                <Stack>
                  {partData &&
                    (partData.data.pros.length > 0 ? (
                      partData.data.pros.map((pros: string) => (
                        <Group spacing="xs" align="normal" sx={{ flexWrap: 'nowrap' }}>
                          <IconCirclePlus color="green" />
                          <Text>{pros}</Text>
                        </Group>
                      ))
                    ) : (
                      <Text>Нет плюсов</Text>
                    ))}
                </Stack>
                <Stack>
                  {partData &&
                    (partData.data.cons.length > 0 ? (
                      partData.data.cons.map((cons: string) => (
                        <Group spacing="xs" align="normal" sx={{ flexWrap: 'nowrap' }}>
                          <IconCircleMinus color="red" />
                          <Text>{cons}</Text>
                        </Group>
                      ))
                    ) : (
                      <Text>Нет минусов</Text>
                    ))}
                </Stack>
              </Group>
            </Input.Wrapper>
          </Stack>
        </Paper>
      </Group>
    </>
  );
}
