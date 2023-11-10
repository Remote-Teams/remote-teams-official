import React from "react";

function CountCardCommon({ title, count, onClick }) {
  return (
    <div onClick={onClick} className="count-card-block">
      <h2 className="count-card-block__title">{title}</h2>
      <p className="count-card-block__count">{count}</p>
      {/*<h2 className="count-card-block__title">{title}</h2>*/}
    </div>
  );
}

export default CountCardCommon;
