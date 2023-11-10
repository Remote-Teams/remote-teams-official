import React from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import { workspaceId } from "./../../../store/actions/config";

class LoginFlowDashboardDoneModal extends React.Component {
  state = {
    open: false,
  };

  componentDidMount() {
    // activeProfileTabIndex
    localStorage.setItem("activeProfileTabIndex", 3);
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handlYes = () => {
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:3000/dashboard`;
    } else {
      window.location.href = `https://${workspaceId}.remote-teams.io/dashboard`;
    }
  };

  render() {
    const { open } = this.state;
    let userData = JSON.parse(localStorage.getItem("UserData"));
    return (
      <>
        <div className="text-center login-form-next-btn-div">
          <GreenButtonSmallFont text="Done" onClick={this.onOpenModal} />
        </div>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--loginDone",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="login-flow-done-modal-content">
            <div className="login-setup-done-img-block">
              <img
                src={require("../../../assets/img/illustrations/login-setup-done-modal.svg")}
                alt=""
              />
            </div>
            <h1 className="font-24-semiBold">
              Great!! You are all set to start Using
              <br /> throtl
            </h1>
            <p className="font-24-semiBold">
              you can find everything in settings if you want to change it in
              future
            </p>
            {userData.demo ? (
              <GreenButtonSmallFont text="Yes" onClick={this.handlYes} />
            ) : (
              // <GreenLinkSmallFont path="/dashboard" text="Start Using" />
              <GreenLinkSmallFont path="/profile" text="Start Using" />
            )}
          </div>
        </Modal>
      </>
    );
  }
}

export default LoginFlowDashboardDoneModal;
