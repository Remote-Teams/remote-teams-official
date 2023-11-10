import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddClient = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.clientName)) {
    errors.clientName = "Client name is required";
  }

  if (data.isStatusActive === true) {
    if (Validator.isEmpty(data.shareInviteEmail)) {
      errors.shareInviteEmail = "Invite email is required";
    }
  }

  // if (Validator.isEmpty(data.contactName)) {
  //   errors.contactName = "Primary contact name is required";
  // }

  // if (Validator.isEmpty(data.contactNumber.toString())) {
  //   errors.contactNumber = "Primary contact number is required";
  // }

  // if (Validator.isEmpty(data.contactEmail)) {
  //   errors.contactEmail = "Primary contact email is required";
  // }

  // if (Validator.isEmpty(data.startDate.toString())) {
  //   errors.startDate = "Start date is required";
  // }

  // if (Validator.isEmpty(data.endDate.toString())) {
  //   errors.endDate = "End date is required";
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
