import { Group, Image, Stack, Text, Box, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  image: {
    height: 128,
    width: 128,
  },
}));

export const ConfigsItem = ({ data }: any) => {
  const { classes } = useStyles();
  return (
    <Group>
      <Box className={classes.image}>
        <Image
          src={
            'https://cdn.discordapp.com/avatars/263349725099458566/18993e33fb027e11af9d826d74b37fab.png?size=4096'
          }
        />
      </Box>
      <Stack>
        <Text>Title</Text>
        <Text>Description</Text>
      </Stack>
    </Group>
  );
};
