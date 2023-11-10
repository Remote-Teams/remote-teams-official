import React from "react";
import isEmpty from "../../../store/validations/is-empty";

function UploadFile({
  containerClassName,
  buttonName,
  fileNameValue,
  placeholder,
  acceptType,
  onChange,
  error,
}) {
  return (
    <>
      {/* display logo */}
      <div className={`${containerClassName} row mx-0`}>
        {!isEmpty(fileNameValue) && (
          <div className="col-10 upload-file__display-input-block px-0">
            <div className="container-login-flow-input container-login-flow-input--memberDayOffsInputTitle mb-0">
              <div className="input-border-div">
                <input
                  type="text"
                  value={fileNameValue}
                  placeholder={placeholder}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
        <div className="col-2 px-0">
          {/* select image file */}
          <div className="upload-img__btn-input-block">
            <span className="login-dashboard-btn">{buttonName}</span>
            <input
              type="file"
              accept={acceptType}
              title=""
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-12 mt-20">
          {isEmpty(fileNameValue) && error && (
            <div className="is-invalid">{error}</div>
          )}
        </div>
      </div>
    </>
  );
}

UploadFile.defaultProps = {
  placeholder: "",
  error: "",
};

export default UploadFile;
