import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Group,
  MediaQuery,
  Stack,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconPencil } from '@tabler/icons-react';
import { Block, PageHeader } from '../../components/Layout';
import { NextLink } from '../../components/Layout/general/NextLink/NextLink';
import { useConfigData } from '../../components/hooks/configs';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';

export default function partPage() {
  const router = useRouter();
  const { data: configData, isSuccess } = useConfigData(router.query.configId as string);

  const { user } = useAuth();

  if (isSuccess && !configData) router.push('/configs');

  return (
    isSuccess &&
    !!configData && (
      <Container size="xl" px={0}>
        <Stack>
          <PageHeader
            title={isSuccess ? configData.title : ''}
            leftSection={
              <ActionIcon href="/configs" component={NextLink}>
                <IconArrowLeft />
              </ActionIcon>
            }
            rightSection={
              user &&
              user.role === 'ADMIN' && (
                <Group sx={{ height: '100%' }}>
                  <MediaQuery styles={{ display: 'none' }} smallerThan="sm">
                    <Button leftIcon={<IconPencil />}>Изменить</Button>
                  </MediaQuery>
                  <MediaQuery styles={{ display: 'none' }} largerThan="sm">
                    <ActionIcon color="blue" variant="filled">
                      <IconPencil />
                    </ActionIcon>
                  </MediaQuery>
                </Group>
              )
            }
          />
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
    )
  );
}
