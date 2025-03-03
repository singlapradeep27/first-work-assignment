import { formReducer } from './FormContext';
import { FormField, FieldType } from '../types/formField';


describe('formReducer', () => {
    it('sets fields', () => {
        const initialState = { fields: [] };
        const fields: FormField[] = [{ id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' }];
        const action: { type: 'SET_FIELDS'; payload: FormField[] } = { type: 'SET_FIELDS', payload: fields };

        const newState = formReducer(initialState, action);

        expect(newState.fields).toEqual(fields);
    });

    it('adds a field', () => {
        const initialState = { fields: [] };
        const field: FormField = { id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' };
        const action: { type: 'ADD_FIELD'; payload: FormField } = { type: 'ADD_FIELD', payload: field };

        const newState = formReducer(initialState, action);

        expect(newState.fields).toContain(field);
    });

    it('updates a field', () => {
        const initialState = { fields: [{ id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' }] };
        const updatedField: FormField = { id: '1', label: 'Updated Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' };
        const action: { type: 'UPDATE_FIELD'; payload: { field: FormField; id: string } } = { type: 'UPDATE_FIELD', payload: { field: updatedField, id: '1' } };

        const newState = formReducer(initialState, action);

        expect(newState.fields).toContain(updatedField);
    });

    it('removes a field', () => {
        const initialState = { fields: [{ id: '1', label: 'Field 1', type: FieldType.TEXT, key: 'field1', name: 'field1' }] };
        const action: { type: 'REMOVE_FIELD'; payload: string } = { type: 'REMOVE_FIELD', payload: '1' };

        const newState = formReducer(initialState, action);

        expect(newState.fields).not.toContainEqual(expect.objectContaining({ id: '1' }));
    });
});
