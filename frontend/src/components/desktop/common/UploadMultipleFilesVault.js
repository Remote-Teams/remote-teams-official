import React from "react";
import isEmpty from "../../../store/validations/is-empty";

// let fileNameValueLength = "";
// let namesList = [];

function UploadMultipleFilesVault({
  containerClassName,
  buttonName,
  fileNameValue,
  placeholder,
  acceptType,
  onChange,
  handleOnClickRemoveDocument,
  handleOnClickOpenDocument,
  error,
}) {
  // fileNameValueLength = !isEmpty(fileNameValue) ? fileNameValue[0].length : "";
  // for (let i = 0; i < fileNameValueLength; i++) {
  //   console.log(fileNameValue[0][i]);
  //   namesList.push(fileNameValue[0][i]);
  // }

  return (
    <>
      <div className={`${containerClassName} row mx-0`}>
        {/* {!isEmpty(fileNameValue) && (
          <div className="col-7">
            {fileNameValue.map((data, index) => (
              <div key={index} className="row mx-0 align-items-center mb-30">
                <div className="col-1 px-0">
                  <img
                    src={require("../../../assets/img/icons/common-file-icon.svg")}
                    alt="file"
                    className="common-file-icon"
                  />
                </div>
                <div className="col-9 upload-file__display-input-block px-0">
                  <div className="container-login-flow-input container-login-flow-input--memberDayOffsInputTitle mb-0">
                    <div className="input-border-div">
                      <input
                        type="text"
                        value={data.originalName}
                        placeholder={placeholder}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="row flex-nowrap align-items-center mx-0">
                    <i
                      className="fa fa-times cursor-pointer"
                      onClick={handleOnClickRemoveDocument(data)}
                    ></i>
                    <img
                      src={require("../../../assets/img/icons/export-icon.svg")}
                      alt="export"
                      className="vault-open-file-icon"
                      onClick={handleOnClickOpenDocument(data)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}
        <div className="col-12 px-0">
          {/* select image file */}
          <div className="upload-img__btn-input-block">
            <div className="login-dashboard-btn">{buttonName}</div>
            <input
              name="fileName[]"
              type="file"
              accept={acceptType}
              title=""
              onChange={onChange}
              // multiple
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

UploadMultipleFilesVault.defaultProps = {
  placeholder: "",
  error: "",
};

export default UploadMultipleFilesVault;
