import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddResource = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.fName)) {
    errors.fName = "Resource firstname is required";
  }

  if (Validator.isEmpty(data.lName)) {
    errors.lName = "Resource lastname is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Resource email address is required";
  }

  if (isEmpty(data.accessRole)) {
    errors.accessRole = "Resource accesss role is required";
  }

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
