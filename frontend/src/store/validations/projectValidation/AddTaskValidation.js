import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddTask = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.taskName)) {
    errors.taskName = "Task name is required";
  }

  // if (isEmpty(data.selectedModule)) {
  //   errors.selectedModule = "Module name is required";
  // }

  // if (isEmpty(data.selectedSprint)) {
  //   errors.selectedSprint = "Sprint name is required";
  // }

  // if (isEmpty(memberArray)) {
  //   errors.memberName = "Member is required";
  // }

  //   if (Validator.isEmpty(data.accountsLocation)) {
  //     errors.accountsLocation = "Account location is required";
  //   }

  //   if (Validator.isEmpty(data.accountsShippingAddress)) {
  //     errors.accountsShippingAddress = "Account shipping address is required";
  //   }

  //   if (Validator.isEmpty(data.accountsBillingAddress)) {
  //     errors.accountsBillingAddress = "Account billing address is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
