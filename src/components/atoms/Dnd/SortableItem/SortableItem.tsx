import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableItemProps {
  id: string;
  children: React.ReactElement;
  dragHandle?: React.ReactElement
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children, dragHandle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} >
      {dragHandle && React.cloneElement(dragHandle, { ...attributes, ...listeners })}
      {React.cloneElement(children, { style: { cursor: "default" } })}
    </div>
  );
};

export default SortableItem;



