import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddRole = (data) => {
  let errors = {};

  console.log(data);

  if (Validator.isEmpty(data.roleName)) {
    errors.roleName = "Role name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
