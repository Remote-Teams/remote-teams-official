import Validator from "validator";
import isEmpty from "../is-empty";

export const AddDiscussionValidation = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Discussion subject is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Discussion description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
