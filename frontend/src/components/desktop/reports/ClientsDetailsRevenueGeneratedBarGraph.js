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
    labels: {
      fontSize: letTicksFontSize,
      fontColor: "rgba(255, 255, 255, 1)",
      //fontFamily: "Nunito-SemiBold",
      fontFamily: "Nunito-Bold",
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
          display: false,
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

class ClientsDetailsRevenueGeneratedBarGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.revenueGeneratedChartData) &&
      nextProps.revenueGeneratedChartData !==
        nextState.revenueGeneratedChartData
    ) {
      return {
        revenueGeneratedChartData: nextProps.revenueGeneratedChartData,
      };
    }
    return null;
  }

  render() {
    const { revenueGeneratedChartData } = this.state;
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "#642B73");
      gradient1.addColorStop(0.3, "#654EA3");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "#EAAFC8");
      gradient2.addColorStop(0.2, "#654EA3");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels:
          !isEmpty(revenueGeneratedChartData) &&
          revenueGeneratedChartData.label,
        datasets: [
          {
            label: "TILL DATE",
            backgroundColor: [gradient1, gradient2],
            data:
              !isEmpty(revenueGeneratedChartData) &&
              revenueGeneratedChartData.data,
            borderWidth: 0,
          },
          //{
          //  label: "THIS MONTH",
          //  backgroundColor: gradient2,
          //  data:
          //    !isEmpty(revenueGeneratedChartData) &&
          //    revenueGeneratedChartData.data,
          //  borderWidth: 0,
          //},
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
  revenueGeneratedChartData: state.reports.revenueGeneratedChartData,
});

export default connect(
  mapStateToProps,
  {}
)(ClientsDetailsRevenueGeneratedBarGraph);
