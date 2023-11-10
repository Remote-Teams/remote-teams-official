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
    display: false,
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

class AllProjectOverviewScheduleIndicatorChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.indicatorTaskCompletionByWeek) &&
      nextProps.indicatorTaskCompletionByWeek !==
        nextState.indicatorTaskCompletionByWeek
    ) {
      return {
        indicatorTaskCompletionByWeek: nextProps.indicatorTaskCompletionByWeek,
      };
    }
    return null;
  }

  render() {
    const { indicatorTaskCompletionByWeek } = this.state;
    let labelArray = [];
    let filterData =
      !isEmpty(indicatorTaskCompletionByWeek) &&
      indicatorTaskCompletionByWeek[0].forEach((element) => {
        // console.log(element);
        labelArray.push(`Week ${element}`);
      });

    var newData = labelArray.slice(Math.max(labelArray.length - 5, 0));

    // console.log(
    //   !isEmpty(indicatorTaskCompletionByWeek) &&
    //     indicatorTaskCompletionByWeek[1].slice(
    //       Math.max(indicatorTaskCompletionByWeek[1].length - 5, 0)
    //     )
    // );

    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0.4, "rgba(0, 0, 0, .7)");
      gradient1.addColorStop(0.3, "rgba(0, 2, 9, .7)");
      gradient1.addColorStop(0.2, "rgba(1, 21, 95, .7)");
      gradient1.addColorStop(0.1, "rgba(2, 34, 149, .7)");
      gradient1.addColorStop(0, "rgba(3, 39, 170, .7)");

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
        labels: !isEmpty(newData) && newData,
        datasets: [
          {
            label: "",
            data:
              !isEmpty(indicatorTaskCompletionByWeek) &&
              indicatorTaskCompletionByWeek[1].slice(
                Math.max(indicatorTaskCompletionByWeek[1].length - 5, 0)
              ),
            backgroundColor: gradient1,
            lineTension: 0,
            //borderColor: "rgba(0, 255, 255, 1)",
            borderWidth: 1,
            radius: 1,
          },
        ],
      };
    };

    return (
      <Line
        data={data}
        options={options}
        width={100}
        height={33}
        // height={26}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  indicatorTaskCompletionByWeek: state.projects.indicatorTaskCompletionByWeek,
});

export default connect(
  mapStateToProps,
  {}
)(AllProjectOverviewScheduleIndicatorChart);
