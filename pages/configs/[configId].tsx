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
  Tabs,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { IconPencil } from '@tabler/icons-react';
import { Block, PageHeader } from '../../components/Layout';
import { useConfigData } from '../../components/hooks/configs';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { Comments } from '../../components/Layout/specific/Comments/Comments';

export default function partPage() {
  const router = useRouter();
  const { data: configData, isSuccess } = useConfigData(router.query.configId as string);

  const { user } = useAuth();

  if (isSuccess && !configData) router.back();

  return (
    isSuccess &&
    !!configData && (
      <Container size="xl" px={0}>
        <Stack>
          <PageHeader
            title={isSuccess ? configData.title : ''}
            addBack
            rightSection={
              isSuccess &&
              user &&
              configData.author.id === user.id && (
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
              <Grid.Col span="auto">
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
              <Grid.Col xs={3} sm={2}>
                <Tabs defaultValue="info">
                  <Block>
                    <Tabs.List>
                      <Tabs.Tab value="info">Информация</Tabs.Tab>
                      <Tabs.Tab value="comments">Комментарии</Tabs.Tab>
                    </Tabs.List>
                  </Block>
                  <Tabs.Panel value="info" mt="xs">
                    <Stack>
                      <Block>
                        <Text>{isSuccess && configData.description}</Text>
                      </Block>
                      <Stack>
                        {isSuccess &&
                          configData.components.map((c) => (
                            <ComponentRow key={c.id} component={c.component.data} />
                          ))}
                      </Stack>
                    </Stack>
                  </Tabs.Panel>
                  <Tabs.Panel value="comments" mt="xs">
                    <Comments configId={router.query.configId as string} />
                  </Tabs.Panel>
                </Tabs>
              </Grid.Col>
            </Grid>
          </Box>
        </Stack>
      </Container>
    )
  );
}
