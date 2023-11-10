import React, { Component } from "react";
import Modal from "react-responsive-modal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import Select from "react-select";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

const options = [
  { value: "Lorem 1", label: "Lorem 1" },
  { value: "Lorem 2", label: "Lorem 2" },
  { value: "Lorem 3", label: "Lorem 3" },
  { value: "Lorem 4", label: "Lorem 4" },
  { value: "Lorem 5", label: "Lorem 5" },
];

const imgList = [1, 2, 3];

export class VideoCallingShareMeetingLink extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      openTwo: false,
      selectedOption: null,
    };
  }
  /*=========================================
              open modal
  =========================================*/
  openModal = () => {
    this.setState({
      open: true,
    });
  };

  openModalTwo = () => {
    this.setState({
      openTwo: true,
    });
  };

  /*=========================================
              close Modal
  =========================================*/
  onCloseModal = () => {
    this.setState({
      open: false,
      openTwo: false,
    });
  };
  onCloseTwo = () => {
    this.setState({
      openTwo: false,
    });
  };
  /*=========================================
              handler
  =========================================*/
  handleRemoveMember = () => {
    console.log("member delete");
  };

  handleSubmit = () => {
    console.log(this.state);
    this.setState({
      open: false,
      openTwo: false,
    });
  };
  handleChangeOption = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  handleCopy = () => {
    console.log("Link copy");
  };
  /*=========================================

             render modal

=========================================*/

  renderModal = () => {
    const { open } = this.state;
    return (
      <div>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={true}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--videoCallingShareMeetingLink",
            closeButton: "customCloseButton",
          }}
        >
          {/**freightsans-30-semibold */}
          <h2 className="video-calling-share-meeting-link-title  pt-53 mb-15  text-center">
            Share meeting link
          </h2>
          <div className="share-link-column-div">
            <div className="row mx-0 align-items-center justify-content-between meeting-link-div">
              <div className="meeting-link-text-div">
                <h5>meeting Link</h5>
              </div>
              <div className="meeting-link-img-div">
                <img
                  src={require("../../../assets/img/video-calling/new-copy-icon.svg")}
                  alt="share meeting copy "
                  onClick={this.handleCopy}
                />
              </div>
            </div>
            <h5 className="font-20-Kollektif-Italic or-padding-div">or</h5>
            <GrayButtonSmallFont
              text="Add Participants"
              onClick={this.openModalTwo}
              extraClassName="share-meeting-link-btn"
            />
          </div>
        </Modal>
      </div>
    );
  };

  /*=========================================

             render modal

=========================================*/
  renderModalTwo = () => {
    const { openTwo } = this.state;
    return (
      <div>
        <Modal
          open={openTwo}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={true}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--videoCallingShareMeetingLink customModal--videoCallingShareMeetingLink--add",
            closeButton: "customCloseButton",
          }}
        >
          <div>
            <div className="row justify-content-center position-relative mx-0 mb-15 mt-30">
              <div
                className="row mx-0 share-link-back-arrow"
                onClick={this.onCloseTwo}
              >
                <i className="fa fa-chevron-left"></i>
              </div>
              <h2 className="video-calling-share-meeting-link-title video-calling-share-meeting-link-title--add-partcipant  text-center">
                Add Participants
              </h2>
            </div>
            <div className="add-participate-inner-div">
              <div className="row mx-0 align-items-center mb-20">
                <div>
                  <Select
                    className="react-select-container react-select-container--addMember react-select-container--addparticipant "
                    classNamePrefix="react-select-elements"
                    value={this.state.selectedOption}
                    onChange={this.handleChangeOption}
                    options={options}
                    placeholder="Select Members"
                    isSearchable={false}
                  />
                </div>
                {/*<h5 className="font-20-Kollektif-Italic add-participants-or-padding-div">
                  or
        </h5>*/}
                <div className="copy-link-div row mx-0 align-items-center justify-content-between">
                  <div className="copy-link-img-div">
                    <img
                      src={require("../../../assets/img/video-calling/new-copy-icon.svg")}
                      alt="share meeting copy "
                      onClick={this.handleCopy}
                    />
                  </div>
                  <div className="copy-link-text">
                    <h5>Copy Link</h5>
                  </div>
                </div>
              </div>
              <div className="row mx-0 pt-40">
                <h5 className="font-13-regular">Selected participants</h5>
              </div>
              <div className="row mx-0 share-link-member-img calendar-add-meeting-modal-list-overflow--schedule-later">
                {imgList.map((key, data) => (
                  <div
                    key={key}
                    className="create-project-add-member-img-text-block"
                  >
                    <div className="create-project-add-member-img-block">
                      <img
                        src={require("../../../assets/img/video-calling/new-add-participant-icon.svg")}
                        //src={require("../../../assets/img/dummy/access-role-resource.svg")}
                        alt="member"
                        className="create-project-add-member-img-block__imgMember"
                      />
                      <i
                        className="fa fa-close create-project-add-member-img-block__remove"
                        onClick={this.handleRemoveMember}
                      ></i>
                      <h5 className="font-16-semiBold pt-14">Jen Doe</h5>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right pt-20">
                <GreenButtonSmallFont
                  text="Send Invite"
                  extraClassName="share-link-button"
                  onClick={this.handleSubmit}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  /*=========================================

             render

=========================================*/
  render() {
    return (
      <div>
        {this.renderModal()}
        {this.renderModalTwo()}
        {/* <button className="login-dashboard-btn" onClick={this.openModal}>
          Schedule Later
        </button> */}
      </div>
    );
  }
}

export default VideoCallingShareMeetingLink;
