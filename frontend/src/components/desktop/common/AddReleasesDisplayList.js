import React from "react";
import isEmpty from "../../../store/validations/is-empty";

function AddReleasesDisplayList({
  extraClassName,
  displayListSelected,
  handleRemoveMember,
  placeholder,
}) {
  return (
    <div className={`${extraClassName} row mx-0`}>
      {!isEmpty(displayListSelected) &&
        displayListSelected.map((data, index) => (
          <div
            key={index}
            className="row mx-0 flex-nowrap align-items-center mb-30 products-add-new-roadmap-releases-displaylist-block"
          >
            <div className="container-login-flow-input mb-0">
              <div className="input-border-div">
                <input
                  type="text"
                  // value={data.name}
                  value={data.label}
                  placeholder={placeholder}
                  readOnly
                />

                <button
                  onClick={handleRemoveMember(index)}
                  className="products-add-new-roadmap-releases-displaylist-block__remove-button"
                >
                  <i className="fa fa-times cursor-pointer upload-file-close-icon"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

AddReleasesDisplayList.defaultProps = {
  extraClassName: "",
  placeholder: "Release name",
};

export default AddReleasesDisplayList;
