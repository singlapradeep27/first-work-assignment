import React, { useState } from 'react';
import { Box, IconButton, Button, debounce } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Option } from '../../types/formField';
import Typography from '@mui/material/Typography';
import TextInput from '../atoms/TextInput/TextInput'

interface OptionEditorProps {
	options: Option[];
	onOptionsChange: (options: Option[]) => void;
}

const OptionEditor: React.FC<OptionEditorProps> = ({ options = [], onOptionsChange }) => {

	const handleDelete = (index: number) => {
		const updatedOptions = options.filter((_, i) => i !== index);
		onOptionsChange(updatedOptions);
	};

	const handleOptionChange = (index: number, field: keyof Option, value: string) => {
		const updatedOptions = options.map((opt, i) => {
			if (i === index) {
				return { ...opt, [field]: value };
			}
			return opt;
		});
		onOptionsChange(updatedOptions);
	};

	const handleAddOption = () => {
		const updatedOptions = [...options, { value: '', label: '' }];
		onOptionsChange(updatedOptions);
	};

	return (
		<Box sx={{ width: '100%', mt: 1 }}>
			<Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
				Options:
			</Typography>
			{options.map((option, index) => (
				<Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<TextInput
						label="Value"
						value={option.value}
						onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
						sx={{ mr: 1 }}
					/>
					<TextInput
						label="Label"
						value={option.label}
						onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
						sx={{ mr: 1 }}
					/>
					<IconButton onClick={() => handleDelete(index)} color="error">
						<DeleteIcon />
					</IconButton>
				</Box>
			))}
			<Button variant="outlined" onClick={handleAddOption}>
				Add Option
			</Button>
		</Box>
	);
};

export default OptionEditor;
