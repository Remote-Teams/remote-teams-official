import React, { useState, useRef } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import {
  createKanBanStack,
  checkIfStageIsExist,
} from "./../../../store/actions/kanbanAction";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import { validateAddStage } from "./../../../store/validations/projectValidation/AddKanbanStageValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

function AddKanBanList() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    stackName: "",
  });

  const [backendError, setBackendError] = useState("");

  const handleChange = (e) => {
    const { value: nextValue } = e.target;
    debouncedSave(nextValue);
    setBackendError("");
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const callBackLeadExist = (isExist) => {
    if (isExist === true) {
      setBackendError("A stage with this name already exists for this project");
    } else {
      setBackendError("");
    }
  };

  let projectData = JSON.parse(localStorage.getItem("projectData"));
  // debounce start
  const debouncedSave = useRef(
    debounce(
      (nextValue) =>
        dispatch(
          checkIfStageIsExist(
            {
              project: projectData._id,
              name: nextValue.toUpperCase(),
            },
            callBackLeadExist
          )
        ),
      500
    )
    // will be created only once initially
  ).current;
  // debounce end

  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      stackName: " ",
    });
  };

  const callbackAddStack = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        open: false,
        stackName: "",
      });
    } else if (status === 400) {
      setBackendError("A stage with this name already exists for this project");
    }
  };

  const addStackHandler = () => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    const { errors, isValid } = validateAddStage(values);

    if (!isValid) {
      setBackendError(errors.stackName);
    } else {
      const formData = {
        name: values.stackName.toUpperCase(),
        project: projectData._id,
        position: 3,
      };

      dispatch(createKanBanStack(formData, callbackAddStack));
    }
  };
  // console.log(backendError);
  return (
    <div>
      <div onClick={onOpenModal} className=" add_kanban_list">
        <div className="heads">
          {/*<h3 className="heads__title">+ ADD NEW STACK </h3>*/}
          <h3 className="heads__title">Add A Stage </h3>
        </div>
      </div>
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--createBoard",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add_board_model_container">
          {/*<h3 className="text-center">ADD NEW STACK</h3>*/}
          <h1 className="add-meeting-title add-meeting-title--create-module">
            Add New Stage
          </h1>

          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input"
            label="Name"
            name="stackName"
            value={values.stackName}
            onChange={handleChange}
            type="text"
            autoFocus={true}
            error={backendError}
            maxLength={maxLengths.char20}
          />

          <div className="text-center">
            <GreenButtonSmallFont onClick={addStackHandler} text={"ADD"} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddKanBanList;
