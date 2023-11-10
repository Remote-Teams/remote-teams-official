import React from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

function ReportsTabPanelTitle({ title, onClick }) {
  return (
    <>
      {/* tabpanel title */}
      <div className="row mx-0 reports-tabpanel-title-div">
        <h2 className="reports-tabpanel-title">{title}</h2>
        <GreenButtonSmallFont
          text="Download"
          onClick={onClick}
          extraClassName="reports-download-btn"
        />
      </div>
      {/* tabpanel title end */}
    </>
  );
}

export default ReportsTabPanelTitle;
