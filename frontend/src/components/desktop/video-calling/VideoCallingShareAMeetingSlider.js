import React, { Component } from "react";
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

export class VideoCallingShareAMeetingSlider extends Component {
  constructor() {
    super();
    this.state = {
      isAddParticipantClicked: false,
      selectedOption: null,
    };
  }

  /*=======================================================================
            handlers
  =======================================================================*/
  handleOnClickCopyLink = () => {
    console.log("clicked on copy link");
  };

  handleOnClickAddParticipant = () => {
    this.setState({
      isAddParticipantClicked: !this.state.isAddParticipantClicked,
    });
  };

  handleChangeOption = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleRemoveMember = () => {
    console.log("member delete");
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  /*=======================================================================
            renderAddParticipants
  =======================================================================*/
  renderAddParticipants = () => {
    return (
      <div>
        <div className="vc-share-meeting-slider-card__title-block vc-share-meeting-slider-card__title-block--add-participant row mx-0 align-items-center">
          <i
            className="fa fa-chevron-left"
            onClick={this.handleOnClickAddParticipant}
          ></i>
          <h3>Add Participants</h3>
        </div>

        <div className="vc-share-meeting-slider-card__add-participant-block add-participate-inner-div">
          <div className="row mx-0 align-items-center mb-20">
            <div>
              <Select
                className="react-select-container react-select-container--addMember react-select-container--addparticipant-vc-slider "
                classNamePrefix="react-select-elements"
                value={this.state.selectedOption}
                onChange={this.handleChangeOption}
                options={options}
                placeholder="Select Members"
                isSearchable={false}
              />
            </div>
          </div>
          <div className="row mx-0">
            <h5 className="font-13-regular">Selected participants</h5>
          </div>
          <div className="row mx-0 flex-nowrap share-link-member-img calendar-add-meeting-modal-list-overflow--schedule-later vc-addparticipant-list-overflow">
            {imgList.map((key, data) => (
              <div
                key={key}
                className="create-project-add-member-img-text-block"
              >
                <div className="create-project-add-member-img-block">
                  <img
                    src={require("../../../assets/img/video-calling/new-add-participant-icon.svg")}
                    alt="member"
                    className="create-project-add-member-img-block__imgMember"
                  />
                  <i
                    className="fa fa-close create-project-add-member-img-block__remove"
                    onClick={this.handleRemoveMember}
                  ></i>
                  <h5 className="font-13-bold pt-10">Jen Doe</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="row mx-0 justify-content-center pt-20">
            <GreenButtonSmallFont
              text="Send Invite"
              extraClassName="vc-share-meeting-slider-card__add-participant-block-btn"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  };

  /*=======================================================================
            main
  =======================================================================*/
  render() {
    const { isAddParticipantClicked } = this.state;
    return (
      <div className="vc-share-meeting-slider-card">
        {!isAddParticipantClicked ? (
          <>
            <div className="vc-share-meeting-slider-card__title-block">
              <h3>Share meeting link</h3>
            </div>
            <div className="row mx-0 vc-share-meeting-slider-card__buttons-block">
              {/*<button
                className="vc-share-meeting-slider-card__button"
                onClick={this.handleOnClickCopyLink}
              >
                Copy meeting link
              </button>
              <button
                className="vc-share-meeting-slider-card__button"
                onClick={this.handleOnClickAddParticipant}
              >
                Add Participants
              </button>*/}
              <div
                onClick={this.handleOnClickCopyLink}
                className="vc-share-meeting-slider-card__button-outer-div "
              >
                <div className="vc-share-meeting-slider-card__button"></div>
                <span>Copy meeting link</span>
              </div>
              <div
                onClick={this.handleOnClickAddParticipant}
                className="vc-share-meeting-slider-card__button-outer-div mr-0"
              >
                <div className="vc-share-meeting-slider-card__button"></div>
                <span>Add Participants</span>
              </div>
            </div>
          </>
        ) : (
          this.renderAddParticipants()
        )}
      </div>
    );
  }
}

export default VideoCallingShareAMeetingSlider;
