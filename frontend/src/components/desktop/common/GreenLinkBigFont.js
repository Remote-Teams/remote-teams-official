import React from "react";
import { Link } from "react-router-dom";

function GreenLinkBigFont({ path, text }) {
  return (
    <Link to={path}>
      <span className="login-next-green-btn">{text}</span>
    </Link>
  );
}

export default GreenLinkBigFont;
