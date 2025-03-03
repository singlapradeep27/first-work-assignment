import React, { useEffect, useState } from "react";
import { useService } from "../../services/formService";
import { useFormContext } from "../../context/FormContext";
import FullScreenLoader from "../../components/atoms/FullScreenLoader/FullScreenLoader";

const BootStrap: React.FC<{}> = () => {
  const { dispatch } = useFormContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getFields } = useService();

  useEffect(() => {
    setIsLoading(true);
    fetchFields();
  }, []);

  const fetchFields = async () => {
    const fields = await getFields();
    dispatch({
      type: "SET_FIELDS",
      payload: fields,
    });
    setIsLoading(false);
  };

  return isLoading ? <FullScreenLoader open /> : null;
};

export default BootStrap;
