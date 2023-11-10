import React, { useState } from "react";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "./../../desktop/common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import { updateStack } from "./../../../store/actions/kanbanAction";
import { useDispatch } from "react-redux";
import DeleteCompletedStageWaring from "./DeleteCompletedStageWaring";

function EditKanBanList({ stackData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    stackName: stackData.name,
  });

  const [backendError, setBackendError] = useState("");
  const [
    deleteCompletedStageWarning,
    setDeleteCompletedStageWarning,
  ] = useState(false);

  const handleChange = (e) => {
    setBackendError("");
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

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
    console.log(status);
    if (status === 200) {
      setValues({
        ...values,
        open: false,
      });
    } else if (status === 400) {
      setBackendError("A stage with this name already exists for this project");
    }
  };

  const addStackHandler = () => {
    if (stackData.name === "COMPLETED") {
      setDeleteCompletedStageWarning(true);
    } else {
      let formData = stackData;
      formData.name = values.stackName.toUpperCase();
      dispatch(updateStack(stackData._id, formData, callbackAddStack));
    }
    // console.log(this.props.singleProjectData);
    // console.log(this.state.stackName);
  };
  return (
    <div>
      {deleteCompletedStageWarning === true && (
        <DeleteCompletedStageWaring
          setDeleteCompletedStageWarning={setDeleteCompletedStageWarning}
        />
      )}

      <span onClick={onOpenModal}>Edit Stage</span>
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
          {/*<h3 className="text-center">EDIT STACK</h3>*/}
          <h1 className="add-meeting-title add-meeting-title--create-module">
            Edit Stage{" "}
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
          />
          <div className="text-center">
            <GreenButtonSmallFont onClick={addStackHandler} text={"SAVE"} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditKanBanList;
