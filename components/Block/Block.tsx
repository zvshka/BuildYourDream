import { Paper } from '@mantine/core';
import React, { FC, PropsWithChildren } from 'react';

export const Block: FC<PropsWithChildren<{ [key: string]: any }>> = ({
  children = null,
  ...props
}) => (
  <Paper shadow="xl" p="md" {...props}>
    {children}
  </Paper>
);
