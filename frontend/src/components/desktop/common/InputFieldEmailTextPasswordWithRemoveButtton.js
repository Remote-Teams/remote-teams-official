import React from "react";

function InputFieldEmailTextPasswordWithRemoveButtton({
  containerClassName,
  label,
  type,
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
  onClickRemove,
}) {
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
          readOnly={isReadOnly}
        />
        {!isDisabled && !isReadOnly && (
          <button
            onClick={onClickRemove}
            className="products-add-new-roadmap-releases-displaylist-block__remove-button"
          >
            <i className="fa fa-times cursor-pointer upload-file-close-icon"></i>
          </button>
        )}
      </div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="error-message opacity-0">error</p>
      )}
    </div>
  );
}

InputFieldEmailTextPasswordWithRemoveButtton.defaultProps = {
  label: "",
  placeholder: "",
  maxLength: "",
  error: "",
  autoFocus: "",
};

export default InputFieldEmailTextPasswordWithRemoveButtton;
