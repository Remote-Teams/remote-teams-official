import React, { Component } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";

export class VideoCallingRejoin extends Component {
  render() {
    return (
      <>
        <div className="main-page-padding">
          <div className="row mx-0 justify-content-end">
            <GrayLinkSmallFont path="/video-calling" text="Go Back" />
          </div>
        </div>
        <div className="rejoin-div">
          <div className="rejoin-img-div">
            <img
              src={require("../../../assets/img/video-calling/new-rejoin.png")}
              alt="rejoin"
            />
          </div>
          <h5 className="rejoin-41-font-bold">you have left the call</h5>
          <div className="row align-items-center mx-0">
            <GrayLinkSmallFont
              path="/video-calling"
              text="Start New Meeting"
              extraClassName="rejoin-button"
            />
            <GreenLinkSmallFont
              path="/video-call-starting"
              //text="Rejoin"
              text="Rejoin Call"
              extraClassName="rejoin-button-two"
            />
          </div>
        </div>
      </>
    );
  }
}

export default VideoCallingRejoin;
