import React from "react";

function CustomRadioButton({
  label,
  name,
  selectedRadioOption,
  handleOnClickRadioOption,
}) {
  return (
    <div className="custom-radio-btn-block">
      {/** font-24-semiBold */}
      <label htmlFor={name} className="font-18-bold">
        {label}
      </label>
      <input
        id={name}
        value={name}
        type="radio"
        checked={selectedRadioOption === name}
        onChange={handleOnClickRadioOption}
      />
      <span className="custom-radio-btn-block__circle-custom"></span>
    </div>
  );
}

export default CustomRadioButton;
