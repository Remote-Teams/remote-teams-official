import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class OverviewDemoNewDashboard2 extends Component {
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

  callBackUpdateWalkthrough = (status) => {
    console.log(status);
    if (status === 200) {
      this.setState({
        open: false,
      });
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "",
      });
    }
  };

  onCloseModal = () => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    if (!isEmpty(userData)) {
      let user = userData;
      user.demo = false;
      this.props.updateUserDemoWalkthroughFlag(
        user.id,
        user,
        this.callBackUpdateWalkthrough
      );
    }
  };

  onClickNext = () => {
    this.setState({
      open: false,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "navbar-1",
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
              "customModal customModal--walkthrough customModal--walkthrough-dashboard-2",
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
                    This is the dashboard
                  </h2>
                </div>
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-75">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex
                  </p>
                  <div className="new-walkthrough__see-through-block ">
                    <button
                      className="new-walkthrough__button"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col-3 px-0 text-center align-self-end">
                  <img
                    src={require("../../../assets/img/walkthrough/icons/dashboard-2.svg")}
                    alt=""
                    className="new-walkthrough--dashboard-2__img"
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

export default connect(null, { updateUserDemoWalkthroughFlag })(
  OverviewDemoNewDashboard2
);
