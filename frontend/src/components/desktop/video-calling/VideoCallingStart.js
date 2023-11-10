import React, { Component } from "react";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export class VideoCallingStart extends Component {
  render() {
    return (
      <div className="video-calling-start row mx-0">
        <div className="video-calling-start-left-section">
          <div className="start-video-calling-left-img-div">
            <img
              src={require("../../../assets/img/video-calling/video-home-img.svg")}
              alt="video call start"
            />
          </div>
        </div>
        <div className="video-calling-start-right-section">
          <div className="start-video-calling-right-img-div">
            {/*<img
              src={require("../../../assets/img/video-calling/user-profile.svg")}
              alt="video call user profile"
            />*/}
          </div>
          <h5 className="video-calling-font-30-bold">Jen Doe</h5>
          <h5 className="font-18-bold font-18-bold--host">Host</h5>
          <h5 className="freightsans-font-30-semibold">
            Waiting for the host to start
            <br /> /Let you in
          </h5>

          <h5 className="freightsans-font-30-semibold mb-40">
            The link is ready to join!
          </h5>
          <div className="video-calling-home-button-div ">
            <GreenLinkSmallFont path="/video-call-joined" text="Join Now" />
          </div>
        </div>
      </div>
    );
  }
}

export default VideoCallingStart;
