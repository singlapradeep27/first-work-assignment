import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider } from '../../context/FormContext';
import FormBuilder from './FormBuilder';
import { useService } from '../../services/formService';

jest.mock('../../services/formService');

const mockGetFields = useService().getFields as jest.Mock;
const mockDeleteField = useService().deleteField as jest.Mock;

describe('FormBuilder', () => {
	beforeEach(() => {
		mockGetFields.mockResolvedValue([
			{ id: '1', label: 'Field 1', type: 'text' },
			{ id: '2', label: 'Field 2', type: 'text' }
		]);
	});

	it('renders form fields', async () => {
		render(
			<FormProvider>
				<FormBuilder />
			</FormProvider>
		);

		expect(await screen.findByText('Field 1')).toBeInTheDocument();
		expect(await screen.findByText('Field 2')).toBeInTheDocument();
	});

	it('adds a new field', async () => {
		render(
			<FormProvider>
				<FormBuilder />
			</FormProvider>
		);

		fireEvent.click(await screen.findByText('Add Question'));

		expect(await screen.findByText('')).toBeInTheDocument();
	});

	it('removes a field', async () => {
		render(
			<FormProvider>
				<FormBuilder />
			</FormProvider>
		);

		fireEvent.click(await screen.findByText('Remove'));

		expect(await screen.findByText('Confirm Delete')).toBeInTheDocument();
	});
});
