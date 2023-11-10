import React from "react";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";

function AddMemberSelectAndDisplayList({
  extraClassName,
  selectedOptionValue,
  handleChangeSelectClient,
  options,
  displayListSelected,
  handleRemoveMember,
  dropdownPlaceholder,
}) {
  return (
    <div className={`${extraClassName}`}>
      <div className="select-member-dropdown-block">
        <h3 className="font-18-bold-space-light-uppercase mb-20">
          select member
        </h3>
        <Select
          className="react-select-container react-select-container--addMember mb-50"
          classNamePrefix="react-select-elements"
          value={selectedOptionValue}
          onChange={handleChangeSelectClient}
          options={options}
          placeholder={dropdownPlaceholder}
          isSearchable={false}
        />
      </div>
      {/* selected */}
      <div className="mb-40">
        <h3 className="font-18-bold font-18-bold--select-member mb-20">
          Selected member
        </h3>
        <div className="row mx-0 flex-nowrap add-project-member-modal-list-overflow">
          {!isEmpty(displayListSelected) &&
            displayListSelected.map((data, index) => (
              <div
                key={index}
                className="create-project-add-member-img-text-block"
              >
                <div className="create-project-add-member-img-block">
                  <img
                    //src={require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg")}
                    //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                    src={require("../../../assets/img/dummy/new-profile-img.svg")}
                    alt="member"
                    className="create-project-add-member-img-block__imgMember"
                  />
                  <i
                    className="fa fa-minus create-project-add-member-img-block__remove"
                    onClick={handleRemoveMember(index)}
                  ></i>
                </div>
                <h4 className="font-18-semiBold">{data.label}</h4>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

AddMemberSelectAndDisplayList.defaultProps = {
  extraClassName: "",
  dropdownPlaceholder: "select from the list",
};

export default AddMemberSelectAndDisplayList;
