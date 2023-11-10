import Validator from "validator";
import isEmpty from "../is-empty";

export const validateLogin = (data) => {
  let errors = {};

  if (!Validator.isEmail(data.loginEmail)) {
    // errors.emailError = "Please enter valid company email";
    errors.loginEmail = "Invalid email password";
  }

  if (Validator.isEmpty(data.loginEmail)) {
    errors.loginEmail = "Email is required";
  }
  if (Validator.isEmpty(data.loginPassword)) {
    errors.loginPassword = "Password is required";
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
