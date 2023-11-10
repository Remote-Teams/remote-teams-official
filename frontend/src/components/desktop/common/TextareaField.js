import React from "react";

function TextareaField({
  containerClassName,
  label,
  id,
  name,
  placeholder,
  onChange,
  value,
  maxLength,
  autoFocus,
  isDisabled,
  error,
}) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id ? id : name}>{label}</label>
      <div className="input-border-div">
        <textarea
          type="text"
          id={id ? id : name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={isDisabled}
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

TextareaField.defaultProps = {
  placeholder: "",
  maxLength: "",
  error: "",
  autoFocus: "",
};

export default TextareaField;
