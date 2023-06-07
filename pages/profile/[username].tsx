import { useRouter } from 'next/router';
import { Center, Container, Grid, Image, Stack, Tabs, Text, Textarea, Title } from '@mantine/core';
import { useUserData } from '../../components/hooks/users';
import { Block, ComponentsList, PageHeader } from '../../components/Layout';
import { ConfigsList } from '../../components/Layout/specific/ConfigsList';
import { ViolationsList } from '../../components/Layout/specific/ViolationsList/ViolationsList';
import { ReviewsList } from '../../components/Layout/specific/ReviewsList/ReviewsList';

export default function UserProfile() {
  const router = useRouter();
  const { data: userData, isSuccess } = useUserData(router.query.username as string);

  return (
    <Container size="xl" px={0}>
      <PageHeader title="Профиль пользователя" addBack />
      <Grid mt="sm">
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
                src={isSuccess && userData.avatarUrl ? userData.avatarUrl : undefined}
                alt="avatar"
                withPlaceholder
              />
            </Block>
            <Block>
              <Center>
                <Title order={3}>{isSuccess && userData.username}</Title>
              </Center>
            </Block>
            <Block>
              <Center>
                <Text>
                  {userData?.role === 'ADMIN'
                    ? 'Администратор'
                    : userData?.role === 'MODERATOR'
                    ? 'Модератор'
                    : 'Пользователь'}
                </Text>
              </Center>
            </Block>
          </Stack>
        </Grid.Col>
        <Grid.Col sm={8}>
          <Tabs variant="pills" defaultValue="info">
            <Block>
              <Tabs.List>
                <Tabs.Tab value="info">Информация о пользователе</Tabs.Tab>
                <Tabs.Tab value="configs">Сборки пользователя</Tabs.Tab>
                <Tabs.Tab value="components">Компоненты пользователя</Tabs.Tab>
                <Tabs.Tab value="warns">История нарушений</Tabs.Tab>
              </Tabs.List>
            </Block>
            <Tabs.Panel value="info" mt="md">
              <Stack>
                <Block>
                  <Textarea
                    minRows={7}
                    label="Биография"
                    readOnly
                    value={isSuccess && userData.bio ? userData.bio : ''}
                  />
                </Block>
                <Block h={200}>
                  <Center h="100%">
                    <Title order={3}>Сборка {isSuccess && userData.username}</Title>
                  </Center>
                </Block>
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="configs" mt="md">
              <ConfigsList username={router.query.username as string} />
            </Tabs.Panel>
            <Tabs.Panel value="components" mt="md">
              <ComponentsList username={router.query.username as string} />
            </Tabs.Panel>
            <Tabs.Panel value="warns" mt="md">
              <ViolationsList username={router.query.username as string} />
            </Tabs.Panel>
            <Tabs.Panel value="reviews" mt="md">
              <ReviewsList username={router.query.username as string} />
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
