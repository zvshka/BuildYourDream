import { Box, createStyles, Group, Image, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  avatar: {
    width: 128,
    borderRadius: theme.radius.sm,
  },
}));

export default function Profile() {
  const { classes } = useStyles();

  return (
    <>
      <Group>
        <Box className={classes.avatar}>
          <Image
            radius="sm"
            src="https://cdn.discordapp.com/avatars/263349725099458566/18993e33fb027e11af9d826d74b37fab.png?size=512"
            alt="avatar"
          />
        </Box>
        <Text>Чертилаgd</Text>
        <Text>Email</Text>
      </Group>
    </>
  );
}
