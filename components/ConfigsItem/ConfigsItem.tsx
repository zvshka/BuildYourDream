import { Box, createStyles, Group, Image, Paper, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  image: {
    width: 96,
    borderRadius: theme.radius.sm,
  },
  wrapper: {
    borderRadius: theme.radius.sm,
    transition: 'all .4s',
    '&:hover': {
      boxShadow: theme.shadows.xl,
    },
  },
}));

export const ConfigsItem = () => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.wrapper}>
      <Group>
        <Box className={classes.image}>
          <Image
            radius="sm"
            src="https://cdn.discordapp.com/avatars/263349725099458566/18993e33fb027e11af9d826d74b37fab.png?size=4096"
          />
        </Box>
        <Box>
          <Box>
            <Text>
              <b>Название сборки</b>
            </Text>
            <Text>Описание сборки</Text>
          </Box>
          <Box />
        </Box>
      </Group>
    </Paper>
  );
};
