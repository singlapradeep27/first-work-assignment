import { FormField } from '../types/formField';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';

const STORAGE_KEY = 'form_questions';

export const useService = () => {

	const getFields = useCallback(async () => {
		return new Promise<FormField[]>((resolve, reject) => {
			// Reject if there is no data
			setTimeout(() => {
				try {
					const data = localStorage.getItem(STORAGE_KEY);
					const fields = data ? JSON.parse(data) : {};
					resolve(Object.values(fields) as FormField[]);
				} catch (error) {
					reject(error);
				}
			}, 500);
		});
	}, []);

	const upsertField = useCallback(async (field: FormField) => {
		return new Promise<FormField>((resolve, reject) => {
			// Reject if there is no data
			if (!field) {
				reject();
				return;
			}
			setTimeout(() => {
				try {
					const data = localStorage.getItem(STORAGE_KEY);
					const fields = data ? JSON.parse(data) : {};
					const fieldId = field.id || uuidv4();
					fields[fieldId] = field; // Add or update field
					field.id = fieldId;
					localStorage.setItem(STORAGE_KEY, JSON.stringify(fields)); //Save changes
					resolve(field);
				} catch (error) {
					reject(error);
				}
			}, 1000);
		});
	}, []);

	const deleteField = useCallback(async (fieldid: string) => {
		return new Promise<boolean>((resolve, reject) => {
			// Reject if there is no data
			if (!fieldid) {
				reject('Field id empty');
				return;
			}
			setTimeout(() => {
				try {
					const data = localStorage.getItem(STORAGE_KEY);
					const fields = data ? JSON.parse(data) : {};
					delete fields[fieldid]; // Remove field
					localStorage.setItem(STORAGE_KEY, JSON.stringify(fields)); // Save changes
					resolve(true);
				} catch (error) {
					reject(error);
				}
			}, 1000);
		});
	}, []);

	return { getFields, upsertField, deleteField };
}


