import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
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

class DashboardInvoiceSummaryChart extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*=======================================
              Lifecycle Methods
  =========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.invoiceSummary) &&
      nextProps.invoiceSummary !== nextState.invoiceSummary
    ) {
      return {
        invoiceSummary: nextProps.invoiceSummary,
      };
    }
    return null;
  }

  render() {
    const { invoiceSummary } = this.state;

    let labelArray = [];
    let percentageData = [];

    let mapData =
      !isEmpty(invoiceSummary) &&
      invoiceSummary.map((element, index) => {
        if (typeof element[0] === "string") {
          labelArray = element;
        } else {
          percentageData = element;
        }
      });

    // console.log(labelArray);

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0.1, "rgba(67, 206, 162, 1)");
      gradient1.addColorStop(0.2, "rgba(24, 90, 157, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0.01, "rgba(30, 117, 217, 1)");
      gradient2.addColorStop(0.1, "rgba(75, 28, 202, 1)");

      const gradient3 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient3.addColorStop(0.01, "rgba(234, 175, 200, 1)");
      gradient3.addColorStop(0.1, "rgba(101, 78, 163, 1)");

      const gradient4 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient4.addColorStop(0.1, "rgba(252, 151, 71, 1)");
      gradient4.addColorStop(0.2, "rgba(253, 118, 151, 1)");

      return {
        datasets: [
          {
            data: !isEmpty(percentageData) && percentageData,
            // data: countData,
            backgroundColor: [gradient1, gradient2, gradient3, gradient4],
            label: "",
            borderColor: "transparent",
            borderWidth: 0,
            hoverBorderColor: "transparent",
          },
        ],
        labels: !isEmpty(labelArray) && labelArray,
        // labels: lebelsData,
      };
    };

    return <Pie data={data} options={options} width={100} height={75} />;
  }
}

const mapStateToProps = (state) => ({
  invoiceSummary: state.dashboard.invoiceSummary,
});

export default connect(mapStateToProps, {})(DashboardInvoiceSummaryChart);
