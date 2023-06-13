import {
  Box,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import React, { useState } from 'react';
import { useModals } from '@mantine/modals';
import { NextLink } from '../NextLink/NextLink';
import { useAuth } from '../../../Providers/AuthContext/AuthWrapper';
import { tabs } from '../../../../lib/tabs';

export const NavbarModal = () => {
  const { closeAll } = useModals();
  const { user } = useAuth();
  const [section, setSection] = useState<'userPages' | 'adminPages'>('userPages');
  const theme = useMantineTheme();

  return (
    <Stack>
      {user && user?.role !== 'USER' && (
        <SegmentedControl
          value={section}
          onChange={(value: 'userPages' | 'adminPages') => setSection(value)}
          transitionTimingFunction="ease"
          fullWidth
          data={[
            { label: 'User', value: 'userPages' },
            { label: 'Admin', value: 'adminPages' },
          ]}
          mb="lg"
        />
      )}
      <SimpleGrid cols={4}>
        {tabs[section].map((item) => (
          <Box
            style={{ textDecoration: 'none' }}
            component={NextLink}
            href={item.link}
            key={item.label}
          >
            <UnstyledButton
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.gray[2],
                aspectRatio: '1 / 1',
                height: '100%',
                borderRadius: theme.radius.md,
                transition: 'all ease 0.2s',
                ':hover': {
                  backgroundColor: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                  }).background,
                },
              }}
              onClick={() => closeAll()}
            >
              <Stack align="center" spacing="xs">
                <item.Icon size={36} color={theme.colors.blue[5]} />
                <Text align="center" weight={500} size={18}>
                  {item.label}
                </Text>
              </Stack>
            </UnstyledButton>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
};
