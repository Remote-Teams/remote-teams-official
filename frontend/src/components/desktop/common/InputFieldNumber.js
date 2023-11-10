import React from "react";

function InputFieldNumber({
  containerClassName,
  label,
  id,
  name,
  placeholder,
  onChange,
  value,
  maxLength,
  autoFocus,
  error,
  isDisabled,
  isReadOnly,
}) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id ? id : name}>{label}</label>
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
          disabled={isDisabled}
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

InputFieldNumber.defaultProps = {
  label: "",
  placeholder: "",
  maxLength: "",
  error: "",
  autoFocus: "",
};

export default InputFieldNumber;
