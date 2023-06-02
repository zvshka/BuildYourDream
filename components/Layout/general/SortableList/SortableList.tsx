import React, { ReactNode, useMemo, useState } from 'react';
import {
  Active,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Stack } from '@mantine/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DragHandle, SortableItem } from './SortableItem';
import { SortableOverlay } from './SortableOverlay';

interface BaseItem {
  id: UniqueIdentifier;
}

interface ListProps<T extends BaseItem> {
  items: T[];

  onChange(items: T[]): void;

  renderItem(item: T, index?: number): ReactNode;
}

export function SortableList<T extends BaseItem>({ items, onChange, renderItem }: ListProps<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={({ active: currentItem }) => {
        setActive(currentItem);
      }}
      onDragEnd={({ active: currentItem, over }) => {
        if (over && currentItem.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === currentItem.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <Stack role="application">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>{renderItem(item, index)}</React.Fragment>
          ))}
        </Stack>
      </SortableContext>
      <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
