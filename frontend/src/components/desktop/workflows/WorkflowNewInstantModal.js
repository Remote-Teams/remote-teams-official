import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import Modal from "react-responsive-modal";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

const option = [
  { value: "lorem", label: "Lorem" },
  { value: "lorem1", label: "Lorem1" },
  { value: "lorem2", label: "Lorem2" },
];

export default function WorkflowNewInstantModal() {
  const [values, setValues] = useState({
    open: false,
    workspaceName: null,
    name: "",
    redirect: false,
  });

  /*=========================================
              open modal
  =========================================*/
  const openModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  /*=========================================
              close Modal
  =========================================*/
  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  const handleChange = (workspaceName) => {
    setValues({
      ...values,
      workspaceName,
    });
    // console.log(`Option selected:`, workspaceName);
  };

  const handleChangeInput = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // console.log(values);
    setValues({
      ...values,
      open: false,
      redirect: true,
    });
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
          <h1 className="font-32-extraBold-letterspace mt-30 mb-50 text-center">
            Start new instance
          </h1>
          <div className="pt-60 pb-30">
            <h3 className="font-18-bold-space-light-uppercase mb-20">
              workflow name
            </h3>
            <Select
              className="react-select-container react-select-container--workflow-new-instant"
              classNamePrefix="react-select-elements"
              value={values.workspaceName}
              onChange={handleChange}
              options={option}
              placeholder="Select"
              isSearchable={false}
            />
          </div>
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
          <GreenButtonSmallFont
            text="Start"
            extraClassName="workflow-new-instant-green-button"
            onClick={handleSubmit}
          />
        </div>
      </Modal>
    );
  };

  return (
    <>
      {values.redirect && <Redirect to="/workflow-details" />}
      {renderModal()}
      <div onClick={openModal}>
        <GreenButtonSmallFont text="+ New Instance" />
      </div>
    </>
  );
}
