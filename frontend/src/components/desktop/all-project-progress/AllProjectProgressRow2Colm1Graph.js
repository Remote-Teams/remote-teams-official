import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { optionsDays } from "./BarGraphOptions";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letTicksFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letTicksFontSize = 9;
  letLegendBoxWidth = 5;
} else {
  letTicksFontSize = 5;
  letLegendBoxWidth = 3;
}

class AllProjectProgressRow2Colm1Graph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.taskProgressChartData) &&
      nextProps.taskProgressChartData !== nextState.taskProgressChartData
    ) {
      return {
        taskProgressChartData: nextProps.taskProgressChartData,
      };
    }
    return null;
  }

  render() {
    const { taskProgressChartData } = this.state;

    let labelArray = [];
    let filterData =
      !isEmpty(taskProgressChartData) &&
      taskProgressChartData[0].forEach((element) => {
        // console.log(element);
        labelArray.push(`Week ${element}`);
      });

    var newData = labelArray.slice(Math.max(labelArray.length - 5, 0));

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(247, 148, 164, 1)");
      gradient1.addColorStop(0.3, "rgba(253, 214, 189, 1)");
      //gradient1.addColorStop(0, "#FC9747");
      //gradient1.addColorStop(0.3, "#FD7697");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(102, 126, 234, 1)");
      gradient2.addColorStop(0.3, "rgba(118, 75, 162, 1)");
      //gradient2.addColorStop(0, "#1E75D9");
      //gradient2.addColorStop(0.3, "#4B1CCA");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels: !isEmpty(labelArray) && labelArray,
        datasets: [
          {
            label: "Actual",
            backgroundColor: gradient1,
            borderWidth: 0,
            // data: [50],
            data: !isEmpty(taskProgressChartData) && taskProgressChartData[1],
          },
          {
            label: "Estimated",
            backgroundColor: gradient2,
            borderWidth: 0,
            // data: [80],
            data: !isEmpty(taskProgressChartData) && taskProgressChartData[2],
          },
        ],
      };
    };
    return (
      <>
        <Bar data={data} options={optionsDays} width={100} height={31} />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  taskProgressChartData: state.projects.taskProgressChartData,
});

export default connect(mapStateToProps, {})(AllProjectProgressRow2Colm1Graph);
