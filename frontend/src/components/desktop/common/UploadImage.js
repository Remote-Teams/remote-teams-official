import React from "react";
import isEmpty from "../../../store/validations/is-empty";

function UploadImage({
  containerClassName,
  buttonName,
  fileNameValue,
  acceptType,
  onChange,
  error,
}) {
  return (
    <>
      {/* display logo */}
      <div className={containerClassName}>
        <div className="upload-img__img-block-border-div">
          <div className="upload-img__img-block">
            {!isEmpty(fileNameValue) && (
              <img src={fileNameValue} className="img-wh-100" alt="" />
            )}
          </div>
        </div>
        {/* select image file */}
        <div className="upload-img__btn-input-block">
          <span className="login-dashboard-btn">{buttonName}</span>
          <input type="file" accept={acceptType} title="" onChange={onChange} />
        </div>
        {isEmpty(fileNameValue) && error && (
          <div className="is-invalid mb-20">{error}</div>
        )}
      </div>
    </>
  );
}

UploadImage.defaultProps = {
  error: "",
};

export default UploadImage;
