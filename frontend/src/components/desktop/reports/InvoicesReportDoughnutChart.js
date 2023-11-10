import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 10;
  letLegendBoxWidth = 5;
} else {
  letLegendFontSize = 6;
  letLegendBoxWidth = 4;
}

const optionsTimesheetBarGraph = {
  rotation: -7.5 * Math.PI,
  cutoutPercentage: 77,
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

class InvoicesReportDoughnutChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.distributionChart) &&
      nextProps.distributionChart !== nextState.distributionChart
    ) {
      return {
        distributionChart: nextProps.distributionChart,
      };
    }
    return null;
  }

  render() {
    const { distributionChart } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letLegendFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.3)";

      return {
        labels: !isEmpty(distributionChart) && distributionChart.label,
        datasets: [
          {
            backgroundColor: [
              "#70F84E",
              "#FF5B3D",
              "#FC9747",
              "#FFDE0A",
              "#828FE3",
            ],
            data: !isEmpty(distributionChart) && distributionChart.data,
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
          height={39}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  distributionChart: state.reports.distributionChart,
});

export default connect(mapStateToProps, {})(InvoicesReportDoughnutChart);
