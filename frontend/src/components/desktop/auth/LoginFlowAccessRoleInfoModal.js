import React from "react";
import Modal from "react-responsive-modal";
import AccessRoleInfoColumns from "../common/AccessRoleInfoColumns";

class LoginFlowAccessRoleInfoModal extends React.Component {
  state = {
    open: false,
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <div>
        <p
          className="font-18-semiBold text-underline mt-30 mb-30 cursor-pointer check-access-roles-text"
          onClick={this.onOpenModal}
        >
          Check access roles
        </p>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--accessRoleInfo",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          {/* content */}
          <div className="access-role-info-modal-contetnt">
            <h1 className="font-24-semiBold access-role-info-heading">
              Here are the default roles
            </h1>
            <div className="row mx-auto align-items-start flex-nowrap">
              <AccessRoleInfoColumns />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginFlowAccessRoleInfoModal;
