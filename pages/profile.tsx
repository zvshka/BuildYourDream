import { Center, Container, createStyles, Grid, Image, Stack, Text, Title } from '@mantine/core';
import { useAuth } from '../components/Providers/AuthContext/AuthWrapper';
import { Block } from '../components/Layout';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  avatar: {
    width: 256,
    borderRadius: theme.radius.sm,
  },
}));

export default function Profile() {
  const { classes } = useStyles();
  const { user, isLoggingIn } = useAuth();
  const router = useRouter();

  return (
    <Container size="xl" px={0}>
      <Grid>
        <Grid.Col span="content">
          <Stack>
            <Block>
              <Image withPlaceholder height={350} width={350} />
            </Block>
            <Block>
              <Center>
                <Title order={3}>{user?.username}</Title>
              </Center>
            </Block>
            <Block>
              <Center>
                <Text>{user?.role}</Text>
              </Center>
            </Block>
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack>
            <Block></Block>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
