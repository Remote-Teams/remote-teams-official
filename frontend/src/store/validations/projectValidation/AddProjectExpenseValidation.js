import Validator from "validator";
import isEmpty from "../is-empty";

export const AddProjectExpenseValidation = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.payeeName)) {
    errors.payeeName = "Expense title is required";
  }

  if (isEmpty(data.projectName)) {
    errors.projectName = "Please select project";
  }

  //   if (Validator.isEmpty(data.description)) {
  //     errors.description = "Discussion description is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
