import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 10;
  letLegendBoxWidth = 6;
} else {
  letLegendFontSize = 6;
  letLegendBoxWidth = 4;
}

const optionsTimesheetBarGraph = {
  rotation: -7.5 * Math.PI,
  cutoutPercentage: 72,
  legend: {
    display: true,
    labels: {
      fontSize: letLegendFontSize,
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
};

class ResourceTimesheetReportDoughnutChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.resourceDistributionPercent) &&
      nextProps.resourceDistributionPercent !==
        nextState.resourceDistributionPercent
    ) {
      return {
        resourceDistributionPercent: nextProps.resourceDistributionPercent,
      };
    }
    return null;
  }

  render() {
    const { resourceDistributionPercent } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letLegendFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.3)";

      return {
        labels:
          !isEmpty(resourceDistributionPercent) &&
          resourceDistributionPercent[0],
        datasets: [
          {
            backgroundColor: ["#70F84E", "#FF5B3D", "#FC9747"],
            data:
              !isEmpty(resourceDistributionPercent) &&
              resourceDistributionPercent[1],
            borderWidth: 0,
            borderColor: "transparent",
          },
        ],
      };
    };
    return (
      <>
        <Doughnut
          data={data}
          options={optionsTimesheetBarGraph}
          width={100}
          height={38}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  resourceDistributionPercent: state.reports.resourceDistributionPercent,
});

export default connect(
  mapStateToProps,
  {}
)(ResourceTimesheetReportDoughnutChart);
