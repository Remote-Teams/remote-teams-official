import React, { Component } from "react";
import Gantt from "./Gantt/Gantt";
import Toolbar from "./Toolbar/Toolbar";
import MessageArea from "./MessageArea/MessageArea";

// const data = {
//   data: [
//     {
//       id: 1,
//       text: "Task #1",
//       start_date: "2020-06-12",
//       duration: 3,
//       progress: 0.6,
//     },
//     {
//       id: 2,
//       text: "Task #2",
//       start_date: "2020-06-16",
//       duration: 3,
//       progress: 0.4,
//     },
//   ],
//   links: [{ id: 1, source: 1, target: 2, type: "0" }],
// };

const data = {
  data: [
    {
      id: 1,
      text: "Module 1",
      start_date: new Date(),
      duration: 3,
      progress: 0.6,
    },
    {
      id: 2,
      text: "Module 2",
      start_date: new Date(),
      duration: 3,
      progress: 0.4,
    },
    {
      id: 3,
      text: "Module 3",
      start_date: new Date(),
      duration: 5,
      progress: 0.4,
    },
  ],
  // links: [{ id: 1, source: 1, target: 2, type: "0" }]
};

export class DispalyDhtmlGantt extends Component {
  state = {
    currentZoom: "Days",
    messages: [],
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [newMessate, ...this.state.messages];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    // let text = item && item.text ? ` (${item.text})` : "";
    // let message = `${type} ${action}: ${id} ${text}`;
    // if (type === "link" && action !== "delete") {
    //   message += ` ( source: ${item.source}, target: ${item.target} )`;
    // }
    // this.addMessage(message);
    console.log(item);
  };

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom,
    });
  };
  render() {
    const { currentZoom, messages } = this.state;
    return (
      <>
        <div className="dhtml_main_gantt">
          <div className="zoom-bar">
            <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange} />
          </div>
          <div className="gantt-container">
            <Gantt
              tasks={data}
              zoom={currentZoom}
              onDataUpdated={this.logDataUpdate}
            />
          </div>
          <MessageArea messages={messages} />
        </div>
      </>
    );
  }
}

export default DispalyDhtmlGantt;
