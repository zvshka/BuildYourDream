import { useRouter } from 'next/router';
import { Center, Container, Grid, Image, Stack, Tabs, Text, Textarea, Title } from '@mantine/core';
import { useUserData } from '../../components/hooks/users';
import { Block } from '../../components/Layout';

export default function UserProfile() {
  const router = useRouter();
  const { data: userData, isSuccess } = useUserData(router.query.username as string);

  return (
    <Container size="xl" px={0}>
      <Grid>
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
                src={isSuccess && userData.avatarUrl}
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
                <Text>{isSuccess && userData.role}</Text>
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
          </Tabs>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
