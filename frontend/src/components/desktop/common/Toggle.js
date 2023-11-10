import React from "react";

const Toggle = ({
  name,
  containerClassName,
  textClassName,
  text1,
  text2,
  onChange,
  defaultChecked,
}) => {
  return (
    <>
      <div className={`toggle ${containerClassName}`}>
        <span
          className={
            defaultChecked ? textClassName : `opacity-5 ${textClassName}`
          }
        >
          {text1}
        </span>

        <div
          className={
            defaultChecked
              ? "toggle-circle-input toggle-circle-input--active"
              : "toggle-circle-input"
          }
        >
          <input
            type="checkbox"
            name={name}
            onChange={onChange}
            defaultChecked={defaultChecked}
          />
          <span className="toggle-circle-input__circle"></span>
        </div>
        <span
          className={
            !defaultChecked ? textClassName : `opacity-5 ${textClassName}`
          }
        >
          {text2}
        </span>
      </div>
    </>
  );
};

Toggle.defaultProps = {
  containerClassName: "",
};

export default Toggle;
