import React, { useState } from "react";
import FieldItem from "./FieldItem/FieldItem";
import { FormField } from "../../types/formField";
import { useService } from "../../services/formService";
import Button from "@mui/material/Button";
import "./FormBuilder.css"; // Import CSS file for styling
import { useFormContext } from "../../context/FormContext";
import { v4 as uuidv4 } from "uuid";
import BootStrap from "../../modules/BootStrap/BootStrap";
import ConfirmationDialog from "../../components/atoms/Dialog/ConfirmationDialog";
import FullScreenLoader from "../../components/atoms/FullScreenLoader/FullScreenLoader";

const FormBuilder: React.FC<{}> = () => {
	const { state, dispatch } = useFormContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { deleteField } = useService();
	const [removalableId, setRemovalableId] = useState<string>();

	const addField = () => {
		const newField: FormField = {
			label: "",
			key: "",
			id: `UI-${uuidv4()}`,
		};
		dispatch({
			type: "ADD_FIELD",
			payload: newField,
		});
	};

	const removeField = (id: string) => {
		setRemovalableId(id);
	};

	const deleteFieldPermanantaly = async () => {
		try {
			setRemovalableId("");
			setIsLoading(true);
			if (removalableId && !removalableId?.includes("UI-")) {
				await deleteField(removalableId);
			}
			removalableId &&
				dispatch({
					type: "REMOVE_FIELD",
					payload: removalableId,
				});
		} catch (e) {
			//handle Error here
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="form-builder">
			<h2 className="form-builder__title">Form Builder</h2>

			{state.fields.map((field, index) => (
				<FieldItem key={field.id} fieldData={field} removeField={removeField} />
			))}

			<Button onClick={addField} variant="contained">
				Add Question
			</Button>
			<ConfirmationDialog
				open={!!removalableId}
				title="Confirm Delete"
				description="Are you sure you want to delete this item?"
				onConfirm={deleteFieldPermanantaly}
				onCancel={() => setRemovalableId("")}
			/>
			{<FullScreenLoader open={isLoading} />}
			<BootStrap />
		</div>
	);
};

export default FormBuilder;
