import React, { Component, Fragment } from "react";
import TimeLine from "./lib/TimeLine";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import store from "../../../store/store";
import {
  SET_GANTT_MODULE_POPUP_DATA,
  SET_AUTH_API_STATUS,
} from "./../../../store/types";
import {
  // updateModuleById,
  // updateSprintById,
  updateTaskById,
  getTaskCollaboraters,
} from "./../../../store/actions/projectAction";
import addDays from "date-fns/add_days";

const data = [
  {
    id: "92ee8260-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Task one",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2021-07-15T07:03:47.995Z"),
    end: new Date("2021-07-20T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:52:41.865Z"),
    updatedAt: new Date("2020-06-07T01:52:41.865Z"),
    color: "#FF5B3D",
  },
  {
    id: "c5e9a820-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Task two",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2021-07-16T07:03:47.995Z"),
    end: new Date("2021-07-21T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:07.396Z"),
    updatedAt: new Date("2020-06-07T01:54:07.396Z"),
    color: "#FF5B3D",
  },
];

const config = {
  header: {
    top: {
      //Tartget the month elements
      style: { backgroundColor: "#2d3135", fontSize: 15 }, //The style applied to the month elements
    },
    middle: {
      //Tartget elements displaying the day of week info
      style: { backgroundColor: "#2d3135", fontSize: 9 }, //The style applied to the day of week elements
      selectedStyle: { backgroundColor: "#b13525" }, //The style applied to the day of week elements when is selected
    },
    bottom: {
      //Tartget elements displaying the day number or time
      style: { background: "", fontSize: 9, borderLeft: "none" }, //the style tp be applied
      selectedStyle: { backgroundColor: "red", fontWeight: "bold" }, //the style tp be applied  when selected
    },
    month: {
      dateFormat: "MMMM  YYYY",
      style: {
        // background: "linear-gradient( grey, black)",
        textShadow: "0.5px 0.5px black",
        fontSize: 20,
      },
    },
    dayOfWeek: {
      style: {
        background: "linear-gradient( orange, grey)",
        fontSize: 9,
      },
    },
    dayTime: {
      style: {
        // background: "linear-gradient( grey, black)",
        fontSize: 9,
        color: "orange",
      },
      selectedStyle: {
        // background: "linear-gradient( #d011dd ,#d011dd)",
        fontWeight: "bold",
        color: "red",
      },
    },
  },
  // taskList: {
  //   // title: {
  //   //   label: "Task Todo",
  //   //   style: {
  //   //     background: "",
  //   //   },
  //   // },
  //   task: {
  //     style: {
  //       // backgroundColor: "#4d5258",
  //       color: "white",
  //     },
  //   },
  //   verticalSeparator: {
  //     style: {
  //       // backgroundColor: "#2d3135",
  //     },
  //     grip: {
  //       style: {
  //         // backgroundColor: "#48d226",
  //       },
  //     },
  //   },
  // },
  dataViewPort: {
    rows: {
      style: {
        backgroundColor: "transparent",
        borderBottom: "solid 1px silver",
      },
    },
    task: {
      showLabel: true,
      style: {
        borderRadius: 10,
        // boxShadow: "2px 2px 8px #888888",
        color: "black",
      },
      // selectedStyle: { border: "1px solid red", color: "black" },
    },
  },
};

class GanttChartTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemheight: 70,
      selectedItem: null,
      timelineMode: "month",
      nonEditableName: true,
      editModulePopup: false,
      editSprintPopup: false,
      editTaskPopup: false,
    };
  }

  /*========================================================
                    lIFECYCLE METHOD
=========================================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.ganttChartData) &&
      nextProps.ganttChartData !== nextState.ganttChartData
    ) {
      return {
        ganttChartData: nextProps.ganttChartData,
      };
    }
    if (!isEmpty(nextProps.apiStatus) && nextProps.apiStatus === 200) {
      store.dispatch({
        type: SET_AUTH_API_STATUS,
        payload: "",
      });
      return {
        editModulePopup: false,
        editSprintPopup: false,
        editTaskPopup: false,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.ganttChartData !== this.state.ganttChartData) {
      this.setState({
        ganttChartData: this.props.ganttChartData,
      });
    }
  }

  onCloseModal = () => {
    this.setState({
      editModulePopup: false,
      editSprintPopup: false,
      editTaskPopup: false,
    });
  };

  updateTaskHandler = (task, props) => {
    console.log(task, props);
    if (!isEmpty(this.state.ganttChartData)) {
      if (
        task.start.toISOString() === props.start.toISOString() &&
        task.end.toISOString() === props.end.toISOString()
      ) {
        console.log("open popup");
      } else {
        console.log("update task");

        let formData = task;
        formData.startDate = props.start.toISOString();
        formData.endDate = props.end.toISOString();
        // console.log(formData);
        this.props.updateTaskById(formData._id, formData);
      }
    }
  };

  onSelectItem = (item, open) => {
    this.setState({ selectedItem: item });
  };

  render() {
    const {
      ganttChartData,
      editModulePopup,
      editSprintPopup,
      editTaskPopup,
    } = this.state;

    // making data suitable for gantt chart

    // let finalArray = [];
    // if (!isEmpty(ganttChartData)) {
    //   ganttChartData.forEach((module) => {
    //     let data = module;
    //     data.type = "module";
    //     finalArray.push(data);
    //     if (!isEmpty(module)) {
    //       module.sprints.map((sprint) => {
    //         // console.log(sprint);
    //         if (!isEmpty(sprint) && !isEmpty(sprint._id)) {
    //           // console.log(finalArray);
    //           let data = sprint;
    //           data.type = "sprint";
    //           finalArray.push(data);
    //         }

    //         if (!isEmpty(sprint)) {
    //           sprint.tasks.map((task) => {
    //             if (!isEmpty(task)) {
    //               let data = task;
    //               data.type = "task";
    //               // console.log(task);
    //               finalArray.push(task);
    //             }
    //           });
    //         }
    //       });
    //       // console.log(module.sprints);
    //     }
    //   });
    // }

    let newArray = !isEmpty(ganttChartData)
      ? ganttChartData.map((element, index) => ({
          id: element._id,
          // status: "UPCOMING",
          name: element.name,
          start: new Date(element.startDate),
          end: new Date(element.endDate),
          // color:
          //   element.type === "module"
          //     ? "#70F84E"
          //     : element.type === "sprint"
          //     ? "#FC9747"
          //     : "#FF5B3D",
          ...element,
        }))
      : [
          {
            id: "dummyTask",
            // status: "UPCOMING",
            name: "",
            start: addDays(new Date(), 3).toISOString(),
            end: addDays(new Date(), 9).toISOString(),
          },
        ];

    if (!isEmpty(newArray)) {
      // console.log(newArray);
      return (
        <Fragment>
          <div className="time-line-container">
            <TimeLine
              data={newArray}
              mode={this.state.timelineMode}
              // links={this.state.links}
              config={config}
              onUpdateTask={this.updateTaskHandler}
              itemheight={this.state.itemheight}
              nonEditableName={this.state.nonEditableName}
              onSelectItem={this.onSelectItem}
              selectedItem={this.state.selectedItem}

              // onHorizonChange={this.onHorizonChange}
            />
          </div>
        </Fragment>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  ganttChartData: state.projects.ganttChartData,
  apiStatus: state.auth.apiStatus,
});

export default connect(mapStateToProps, {
  // updateModuleById,
  // updateSprintById,
  updateTaskById,
  getTaskCollaboraters,
})(GanttChartTimeline);
