import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import VideoCallingChatTabPanel from "./VideoCallingChatTabPanel";
import VideoCallingParticipantsTabPanel from "./VideoCallingParticipantsTabPanel";

export class VideoCallingChatAndParticipantsTabs extends Component {
  /*=======================================================================
        handlers
  =======================================================================*/

  handleOnSelect = (val) => {
    // activeVideoCallingTabIndex
    localStorage.setItem("activeVideoCallingTabIndex", val);
  };

  /*=================================================================
      main
  ==================================================================*/
  render() {
    return (
      <div>
        <div className="vc-right-slider-time-block">
          <time className="vc-right-slider-time-text"> 23.43 AM</time>
        </div>
        <div className="profile_tabs_section profile_tabs_section--shadow-simple-tabs profile_tabs_section--vc-chat-participants">
          <Tabs
            defaultIndex={parseInt(
              localStorage.getItem("activeVideoCallingTabIndex")
            )}
            onSelect={this.handleOnSelect}
          >
            <TabList>
              <Tab>Chat</Tab>
              <Tab>Participants</Tab>
            </TabList>
            <TabPanel>
              <VideoCallingChatTabPanel />
            </TabPanel>
            <TabPanel>
              <VideoCallingParticipantsTabPanel />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default VideoCallingChatAndParticipantsTabs;
