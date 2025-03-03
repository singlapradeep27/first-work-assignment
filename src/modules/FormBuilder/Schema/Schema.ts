import { FieldType, Option } from "../../../types/formField";

const schema = {
  formId: "questions-first-work",
  formTitle: "Question",
  fields: {
    label: {
      name: "label",
      label: "Question Title",
      type: FieldType.TEXT,
      required: true,
      hidden: false,
      validationRule: {
        minLength: 3,
      },
    },

    placeholder: {
      name: "placeholder",
      label: "Question Placeholder",
      type: FieldType.TEXT,
      required: false,
      hidden: false,
    },
    type: {
      name: "type",
      label: "Question Type",
      type: FieldType.SELECT,
      options: Object.keys(FieldType).reduce((acc: Option[], key) => {
        const fieldKey = key as keyof typeof FieldType;
        acc.push({
          label: FieldType[fieldKey] as string,
          value: FieldType[fieldKey],
        });
        return acc;
      }, []),
      required: true,
      hidden: false,
      numberType: "years",
    },
    helperText: {
      name: "helperText",
      label: "Helper Text",
      type: FieldType.TEXT,
      required: false,
      hidden: false,
    },
    defaultValue: {
      name: "defaultValue",
      label: "Default value",
      type: FieldType.TEXT,
      required: false,
      hidden: false,
    },
    multiline: {
      name: "multiline",
      label: "Is paragraph",
      type: FieldType.CHECKBOX,
      required: false,
      hidden: false,
    },
    required: {
      name: "required",
      label: "Required",
      type: FieldType.CHECKBOX,
      required: false,
      hidden: false,
    },
    hidden: {
      name: "hidden",
      label: "Hidden",
      type: FieldType.CHECKBOX,
      required: false,
      hidden: false,
    },
    "validationRule.min": {
      name: "validationRule.min",
      label: "Min",
      type: FieldType.NUMBER,
      required: false,
      hidden: false,
    },
    "validationRule.max": {
      name: "validationRule.max",
      label: "Max",
      type: FieldType.NUMBER,
      required: false,
      hidden: false,
    },
    "validationRule.minLength": {
      name: "validationRule.minLength",
      label: "Min Length",
      type: FieldType.NUMBER,
      required: false,
      hidden: false,
    },
    "validationRule.maxLength": {
      name: "validationRule.maxLength",
      label: "Max Length",
      type: FieldType.NUMBER,
      required: false,
      hidden: false,
    },
  },
};

const baseInputFields: string[] = [
  "label",
  "type",
  "required",
  "hidden",
  "helperText",
];
const textInputFields: string[] = [
  "defaultValue",
  "multiline",
  "validationRule.minLength",
  "validationRule.maxLength",
];
const selectInputFields: string[] = [];
const numberInputFields: string[] = [
  "defaultValue",
  "validationRule.min",
  "validationRule.max",
];

export {
  schema,
  baseInputFields,
  textInputFields,
  selectInputFields,
  numberInputFields,
};
