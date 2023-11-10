import React from "react";

function SearchInput({
  containerClassName,
  name,
  placeholder,
  onChange,
  value,
  maxLength,
  autoFocus,
  error,
}) {
  return (
    <div className={`search-input-container ${containerClassName}`}>
      <div className="search-input-container__input-div">
        <i className="fa fa-search"></i>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

SearchInput.defaultProps = {
  placeholder: "",
  maxLength: "",
  error: "",
  autoFocus: "",
};

export default SearchInput;
