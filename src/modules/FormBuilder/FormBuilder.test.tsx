import React, { ReactElement, JSXElementConstructor } from 'react';
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormProvider } from '../../context/FormContext';
import FormBuilder from './FormBuilder';
import { useService } from '../../services/formService';

jest.mock('../../services/formService');

const mockGetFields = useService().getFields as jest.Mock;
const mockDeleteField = useService().deleteField as jest.Mock;

describe('FormBuilder', () => {
    const renderWithProvider = (component: ReactElement<any, string | JSXElementConstructor<any>>): RenderResult => {
        return render(
            <FormProvider>
                {component}
            </FormProvider>
        );
    };

	beforeEach(() => {
		mockGetFields.mockResolvedValue([
			{ id: '1', label: 'Field 1', type: 'text' },
			{ id: '2', label: 'Field 2', type: 'text' }
		]);
	});

	it('renders form fields', async () => {
		renderWithProvider(<FormBuilder />);

		const field1 = await screen.findByText('Field 1');
		const field2 = await screen.findByText('Field 2');
		
		expect(field1).toBeInTheDocument();
		expect(field2).toBeInTheDocument();
	});

	it('adds a new field', async () => {
		renderWithProvider(<FormBuilder />);

		fireEvent.click(await screen.findByText('Add Question'));

		expect(await screen.findByText('')).toBeInTheDocument();
	});

	it('removes a field', async () => {
		renderWithProvider(<FormBuilder />);

		fireEvent.click(await screen.findByText('Remove'));

		expect(await screen.findByText('Confirm Delete')).toBeInTheDocument();
	});
});
