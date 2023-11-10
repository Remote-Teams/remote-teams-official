import React from "react";

function GrayButtonSmallFont({
  type,
  text,
  onClick,
  disabled,
  extraClassName,
}) {
  return (
    <button
      type={type}
      className={`login-dashboard-btn mr-25 ${extraClassName}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

GrayButtonSmallFont.defaultProps = {
  type: "button",
  extraClassName: "",
};

export default GrayButtonSmallFont;
