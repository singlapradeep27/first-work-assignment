import React, { useState } from "react";
import FieldItem from "./FieldItem/FieldItem";
import { FormField } from "../../types/formField";
import { useService } from "../../services/formService";
import Button from "@mui/material/Button";
import "./FormBuilder.css"; // Import CSS file for styling
import { useFormContext } from "../../context/FormContext";
import { v4 as uuidv4 } from "uuid";
import DndWrapper from "../../components/atoms/Dnd/DndWrapper";
import SortableItem from "../../components/atoms/Dnd/SortableItem/SortableItem";
import BootStrap from "../../modules/BootStrap/BootStrap";
import ConfirmationDialog from "../../components/atoms/Dialog/ConfirmationDialog";
import FullScreenLoader from "../../components/atoms/FullScreenLoader/FullScreenLoader";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { IconButton } from "@mui/material";

const FormBuilder: React.FC<{}> = () => {
  const { state, dispatch } = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteField, upsertField, updateFieldOrder } = useService();
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

  const duplicateField = async (id: string) => {
    const idx = state.fields.findIndex((field) => field.id === id);
    const field = JSON.parse(JSON.stringify(state.fields[idx]));
    setIsLoading(true);
    if (id.includes("UI")) {
      field.id = `UI-${uuidv4()}`;
      dispatch({
        type: "ADD_FIELD",
        payload: field,
      });
    } else {
      delete field.id;
      try {
        const newField = await upsertField(field);
        dispatch({
          type: "ADD_FIELD",
          payload: newField,
        });
      } catch (e) {
        //handle Error here
      }
    }
    setIsLoading(false);
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
      await updateFieldOrder(
        state.fields
          .map((field) => field.id)
          .filter((id) => id !== removalableId) as string[],
      );
    } catch (e) {
      //handle Error here
    } finally {
      setIsLoading(false);
    }
  };

  const onFieldsOrderUpdate = async (fields: FormField[]) => {
    dispatch({
      type: "SET_FIELDS",
      payload: fields,
    });
    setIsLoading(true);
    try {
      await updateFieldOrder(fields.map((field) => field.id) as string[]);
    } catch (e) {
      //handle Error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-builder">
      <h2 className="form-builder__title">Form Builder</h2>
      <DndWrapper
        items={state.fields}
        idKey="id"
        onDragEnd={onFieldsOrderUpdate}
      >
        {state.fields.map((field, index) => (
          <SortableItem
            key={field.id}
            id={field.id!}
            dragHandle={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  position: "absolute",
                  top: "-10px",
                }}
              >
                <IconButton
                  sx={{
                    cursor: "grab",
                  }}
                >
                  <DragIndicatorIcon sx={{ transform: "rotate(90deg)" }} />
                </IconButton>
              </div>
            }
          >
            <FieldItem
              key={field.id}
              fieldData={field}
              removeField={removeField}
              duplicateField={duplicateField}
            />
          </SortableItem>
        ))}
      </DndWrapper>
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
