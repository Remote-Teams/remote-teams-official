import React, { Component } from "react";
import Modal from "react-responsive-modal";

export class OverviewDemoModalFirstTimeUser extends Component {
  constructor() {
    super();
    this.state = {
      openDemo: true,
    };
  }

  onCloseHandler = () => {
    this.setState({
      openDemo: false,
    });
  };
  render() {
    return (
      <div>
        <Modal
          onClose={() => console.log("Unable to close")}
          open={this.state.openDemo}
          // onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "",
            modal: "",
            closeButton: "",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseHandler} />
          <div>Throttle Demo</div>
        </Modal>
      </div>
    );
  }
}

export default OverviewDemoModalFirstTimeUser;
