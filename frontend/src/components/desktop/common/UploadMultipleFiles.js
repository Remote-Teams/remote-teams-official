import React, { Fragment } from "react";
import isEmpty from "../../../store/validations/is-empty";

// let fileNameValueLength = "";
// let namesList = [];

function UploadMultipleFiles({
  containerClassName,
  buttonName,
  fileNameValue,
  placeholder,
  acceptType,
  onChange,
  handleOnClickRemoveDocument,
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
        {!isEmpty(fileNameValue) && (
          <Fragment>
            {/*<div className="col-7 px-0">*/}
            {fileNameValue.map((data, index) => (
              <div
                key={index}
                className="row ml-0 flex-nowrap align-items-center mb-30 file-name-display-div"
              >
                {/* {console.log(data)} */}
                <div className="col-2 px-0">
                  <img
                    src={require("../../../assets/img/icons/new-common-file-icon.svg")}
                    alt="file"
                    className="common-file-icon"
                  />
                </div>
                <div className="col-7 upload-file__display-input-block px-0">
                  <div className="container-login-flow-input container-login-flow-input--upload-file mb-0">
                    <div className="input-border-div">
                      <input
                        type="text"
                        // value={data.name}
                        value={data}
                        placeholder={placeholder}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <i
                    className="fa fa-times cursor-pointer upload-file-close-icon"
                    onClick={handleOnClickRemoveDocument(data)}
                  ></i>
                </div>
              </div>
            ))}
            {/* </div> */}
          </Fragment>
        )}
        <div className="col-12 px-0">
          {/* select image file */}
          <div className="upload-img__btn-input-block">
            <div className="upload-img__btn-input-block-btn-div">
              <span className="login-dashboard-btn">{buttonName}</span>
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

UploadMultipleFiles.defaultProps = {
  placeholder: "",
  error: "",
};

export default UploadMultipleFiles;
