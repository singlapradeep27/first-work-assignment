import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React from "react";
import "./SortableItem.css";

interface SortableItemProps {
  id: string;
  children: React.ReactElement;
  dragHandle?: React.ReactElement;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  dragHandle,
}) => {
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
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {dragHandle ? (
        React.cloneElement(dragHandle, { ...attributes, ...listeners })
      ) : (
        <IconButton className="drag-handle" {...attributes} {...listeners}>
          <DragIndicatorIcon />
        </IconButton>
      )}
      {React.cloneElement(children, { style: { cursor: "default" } })}
    </div>
  );
};

export default SortableItem;
