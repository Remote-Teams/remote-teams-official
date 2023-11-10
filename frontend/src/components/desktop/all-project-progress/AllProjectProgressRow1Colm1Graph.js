import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { optionsCurrency } from "./BarGraphOptions";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";

let letTicksFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letTicksFontSize = 9;
  letLegendBoxWidth = 5;
} else {
  letTicksFontSize = 5;
  letLegendBoxWidth = 3;
}

class AllProjectProgressRow1Colm1Graph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.estimatedVsActualCostChartData) &&
      nextProps.estimatedVsActualCostChartData !==
        nextState.estimatedVsActualCostChartData
    ) {
      return {
        estimatedVsActualCostChartData:
          nextProps.estimatedVsActualCostChartData,
      };
    }
    return null;
  }

  render() {
    const { estimatedVsActualCostChartData } = this.state;

    let labelArray = [];
    let filterData =
      !isEmpty(estimatedVsActualCostChartData) &&
      estimatedVsActualCostChartData[0].forEach((element) => {
        // console.log(element);
        labelArray.push(`Week ${element}`);
      });

    var newData = labelArray.slice(Math.max(labelArray.length - 5, 0));

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(246, 211, 101, 1)");
      gradient1.addColorStop(0.3, "rgba(253, 160, 133, 1)");
      //gradient1.addColorStop(0.1, "#D440FD");
      //gradient1.addColorStop(0, "#A304FA");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(161, 140, 209, 1)");
      gradient2.addColorStop(0.3, "rgba(251, 194, 235, 1)");
      // gradient2.addColorStop(0.1, "#FEA859");
      // gradient2.addColorStop(0, "#EE765E");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels: !isEmpty(newData) && newData,
        datasets: [
          {
            label: "Estimated Cost",
            backgroundColor: gradient1,
            borderWidth: 0,
            data:
              !isEmpty(estimatedVsActualCostChartData) &&
              estimatedVsActualCostChartData[2].slice(
                Math.max(estimatedVsActualCostChartData[2].length - 5, 0)
              ),
          },
          {
            label: "Actual Cost",
            //backgroundColor: "#40E0D0",
            backgroundColor: gradient2,
            borderWidth: 0,
            data:
              !isEmpty(estimatedVsActualCostChartData) &&
              estimatedVsActualCostChartData[1].slice(
                Math.max(estimatedVsActualCostChartData[1].length - 5, 0)
              ),
          },
        ],
      };
    };
    return (
      <>
        <Bar data={data} options={optionsCurrency} width={100} height={41} />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  estimatedVsActualCostChartData: state.projects.estimatedVsActualCostChartData,
});

export default connect(mapStateToProps, {})(AllProjectProgressRow1Colm1Graph);
