import React from "react";
import { useState } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

function AddMemberWarning() {
  const [open, setOpen] = useState(false);

  const onCloseModal = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="members-fold-one-row__block-main"
      >
        <div className="members-fold-one-row__block-outer">
          <div className="members-fold-one-row__block-inner">
            <span className="members-fold-one-row__block-text-1">+</span>
          </div>
        </div>
        <p className="members-fold-one-row__block-text">new member</p>
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--add-member-warning-popup",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />

        <div className="add-member-warning-popup-div text-center">
          <img
            src={require("../../../assets/img/illustrations/add-member-warning-popup.png")}
            alt="add member warning popup"
            className="add-member-warning-popup"
          />
          <h2 className="add-member-warning-popup-text1">Uh-oh!</h2>
          <h3 className="add-member-warning-popup-text2">
            Looks you are trying to add more members to the workspace!!
          </h3>
          <h5 className="add-member-warning-popup-text3">
            You can add only 10 members to the free plan :(. Please upgrade to
            add more members!!
          </h5>
          <div className="row mx-0 align-items-center justify-content-center">
            <GrayButtonSmallFont
              text="Ok! Go Back"
              extraClassName="add-member-warning-popup-btn add-member-warning-popup-btn--grey"
              onClick={onCloseModal}
            />
            <GreenButtonSmallFont
              text="Check out Plans"
              extraClassName="add-member-warning-popup-btn"
              onClick={onCloseModal}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AddMemberWarning;
