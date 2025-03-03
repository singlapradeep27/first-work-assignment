
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { FormField } from '../types/formField';

type State = {
    fields: FormField[];
};

type Action =
    | { type: 'SET_FIELDS'; payload: FormField[] }
    | { type: 'ADD_FIELD'; payload: FormField }
    | { type: 'UPDATE_FIELD'; payload: { field: FormField, id: string } }
    | { type: 'REMOVE_FIELD'; payload: string };

const initialState: State = { fields: [] };

export function formReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FIELDS':
            return { ...state, fields: action.payload };
        case 'ADD_FIELD':
            return { ...state, fields: [...state.fields, action.payload] };
        case 'UPDATE_FIELD':
            return {
                ...state,
                fields: state.fields.map((q: FormField) =>
                    q.id === action.payload.id ? action.payload.field : q
                ),
            };
        case 'REMOVE_FIELD':
            console.log('aaaa', state, action.payload)
            return {
                ...state,
                fields: state.fields.filter((q: FormField) => q.id !== action.payload),
            };
        default:
            return state;
    }
}

export const FormContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(formReducer, initialState);

    return <FormContext.Provider value={{ state, dispatch }}>{children}</FormContext.Provider>;
}

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error("useFormContext must be used within an FormProvider");
    return context;
};
