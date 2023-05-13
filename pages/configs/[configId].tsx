import {
  Avatar,
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
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Block } from '../../components/Layout';
import { useComponentData } from '../../components/hooks/components';
import { useTemplateData } from '../../components/hooks/templates';
import { BOOL, DEPENDS_ON, LARGE_TEXT, NUMBER, RANGE, SELECT, TEXT } from '../../types/FieldTypes';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';
import { useConfigData } from '../../components/hooks/configs';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';

export default function partPage() {
  const router = useRouter();
  const { data: configData, isSuccess } = useConfigData(router.query.configId as string);

  return (
    <Container size="xl" px={0}>
      <Stack>
        <Block>
          <Group position="apart">
            <Title order={2}>{isSuccess && configData.title}</Title>
            <Group>
              {/*TODO: Load config from list and edit*/}
              <Button disabled href="/" component={NextLink}>
                Изменить
              </Button>
              <Button href="/configs" component={NextLink}>
                Назад
              </Button>
            </Group>
          </Group>
        </Block>
        <Box>
          <Grid columns={3}>
            <Grid.Col md={3} lg={1}>
              <Stack>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Автор
                    </Text>
                    <Group>
                      <Avatar />
                      <Text>{isSuccess && configData.author.username}</Text>
                    </Group>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Примерная цена:
                    </Text>
                    <Text size={20}>150000</Text>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Наша оценка
                    </Text>
                    <Text size={20}>High tier</Text>
                  </Stack>
                </Block>
              </Stack>
            </Grid.Col>
            <Grid.Col md={3} lg={2}>
              <Grid columns={4}>
                <Grid.Col>
                  <Block>
                    <Text>{isSuccess && configData.description}</Text>
                  </Block>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack>
                    {isSuccess &&
                      configData.components.map((c) => <ComponentRow component={c.data} />)}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
