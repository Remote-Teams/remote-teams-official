import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 9;
  //letLegendFontSize = 5;
  letLegendBoxWidth = 5;
} else {
  letLegendFontSize = 7;
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

class DashboardCostVarianceChart extends Component {
  constructor() {
    super();
    this.state = {
      costVarianceData: {},
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.costVariance) &&
      nextProps.costVariance !== nextState.costVariance
    ) {
      return {
        costVarianceData: nextProps.costVariance,
      };
    }
    return null;
  }

  render() {
    const { costVarianceData } = this.state;
    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(234, 175, 200, 1)");
      gradient1.addColorStop(0.2, "rgba(101, 78, 163, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(252, 151, 71, 1)");
      gradient2.addColorStop(0.2, "rgba(253, 118, 151, 1)");

      const gradientPoint1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradientPoint1.addColorStop(0, "rgba(212, 64, 253, 1)");
      gradientPoint1.addColorStop(0.2, "rgba(163, 4, 250, 1)");

      const gradientPoint2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradientPoint2.addColorStop(0, "rgba(255, 94, 98, 1)");
      gradientPoint2.addColorStop(0.2, "rgba(255, 153, 102, 1)");

      // shadow
      //const originalStroke = ctx.stroke;
      //ctx.stroke = function() {
      //  ctx.save();
      //  ctx.shadowColor = "#000";
      //  ctx.shadowBlur = letLegendFontSize;
      //  ctx.shadowOffsetX = letLegendBoxWidth;
      //  ctx.shadowOffsetY = letLegendBoxWidth;
      //  originalStroke.apply(this, arguments);
      //  ctx.restore();
      //};

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
            label: "Planned Cost",
            data: !isEmpty(costVarianceData) && costVarianceData[0],
            backgroundColor: "transparent",
            borderColor: gradient1,
            borderWidth: 2,
            hoverBorderWidth: 2,
            pointBorderColor: gradientPoint1,
            pointBackgroundColor: gradientPoint1,
            pointHoverBackgroundColor: gradientPoint1,
            radius: 2,
          },
          {
            label: "Actual cost",
            data: !isEmpty(costVarianceData) && costVarianceData[1],
            backgroundColor: "transparent",
            borderColor: gradient2,
            borderWidth: 2,
            hoverBorderWidth: 2,
            pointBorderColor: gradientPoint2,
            pointBackgroundColor: gradientPoint2,
            pointHoverBackgroundColor: gradientPoint2,
            radius: 2,
          },
        ],
      };
    };

    return (
      <Line
        data={data}
        options={options}
        width={100}
        //height={41}
        height={30}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  costVariance: state.dashboard.costVariance,
});

export default connect(mapStateToProps, {})(DashboardCostVarianceChart);
