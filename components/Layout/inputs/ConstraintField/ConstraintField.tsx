import { Group, Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IComponentFieldValue, IConstraintFieldValue } from '../../../../types/Constraints';
import { Block } from '../../general/Block/Block';
import { ComponentField } from '../ComponentField/ComponentField';

export const ConstraintField = ({
  onChange,
  value,
}: {
  onChange?: any;
  value?: IConstraintFieldValue;
}) => {
  const [leftSide, setLeftSide] = useState<IComponentFieldValue>(value?.leftSide || {});
  const [rightSide, setRightSide] = useState<IComponentFieldValue>(value?.rightSide || {});
  const [constraint, setConstraint] = useState<string | null>(value?.constraint || '');

  useEffect(() => {
    onChange && onChange({ leftSide, rightSide, constraint });
  }, [leftSide, rightSide, constraint]);

  return (
    <Group>
      <ComponentField label="Первый компонент" value={leftSide} onChange={setLeftSide} />
      <Select
        label="Условие"
        defaultValue="EQUALS"
        data={[
          { label: 'Одно из', value: 'IN' },
          { label: 'Эквивалентно', value: 'EQUALS' },
        ]}
        value={constraint}
        onChange={setConstraint}
      />
      <ComponentField label="Второй компонент" value={rightSide} onChange={setRightSide} />
    </Group>
  );
};
