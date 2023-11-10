import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  //letLegendFontSize = 9;
  letLegendFontSize = 7;
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
          fontSize: letLegendFontSize,
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
          fontSize: 10,
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

class DashboardYearlyExpenseReportChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.yearlyTotalExpense) &&
      nextProps.yearlyTotalExpense !== nextState.yearlyTotalExpense
    ) {
      return {
        yearlyTotalExpense: nextProps.yearlyTotalExpense,
      };
    }
    if (
      !isEmpty(nextProps.yearlyBilledExpense) &&
      nextProps.yearlyBilledExpense !== nextState.yearlyBilledExpense
    ) {
      return {
        yearlyBilledExpense: nextProps.yearlyBilledExpense,
      };
    }
    if (
      !isEmpty(nextProps.yearlyMisExpense) &&
      nextProps.yearlyMisExpense !== nextState.yearlyMisExpense
    ) {
      return {
        yearlyMisExpense: nextProps.yearlyMisExpense,
      };
    }

    return null;
  }

  render() {
    const {
      yearlyTotalExpense,
      yearlyBilledExpense,
      yearlyMisExpense,
    } = this.state;

    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      const gradientPoint1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradientPoint1.addColorStop(0, "rgba(0, 224, 215, 1)");
      gradientPoint1.addColorStop(0.1, "rgba(0, 233, 224, 1)");
      gradientPoint1.addColorStop(0.2, "rgba(0, 240, 231, 1)");

      const colorPoint2 = "rgba(239, 98, 98, 1)";

      const gradientPoint3 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradientPoint3.addColorStop(0, "rgba(76, 113, 240, 1)");
      gradientPoint3.addColorStop(0.2, "rgba(44, 82, 219, 1)");

      // shadow
      const originalStroke = ctx.stroke;
      ctx.stroke = function() {
        ctx.save();
        ctx.shadowColor = "#fffff";
        ctx.shadowBlur = letLegendFontSize;
        ctx.shadowOffsetX = letLegendBoxWidth;
        ctx.shadowOffsetY = letLegendBoxWidth;
        originalStroke.apply(this, arguments);
        ctx.restore();
      };

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
            label: "Total",
            data: yearlyTotalExpense,
            backgroundColor: "transparent",
            borderColor: "#ffffff",
            borderWidth: 1,
            hoverBorderWidth: 2,
            pointBorderColor: gradientPoint1,
            pointBackgroundColor: gradientPoint1,
            pointHoverBackgroundColor: gradientPoint1,
            radius: 3,
          },
          {
            label: "Misc",
            data: yearlyMisExpense,
            backgroundColor: "transparent",
            borderColor: "#ffffff",
            borderWidth: 1,
            hoverBorderWidth: 2,
            pointBorderColor: colorPoint2,
            pointBackgroundColor: colorPoint2,
            pointHoverBackgroundColor: colorPoint2,
            radius: 3,
          },
          {
            label: "Billed",
            data: yearlyBilledExpense,
            backgroundColor: "transparent",
            borderColor: "#ffffff",
            borderWidth: 1,
            hoverBorderWidth: 2,
            pointBorderColor: gradientPoint3,
            pointBackgroundColor: gradientPoint3,
            pointHoverBackgroundColor: gradientPoint3,
            radius: 3,
          },
        ],
      };
    };

    return <Line data={data} options={options} width={100} height={37} />;
  }
}

const mapStateToProps = (state) => ({
  yearlyTotalExpense: state.dashboard.yearlyTotalExpense,
  yearlyBilledExpense: state.dashboard.yearlyBilledExpense,
  yearlyMisExpense: state.dashboard.yearlyMisExpense,
});

export default connect(mapStateToProps, {})(DashboardYearlyExpenseReportChart);
