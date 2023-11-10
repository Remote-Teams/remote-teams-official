import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import VideoCallingChatAndParticipantsTabs from "./VideoCallingChatAndParticipantsTabs";
import VideoCallingJoinedUserCard from "./VideoCallingJoinedUserCard";
import VideoCallingShareAMeetingSlider from "./VideoCallingShareAMeetingSlider";
import VideoCallingShareMeetingLink from "./VideoCallingShareMeetingLink";

export class VideoCallingJoinedMainScreen extends Component {
  constructor() {
    super();
    this.state = {
      isVideoMute: false,
      isAudioMute: false,
      isRedirectToRejoin: false,
      isDisplayRightSlider: false,
      isDisplayShareMeetingSlider: false,
    };
  }

  /*=======================================================================
        handlers
  =======================================================================*/

  onClickCloseRightSlider = () => {
    localStorage.setItem("activeVideoCallingTabIndex", 0);
    this.setState({
      isDisplayRightSlider: false,
    });
  };

  onClickCloseShareMeetingSlider = () => {
    this.setState({
      isDisplayShareMeetingSlider: false,
    });
  };

  /*=======================================================================
        renderVideoAudioLeaveCallBtns
  =======================================================================*/

  // handlers
  handleOnClickVideoMuteUnmute = () => {
    this.setState({
      isVideoMute: !this.state.isVideoMute,
    });
  };

  handleOnClickAudioMuteUnmute = () => {
    this.setState({
      isAudioMute: !this.state.isAudioMute,
    });
  };

  handleOnClickLeaveMeetingButton = () => {
    this.setState({
      isRedirectToRejoin: true,
    });
  };

  // renderVideoAudioLeaveCallBtns
  renderVideoAudioLeaveCallBtns = () => {
    const { isVideoMute, isAudioMute } = this.state;

    return (
      <div className="vc-menu-username-colm2__1">
        <button
          className="vc-menu-icons-btn"
          onClick={this.handleOnClickVideoMuteUnmute}
        >
          {isVideoMute ? (
            <img
              //src={require("../../../assets/img/video-calling/video-unmute-icon.svg")}
              src={require("../../../assets/img/video-calling/new-video-unmute-icon.svg")}
              alt="video"
              className="vc-menu-icons"
            />
          ) : (
            <img
              //src={require("../../../assets/img/video-calling/video-mute-icon.svg")}
              src={require("../../../assets/img/video-calling/new-video-mute-icon.svg")}
              alt="mute video"
              className="vc-menu-icons"
            />
          )}
        </button>
        <button
          className="vc-menu-icons-btn"
          onClick={this.handleOnClickAudioMuteUnmute}
        >
          {isAudioMute ? (
            <img
              //src={require("../../../assets/img/video-calling/audio-unmute-icon.svg")}
              src={require("../../../assets/img/video-calling/new-audio-icon.svg")}
              alt="audio"
              className="vc-menu-icons"
            />
          ) : (
            <img
              //src={require("../../../assets/img/video-calling/audio-mute-icon.svg")}
              src={require("../../../assets/img/video-calling/new-audio-mute-icon.svg")}
              alt="mute audio"
              className="vc-menu-icons"
            />
          )}
        </button>
        <button
          className="vc-menu-icons-btn"
          onClick={this.handleOnClickLeaveMeetingButton}
        >
          <img
            //src={require("../../../assets/img/video-calling/video-leave-icon.svg")}
            src={require("../../../assets/img/video-calling/new-video-leave-icon.svg")}
            alt="leave meeting"
            className="vc-menu-icons"
          />
        </button>
      </div>
    );
  };

  /*=======================================================================
        renderChatParticipantsShareLinkBtns
  =======================================================================*/

  // handlers
  handleOnClickChatIcon = () => {
    this.setState({
      isDisplayRightSlider: true,
    });
  };

  handleOnClickParticipantsIcon = () => {
    localStorage.setItem("activeVideoCallingTabIndex", 1);
    this.setState({
      isDisplayRightSlider: true,
    });
  };

  onClickShareAMeetingButton = () => {
    this.setState({
      isDisplayShareMeetingSlider: true,
    });
  };

  // renderChatParticipantsShareLinkBtns
  renderChatParticipantsShareLinkBtns = () => {
    return (
      <div className="vc-menu-username-colm2__2">
        <button
          className="vc-menu-icons-btn"
          onClick={this.handleOnClickChatIcon}
        >
          <img
            //src={require("../../../assets/img/video-calling/video-chat-icon.svg")}
            src={require("../../../assets/img/video-calling/new-chat-icon.svg")}
            alt="chat"
            className="vc-menu-icons"
          />
        </button>
        <button
          className="vc-menu-icons-btn"
          onClick={this.handleOnClickParticipantsIcon}
        >
          <img
            //src={require("../../../assets/img/video-calling/video-participant-icon.svg")}
            src={require("../../../assets/img/video-calling/new-participant-icon.svg")}
            alt="participants"
            className="vc-menu-icons"
          />
        </button>
        <button
          className="vc-menu-icons-btn"
          onClick={this.onClickShareAMeetingButton}
        >
          <img
            //src={require("../../../assets/img/video-calling/video-share-link-icon.svg")}
            src={require("../../../assets/img/video-calling/new-share-icon.svg")}
            alt="share meeting link"
            className="vc-menu-icon-share-link"
          />
          {/*Share Meeting*/}
        </button>
      </div>
    );
  };

  /*=======================================================================
        main
  =======================================================================*/
  render() {
    const {
      isVideoMute,
      isRedirectToRejoin,
      isDisplayRightSlider,
      isDisplayShareMeetingSlider,
    } = this.state;

    return (
      <>
        {/* share meeting link modal */}
        <VideoCallingShareMeetingLink />

        {/* on click leave meeting redirecting to /video-call-rejoin */}
        {isRedirectToRejoin && <Redirect to="/video-call-rejoin" />}

        {/* right slider */}
        {isDisplayRightSlider && (
          <div className="vc-right-slider vc-right-slider--slideIn">
            <span
              className="closeIconInModal"
              onClick={this.onClickCloseRightSlider}
            />
            <VideoCallingChatAndParticipantsTabs />
          </div>
        )}
        {/* share meeting slider */}
        {isDisplayShareMeetingSlider && (
          <div className="vc-share-meeting-slider">
            <span
              className="closeIconInModal"
              onClick={this.onClickCloseShareMeetingSlider}
            />
            <VideoCallingShareAMeetingSlider />
          </div>
        )}
        {/* main screen first fold */}
        <div className="vc-joined-main-screen-first-fold">
          {isVideoMute ? (
            <VideoCallingJoinedUserCard />
          ) : (
            <img
              src={require("../../../assets/img/video-calling/single-user.png")}
              alt=""
              className="vc-single-user-img"
            />
          )}
        </div>
        {/* main screen second fold */}
        <div className="vc-joined-main-screen-menu-fold">
          <div className="row mx-0 align-items-center">
            <div className="row flex-nowrap ml-0 align-items-center vc-menu-username-colm1">
              <div className="vc-menu-joined-user-img-block">
                <img
                  src={require("../../../assets/img/video-calling/new-add-participant-icon.svg")}
                  alt="user"
                />
              </div>
              <div>
                <h3 className="vc-menu-user-name">Jean Sean</h3>
                <h4 className="vc-menu-user-post"> Host</h4>
              </div>
            </div>

            <div className="row mx-0 align-items-center justify-content-between vc-menu-username-colm2">
              {this.renderVideoAudioLeaveCallBtns()}
              {this.renderChatParticipantsShareLinkBtns()}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default VideoCallingJoinedMainScreen;
