import React from "react";
import { Redirect } from "react-router-dom";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import { useState } from "react";
import { createWorkFlowInstanceAction } from "./../../../store/actions/workflowApiAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";

export default function WorkflowStartNewInstance({ singleWorkflowData }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    name: "",
    redirect: false,
  });

  /*=========================================
                  close Modal
  =========================================*/
  const openModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  const handleChangeInput = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    var userData = JSON.parse(localStorage.getItem("UserData"));

    const formData = {
      user: userData.id,
      workflow: singleWorkflowData._id,
      instanceInfo: {
        instanceName: values.name,
        createdBy: userData.name,
        firstName: userData.firstName,
        lastName: userData.lastName,
        completionDate: "",
        status: "ACTIVE",
      },
    };
    dispatch(createWorkFlowInstanceAction(formData, history));
  };

  /*=========================================  
                render Modal
  =========================================*/
  const renderModal = () => {
    return (
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--workflow",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="workflow-new-instant-div">
          <h1 className="workflow-new-instant-tittle text-center">
            Start New Instance
          </h1>
          <div className="histroy-new-instant-workflow-name-div mt-50">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              workflow name
            </h3>
            <h3 className="workflow-start-new-instance-rubix-text">
              {!isEmpty(singleWorkflowData) && singleWorkflowData.name}
            </h3>
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--workflow-new-instant"
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChangeInput}
                type="text"
              />
            </div>
          </div>
          <div className="text-center">
            <GreenButtonSmallFont
              text="Start"
              extraClassName="workflow-new-instant-green-button"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {values.redirect && <Redirect to="/workflow-details" />}
      {renderModal()}
      <GreenButtonSmallFont
        text="Start New Instance"
        //extraClassName="workflow-start-new-instance-btn"
        extraClassName="workflow-ongoing-processes-green-btn"
        onClick={openModal}
      />
    </>
  );
}
