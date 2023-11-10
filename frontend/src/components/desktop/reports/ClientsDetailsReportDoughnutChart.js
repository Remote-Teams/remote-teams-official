import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

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

class ClientsDetailsReportDoughnutChart extends Component {
  render() {
    const { chartData } = this.props;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letLegendFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.3)";

      return {
        labels: ["ACTIVE", "INACTIVE"],
        datasets: [
          {
            backgroundColor: ["#70F84E", "#FC9747"],
            data: chartData,
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
          height={53}
        />
      </>
    );
  }
}

export default ClientsDetailsReportDoughnutChart;
