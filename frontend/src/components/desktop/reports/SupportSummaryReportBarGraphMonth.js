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

class SupportSummaryReportBarGraphMonth extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.ticketSummaryChart) &&
      nextProps.ticketSummaryChart !== nextState.ticketSummaryChart
    ) {
      return {
        ticketSummaryChart: nextProps.ticketSummaryChart,
      };
    }
    return null;
  }

  render() {
    const { ticketSummaryChart } = this.state;

    let ticketSummaryThisMonth =
      !isEmpty(ticketSummaryChart) && ticketSummaryChart.chartDataThisMonth;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(160, 0, 0, 0);
      gradient1.addColorStop(0, "rgba(67, 206, 162, 1)");
      gradient1.addColorStop(1, "rgba(24, 90, 157, 1)");

      const gradient2 = ctx.createLinearGradient(500, 0, 0, 0);
      gradient2.addColorStop(0, "rgba(252, 151, 71, 1)");
      gradient2.addColorStop(1, "rgba(253, 118, 151, 1)");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels:
          !isEmpty(ticketSummaryThisMonth) && ticketSummaryThisMonth.label,
        datasets: [
          {
            label: "",
            backgroundColor: [gradient1, gradient2],
            data:
              !isEmpty(ticketSummaryThisMonth) && ticketSummaryThisMonth.data,
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
          //height={22}
          height={28}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ticketSummaryChart: state.reports.ticketSummaryChart,
});

export default connect(mapStateToProps, {})(SupportSummaryReportBarGraphMonth);
