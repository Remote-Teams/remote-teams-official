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
            else return value + "  ";
          },
        },
        scaleLabel: {
          fontSize: letLegendFontSize,
          fontColor: "rgba(255, 255, 255, .4)",
          fontFamily: "Nunito-SemiBold",
          labelString: "Tasks",
          display: true,
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
        barPercentage: 0.5,
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

class BurndownChart extends Component {
  constructor() {
    super();
    this.state = {
      burndownChartData: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.taskProgressChartData) &&
      nextProps.taskProgressChartData !== nextState.taskProgressChartData
    ) {
      return {
        burndownChartData: nextProps.taskProgressChartData,
      };
    }
    return null;
  }

  render() {
    const { burndownChartData } = this.state;

    let labelArray = [];
    let filterData =
      !isEmpty(burndownChartData) &&
      burndownChartData[0].forEach((element) => {
        // console.log(element);
        labelArray.push(`Week ${element}`);
      });

    var newData = labelArray.slice(Math.max(labelArray.length - 5, 0));

    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(255, 236, 210, 0.8)");
      gradient1.addColorStop(0.2, "rgba(252, 182, 159, 0.8)");
      //gradient1.addColorStop(0, "rgba(67, 206, 162, .83)");
      //gradient1.addColorStop(0.2, "rgba(24, 90, 157, .83)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(102, 126, 234, 1)");
      gradient2.addColorStop(0.2, "rgba(118, 75, 162, 1)");
      //gradient2.addColorStop(0, "rgba(234, 175, 200, .83)");
      //gradient2.addColorStop(0.2, "rgba(101, 78, 163, .83)");

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

      return {
        labels: !isEmpty(labelArray) && labelArray,
        datasets: [
          {
            label: "Actual",
            data: !isEmpty(burndownChartData) && burndownChartData[1],
            // data: [10, 20, 30, 40, 50],
            backgroundColor: gradient1,
            borderColor: "transparent",
            lineTension: 0,
          },
          {
            label: "Estimated",
            // data: [60, 70, 80, 90, 95],
            data: !isEmpty(burndownChartData) && burndownChartData[2],
            backgroundColor: gradient2,
            borderColor: "transparent",
            lineTension: 0,
          },
        ],
      };
    };

    return (
      <Line
        data={data}
        options={options}
        width={100}
        //  height={24}
        height={35}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  taskProgressChartData: state.projects.taskProgressChartData,
});

export default connect(mapStateToProps, {})(BurndownChart);
