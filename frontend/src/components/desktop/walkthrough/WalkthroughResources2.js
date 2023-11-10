import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Redirect } from "react-router-dom";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class WalkthroughResources2 extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      redirect: false,
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
    var userData = JSON.parse(localStorage.getItem("UserData"));
    if (!isEmpty(userData)) {
      alert("Update Flag");
      // let user = userData;
      // user.demo = false;
      // this.props.updateUserDemoWalkthroughFlag(
      //   user.id,
      //   user,
      //   this.callBackUpdateWalkthrough
      // );
    }
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
      redirect: true,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "finances-1",
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    const { redirect } = this.state;
    return (
      <Fragment>
        {redirect && <Redirect to="/finances" />}
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
              "customModal customModal--walkthrough customModal--walkthrough-resources-2",
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
                    Plan their schedule
                  </h2>
                </div>
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-75">
                    You can check the schedule and the availability of your team
                    members here which will help in planning your work.
                  </p>
                  <p className="new-walkthrough__desc new-walkthrough__desc--white">
                    You can check teams schedule by using this button
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
                    src={require("../../../assets/img/walkthrough/icons/resources-2.svg")}
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

export default connect(null, { updateUserDemoWalkthroughFlag })(
  WalkthroughResources2
);
