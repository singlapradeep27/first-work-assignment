import React, { useEffect, useState } from "react";
import { useFormContext } from "../../context/FormContext";
import { Button, Box } from "@mui/material";
import TextInput from "../../components/atoms/TextInput/TextInput";
import { validateForm } from "../../utils/validations";
import { SelectField } from "../../types/formField";
import BootStrap from "../../modules/BootStrap/BootStrap";
import "./FormRenderer.css"; // Import CSS file for styling

const FormRenderer: React.FC<{}> = () => {
	const { state } = useFormContext();
	const [formValues, setFormValues] = useState<Record<string, string | number>>(
		{},
	);
	const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

	useEffect(() => {
		const initialFormState = state.fields.reduce<
			Record<string, string | number>
		>((acc, field) => {
			acc[field.id!] = field.defaultValue || "";
			return acc;
		}, {});
		setFormValues(initialFormState);
	}, [state.fields]);

	const validate = () => {
		const errors = validateForm(state.fields, formValues);
		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		const labelValues = state.fields.reduce<string[]>((acc, field) => {
			acc.push(`${field.label} : ${formValues[field.id!]}`);
			return acc;
		}, []);
		alert(labelValues);
	};

	return (
		<Box component="form" onSubmit={handleSubmit} className="form-renderer">
			<h3>{state.fields.length ? 'Fill the values' : 'Build the form first'}</h3>
			{state.fields.map((field, index) => {
				const id = field.name || field.id;
				return (
					<Box key={id} mb={2}>
						<TextInput
							error={!!errors?.[id!]}
							helperText={errors?.[id!]}
							value={formValues[id!]}
							defaultValue={field.defaultValue}
							onChange={handleChange}
							name={field.id}
							options={(field as SelectField).options}
							{...field}
						/>
					</Box>
				);
			})}
			{state.fields.length ? <Button variant="contained" color="primary" type="submit">
				Submit
			</Button> : null}
			<BootStrap />
		</Box>
	);
};

export default FormRenderer;
