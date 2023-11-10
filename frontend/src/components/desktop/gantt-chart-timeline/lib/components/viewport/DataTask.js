import React, { Component } from "react";
// import { Portal } from "react-portal";
import DateHelper from "./../../helpers/DateHelper";
import {
  MODE_NONE,
  MODE_MOVE,
  MOVE_RESIZE_LEFT,
  MOVE_RESIZE_RIGHT,
} from "./../../Const";
import { LINK_POS_LEFT, LINK_POS_RIGHT } from "./../../Const";
import Config from "./../../helpers/config/Config";
import isEmpty from "../../../../../../store/validations/is-empty";
import ViewGanttTask from "./../../../../all-project-planning/ViewGanttTask";
import ViewGantDummyTask from "./../../../../all-project-planning/ViewGantDummyTask";
import { SET_GANTT_TASK_EDIT_DATA } from "./../../../../../../store/types";
import store from "../../../../../../store/store";
import { connect } from "react-redux";
import { deleteTaskById } from "./../../../../../../store/actions/projectAction";
import { Fragment } from "react";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";

// const dummyData = [1, 2, 3];

class DataTask extends Component {
  constructor(props) {
    super(props);
    this.calculateStyle = this.calculateStyle.bind(this);
    this.state = {
      dragging: false,
      left: this.props.left,
      width: this.props.width,
      mode: MODE_NONE,
      itemSet: false,
      ganttChartData: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.ganttChartData) &&
      nextProps.ganttChartData !== nextState.ganttChartData
    ) {
      return {
        ganttChartData: nextProps.ganttChartData,
        itemSet: nextProps.ganttChartData.length > 0 && false,
      };
    }
    if (nextProps.ganttChartData && !nextState.hasSet) {
      if (nextProps.ganttChartData.length === 0) {
        return {
          itemSet: true,
          hasSet: true,
        };
      }
    }
    return null;
  }

  onCreateLinkMouseDown = (e, position) => {
    if (e.button === 0) {
      e.stopPropagation();
      this.props.onStartCreateLink(this.props.item, position);
    }
  };
  onCreateLinkMouseUp = (e, position) => {
    e.stopPropagation();
    this.props.onFinishCreateLink(this.props.item, position);
  };
  onCreateLinkTouchStart = (e, position) => {
    e.stopPropagation();
    this.props.onStartCreateLink(this.props.item, position);
  };
  onCreateLinkTouchEnd = (e, position) => {
    e.stopPropagation();
    this.props.onFinishCreateLink(this.props.item, position);
  };

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener("mousemove", this.doMouseMove);
      document.addEventListener("mouseup", this.doMouseUp);
      document.addEventListener("touchmove", this.doTouchMove);
      document.addEventListener("touchend", this.doTouchEnd);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener("mousemove", this.doMouseMove);
      document.removeEventListener("mouseup", this.doMouseUp);
      document.removeEventListener("touchmove", this.doTouchMove);
      document.removeEventListener("touchend", this.doTouchEnd);
    }

    if (this.props.ganttChartData !== this.state.ganttChartData) {
      this.setState({
        ganttChartData: this.props.ganttChartData,
      });
    }
  }

  dragStart(x, mode) {
    this.props.onChildDrag(true);
    this.draggingPosition = x;
    this.setState({
      dragging: true,
      mode: mode,
      left: this.props.left,
      width: this.props.width,
    });
  }
  dragProcess(x) {
    let delta = this.draggingPosition - x;
    let newLeft = this.state.left;
    let newWidth = this.state.width;

    switch (this.state.mode) {
      case MODE_MOVE:
        newLeft = this.state.left - delta;
        break;
      case MOVE_RESIZE_LEFT:
        newLeft = this.state.left - delta;
        newWidth = this.state.width + delta;
        break;
      case MOVE_RESIZE_RIGHT:
        newWidth = this.state.width - delta;
        break;
    }
    //the coordinates need to be global
    let changeObj = {
      item: this.props.item,
      position: {
        start: newLeft - this.props.nowposition,
        end: newLeft + newWidth - this.props.nowposition,
      },
    };
    this.props.onTaskChanging(changeObj);
    this.setState({ left: newLeft, width: newWidth });
    this.draggingPosition = x;
  }
  dragEnd() {
    this.props.onChildDrag(false);
    let new_start_date = DateHelper.pixelToDate(
      this.state.left,
      this.props.nowposition,
      this.props.dayWidth
    );
    let new_end_date = DateHelper.pixelToDate(
      this.state.left + this.state.width,
      this.props.nowposition,
      this.props.dayWidth
    );
    this.props.onUpdateTask(this.props.item, {
      start: new_start_date,
      end: new_end_date,
    });
    this.setState({ dragging: false, mode: MODE_NONE });
  }

  doMouseDown = (e, mode) => {
    if (!this.props.onUpdateTask) return;
    if (e.button === 0) {
      e.stopPropagation();
      this.dragStart(e.clientX, mode);
    }
  };
  doMouseMove = (e) => {
    if (this.state.dragging) {
      e.stopPropagation();
      this.dragProcess(e.clientX);
    }
  };
  doMouseUp = () => {
    this.dragEnd();
  };

  doTouchStart = (e, mode) => {
    if (!this.props.onUpdateTask) return;
    console.log("start");
    e.stopPropagation();
    this.dragStart(e.touches[0].clientX, mode);
  };
  doTouchMove = (e) => {
    if (this.state.dragging) {
      console.log("move");
      e.stopPropagation();
      this.dragProcess(e.changedTouches[0].clientX);
    }
  };
  doTouchEnd = (e) => {
    console.log("end");
    this.dragEnd();
  };

  calculateStyle() {
    let configStyle = this.props.isSelected
      ? Config.values.dataViewPort.task.selectedStyle
      : Config.values.dataViewPort.task.style;
    let backgroundColor = this.props.color
      ? this.props.color
      : configStyle.backgroundColor;

    if (this.state.dragging) {
      return {
        ...configStyle,
        backgroundColor: backgroundColor,
        left: this.state.left,
        width: this.state.width,
        height: this.props.height - 5,
        top: 2,
      };
    } else {
      return {
        ...configStyle,
        backgroundColor,
        left: this.props.left,
        width: this.props.width,
        height: this.props.height - 5,
        top: 2,
      };
    }
  }

  /*========================================================================
                      AKSHAY CODE CHANGES STARTED
  ==========================================================================*/

  viewTaskHandler = () => {
    console.log(this.props.item);
    this.setState({
      itemSet: true,
    });
  };

  onCloseHandler = () => {
    this.setState({
      itemSet: false,
    });
  };

  editTaskHandler = () => {
    store.dispatch({
      type: SET_GANTT_TASK_EDIT_DATA,
      payload: this.props.item,
    });
    this.setState({
      itemSet: false,
    });
  };

  callBackDelete = (status) => {
    if (status === 200) {
      this.setState({
        itemSet: false,
      });
    }
  };

  deleteHanlder = (item) => (e) => {
    // console.log(item);
    this.props.deleteTaskById(item.id, this.callBackDelete);
  };

  onVisibleChange = () => {};

  renderDropdown = () => {
    const menu = (
      <Menu>
        <MenuItem onClick={this.viewTaskHandler}>View</MenuItem>
        <Divider />
        <MenuItem onClick={this.deleteHanlder(this.props.item)}>
          Delete
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownIcon>
    );
  };

  dummyTaskClickHandler = () => {
    this.setState({
      itemSet: !this.state.itemSet,
    });
  };

  /*========================================================================
                      AKSHAY CODE CHANGES ENDED
  ==========================================================================*/

  render() {
    let style = this.calculateStyle();
    console.log(this.props.item);
    console.log(this.state.itemSet);
    return (
      <>
        {/* akshay code chnages */}
        {this.state.itemSet === true && this.props.item.id !== "dummyTask" && (
          <>
            <ViewGanttTask
              onCloseHandler={this.onCloseHandler}
              editTaskHandler={this.editTaskHandler}
              deleteHanlder={this.deleteHanlder}
              style={style}
              item={this.props.item}
            />
          </>
        )}
        {this.state.itemSet === true && this.props.item.id === "dummyTask" && (
          <>
            <ViewGantDummyTask style={style} />
          </>
        )}
        {/* akshay code chnages end*/}
        <div
          id="task_box_id"
          className="task_box"
          onMouseDown={(e) => this.doMouseDown(e, MODE_MOVE)}
          onTouchStart={(e) => this.doTouchStart(e, MODE_MOVE)}
          onClick={(e) => {
            this.props.onSelectItem(this.props.item);
          }}
          style={style}
        >
          <div
            className="timeLine-main-data-task-side"
            style={{ top: 0, left: -4, height: style.height }}
            onMouseDown={(e) => this.doMouseDown(e, MOVE_RESIZE_LEFT)}
            onTouchStart={(e) => this.doTouchStart(e, MOVE_RESIZE_LEFT)}
          >
            <div
              className="timeLine-main-data-task-side-linker"
              onMouseUp={(e) => this.onCreateLinkMouseUp(e, LINK_POS_LEFT)}
              onTouchEnd={(e) => this.onCreateLinkTouchEnd(e, LINK_POS_LEFT)}
            />
          </div>
          <div className="timeline-task-label" style={{ overflow: "hidden" }}>
            {/* akshay code chnages */}
            {this.props.item.id !== "dummyTask" && (
              <div className="row mx-0 flex-nowrap pl-30 timeline-task-label-col1">
                {/* akshay code chnages */}
                {!isEmpty(this.props.item.assignees) &&
                  this.props.item.assignees.map((data, index) => (
                    <Fragment key={index}>
                      <img
                        src={require("../../../../../../assets/img/dummy/all-projects-discussion-card-img.svg")}
                        alt="member"
                        className="timeline-task-label-member-img"
                      />
                    </Fragment>
                  ))}
              </div>
            )}

            <div
              //style={{ width: "100%" }}
              style={{ width: "75%" }}
              className="row mx-0 align-items-center timeline-task-label-col2"
              onClick={
                this.props.item.id !== "dummyTask"
                  ? this.viewTaskHandler
                  : this.dummyTaskClickHandler
              }
            >
              <span className="task-modal-emoji task-modal-emoji--gantt-chart">
                {this.props.item.emoji}
              </span>
              <h5 className="timeline-task-label-name">
                {Config.values.dataViewPort.task.showLabel
                  ? this.props.item.name
                  : this.props.item.name}
              </h5>
              {/* akshay code chnages */}
              {this.props.item.id === "dummyTask" && (
                <div
                  onClick={this.dummyTaskClickHandler}
                  className="cursor-pointer"
                >
                  <h5 className="dummyTask-title-text">
                    <span>{/*🍔*/} 🖐️</span>
                    {!this.state.itemSet
                      ? "Hello New Friend!! Click on me!!"
                      : "Hello New Friend!! "}
                  </h5>
                </div>
              )}
            </div>

            {/* akshay code chnages */}
            {this.props.item.id !== "dummyTask" && this.renderDropdown()}
          </div>
          <div
            className="timeLine-main-data-task-side"
            style={{ top: 0, left: style.width - 3, height: style.height }}
            onMouseDown={(e) => this.doMouseDown(e, MOVE_RESIZE_RIGHT)}
            onTouchStart={(e) => this.doTouchStart(e, MOVE_RESIZE_RIGHT)}
          >
            <div
              className="timeLine-main-data-task-side-linker"
              onMouseDown={(e) => this.onCreateLinkMouseDown(e, LINK_POS_RIGHT)}
              onTouchStart={(e) =>
                this.onCreateLinkTouchStart(e, LINK_POS_RIGHT)
              }
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ganttChartData: state.projects.ganttChartData,
});

export default connect(mapStateToProps, { deleteTaskById })(DataTask);
