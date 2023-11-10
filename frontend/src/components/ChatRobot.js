import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";

export class ChatRobot extends Component {
  constructor() {
    super();
    this.state = {
      user: "akshay",
    };
  }
  render() {
    return (
      <div>
        <ChatBot
          speechSynthesis={{ enable: true, lang: "en" }}
          headerTitle={`chat with ${this.state.user}`}
          botAvatar={
            "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blend.png"
          }
          opened={false}
          floating={true}
          floatingIcon={
            "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blend.png"
          }
          userAvatar={
            "http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blend.png"
          }
          placeholder={"Type Your Response"}
          steps={[
            {
              id: "1",
              message: "What number I am thinking?",
              trigger: "2",
            },
            {
              id: "2",
              options: [
                { value: 1, label: "Number 1", trigger: "4" },
                { value: 2, label: "Number 2", trigger: "3" },
                { value: 3, label: "Number 3", trigger: "3" },
              ],
            },
            {
              id: "3",
              message: "Wrong answer, try again.",
              trigger: "2",
            },
            {
              id: "4",
              message: "Awesome! You are a telepath!",
              end: true,
            },
          ]}
        />
      </div>
    );
  }
}

export default ChatRobot;
