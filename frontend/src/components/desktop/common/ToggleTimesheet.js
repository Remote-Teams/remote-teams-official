import React from "react";

const ToggleTimesheet = ({
  name,
  containerClassName,
  textClassName,
  text1,
  text2,
  onChange,
  defaultChecked,
  isDisabled,
}) => {
  return (
    <>
      <div className={`toggle ${containerClassName}`}>
        <span
          className={
            defaultChecked ? textClassName : `opacity-26 ${textClassName}`
          }
        >
          {text1}
        </span>

        <div className="toggle-circle-input toggle-circle-input--active">
          <input
            type="checkbox"
            name={name}
            onChange={onChange}
            defaultChecked={defaultChecked}
            disabled={isDisabled}
          />
          <span className="toggle-circle-input__circle"></span>
        </div>
        <span
          className={
            !defaultChecked ? textClassName : `opacity-26 ${textClassName}`
          }
        >
          {text2}
        </span>
      </div>
    </>
  );
};

ToggleTimesheet.defaultProps = {
  containerClassName: "",
};

export default ToggleTimesheet;
