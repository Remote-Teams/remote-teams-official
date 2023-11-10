import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddSubscription = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Subscription name is required";
  }

  if (Validator.isEmpty(data.cost)) {
    errors.cost = "Subscription cost is required";
  }

  if (Validator.isEmpty(data.purpose)) {
    errors.purpose = "Subscription purpose is required";
  }

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
