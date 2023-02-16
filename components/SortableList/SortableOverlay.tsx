import React, { PropsWithChildren } from 'react';
import { defaultDropAnimationSideEffects, DragOverlay, DropAnimation } from '@dnd-kit/core';

interface Props {}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export function SortableOverlay({ children }: PropsWithChildren<Props>) {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
}
