import Validator from "validator";
import isEmpty from "../is-empty";

export const AddScrumValidation = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Scrum title is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
