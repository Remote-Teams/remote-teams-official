import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddProject = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.projectName)) {
    errors.projectName = "Project name is required";
  }

  // if (Validator.isEmpty(data.startDate.toString())) {
  //   errors.startDate = "Project start date is required";
  // }

  // if (Validator.isEmpty(data.endDate.toString())) {
  //   errors.endDate = "Project end date is required";
  // }

  // if (Validator.isEmpty(data.cost.toString())) {
  //   errors.cost = "Project estimated cost is required";
  // }

  // if (Validator.isEmpty(data.estimatedHours.toString())) {
  //   errors.estimatedHours = "Project estimated hours is required";
  // }

  // if (data.clientName.label !== undefined) {
  //   if (Validator.isEmpty(data.clientName.label)) {
  //     errors.clientName = "Client name is required";
  //   }
  // } else {
  //   errors.clientName = "Client name is required";
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
