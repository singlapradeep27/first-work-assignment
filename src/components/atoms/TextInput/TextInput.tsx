import React from "react";
import TextField from "@mui/material/TextField";
import { FieldType, Option } from "../../../types/formField";
import MenuItem from "@mui/material/MenuItem";

interface TextInputProps {
  type?: FieldType;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  children?: React.ReactNode;
  [x: string]: any;
  options?: Option[];
}

const TextInput: React.FC<TextInputProps> = ({
  type = FieldType.TEXT,
  label,
  value,
  onChange,
  name,
  error,
  helperText,
  options,
  children,
  ...props
}) => {
  return (
    <TextField
      select={type === FieldType.SELECT}
      type={type}
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      variant="filled"
      fullWidth
      error={error}
      helperText={helperText}
      {...props}
    >
      {options
        ? options.map((option: Option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label || option.value}
            </MenuItem>
          ))
        : children}
    </TextField>
  );
};

export default TextInput;
