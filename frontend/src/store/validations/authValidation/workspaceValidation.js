import Validator from "validator";
import isEmpty from "../is-empty";

export const validateWorkspace = (data) => {
  let errors = {};

  if (!Validator.isLength(data.loginWorkspaceName, { min: 2, max: 30 })) {
    errors.workspace = "Workspace name must be of 2 to 30 characters";
  }

  if (
    !isEmpty(data.loginWorkspaceName) &&
    data.loginWorkspaceName.includes(" ")
  ) {
    console.log("space error");
    errors.workspace = "Space not allowed";
  }

  if (Validator.isEmpty(data.loginWorkspaceName)) {
    errors.workspace = "Workspace name is required";
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
