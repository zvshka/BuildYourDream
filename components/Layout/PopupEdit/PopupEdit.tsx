import { Box, Input, Popover, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { getHotkeyHandler } from '@mantine/hooks';

export const PopupEdit = (props: any) => {
  const [value, setValue] = useState<string>('Hello');
  const [unsaved, setUnsaved] = useState<string>(value);
  const [opened, setOpened] = useState(false);

  const handleSave = () => {
    setValue(unsaved);
    setOpened(false);
  };

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
            <Text onClick={() => setOpened(true)}>{value}</Text>
          </Box>
        </Popover.Target>
        <Popover.Dropdown>
          <TextInput
            onKeyDown={getHotkeyHandler([['Enter', handleSave]])}
            value={unsaved}
            onChange={(event) => setUnsaved(event.currentTarget.value)}
          />
        </Popover.Dropdown>
      </Popover>
    </Input.Wrapper>
  );
};
