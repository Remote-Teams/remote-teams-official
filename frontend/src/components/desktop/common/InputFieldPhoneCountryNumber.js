import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function InputFieldPhoneCountryNumber({
  index,
  containerClassName,
  label,
  id,
  name,
  placeholder,
  onChange,
  value,
  countryCode,
  handleChangeCountryCode,
  maxLength,
  autoFocus,
  errorCountryCode,
  errorPhone,
}) {
  return (
    <div
      className={`${containerClassName} input-country-phone-number-container`}
    >
      <label htmlFor={id ? id : name}>{label}</label>
      <div className="row mx-0 flex-nowrap">
        <div className="react-phone-input-block">
          <PhoneInput
            country={"us"}
            value={countryCode}
            onChange={(countryCodeVal) =>
              handleChangeCountryCode(countryCodeVal, index)
            }
          />
          {errorCountryCode ? (
            <p className="error-message">{errorCountryCode}</p>
          ) : (
            <p className="error-message opacity-0">error</p>
          )}
        </div>
        <div>
          <div className="input-border-div">
            <input
              type="text"
              pattern="[0-9]*"
              id={id ? id : name}
              name={name}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              maxLength={maxLength}
              autoComplete="off"
              autoFocus={autoFocus}
            />
          </div>
          {errorPhone ? (
            <p className="error-message">{errorPhone}</p>
          ) : (
            <p className="error-message opacity-0">error</p>
          )}
        </div>
      </div>
    </div>
  );
}

InputFieldPhoneCountryNumber.defaultProps = {
  index: "",
  placeholder: "",
  maxLength: "",
  errorCountryCode: "",
  errorPhone: "",
  autoFocus: "",
};

export default InputFieldPhoneCountryNumber;
