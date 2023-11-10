import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";
import { withRouter } from "react-router-dom";

class AskHimForWalkthrough extends Component {
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
    this.props.history.push("/dashboard");
    this.setState({
      open: false,
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
              "customModal customModal--walkthrough customModal--walkthrough-dashboard-1",
            closeButton: "customCloseButton",
          }}
        >
          <div className="new-walkthrough new-walkthrough--dashboard-1">
            <div className="row mx-0">
              <div className="col-9 px-0">
                <h2 className="new-walkthrough__title">
                  Do you want to start entire walkthrough
                </h2>
              </div>
              <div className="col-3 px-0 align-self-center">
                <p
                  className="skip-walkthrough-text text-right"
                  onClick={this.onCloseModal}
                >
                  Skip Walkthrough
                </p>
              </div>
              <div className="col-9 px-0">
                <p className="new-walkthrough__desc new-walkthrough__desc--opacity-75">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex
                </p>
                <div className="new-walkthrough__see-through-block ">
                  <button
                    className="new-walkthrough__button"
                    onClick={this.onClickNext}
                  >
                    Let's start
                  </button>
                </div>
              </div>
              <div className="col-3 px-0 text-right align-self-end">
                <img
                  src={require("../../../assets/img/walkthrough/icons/dashboard-1.svg")}
                  alt=""
                  className="new-walkthrough--dashboard-1__img"
                />
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { updateUserDemoWalkthroughFlag })(
  withRouter(AskHimForWalkthrough)
);
