import React, { Component } from "react";

const dummyData = [1, 2, 3, 4, 5];

export class VideoCallingParticipantsTabPanel extends Component {
  constructor() {
    super();
    this.state = {
      isVideoMute: false,
      isAudioMute: false,
    };
  }

  /*=======================================================================
            handlers
  =======================================================================*/

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

  /*=======================================================================
            main
  =======================================================================*/
  render() {
    const { isVideoMute, isAudioMute } = this.state;
    return (
      <div className="vc-chat-participant-card-overflow-div">
        {dummyData.map((data, index) => (
          <div
            key={index}
            className={
              index === 0
                ? "vc-chat-participant-card-outer-div vc-chat-participant-card-outer-div--active1"
                : "vc-chat-participant-card-outer-div"
            }
          >
            <div className="row mx-0 flex-nowrap align-items-center vc-chat-participant-card">
              <div className="vc-chat-participant-img-block vc-chat-participant-img-block--active">
                <img
                  src={require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg")}
                  alt="participant"
                />
              </div>
              <div>
                <h4 className="vc-chat-participant-name">Jen Doe</h4>
                <div className="row mx-0 flex-nowrap vc-chat-video-audio-block">
                  <button
                    className="vc-chat-video-audio-block__video-btn"
                    onClick={this.handleOnClickVideoMuteUnmute}
                  >
                    {isVideoMute ? (
                      <img
                        src={require("../../../assets/img/video-calling/new-participant-video-icon.svg")}
                        alt="video"
                      />
                    ) : (
                      <img
                        src={require("../../../assets/img/video-calling/new-participant-video-mute-icon.svg")}
                        alt="video mute"
                      />
                    )}
                  </button>

                  <button
                    className="vc-chat-video-audio-block__audio-btn"
                    onClick={this.handleOnClickAudioMuteUnmute}
                  >
                    {isAudioMute ? (
                      <img
                        src={require("../../../assets/img/video-calling/new-participant-audio-icon.svg")}
                        alt="audio"
                        className="vc-chat-video-audio-block__audio-green-img"
                      />
                    ) : (
                      <img
                        src={require("../../../assets/img/video-calling/new-participant-audio-mute-icon.svg")}
                        alt="audio mute"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default VideoCallingParticipantsTabPanel;
