import { Paper } from '@mantine/core';
import React from 'react';

export const Block = ({ children, ...props }) => (
  <Paper shadow="xl" p="md" {...props}>
    {children}
  </Paper>
);
