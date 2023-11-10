import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
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
    //display: false,
    display: true,
    boxWidth: 5,
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
        scaleLabel: {
          display: true,
          labelString: "TASKS COUNT",
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, .33)",
          fontFamily: "Nunito-SemiBold",
        },
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, .33)",
          fontFamily: "Nunito-SemiBold",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          beginAtZero: true,
          // Include a string value in the ticks
          callback: function(value, index, values) {
            if (value === 0) return null;
            else return value + "  ";
          },
        },
        gridLines: {
          display: true,
          drawBorder: false,
          borderDash: [8],
          bordercolor: "rgba(112, 112, 112, .1)",
          color: "rgba(112, 112, 112, .1)",
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
          display: false,
        },
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
          bordercolor: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

class ClientsDetailsProjectSummaryBarGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.projectSummaryChartData) &&
      nextProps.projectSummaryChartData !== nextState.projectSummaryChartData
    ) {
      return {
        projectSummaryChartData: nextProps.projectSummaryChartData,
      };
    }
    return null;
  }
  render() {
    const { projectSummaryChartData } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0.1, "#1E75D9");
      gradient1.addColorStop(0.3, "#4B1CCA");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "#A7BFE8");
      gradient2.addColorStop(0.1, "#6190E8");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels:
          !isEmpty(projectSummaryChartData) && projectSummaryChartData.label,
        datasets: [
          {
            label: "TASKS COUNT TILL NOW",
            backgroundColor: [gradient1, gradient2],
            data:
              !isEmpty(projectSummaryChartData) && projectSummaryChartData.data,
            borderWidth: 0,
          },
        ],
      };
    };
    return (
      <>
        <Bar
          data={data}
          options={optionsTimesheetBarGraph}
          width={100}
          height={100}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  projectSummaryChartData: state.reports.projectSummaryChartData,
});

export default connect(
  mapStateToProps,
  {}
)(ClientsDetailsProjectSummaryBarGraph);
