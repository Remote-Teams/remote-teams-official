import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Redirect } from "react-router-dom";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class WalkthroughAllProject1 extends Component {
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
      redirect: true,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "all-project-2",
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    const { redirect } = this.state;
    return (
      <Fragment>
        {redirect && <Redirect to="/all-projects" />}
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
              "customModal customModal--walkthrough customModal--walkthrough-all-roject-1",
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
                    Now lets move on to Projects!!
                  </h2>
                </div>
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-81">
                    Projects is where most of your work will happen!
                  </p>
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-51">
                    You can use this icon later to navigate to Projects section
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
                <div className="col-3 px-0 text-center align-self-center">
                  <img
                    src={require("../../../assets/img/walkthrough/icons/all-project-1.svg")}
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
  WalkthroughAllProject1
);
