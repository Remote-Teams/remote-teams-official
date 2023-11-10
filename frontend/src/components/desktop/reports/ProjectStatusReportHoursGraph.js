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
  rotation: 1.8 * Math.PI,
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

class ProjectStatusReportHoursGraph extends Component {
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
      gradient1.addColorStop(0, "rgba(212, 64, 253, 1)");
      gradient1.addColorStop(0.2, "rgba(163, 4, 250, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(176, 106, 179, 1)");
      gradient2.addColorStop(0.2, "rgba(69, 104, 220, 1)");

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
        labels: ["Utilized", "Remaining"],
        // labels: lebelsData,
      };
    };

    return <Pie data={data} options={options} width={100} height={50} />;
  }
}

const mapStateToProps = (state) => ({
  //   socialMediaGraph: state.reports.socialMediaGraph
});

export default connect(mapStateToProps, {})(ProjectStatusReportHoursGraph);
