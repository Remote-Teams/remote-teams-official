import Validator from "validator";
import isEmpty from "../is-empty";

export const validateTeamSettings = (data) => {
  let errors = {};

  console.log(data);

  if (Validator.isEmpty(data.fname)) {
    errors.fname = "Firstname is required";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Lastname is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address is required";
  }

  if (isEmpty(data.accessRole)) {
    errors.accessRole = "Accesss role is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
