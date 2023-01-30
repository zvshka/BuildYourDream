import { Box, Group, Image, Text, Title } from '@mantine/core';
import React from 'react';

export const ComponentRow = ({ component }) => (
  <Group align="normal">
    <Image
      withPlaceholder
      radius="sm"
      width={256 / 1.5}
      height={256 / 1.5}
      {...(component.data.image ? { src: `${component.data.image.url}?quality=60` } : {})}
    />
    <Box>
      <Title order={3}>{component.data['Название']}</Title>
      <Text>
        Примерная цена: {component.data['Цена'][0]} - {component.data['Цена'][1]} Руб.
      </Text>
      <Text>
        Tier компонента:{' '}
        {component.data.tier === 0 ? 'Low' : component.data.tier === 50 ? 'Medium' : 'High'}
      </Text>
    </Box>
  </Group>
);
