import React, { Component } from "react";
import { HorizontalBar } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letTicksFontSize = 0;

if (window.innerWidth > 880) {
  letTicksFontSize = 11;
} else {
  letTicksFontSize = 8;
}

const optionsTimesheetBarGraph = {
  curvature: 1,
  legend: {
    display: false,
    labels: {
      fontSize: letTicksFontSize,
      fontColor: "rgba(255, 255, 255, 1)",
      fontFamily: "Nunito-SemiBold",
      usePointStyle: true,
      boxWidth: 5,
    },
  },
  tooltips: {
    backgroundColor: "#4a5055",
    titleFontFamily: "Nunito-Regular",
    bodyFontFamily: "Nunito-Regular",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, .33)",
          fontFamily: "Nunito-SemiBold",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
          borderDash: [8],
          color: "transparent",
          borderColor: "transparent",
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, 1)",
          fontFamily: "Nunito-SemiBold",
          beginAtZero: true,
        },
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

class TasksStatusReportBarGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.distributionOfTaskByProject) &&
      nextProps.distributionOfTaskByProject !==
        nextState.distributionOfTaskByProject
    ) {
      return {
        distributionOfTaskByProject: nextProps.distributionOfTaskByProject,
      };
    }
    return null;
  }

  render() {
    const { distributionOfTaskByProject } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(160, 0, 0, 0);
      gradient1.addColorStop(0, "rgba(172, 182, 229, 1)");
      gradient1.addColorStop(1, "rgba(116, 235, 213, 1)");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      let labelLength = !isEmpty(distributionOfTaskByProject)
        ? distributionOfTaskByProject.labelArray.length
        : 1;
      let bgColorGradients = [];

      for (let i = 0; i < labelLength; i++) {
        bgColorGradients.push(gradient1);
      }
      return {
        labels:
          !isEmpty(distributionOfTaskByProject) &&
          distributionOfTaskByProject.labelArray,
        datasets: [
          {
            backgroundColor: bgColorGradients,
            data:
              !isEmpty(distributionOfTaskByProject) &&
              distributionOfTaskByProject.countArray,
            borderWidth: 0,
          },
        ],
      };
    };
    return (
      <>
        <HorizontalBar
          data={data}
          options={optionsTimesheetBarGraph}
          width={100}
          height={33}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  distributionOfTaskByProject: state.reports.distributionOfTaskByProject,
});

export default connect(mapStateToProps, {})(TasksStatusReportBarGraph);
