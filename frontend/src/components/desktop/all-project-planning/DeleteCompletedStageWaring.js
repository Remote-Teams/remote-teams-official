import React, { useState } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

function DeleteCompletedStageWaring({ setDeleteCompletedStageWarning }) {
  const [open, setOpen] = useState(true);

  const onCloseModal = () => {
    setOpen(false);
    setDeleteCompletedStageWarning(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--delete-stage-with-task-warning",
          //customModal--createBoard
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add_board_model_container text-center">
          {/*<h3 className="text-center">EDIT STACK</h3>*/}
          <img
            src={require("./../../../assets/img/kanban/delete-complete-stage-warning.svg")}
            alt="delete complete stage warning"
            className="delete-complete-stage-warning-img"
          />
          <h1 className="add-meeting-title add-meeting-title--create-module mb-0">
            {/*The completed stage cant be updated or deleted*/}Uh-oh!
          </h1>
          <p className="font-14-semibold delete-stage-with-task-warning-para">
            Looks you are trying to modify the Completed Stack!! Sorry you can’t
            delete <br />
            this stack be cause we need it to calculate some metrics for your
            reports!
          </p>
          <GrayButtonSmallFont
            text={"Ok! Go Back"}
            extraClassName={"delete-stage-with-task-warning-go-btn"}
            onClick={onCloseModal}
          />
        </div>
      </Modal>
    </div>
  );
}

export default DeleteCompletedStageWaring;
