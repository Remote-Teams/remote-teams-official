import React from "react";
import GreenButtonSmallFont from "./GreenButtonSmallFont";
import GreenLinkSmallFont from "./GreenLinkSmallFont";

function PageTitle({
  extraClassNamePageTitle,
  title,
  shadow,
  isLinkDisplay,
  linkPath,
  linkText,
  isBtnDisplay,
  btnText,
  btnOnClick,
}) {
  return (
    <>
      <div className={`row mx-0 align-items-center ${extraClassNamePageTitle}`}>
        <div className="titile-div">
          <h1 className="title-div__text">{title}</h1>
          <span className="title-div__shadow">{shadow ? shadow : title}</span>
        </div>
        {isLinkDisplay && (
          <GreenLinkSmallFont
            path={linkPath}
            text={linkText}
            extraClassName={"add-project-btn"}
          />
        )}
        {isBtnDisplay && (
          <GreenButtonSmallFont
            onClick={btnOnClick}
            text={btnText}
            extraClassName={"add-project-btn"}
          />
        )}
      </div>
    </>
  );
}

PageTitle.defaultProps = {
  isBtnDisplay: false,
  isLinkDisplay: false,
  extraClassNamePageTitle: "",
};

export default PageTitle;
