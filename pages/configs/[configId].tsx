import {
  ActionIcon,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Image,
  MediaQuery,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { IconPencil } from '@tabler/icons-react';
import { Block, PageHeader } from '../../components/Layout';
import { useConfigData } from '../../components/hooks/configs';
import { ComponentRow } from '../../components/Layout/general/ComponentRow/ComponentRow';
import { useAuth } from '../../components/Providers/AuthContext/AuthWrapper';
import { Comments } from '../../components/Layout/specific/Comments/Comments';

export default function ConfigPage() {
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
          <Grid columns={3}>
            <Grid.Col span="auto">
              <Stack>
                <Block>
                  <Image
                    styles={{
                      image: {
                        position: 'absolute',
                      },
                      imageWrapper: {
                        '&::after': {
                          content: "''",
                          display: 'block',
                          paddingBottom: '100%',
                        },
                      },
                    }}
                    width="100%"
                    height="100%"
                    src={configData.author.avatarUrl}
                    alt="avatar"
                    withPlaceholder
                  />
                </Block>
                <Block>
                  <Center>
                    <Title order={3}>{configData.author.username}</Title>
                  </Center>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Примерная цена:
                    </Text>
                    <Text size={20}>{configData.price.join(' - ')} Руб.</Text>
                  </Stack>
                </Block>
                <Block>
                  <Stack align="center">
                    <Text weight={700} size={16}>
                      Наша оценка
                    </Text>
                    <Text size={20}>{configData.configTier}</Text>
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
        </Stack>
      </Container>
    )
  );
}
