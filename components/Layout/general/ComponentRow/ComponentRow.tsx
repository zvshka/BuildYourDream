import { Box, createStyles, Group, Image, Text, Title } from '@mantine/core';
import React from 'react';
import { IComponentBody } from '../../../../types/Template';
import { Block } from '../Block/Block';

const useStyles = createStyles((theme) => ({
  wrapper: {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows.xl,
    },
  },
}));

export const ComponentRow = ({ component }: { component: IComponentBody }) => {
  const { classes } = useStyles();

  return (
    <Block className={classes.wrapper}>
      <Group align="normal">
        <Image
          withPlaceholder
          radius="sm"
          width={256 / 1.5}
          height={256 / 1.5}
          {...(component.image && component.image.url
            ? { src: `${component.image.url}?quality=60` }
            : {})}
        />
        <Box>
          <Title order={3}>{component['Название']}</Title>
          <Text>
            Примерная цена: {component['Цена'][0]} - {component['Цена'][1]} Руб.
          </Text>
          <Text>Tier компонента: {component.tier.toUpperCase()}</Text>
        </Box>
      </Group>
    </Block>
  );
};
