import React, { Component } from "react";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";

export class VideoCallingChatTabPanel extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
    };
  }

  /*=======================================================================
            handlers
  =======================================================================*/

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*=======================================================================
            main
  =======================================================================*/
  render() {
    return (
      <div className="row mx-0 flex-nowrap align-items-center vc-chat-tab-send-message-block">
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--vc-chat-tab"
          label=""
          name="message"
          value={this.state.message}
          onChange={this.handleOnChange}
          type="text"
          placeholder="Type Your Response"
        />
        <button className="chat-tab-send-button">
          <img
            src={require("../../../assets/img/video-calling/new-chat-send-icon.svg")}
            alt=""
          />
        </button>
      </div>
    );
  }
}

export default VideoCallingChatTabPanel;
