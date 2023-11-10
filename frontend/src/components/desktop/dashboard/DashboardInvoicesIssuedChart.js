import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
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

const optionsTimesheetBarGraph = {
  curvature: 1,
  legend: {
    display: true,
    labels: {
      fontSize: letTicksFontSize,
      fontColor: "rgba(255, 255, 255, 1)",
      fontFamily: "Nunito-SemiBold",
      usePointStyle: true,
      boxWidth: letLegendBoxWidth,
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
        stacked: true,
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, 1)",
          fontFamily: "Nunito-SemiBold",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          beginAtZero: true,
          callback: function(value, index, values) {
            if (value === 0) return null;
            else return "$ " + value + "  ";
          },
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
        stacked: true,
        ticks: {
          display: true,
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, 1)",
          fontFamily: "Nunito-SemiBold",
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

class DashboardInvoicesIssuedChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.paidInvoicesIssued) &&
      nextProps.paidInvoicesIssued !== nextState.paidInvoicesIssued
    ) {
      return {
        paidInvoicesIssued: nextProps.paidInvoicesIssued,
      };
    }
    if (
      !isEmpty(nextProps.allInvoicesIssued) &&
      nextProps.allInvoicesIssued !== nextState.allInvoicesIssued
    ) {
      return {
        allInvoicesIssued: nextProps.allInvoicesIssued,
      };
    }

    return null;
  }

  setBackgroundColor1 = (labelsLength, text) => {
    let arr = [];
    let i = 0;
    while (i < labelsLength) {
      arr.push(text);
      i++;
    }
    return arr;
  };

  render() {
    // console.log(this.state.allInvoicesIssued, this.state.paidInvoicesIssued);

    const { allInvoicesIssued, paidInvoicesIssued } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 200, 0, 0);
      gradient1.addColorStop(0, "rgba(141, 194, 246, 1)");
      gradient1.addColorStop(1, "rgba(194, 246, 172, 1)");

      const gradient2 = ctx.createLinearGradient(0, 190, 0, 0);
      gradient2.addColorStop(1, "rgba(67, 206, 162, 1)");
      gradient2.addColorStop(0, "rgba(24, 90, 157, 1)");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      // total projects displaying count
      const labelsLength = 12;
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Paid",
            backgroundColor: this.setBackgroundColor1(labelsLength, gradient2),
            data: paidInvoicesIssued,
          },
          {
            label: "Issued",
            backgroundColor: this.setBackgroundColor1(labelsLength, gradient1),
            data: allInvoicesIssued,
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
          height={40}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allInvoicesIssued: state.dashboard.allInvoicesIssued,
  paidInvoicesIssued: state.dashboard.paidInvoicesIssued,
});

export default connect(mapStateToProps, {})(DashboardInvoicesIssuedChart);
