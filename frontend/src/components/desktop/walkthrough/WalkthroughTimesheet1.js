import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class WalkthroughTimesheet1 extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
    };
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({
      open: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "",
    });
  };

  onClickNext = () => {
    this.setState({
      open: false,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "timesheet-2",
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    return (
      <Fragment>
        {/* content */}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay customOverlay--walkthrough",
            modal:
              "customModal customModal--walkthrough customModal--walkthrough-timesheet-1",
            closeButton: "customCloseButton",
          }}
        >
          <button
            className="closeIconInModal-walkthrough"
            onClick={this.onCloseModal}
          >
            <img
              src={require("../../../assets/img/walkthrough/close-modal-times-circle.svg")}
              alt="close modal"
            />
          </button>
          <div>
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-9 px-0">
                  <h2 className="new-walkthrough__title">
                    Lastly let's take a look at Timesheet
                  </h2>
                </div>
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-81">
                    This is where you can track your own tasks and check and
                    update their progress.
                  </p>
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-51">
                    You can use this button later to navigate to your Timesheet
                  </p>
                  <div className="new-walkthrough__see-through-block">
                    <button
                      className="new-walkthrough__button"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col-3 px-0 text-center align-self-center">
                  <img
                    src={require("../../../assets/img/walkthrough/icons/timesheet-1.svg")}
                    alt=""
                    className="new-walkthrough--navbar-1__img"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default WalkthroughTimesheet1;
