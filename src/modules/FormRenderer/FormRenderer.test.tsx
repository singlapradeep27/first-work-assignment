import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider } from '../../context/FormContext';
import FormRenderer from './FormRenderer';
import { useService } from '../../services/formService';

jest.mock('../../services/formService');

const mockGetFields = useService().getFields as jest.Mock;

describe('FormRenderer', () => {
	beforeEach(() => {
		mockGetFields.mockResolvedValue([
			{ id: 'name', label: 'Name', type: 'text', defaultValue: '' },
			{ id: 'age', label: 'Age', type: 'number', defaultValue: 0 }
		]);
	});

	it('renders form fields', async () => {
		render(
			<FormProvider>
				<FormRenderer />
			</FormProvider>
		);

		expect(await screen.findByLabelText('Name')).toBeInTheDocument();
		expect(await screen.findByLabelText('Age')).toBeInTheDocument();
	});

	it('validates form on submit', async () => {
		render(
			<FormProvider>
				<FormRenderer />
			</FormProvider>
		);

		fireEvent.click(await screen.findByText('Submit'));

		expect(await screen.findByText('Name is required')).toBeInTheDocument();
		expect(await screen.findByText('Age is required')).toBeInTheDocument();
	});

	it('submits form with correct values', async () => {
		render(
			<FormProvider>
				<FormRenderer />
			</FormProvider>
		);

		fireEvent.change(await screen.findByLabelText('Name'), { target: { value: 'John' } });
		fireEvent.change(await screen.findByLabelText('Age'), { target: { value: 30 } });

		fireEvent.click(await screen.findByText('Submit'));

		expect(window.alert).toHaveBeenCalledWith(['Name : John', 'Age : 30']);
	});
});
