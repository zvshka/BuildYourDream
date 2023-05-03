import { Container } from '@mantine/core';
import { Block } from './Block';

export default {
  title: 'Block',
};

export const Usage = () => (
  <Container pt="xl" style={{ backgroundColor: 'lightgrey', height: '100vh' }}>
    <Block>This a block</Block>
  </Container>
);
