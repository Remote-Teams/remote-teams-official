import React from "react";
import isEmpty from "../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";

const EmployeeDeletePopup = ({
  empDeletePopup,
  employeeDeleteHandler,
  doEmailExist,
  onChangeCheckbox,
  toggle,
  onCloseModal,
  allUsers,
}) => {
  return (
    <div>
      <Modal
        open={empDeletePopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "employee-delete-popup customModal",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="employee-delete-popup-div">
          <div className="paymentDeleteModalContentTitleBlock">
            <h2 className="paymentDeleteModalContentTitle">
              Downgrade your plan
            </h2>
          </div>
          <div className="paymentDeleteModalContent">
            <div className="paymentDeleteModalContent__textBlock">
              <p className="paymentDeleteModalContent__textBlock-para pb-20">
                You are exceeding the number of employees in your selected
                downgrade plan. We need you to achieve{" "}
                {/* <b>"{runningPlanEmployeeCreated - planMaxUsers}"</b>  */}1
                of your employees
              </p>
              <h3 className="paymentDeleteModalContent__textBlock-team-text">
                Your Team
              </h3>
            </div>
            <ul className="paymentDeleteModalContent__textBlock-list">
              {!isEmpty(allUsers) &&
                allUsers.map((employee, index) => {
                  return (
                    <li
                      key={index}
                      className="row mx-0 align-items-start flex-nowrap"
                    >
                      <div className="customCheckbox">
                        {/*<input
                          type="checkbox"
                          onChange={onChangeCheckbox(employee.email)}
                          checked={
                            doEmailExist(employee.email) ||
                            doEmailExist(employee.email) === 0
                              ? true
                              : false
                          }
                        />*/}
                        <Checkbox
                          checked={
                            doEmailExist(employee.email) ||
                            doEmailExist(employee.email) === 0
                              ? true
                              : false
                          }
                          onChange={onChangeCheckbox(employee.email)}
                        />
                      </div>{" "}
                      <div>
                        <h5 className="paymentDeleteModalContent__textBlock-emp-name mb-10">
                          {employee.name}
                        </h5>
                        <h6 className="paymentDeleteModalContent__textBlock-job-title">
                          {employee.jobTitle}
                        </h6>
                      </div>
                      {/* <img
                      src={require("./../../../assets/img/leads/ben-1.png")}
                      alt="employee-profile"
                    /> */}
                    </li>
                  );
                })}
            </ul>
            {/** paymentDeleteModalContent__buttonBlock cancelBtnDeleteModal*/}
            <div className="cancelBtnDeleteModal  cancelBtnDeleteModal--btn-section">
              <button
                onClick={onCloseModal}
                className="login-dashboard-btn payment-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={employeeDeleteHandler}
                className="login-next-green-btn"
              >
                Archieve
              </button>
            </div>
          </div>
        </div>{" "}
      </Modal>
    </div>
  );
};

export default EmployeeDeletePopup;
