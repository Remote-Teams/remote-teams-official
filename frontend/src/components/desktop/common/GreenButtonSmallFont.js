import React from "react";

function GreenButtonSmallFont({
  type,
  text,
  onClick,
  disabled,
  extraClassName,
}) {
  return (
    <button
      type={type}
      className={
        disabled === "disabled"
          ? `login-next-green-btn login-next-green-btn--fontSize disable_input_field ${extraClassName}`
          : `login-next-green-btn login-next-green-btn--fontSize ${extraClassName}`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

GreenButtonSmallFont.defaultProps = {
  type: "button",
  extraClassName: "",
};

export default GreenButtonSmallFont;
