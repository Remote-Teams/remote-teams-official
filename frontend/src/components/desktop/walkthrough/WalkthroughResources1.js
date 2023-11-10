import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class WalkthroughResources1 extends Component {
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
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "resources-2",
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
              "customModal customModal--walkthrough customModal--walkthrough-resources-1",
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
                    This is the resources section
                  </h2>
                </div>
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-75">
                    Where you can see information about your team members and
                    add more members to your organization
                  </p>
                  <p className="new-walkthrough__desc new-walkthrough__desc--opacity-51">
                    You can get more information about the resource by using the
                    view button in the resource card.
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
                    src={require("../../../assets/img/walkthrough/icons/resources-1.svg")}
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
  WalkthroughResources1
);
