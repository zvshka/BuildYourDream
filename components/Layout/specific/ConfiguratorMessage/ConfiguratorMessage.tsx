import { Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconCircleCheck, IconCircleX, IconExclamationCircle } from '@tabler/icons-react';
import React from 'react';
import { Block } from '../../general/Block/Block';

const Message = ({ title, description, color, Icon }) => (
  <Block
    sx={{
      outline: `1px solid ${color}`,
      flex: '0 0 auto',
    }}
  >
    <Group>
      <Icon color={color} size={36} />
      <Stack spacing={0}>
        <Text weight={600}>{title}</Text>
        <Text>{description}</Text>
      </Stack>
    </Group>
  </Block>
);

export const ErrorMessage = ({ title, description }) => {
  const theme = useMantineTheme();
  return (
    <Message
      title={title}
      description={description}
      color={theme.colors.red[5]}
      Icon={IconCircleX}
    />
  );
};

export const WarnMessage = ({ title, description }) => {
  const theme = useMantineTheme();
  return (
    <Message
      title={title}
      description={description}
      color={theme.colors.orange[5]}
      Icon={IconExclamationCircle}
    />
  );
};

export const SuccessMessage = ({ title, description }) => {
  const theme = useMantineTheme();
  return (
    <Message
      title={title}
      description={description}
      color={theme.colors.green[5]}
      Icon={IconCircleCheck}
    />
  );
};
