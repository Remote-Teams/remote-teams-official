import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";

let letLegendFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 12;
  letLegendBoxWidth = 5;
} else {
  letLegendFontSize = 8;
  letLegendBoxWidth = 4;
}

const options = {
  rotation: 2.3 * Math.PI,
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
};

class SupportSummaryReportPieChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*=======================================
              Lifecycle Methods
  =========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.ticketsRaisedByReasonChartData) &&
      nextProps.ticketsRaisedByReasonChartData !==
        nextState.ticketsRaisedByReasonChartData
    ) {
      return {
        ticketsRaisedByReasonChartData:
          nextProps.ticketsRaisedByReasonChartData,
      };
    }
    return null;
  }

  render() {
    const { ticketsRaisedByReasonChartData } = this.state;

    // console.log(this.state.ticketsRaisedByReasonChartData);

    let labelData =
      !isEmpty(ticketsRaisedByReasonChartData) &&
      ticketsRaisedByReasonChartData.label[0];

    // console.log(labelData);

    let percentData =
      !isEmpty(ticketsRaisedByReasonChartData) &&
      ticketsRaisedByReasonChartData.data[0];

    // let lebelsData =
    //   !isEmpty(socialMediaGraph) && socialMediaGraph.x_axis.labels;

    // let countData = !isEmpty(socialMediaGraph) && socialMediaGraph.y_axis.data;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0.1, "rgba(67, 206, 162, 1)");
      gradient1.addColorStop(0.3, "rgba(24, 90, 157, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0.03, "rgba(30, 117, 217, 1)");
      gradient2.addColorStop(0.16, "rgba(75, 28, 202, 1)");

      const gradient3 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient3.addColorStop(0.03, "rgba(234, 175, 200, 1)");
      gradient3.addColorStop(0.16, "rgba(101, 78, 163, 1)");

      const gradient4 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient4.addColorStop(0.1, "rgba(252, 151, 71, 1)");
      gradient4.addColorStop(0.3, "rgba(253, 118, 151, 1)");

      return {
        datasets: [
          {
            data: !isEmpty(percentData) && percentData,
            // data: countData,
            backgroundColor: [gradient1, gradient2, gradient3, gradient4],
            label: "",
            borderColor: "transparent",
            borderWidth: 0,
            hoverBorderColor: "transparent",
          },
        ],
        labels: !isEmpty(labelData) && labelData,
        // labels: lebelsData,
      };
    };

    return (
      <Pie
        data={data}
        options={options}
        //width={100}
        //height={80}
        width={80}
        height={90}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  //   socialMediaGraph: state.reports.socialMediaGraph
  ticketsRaisedByReasonChartData: state.reports.ticketsRaisedByReasonChartData,
});

export default connect(mapStateToProps, {})(SupportSummaryReportPieChart);
