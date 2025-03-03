
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { FieldType, Option, FormField, SelectField, TextField } from '../../../types/formField';
import { schema, baseInputFields, textInputFields, selectInputFields, numberInputFields } from '../Schema/Schema';
import TextInput from '../../../components/atoms/TextInput/TextInput';
import OptionEditor from '../../../components/OptionEditor/OptionEditor';
import './FieldItem.css';
import { validateForm } from "../../../utils/validations";
import { useService } from "../../../services/formService";
import { useFormContext } from "../../../context/FormContext"
import { set, get, debounce } from "lodash";
import { IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Tooltip } from "@mui/material";

interface FieldItemProps {
	fieldData: FormField;
	removeField: (id: string) => void;
}

export default function FieldItem({ fieldData, removeField }: FieldItemProps) {

	const [errors, setErrors] = useState<{ [key: string]: any }>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
	const { state, dispatch } = useFormContext();
	const { upsertField, deleteField } = useService();

	// Make Schema
	const fieldSchema = useMemo(() => {
		return {
			baseFields: baseInputFields.map((field) => schema.fields[field]),
			[FieldType.TEXT]: textInputFields.map((field) => {
				if (field === 'defaultValue') {
					return {
						...schema.fields[field],
						type: FieldType.TEXT,
					}
				}
				return schema.fields[field];
			}),
			[FieldType.NUMBER]: numberInputFields.map((field) => {
				if (field === 'defaultValue') {
					return {
						...schema.fields[field],
						type: FieldType.NUMBER,
					}
				}
				return schema.fields[field];
			}),
			[FieldType.SELECT]: selectInputFields.map((field) => schema.fields[field])
		}
	}, []);

	// First Validate then store
	const autoSave = useCallback(debounce(async (field: FormField) => {
		const id = field.id;
		if (id.includes('UI')) {
			delete field.id;
		}
		try {
			setIsSaving(true);
			const udpateFiled = await upsertField(field);
			dispatch({
				type: "UPDATE_FIELD", payload: {
					id,
					field: udpateFiled
				}
			});
		} catch (e) {
			console.log(e);
			// handle error here
		} finally {
			setIsSaving(false);
		}

	}, 1000), []);

	const updateField = (field: FormField) => {
		const id = field.id;
		dispatch({
			type: "UPDATE_FIELD", payload: {
				field,
				id,
			}
		});
	};

	useEffect(() => {
		const errors = validateForm(fieldSchema['baseFields'].concat(fieldSchema[fieldData.type] || []), fieldData);
		setErrors(errors);
		if (Object.keys(errors).length !== 0) return;
		autoSave(fieldData);
	}, [fieldData]);


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		if (name === 'type' && value === FieldType.CHECKBOX) {
			alert('Not handled yet, please select another value');
			return;
		}
		const updatedField = set(fieldData, name, value);
		updateField({ ...updatedField });
	};

	const handleCheckboxChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedField = set(fieldData, id, e.target.checked);
		updateField({ ...updatedField });
	};

	const handleSelectOptionChange = (options: Option[]) => {
		updateField({
			...fieldData,
			options,
		});
	};

	const renderFieldComponent = (field: FormField) => {
		switch (field?.type) {
			case FieldType.TEXT:
			case FieldType.NUMBER:
			case FieldType.SELECT:
				return (
					<TextInput
						type={field.type}
						label={field.label}
						error={!!errors?.[field.name || field.id]}
						value={get(fieldData, field.name, '')}
						onChange={handleInputChange}
						required={field.required}
						name={field.name || field.id}
						id={field.name || field.id}
						options={(field as SelectField).options}
						helperText={errors?.[field.name || field.id]}
					/>
				);
			case FieldType.CHECKBOX:
				return (
					<FormControlLabel
						control={
							<Checkbox
								name=''
								checked={get(fieldData, field.name, false)}
								onChange={(event) => handleCheckboxChange(field.name, event)}
							/>
						}
						label={field.label}
					/>
				);

			default:
				return null;
		}
	};

	const toggleCollapse = () => {
		setIsCollapsed((isCollapsed) => !isCollapsed);
	};

	const renderCollapseComponent = () => {
		return <div className='field-item-collapse'>
			<Typography variant="body1" gutterBottom className='collapse_label'>
				{fieldData.label}
			</Typography>
			{isCollapsed && <IconButton onClick={() => removeField(fieldData.id)} color="error">
				<DeleteIcon />
			</IconButton>}
			<IconButton onClick={toggleCollapse}>
				{isCollapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
			</IconButton>
		</div>

	}

	return (
		isCollapsed ? renderCollapseComponent() :
			<div className='field-item'>
				<div className='field-item__container'>
					<div className='text cell label' >
						{renderFieldComponent(fieldSchema['baseFields'][0])}
						<div className="field-item__actions">
							{
								(isSaving ?
									<CircularProgress size={20} color="primary" thickness={5} />
									: errors[fieldData?.id] ?
										<Tooltip title={errors[fieldData?.id]}>
											<ErrorOutlineIcon style={{ color: "red" }} />
										</Tooltip>
										: <CheckCircleIcon color="success" />)
							}
							<IconButton onClick={toggleCollapse}>
								<KeyboardArrowUpIcon />
							</IconButton>
						</div>
					</div>

					{fieldSchema['baseFields'].concat(fieldSchema[fieldData.type] || []).map((field: FormField, idx) => {
						if (idx === 0) return null;
						else return <div className={`${field.type} cell`} >{renderFieldComponent(field)}</div>
					}
					)}
				</div>
				{(fieldData.type === FieldType.SELECT ? <OptionEditor options={(fieldData as SelectField).options} onOptionsChange={handleSelectOptionChange} /> : null)}
			</div >
	);
};