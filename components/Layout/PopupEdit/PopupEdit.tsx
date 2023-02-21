import { Box, Input, Popover, Text } from '@mantine/core';
import React, { useRef, useState } from 'react';
import { useEventListener, useMergedRef } from '@mantine/hooks';

export const PopupEdit = ({ children }: { children?: any }) => {
  const [currentValue, setCurrentValue] = useState<string>('Hello');
  const [unsaved, setUnsaved] = useState<string>();
  const [opened, setOpened] = useState(false);
  const onChangeRef = useEventListener('change', (value) => console.log(value));
  const baseRef = useRef<HTMLInputElement>(null);

  const mergedRef = useMergedRef(baseRef, onChangeRef);
  return (
    <Input.Wrapper>
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Box sx={{ maxWidth: 200 }}>
            <Text onClick={() => setOpened(true)}>{baseRef.current?.value || 'No data'}</Text>
          </Box>
        </Popover.Target>
        <Popover.Dropdown>
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              ref: mergedRef,
            })
          )}
        </Popover.Dropdown>
      </Popover>
    </Input.Wrapper>
  );
};
