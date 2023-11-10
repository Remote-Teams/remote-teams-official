import React, { Component } from "react";
import GanttChart from "./GanttChart";

const data = {
  data: [
    {
      id: 1,
      text: "Task #1",
      start_date: new Date(),
      duration: 3,
      progress: 0.6,
    },
    {
      id: 2,
      text: "Task #2",
      start_date: new Date(),
      duration: 3,
      progress: 0.4,
    },
    {
      id: 3,
      text: "Task #3",
      start_date: new Date(),
      duration: 3,
      progress: 0.4,
    },
  ],
  // links: [{ id: 1, source: 1, target: 2, type: "0" }]
};

class DisplayGanttChart extends Component {
  onCreateLink = (link) => {
    console.log(link);
  };
  onUpdateTask = (task, props) => {
    console.log(task, props);
    console.log("hello");
    // this.setState({ data: [...this.state.data] });
  };

  // logDataUpdate = (entityType, action, itemData, id) => {
  //   let text = itemData && itemData.text ? ` (${itemData.text})` : "";
  //   let message = `${entityType} ${action}: ${id} ${text}`;
  //   if (entityType === "link" && action !== "delete") {
  //     message += ` ( source: ${itemData.source}, target: ${itemData.target} )`;
  //   }
  //   console.log("helo");
  // };

  render() {
    return (
      <div className="text-center mt-5">
        <h1>Gantt Chart</h1>
        <div className="gantt-container px-5">
          <GanttChart
            tasks={data}
            // onDataUpdated={this.logDataUpdate}
            // onCreateLink={this.onCreateLink}
          />
        </div>
      </div>
    );
  }
}

export default DisplayGanttChart;
