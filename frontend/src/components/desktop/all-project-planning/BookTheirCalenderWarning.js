import React, { useState } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

export default function BookTheirCalenderWarning() {
  const [open, setOpen] = useState(true);

  const onCloseModal = () => {
    setOpen(false);
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
          <img
            src={require("./../../../assets/img/kanban/just-min-img.svg")}
            alt="book their calender warning"
            className="just-min-img"
          />
          <h1 className="add-meeting-title add-meeting-title--create-module mb-0">
            {/*The completed stage cant be updated or deleted*/}Just a min!
          </h1>
          <p className="font-14-semibold delete-stage-with-task-warning-para">
            You havent added to the “name” , “name” &amp; “name”’s schedule.
            <br />
            Dont worry you can go back and add it, if you skip however the task
            will
            <br />
            be added to their pipeline{" "}
          </p>
          <div className="row mx-0 align-items-center justify-content-center">
            <GrayButtonSmallFont
              text={"Go Back"}
              extraClassName={"delete-stage-with-task-warning-go-btn mr-30"}
              onClick={onCloseModal}
            />
            <GreenButtonSmallFont
              text={"Add their pipeline"}
              extraClassName={"book-thrir-calender-warning-green-btn"}
              onClick={onCloseModal}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
