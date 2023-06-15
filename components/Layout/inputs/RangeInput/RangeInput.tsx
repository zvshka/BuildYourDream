import { Group, Input, NumberInput } from '@mantine/core';
import { useEffect, useState } from 'react';

export const RangeInput = ({
  label,
  required,
  value = [0, 0],
  onChange,
}: {
  label?: string;
  required?: boolean;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}) => {
  const [currentFrom, setFrom] = useState(value[0]);
  const [currentTo, setTo] = useState(value[1]);

  const handleChangeFrom = (val: number) => {
    setFrom(val || 0);

    if (val > currentTo) {
      setTo(val);
    }
  };

  const handleChangeTo = (val: number) => {
    setTo(val || currentFrom);
  };

  useEffect(() => {
    onChange && onChange([currentFrom, currentTo]);
  }, [currentFrom, currentTo]);

  return (
    <Input.Wrapper label={label} required={required}>
      <Group grow>
        <NumberInput
          min={0}
          value={currentFrom}
          placeholder="От"
          required={required}
          onChange={handleChangeFrom}
        />
        <NumberInput
          value={currentTo}
          min={currentFrom}
          placeholder="До"
          required={required}
          onChange={handleChangeTo}
        />
      </Group>
    </Input.Wrapper>
  );
};
