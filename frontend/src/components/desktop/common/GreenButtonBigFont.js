import React from "react";

function GreenButtonBigFont({
  type,
  text,
  onClick,
  isDisabled,
  extraClassName,
}) {
  return (
    <button
      type={type}
      className={
        isDisabled
          ? `login-next-green-btn disable_input_field ${extraClassName}`
          : `login-next-green-btn ${extraClassName}`
      }
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}

GreenButtonBigFont.defaultProps = {
  type: "button",
  extraClassName: "",
};

export default GreenButtonBigFont;
