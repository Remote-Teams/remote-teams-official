import React, { useState } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

function DeleteStageWithTaskWarning({ setDeleteStageWarning }) {
  const [open, setOpen] = useState(true);

  const onCloseModal = () => {
    setOpen(false);
    setDeleteStageWarning(false);
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
            src={require("./../../../assets/img/kanban/delete-stage-with-task-warning.svg")}
            alt="delete stag with task warning"
            className="delete-stage-with-task-warning-img"
          />

          <h1 className="add-meeting-title add-meeting-title--create-module mb-0">
            {/*This stage has some tasks please remove them before delete this
            stage*/}
            Hi There!
          </h1>
          <p className="font-14-semibold delete-stage-with-task-warning-para">
            Sorry but you can’t delete this stack because there are
            <br />
            some tasks present there, please empty the stack before proceeding
            again
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

export default DeleteStageWithTaskWarning;
