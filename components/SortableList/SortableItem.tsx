import React, { createContext, CSSProperties, PropsWithChildren, useContext, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons';
import { Block } from '../Layout';

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;

  ref(node: HTMLElement | null): void;
}

interface ItemProps {
  id: UniqueIdentifier;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <ActionIcon {...attributes} {...listeners} ref={ref}>
      <IconDotsVertical />
    </ActionIcon>
  );
}

export function SortableItem({ children, id }: PropsWithChildren<ItemProps>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <Block ref={setNodeRef} style={style}>
        {children}
      </Block>
    </SortableItemContext.Provider>
  );
}
