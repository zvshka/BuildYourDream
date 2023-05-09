import { Paper } from '@mantine/core';
import React, { forwardRef } from 'react';

export const Block = forwardRef((props: any, ref) => (
  <Paper shadow="xl" p="md" {...props} ref={ref} radius={9}>
    {props?.children}
  </Paper>
));
