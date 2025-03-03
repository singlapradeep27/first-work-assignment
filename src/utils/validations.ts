import { FieldType, FormField, SelectField } from '../types/formField';




export function validateForm(fields: FormField[], formData: Record<string, any>): Record<string, string> {
	const errors: Record<string, string> = {};
	fields.forEach((field) => {
		const id = field.id || field.name;
		const rule = field['validationRule'];
		let value = formData[id];
		if (field.required && (typeof value === 'undefined' || !value?.length)) errors[id] = `${field.label} is required`;
		if (field.type === FieldType.TEXT) {
			if (rule?.['minLength'] && value?.length < rule?.['minLength']) {
				errors[id] = `Minimum length is ${rule?.['minLength']}`;
			}
			if (rule?.['maxLength'] && value?.length > rule?.['maxLength']) {
				errors[id] = `Maximum length is ${rule?.['maxLength']}`;
			}
		} else if (field.type === FieldType.NUMBER) {
			value = Number(value);
			if (rule?.['min'] !== undefined && value < rule?.['min']) {
				errors[id] = `Value must be at least ${rule?.['min']}`;
			}
			if (rule?.['max'] !== undefined && value > rule?.['max']) {
				errors[id] = `Value must be at most ${rule?.['max']}`;
			}
		}
	});

	if (formData.type === FieldType.SELECT && validateSelectField(formData as SelectField)) {
		errors[formData.id] = 'Minimum one option is required';
	}

	if (formData.type === FieldType.NUMBER) {
		const error = validateNumberField(formData as FormField)
		if (error)
			errors[formData.id] = error;
	}

	if (formData.type === FieldType.TEXT) {
		const error = validateTextField(formData as FormField)
		if (error)
			errors[formData.id] = error;
	}

	return errors;
}


export const validateSelectField = (field: SelectField) => {
	// Validate options for select field
	return (!field.options || field.options.length === 0 || !field.options.filter((option) => option.value).length)

};

export const validateNumberField = (field: FormField) => {

	const rule = field['validationRule'];

	if (rule?.['max'] !== undefined && rule?.['min'] !== undefined) {
		if (Number(rule?.['max']) < Number(rule?.['min'])) {
			return "Min value cannot be greater than max value";
		};
	}
	if (rule?.['min'] !== undefined && field?.defaultValue !== undefined) {
		if (Number(field?.defaultValue) < Number(rule?.['min'])) return "Default value cannot be lesser than min value";
	}
	if (rule?.['max'] !== undefined && field?.defaultValue !== undefined) {
		if (Number(field?.defaultValue) > Number(rule?.['max'])) return "Default value cannot be greater than max value";
	}
	return '';
};

export const validateTextField = (field: FormField) => {

	const rule = field['validationRule'];

	if (rule?.['maxLength'] !== undefined && rule?.['minLength'] !== undefined) {
		if (Number(rule?.['maxLength']) < Number(rule?.['minLength'])) {
			return "Min value cannot be greater than max value";
		};
	}
	if (rule?.['minLength'] !== undefined && field?.defaultValue !== undefined) {
		if ((field?.defaultValue as string)?.length < Number(rule?.['minLength'])) return "Default value length cannot be lesser than min value";
	}
	if (rule?.['max'] !== undefined && field?.defaultValue !== undefined) {
		if ((field?.defaultValue as string).length > Number(rule?.['maxLength'])) return "Default value length cannot be greater than max value";
	}
	return '';
};