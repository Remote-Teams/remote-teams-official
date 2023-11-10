import React, { Component } from "react";

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class VideoCallingJoinedUserCard extends Component {
  constructor() {
    super();
    this.state = {
      isAudioMute: false,
    };
  }

  /*=======================================================================
        handlers
  =======================================================================*/

  handleOnClickAudioMuteUnmute = () => {
    this.setState({
      isAudioMute: !this.state.isAudioMute,
    });
  };

  /*=======================================================================
        main
  =======================================================================*/
  render() {
    const { isAudioMute } = this.state;
    return (
      <>
        <div className="vc-user-card-overflow-div">
          {dummyData.map((data, index) => (
            <div key={index} className="vc-user-card">
              <div className="vc-user-card__img-block">
                {index % 2 === 0 ? (
                  <img
                    src={require("../../../assets/img/video-calling/new-card-img.png")}
                    alt=""
                    className="vc-user-card__img"
                  />
                ) : (
                  <img
                    src={require("../../../assets/img/video-calling/new-card-img.png")}
                    alt=""
                    className="vc-user-card__img"
                  />
                )}
              </div>
              {/* pin fullscreen icon block */}
              <div className="vc-user-card__pin-fullscreen-icon-block">
                <button className="vc-user-card__pin-fullscreen-icon-block__pin-btn">
                  <img
                    src={require("../../../assets/img/video-calling/new-card-pin-icon.svg")}
                    alt="pin"
                  />
                </button>
                <button className="vc-user-card__pin-fullscreen-icon-block__fullscreen-btn">
                  <img
                    src={require("../../../assets/img/video-calling/new-card-fullscreen-icon.svg")}
                    alt="fullscreen"
                  />
                </button>
              </div>
              {/* audio icon and name block */}
              <div className="row mx-0 flex-nowrap align-items-center vc-user-card__audio-icon-and-name-block">
                <button onClick={this.handleOnClickAudioMuteUnmute}>
                  {isAudioMute ? (
                    <img
                      src={require("../../../assets/img/video-calling/new-participant-audio-icon.svg")}
                      alt="audio"
                    />
                  ) : (
                    <img
                      src={require("../../../assets/img/video-calling/new-participant-audio-mute-icon.svg")}
                      alt="audio mute"
                    />
                  )}
                </button>
                <h6 className="vc-user-card__audio-icon-and-name-block__title">
                  Jen Doe
                </h6>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default VideoCallingJoinedUserCard;
