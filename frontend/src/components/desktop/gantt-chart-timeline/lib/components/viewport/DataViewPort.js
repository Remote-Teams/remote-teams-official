import React, { Component } from "react";
import { DATA_CONTAINER_WIDTH } from "./../../Const";
import DataTask from "./DataTask";
import DateHelper from "./../../helpers/DateHelper";
import sizeMe from "react-sizeme";
import Config from "./../../helpers/config/Config";

let offsetTopTimeLinedataViewPort = "";
var timeLineMainDataRowHeight = "";

export class DataRow extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    timeLineMainDataRowHeight = document.getElementById(
      "timeLineMainDataRowHeight"
    ).height;
  }

  render() {
    return (
      <div
        id="timeLineMainDataRowHeight"
        className="timeLine-main-data-row"
        style={{
          ...Config.values.dataViewPort.rows.style,
          top: this.props.top,
          height: this.props.itemheight,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export class DataViewPort extends Component {
  constructor(props) {
    super(props);
    this.childDragging = false;
  }
  getContainerHeight(rows) {
    let new_height = rows > 0 ? rows * this.props.itemheight : 10;
    return new_height;
  }
  onChildDrag = (dragging) => {
    this.childDragging = dragging;
  };

  renderRows = (offsetTopTimeLinedataViewPort) => {
    let result = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      let item = this.props.data[i];
      if (!item) break;
      //FIXME PAINT IN BOUNDARIES

      let new_position = DateHelper.dateToPixel(
        item.start,
        this.props.nowposition,
        this.props.dayWidth
      );
      let new_width =
        DateHelper.dateToPixel(
          item.end,
          this.props.nowposition,
          this.props.dayWidth
        ) - new_position;
      console.log(
        "height",
        timeLineMainDataRowHeight,
        typeof timeLineMainDataRowHeight
      );
      result.push(
        <DataRow
          key={i}
          label={item.name}
          top={i * this.props.itemheight}
          left={20}
          itemheight={this.props.itemheight}
        >
          <DataTask
            taskIndex={i}
            offsetTopTimeLinedataViewPort={offsetTopTimeLinedataViewPort}
            timeLineMainDataRowHeight={timeLineMainDataRowHeight}
            item={item}
            label={item.name}
            nowposition={this.props.nowposition}
            dayWidth={this.props.dayWidth}
            color={item.color}
            left={new_position}
            width={new_width}
            height={50}
            onChildDrag={this.onChildDrag}
            isSelected={this.props.selectedItem === item}
            onSelectItem={this.props.onSelectItem}
            onStartCreateLink={this.props.onStartCreateLink}
            onFinishCreateLink={this.props.onFinishCreateLink}
            onTaskChanging={this.props.onTaskChanging}
            onUpdateTask={this.props.onUpdateTask}
          >
            {" "}
          </DataTask>
        </DataRow>
      );
    }
    return result;
  };

  doMouseDown = (e) => {
    if (e.button === 0 && !this.childDragging) {
      this.props.onMouseDown(e);
    }
  };
  doMouseMove = (e) => {
    this.props.onMouseMove(e, this.refs.dataViewPort);
  };

  doTouchStart = (e) => {
    if (!this.childDragging) {
      this.props.onTouchStart(e);
    }
  };
  doTouchMove = (e) => {
    this.props.onTouchMove(e, this.refs.dataViewPort);
  };

  componentDidMount() {
    this.refs.dataViewPort.scrollLeft = 0;
    offsetTopTimeLinedataViewPort = document.getElementById(
      "timeLinedataViewPort"
    ).offsetTop;
  }

  render() {
    if (this.refs.dataViewPort) {
      this.refs.dataViewPort.scrollLeft = this.props.scrollLeft;
      this.refs.dataViewPort.scrollTop = this.props.scrollTop;
    }

    let height = this.getContainerHeight(this.props.data.length);
    return (
      <div
        ref="dataViewPort"
        id="timeLinedataViewPort"
        className="timeLine-main-data-viewPort"
        onMouseDown={this.doMouseDown}
        onMouseMove={this.doMouseMove}
        onMouseUp={this.props.onMouseUp}
        onMouseLeave={this.props.onMouseLeave}
        onTouchStart={this.doTouchStart}
        onTouchMove={this.doTouchMove}
        onTouchEnd={this.props.onTouchEnd}
        onTouchCancel={this.props.onTouchCancel}
      >
        <div
          className="timeLine-main-data-container"
          style={{
            height: height,
            width: DATA_CONTAINER_WIDTH,
            maxWidth: DATA_CONTAINER_WIDTH,
          }}
        >
          {this.renderRows(offsetTopTimeLinedataViewPort)}
        </div>
      </div>
    );
  }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(
  DataViewPort
);
