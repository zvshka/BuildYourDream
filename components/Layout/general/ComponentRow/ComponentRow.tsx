import { Box, createStyles, Grid, Group, Image, Text, Title } from '@mantine/core';
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

export const ComponentRow = ({
  component,
  rightSide,
}: {
  component: IComponentBody;
  rightSide?: any;
}) => {
  const { classes } = useStyles();

  return (
    <Block className={classes.wrapper}>
      <Grid>
        <Grid.Col span="auto">
          <Group align="normal">
            <Image
              withPlaceholder
              radius="sm"
              width={256 / 1.5}
              height={256 / 1.5}
              {...(component.imageUrl && component.imageUrl.length > 0
                ? { src: `${component.imageUrl}?quality=60` }
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
        </Grid.Col>
        <Grid.Col span={12} sm="content">
          {rightSide}
        </Grid.Col>
      </Grid>
    </Block>
  );
};
