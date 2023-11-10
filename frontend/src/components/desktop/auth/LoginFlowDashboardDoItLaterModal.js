import React from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import { workspaceId } from "./../../../store/actions/config";

class LoginFlowDashboardDoItLaterModal extends React.Component {
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
      <div>
        <div className="text-center login-form-next-btn-div">
          <GreenButtonSmallFont text="Do It Later" onClick={this.onOpenModal} />
        </div>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--loginDoItLater",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="login-flow-do-it-later-modal-content">
            <div className="login-setup-do-it-later-img-block">
              <img
                src={require("../../../assets/img/illustrations/login-setup-do-it-later-modal.svg")}
                alt=""
              />
            </div>
            <h1 className="font-24-semiBold">Want to complete this later?</h1>
            <p className="font-25-semiBold">
              Dont worry you can always finish setting up later from your
              profile and settings.
            </p>

            <div className="row mx-0 justify-content-around">
              <button
                className="login-dashboard-btn mr-25"
                onClick={this.onCloseModal}
              >
                No
              </button>

              {userData.demo ? (
                <GreenButtonSmallFont text="Yes" onClick={this.handlYes} />
              ) : (
                // <GreenLinkSmallFont path="/dashboard" text="Yes" />
                <GreenLinkSmallFont path="/profile" text="Yes" />
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginFlowDashboardDoItLaterModal;
