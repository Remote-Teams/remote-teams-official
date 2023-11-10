import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddAccountCustomField = (data, entity) => {
  let errors = {};

  // console.log(data);

  if (Validator.isEmpty(data.fieldName)) {
    errors.fieldName = "Field name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
