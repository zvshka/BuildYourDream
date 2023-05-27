import { Box, Card, createStyles, Grid, Group, Image, MediaQuery, Text, Title } from '@mantine/core';
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
    <Box>
      {/*<MediaQuery styles={{ display: 'none' }} smallerThan="sm">*/}
      {/*  <Block className={classes.wrapper}>*/}
      {/*    <Grid>*/}
      {/*      <Grid.Col span="auto">*/}
      {/*        <Grid>*/}
      {/*          <Grid.Col span="content">*/}
      {/*            <Image*/}
      {/*              withPlaceholder*/}
      {/*              radius="sm"*/}
      {/*              width={240}*/}
      {/*              height={240}*/}
      {/*              {...(component.imageUrl && component.imageUrl.length > 0*/}
      {/*                ? { src: `${component.imageUrl}?quality=60` }*/}
      {/*                : {})}*/}
      {/*            />*/}
      {/*          </Grid.Col>*/}
      {/*          <Grid.Col span="auto">*/}
      {/*            <Box>*/}
      {/*              <Title order={2}>{component['Название']}</Title>*/}
      {/*              <Text>*/}
      {/*                Примерная цена: {component['Цена'][0]} - {component['Цена'][1]} Руб.*/}
      {/*              </Text>*/}
      {/*              <Text>Tier компонента: {component.tier.toUpperCase()}</Text>*/}
      {/*            </Box>*/}
      {/*          </Grid.Col>*/}
      {/*        </Grid>*/}
      {/*      </Grid.Col>*/}
      {/*      <Grid.Col span={12} sm="content">*/}
      {/*        {rightSide}*/}
      {/*      </Grid.Col>*/}
      {/*    </Grid>*/}
      {/*  </Block>*/}
      {/*</MediaQuery>*/}
      {/*<MediaQuery styles={{ display: 'none' }} largerThan="sm">*/}
        <Card sx={{ maxWidth: 400 }}>
          <Card.Section>
            <Image
              withPlaceholder
              radius="sm"
              height={240}
              {...(component.imageUrl && component.imageUrl.length > 0
                ? { src: `${component.imageUrl}?quality=60` }
                : {})}
            />
          </Card.Section>
          <Box>
            <Title order={2}>{component['Название']}</Title>
            <Text>
              Примерная цена: {component['Цена'][0]} - {component['Цена'][1]} Руб.
            </Text>
            <Text>Tier компонента: {component.tier.toUpperCase()}</Text>
          </Box>
        </Card>
      {/*</MediaQuery>*/}
    </Box>
  );
};
