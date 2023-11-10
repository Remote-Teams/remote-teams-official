import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 9;
  letLegendBoxWidth = 5;
} else {
  letLegendFontSize = 5;
  letLegendBoxWidth = 3;
}

const options = {
  legend: {
    labels: {
      fontSize: letLegendFontSize,
      fontColor: "#ffffff",
      fontFamily: "Nunito-Regular",
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
        ticks: {
          fontSize: letLegendFontSize,
          fontColor: "#ffffff",
          fontFamily: "Nunito-Regular",
          suggestedMin: 0,
          // suggestedMax: 30,
          // precision: 5,
          // stepSize: 5,
          beginAtZero: true,
          // Include a string value in the ticks
          callback: function(value, index, values) {
            if (value === 0) return null;
            else return "$ " + value + "  ";
          },
        },
        scaleLabel: {
          fontSize: "10",
          fontColor: "rgba(255, 255, 255, .4)",
          fontFamily: "Nunito-SemiBold",
          labelString: "",
          display: false,
        },
        gridLines: {
          display: true,
          drawBorder: true,
          borderDash: [8],
          lineWidth: 1,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: letLegendFontSize,
          fontColor: "#ffffff",
          fontFamily: "Nunito-SemiBold",
        },

        scaleLabel: {
          fontSize: letLegendFontSize,
          fontColor: "#ffffff",
          fontFamily: "Nunito-SemiBold",
          display: true,
          // labelString: ""
        },
        gridLines: {
          display: false,
          drawBorder: true,
          lineWidth: 1,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

class DashboardExpenseVsIncomeChart extends Component {
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
      !isEmpty(nextProps.expenseChartData) &&
      nextProps.expenseChartData !== nextState.expenseChartData
    ) {
      return {
        expenseChartData: nextProps.expenseChartData,
      };
    }

    return null;
  }

  render() {
    const { expenseChartData, paidInvoicesIssued } = this.state;

    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(67, 206, 162, .83)");
      gradient1.addColorStop(0.2, "rgba(24, 90, 157, .83)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(234, 175, 200, .83)");
      gradient2.addColorStop(0.2, "rgba(101, 78, 163, .83)");

      // shadow
      const originalStroke = ctx.stroke;
      ctx.stroke = function() {
        ctx.save();
        ctx.shadowColor = "#000";
        ctx.shadowBlur = letLegendFontSize;
        ctx.shadowOffsetX = letLegendBoxWidth;
        ctx.shadowOffsetY = letLegendBoxWidth;
        originalStroke.apply(this, arguments);
        ctx.restore();
      };

      const backgroundColor1 = "rgba(78, 124, 255, .7)";
      const backgroundColor2 = "rgba(64, 224, 208, 1)";

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
            label: "Expense",
            data: expenseChartData,
            backgroundColor: backgroundColor1,
            pointBorderColor: backgroundColor1,
            pointBackgroundColor: backgroundColor1,
            pointHoverBackgroundColor: backgroundColor1,
            borderColor: "transparent",
            radius: 1,
            hoverRadius: 1,
          },
          {
            label: "Income",
            data: paidInvoicesIssued,
            backgroundColor: backgroundColor2,
            pointBorderColor: backgroundColor2,
            pointBackgroundColor: backgroundColor2,
            pointHoverBackgroundColor: backgroundColor2,
            borderColor: "transparent",
            radius: 1,
            hoverRadius: 1,
          },
        ],
      };
    };

    return <Line data={data} options={options} width={100} height={48} />;
  }
}

const mapStateToProps = (state) => ({
  expenseChartData: state.dashboard.expenseChartData,
  paidInvoicesIssued: state.dashboard.paidInvoicesIssued,
});

export default connect(mapStateToProps, {})(DashboardExpenseVsIncomeChart);
