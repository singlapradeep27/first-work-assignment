// Define the FieldType enum, Initial supported types are text, number, select
export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  CHECKBOX = "checkbox",
}

export interface Option {
  label: string;
  value: string;
}

export type ValidationRule = Record<string, any>;

// Define the Field interface
export interface BasicFormField {
  id?: string;
  type?: FieldType;
  label: string;
  key: string;
  helperText?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  name?: string;
  hidden?: boolean;
  validationRule?: ValidationRule;
}

export interface SelectField extends BasicFormField {
  options?: Option[];
  isMultiSelect?: boolean;
}

export interface TextField extends BasicFormField {
  multiline?: boolean;
}

export type FormField = BasicFormField | TextField | SelectField;
