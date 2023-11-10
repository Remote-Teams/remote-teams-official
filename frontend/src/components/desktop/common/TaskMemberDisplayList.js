import React from "react";
import isEmpty from "../../../store/validations/is-empty";

function TaskMemberDisplayList({
  extraClassName,
  displayListSelected,
  handleRemoveMember,
  placeholder,
}) {
  return (
    <div
      className={`${extraClassName} row mx-0 flex-nowrap task-members-list-row mb-15`}
    >
      {!isEmpty(displayListSelected) &&
        displayListSelected.map((data, index) => (
          <div
            key={index}
            className="row ml-0 flex-nowrap align-items-center mb-15 task-members-list-main-block"
          >
            <div className="flex-shrink-0 task-members-list-main-block__circle">
              <span>
                {/* AM */}
                {data.label.charAt(0)}
              </span>
            </div>
            <div className="container-login-flow-input mb-0">
              <div className="input-border-div">
                <input
                  type="text"
                  // value={data.name}
                  value={data.label}
                  placeholder={placeholder}
                  readOnly
                />
              </div>
            </div>
            <button
              onClick={handleRemoveMember(index)}
              className="task-members-list-main-block__remove-button"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
        ))}
    </div>
  );
}

TaskMemberDisplayList.defaultProps = {
  extraClassName: "",
  placeholder: "",
};

export default TaskMemberDisplayList;
