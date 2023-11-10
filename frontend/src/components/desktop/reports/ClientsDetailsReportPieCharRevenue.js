import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { connect } from "react-redux";
// import isEmpty from "./../../../store/validations/is-empty";

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
  rotation: 1.6 * Math.PI,
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

class ClientsDetailsReportPieCharRevenue extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*=======================================
              Lifecycle Methods
  =========================================*/
  //   static getDerivedStateFromProps(nextProps, nextState) {
  //     if (
  //       !isEmpty(nextProps.socialMediaGraph) &&
  //       nextProps.socialMediaGraph !== nextState.socialMediaGraph
  //     ) {
  //       return {
  //         socialMediaGraph: nextProps.socialMediaGraph,
  //       };
  //     }
  //     return null;
  //   }

  render() {
    // const { socialMediaGraph } = this.state;

    // let lebelsData =
    //   !isEmpty(socialMediaGraph) && socialMediaGraph.x_axis.labels;

    // let countData = !isEmpty(socialMediaGraph) && socialMediaGraph.y_axis.data;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "#EAAFC8");
      gradient1.addColorStop(0.12, "#654EA3");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "#642B73");
      gradient2.addColorStop(0.2, "#654EA3");

      return {
        datasets: [
          {
            data: [20, 80],
            // data: countData,
            backgroundColor: [gradient1, gradient2],
            label: "",
            borderColor: "transparent",
            borderWidth: 0,
            hoverBorderColor: "transparent",
          },
        ],
        labels: ["TILL DATE", "THIS MONTH"],
        // labels: lebelsData,
      };
    };

    return <Pie data={data} options={options} width={100} height={80} />;
  }
}

const mapStateToProps = (state) => ({
  //   socialMediaGraph: state.reports.socialMediaGraph
});

export default connect(mapStateToProps, {})(ClientsDetailsReportPieCharRevenue);
