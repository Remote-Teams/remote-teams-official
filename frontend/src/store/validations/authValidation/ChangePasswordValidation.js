import Validator from "validator";
import isEmpty from "../is-empty";

export const validateChangePassword = (data) => {
  let errors = {};

  // Password Validation
  if (data.currentPassword !== undefined) {
    if (!Validator.isLength(data.currentPassword, { min: 8, max: 30 })) {
      errors.currentPassword = "Password must be of 8 to 30 characters";
    }
  }

  if (data.currentPassword !== undefined) {
    if (
      !Validator.matches(
        data.currentPassword,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
      )
    ) {
      errors.currentPassword =
        "Password must contain at least 8 characters with a mix of special characters, numbers and both upper and lower case";
    }
  }

  if (data.currentPassword !== undefined) {
    if (Validator.isEmpty(data.currentPassword)) {
      errors.currentPassword = "Password is required";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validateNewPassword = (data) => {
  let errors = {};
  /*===========================================================================

                new Password Validation

  ==============================================================================*/
  if (data.newPassword !== undefined) {
    if (!Validator.isLength(data.newPassword, { min: 8, max: 30 })) {
      errors.newPassword = "Password must be of 8 to 30 characters";
    }
  }

  if (data.newPassword !== undefined) {
    if (
      !Validator.matches(
        data.newPassword,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
      )
    ) {
      errors.newPassword =
        "Password must contain at least 8 characters with a mix of special characters, numbers and both upper and lower case";
    }
  }

  if (data.newPassword !== undefined) {
    if (Validator.isEmpty(data.newPassword)) {
      errors.newPassword = "Password is required";
    }
  }

  /*===========================================================================

               confirm Validation

  ==============================================================================*/

  if (data.confirmePassword !== undefined) {
    if (!Validator.equals(data.newPassword, data.confirmePassword)) {
      errors.confirmePassword = "Confirm password did not match";
    }
  }

  if (data.confirmePassword !== undefined) {
    if (Validator.isEmpty(data.confirmePassword)) {
      errors.confirmePassword = "Please confirm your password";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
