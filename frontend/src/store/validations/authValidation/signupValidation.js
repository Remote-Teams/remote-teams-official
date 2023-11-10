import Validator from "validator";
import isEmpty from "../is-empty";

export const validateSignUp = (data, pass, confirmPass) => {
  let errors = {};

  // Company Email Validation

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter valid Company email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Company email is required";
  }

  // First Name Validation

  if (
    !Validator.isLength(data.fname, { min: 2, max: 30 }) ||
    !Validator.matches(data.fname, /^[a-zA-Z\s]+$/)
  ) {
    errors.fname =
      "First name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (!isEmpty(data.fname) && data.fname.includes(" ")) {
    console.log("space error");
    errors.fname = "Space not allowed";
  }

  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First name is required";
  }

  // Last Name Validation

  if (
    !Validator.isLength(data.lname, { min: 2, max: 30 }) ||
    !Validator.matches(data.lname, /^[a-zA-Z\s]+$/)
  ) {
    errors.lname =
      "Last name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (!isEmpty(data.lname) && data.lname.includes(" ")) {
    console.log("space error");
    errors.lname = "Space not allowed";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last name is required";
  }

  // Password Validation
  if (pass !== undefined) {
    if (!Validator.isLength(pass, { min: 8, max: 30 })) {
      errors.password = "Password must be of 8 to 30 characters";
    }
  }

  if (pass !== undefined) {
    if (
      !Validator.matches(
        pass,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
      )
    ) {
      errors.password =
        "Password must contain at least 8 characters with a mix of special characters, numbers and both upper and lower case";
    }
  }

  if (pass !== undefined) {
    if (Validator.isEmpty(pass)) {
      errors.password = "Password is required";
    }
  }

  // Confirm Password Validation

  if (confirmPass !== undefined) {
    if (!Validator.equals(pass, confirmPass)) {
      errors.confirmPassword = "Confirm password did not match";
    }
  }

  if (confirmPass !== undefined) {
    if (Validator.isEmpty(confirmPass)) {
      errors.confirmPassword = "please confirm your password";
    }
  }

  // if (data.leadsPhoneCountryNumber.charAt(0) !== "+") {
  //     errors.leadsPhoneCountryNumber = "Please add + in country code";
  // }

  // if (
  //     isNaN(data.leadsPhoneCountryNumber) ||
  //     data.leadsPhoneCountryNumber.length === 0
  // ) {
  //     errors.leadsPhoneCountryNumber = "Country code invalid";
  // }

  // if (!Validator.isLength(data.leadAssignRepresentative.toString().trim(), { min: 2, max: 30 })) {
  //     errors.leadAssignRepresentative = "Representative name must be of 2 to 30 characters";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
