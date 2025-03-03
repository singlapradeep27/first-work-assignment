import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import FieldItem from './FieldItem';
import '@testing-library/jest-dom';
import { FieldType, FormField } from '../../../types/formField';
import { FormProvider } from '../../../context/FormContext';

const mockField: FormField = {
    id: '1',
    type: FieldType.TEXT,
    label: 'Test Field',
    key: 'testFieldKey',
    required: true,
    name: 'testField',
    options: [],
};

const mockUpdateField = jest.fn();
const mockRemoveField = jest.fn();

const renderComponent = (field = mockField) => {
    return render(
        <FormProvider>
            <FieldItem fieldData={field} removeField={mockRemoveField} />
        </FormProvider>
    );
};

describe('FieldItem Component', () => {
    it('renders without crashing', () => {
        renderComponent();
        expect(screen.getByText('Test Field')).toBeInTheDocument();
    });

    it('calls updateField when input changes', () => {
        renderComponent();
        const input = screen.getByLabelText('Field title');
        fireEvent.change(input, { target: { value: 'Updated Field' } });
        expect(mockUpdateField).toHaveBeenCalled();
    });

    it('calls removeField when delete button is clicked', () => {
        renderComponent();
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(mockRemoveField).toHaveBeenCalled();
    });

    it('toggles collapse state when collapse button is clicked', () => {
        renderComponent();
        const collapseButton = screen.getByRole('button', { name: /collapse/i });
        fireEvent.click(collapseButton);
        expect(screen.queryByText('Test Field')).not.toBeInTheDocument();
    });

    it('renders the correct field component based on field type', () => {
        const textField = { ...mockField, type: FieldType.TEXT };
        const numberField = { ...mockField, type: FieldType.NUMBER };
        const selectField = { ...mockField, type: FieldType.SELECT };

        renderComponent(textField);
        expect(screen.getByLabelText('Field title')).toBeInTheDocument();

        renderComponent(numberField);
        expect(screen.getByLabelText('Min')).toBeInTheDocument();

        renderComponent(selectField);
        expect(screen.getByText('Add Option')).toBeInTheDocument();
    });
});

import { useService } from '../../../services/formService';

jest.mock('../../../services/formService');

const mockDeleteField = useService().deleteField as jest.Mock;

describe('FieldItem', () => {
    beforeEach(() => {
        mockDeleteField.mockResolvedValue(Promise.resolve() as never);
    });

    it('renders field item', async () => {
        const fieldData = { id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' };
        render(
            <FormProvider>
                <FieldItem fieldData={fieldData} removeField={jest.fn()} />
            </FormProvider>
        );

        expect(await screen.findByText('Field 1')).toBeInTheDocument();
    });

    it('removes field item', async () => {
        const fieldData = { id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' };
        const removeField = jest.fn();
        render(
            <FormProvider>
                <FieldItem fieldData={fieldData} removeField={removeField} />
            </FormProvider>
        );

        fireEvent.click(await screen.findByText('Remove'));

        expect(await screen.findByText('Confirm Delete')).toBeInTheDocument();
    });
});
