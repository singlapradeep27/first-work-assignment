import React from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TextInput from "../atoms/TextInput/TextInput";
import { v4 as uuidv4 } from "uuid";
import { Option } from '../../types/formField';
import SortableItem from "../atoms/Dnd/SortableItem/SortableItem";
import DndWrapper from "../atoms/Dnd/DndWrapper";
import CloseIcon from "@mui/icons-material/Close";
import './OptionEditor.css';

interface OptionEditorProps {
  options: Option[];
  onOptionsChange: (options: Option[]) => void;
}

const OptionEditor: React.FC<OptionEditorProps> = ({ options = [], onOptionsChange }) => {

  const handleDelete = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onOptionsChange(updatedOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((opt, i) =>
      i === index ? { ...opt, label: value } : opt
    );
    onOptionsChange(updatedOptions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...options, { value: uuidv4(), label: "" }];
    onOptionsChange(updatedOptions);
  };
  const handleOtherOption = () => {
    const updatedOptions = [...options, { value: uuidv4(), label: "Other" }];
    onOptionsChange(updatedOptions);
  };

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <DndWrapper items={options} idKey="value" onDragEnd={onOptionsChange}>

        {options.map((option, index) => (
          <SortableItem key={option.value} id={option.value}
            dragHandle={
              <IconButton className="drag-handle">
                <DragIndicatorIcon />
              </IconButton>
            }
          >
            <Box
              className="option-container"
            >
              {/* <IconButton
                className="drag-handle"
                data-drag-handle
                tabIndex={-1}
              >
                <DragIndicatorIcon />
              </IconButton> */}
              <RadioButtonUncheckedIcon color="disabled" />
              <TextInput
                fullWidth
                label=''
                variant='standard'
                value={option.label}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <IconButton
                onClick={() => handleDelete(index)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </SortableItem>
        ))}
      </DndWrapper>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Button variant="text" onClick={handleAddOption} sx={{ textTransform: "none" }}>
          Add option
        </Button>
      </Box>
    </Box >
  );
};

export default OptionEditor;



