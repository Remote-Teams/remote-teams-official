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
          // Include a string value in the ticks
          callback: function(value, index, values) {
            if (value === 0) return null;
            else return value + " $ " + "  ";
          },
        },
        gridLines: {
          display: true,
          drawBorder: false,
          borderDash: [8],
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
        },
        categoryPercentage: 0.5,
        barPercentage: 0.8,
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
  },
};

class ProjectStatusReportBudgetSpentBarGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.overallBudgetSpent) &&
      nextProps.overallBudgetSpent !== nextState.overallBudgetSpent
    ) {
      return {
        overallBudgetSpent: nextProps.overallBudgetSpent,
      };
    }
    return null;
  }

  render() {
    const { overallBudgetSpent } = this.state;
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0.2, "rgba(17, 153, 142, 1)");
      gradient1.addColorStop(0, "rgba(56, 239, 125, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0.1, "rgba(168, 255, 120, 1)");
      gradient2.addColorStop(0, "rgba(120, 255, 214, 1)");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels: !isEmpty(overallBudgetSpent) && overallBudgetSpent[0],
        datasets: [
          {
            label: "",
            backgroundColor: [gradient1, gradient2],
            data: !isEmpty(overallBudgetSpent) && overallBudgetSpent[1],
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
          width={90}
          height={49}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  overallBudgetSpent: state.reports.overallBudgetSpent,
});

export default connect(
  mapStateToProps,
  {}
)(ProjectStatusReportBudgetSpentBarGraph);
