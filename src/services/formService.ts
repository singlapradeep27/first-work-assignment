import { FormField } from "../types/formField";
import { v4 as uuidv4 } from "uuid";
import { useCallback } from "react";

const STORAGE_KEY = "form_questions";

export const useService = () => {
  const getFields = useCallback(async () => {
    return new Promise<FormField[]>((resolve, reject) => {
      // Reject if there is no data
      setTimeout(() => {
        try {
          let fields;
          let data: any = localStorage.getItem(STORAGE_KEY);
          data = data ? JSON.parse(data) : { order: [] };
          if (data?.order) {
            fields = data.order.map((id: string) => data[id]);
          } else {
            fields = Object.values(data);
          }
          resolve(fields.filter(Boolean) as FormField[]);
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
          if (fields?.order?.indexOf(fieldId) === -1) {
            fields.order = fields.order.concat([fieldId]);
          } else if (fields?.order?.indexOf(fieldId) === undefined) {
            fields.order = Object.keys(fields);
          }
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
        reject("Field id empty");
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

  const updateFieldOrder = useCallback(async (fields: string[]) => {
    return new Promise<boolean>((resolve, reject) => {
      // Reject if there is no data
      if (!fields) {
        reject("Fields id are not provided");
        return;
      }
      setTimeout(() => {
        try {
          let data: any = localStorage.getItem(STORAGE_KEY);
          data = data ? JSON.parse(data) : { order: [] };
          data.order = fields;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // Save changes
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }, []);

  return { getFields, upsertField, deleteField, updateFieldOrder };
};
