import React from "react";

function InputFieldEmailTextPassword({
  containerClassName,
  label,
  type,
  id,
  name,
  placeholder,
  onChange,
  onKeyPress,
  value,
  maxLength,
  autoFocus,
  error,
  isDisabled,
  isReadOnly,
}) {
  // console.log(error);
  return (
    <div className={containerClassName}>
      <label htmlFor={id ? id : name}>{label}</label>
      <div className="input-border-div">
        <input
          type={type}
          id={id ? id : name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={isDisabled}
          onKeyPress={onKeyPress}
          readOnly={isReadOnly}
        />
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="error-message opacity-0">error</p>
      )}
    </div>
  );
}

InputFieldEmailTextPassword.defaultProps = {
  label: "",
  placeholder: "",
  maxLength: "",
  error: "",
  autoFocus: "",
  onKeyPress: () => {},
};

export default InputFieldEmailTextPassword;
