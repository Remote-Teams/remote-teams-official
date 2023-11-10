//import React, { Component } from "react";
//import { Pie } from "react-chartjs-2";
//import { connect } from "react-redux";
//import isEmpty from "../../../store/validations/is-empty";
//
//class TaskStatusChart extends Component {
//  constructor() {
//    super();
//    this.state = {};
//  }
//
//  /*=======================================
//              Lifecycle Methods
//  =========================================*/
//  static getDerivedStateFromProps(nextProps, nextState) {
//    if (
//      !isEmpty(nextProps.taskStatusBreakdown) &&
//      nextProps.taskStatusBreakdown !== nextState.taskStatusBreakdown
//    ) {
//      return {
//        taskStatusBreakdown: nextProps.taskStatusBreakdown,
//      };
//    }
//    return null;
//  }
//
//  render() {
//    const { taskStatusBreakdown } = this.state;
//
//    // console.log(taskStatusBreakdown);
//
//    let labelArray = [];
//    let percentageData = [];
//
//    let mapData =
//      !isEmpty(taskStatusBreakdown) &&
//      taskStatusBreakdown.map((element, index) => {
//        if (typeof element[0] === "string") {
//          labelArray = element;
//        } else {
//         percentageData = element;
//        }
//      });
//
//    // console.log(labelArray);
//
//    const data = (canvas) => {
//      const ctx = canvas.getContext("2d");
//      const gradient1 = ctx.createLinearGradient(0, 0, 0, 900);
//      gradient1.addColorStop(0, "#FFECD2");
//      gradient1.addColorStop(0.3, "#FCB69F");
//      //gradient1.addColorStop(0, "#EAAFC8");
//      //gradient1.addColorStop(0.3, "#654EA3");
//
//      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
//      gradient2.addColorStop(0, "#A18CD1");
//      gradient2.addColorStop(0.3, "#FBC2EB");
//      //gradient2.addColorStop(0, "#FC9747");
//      //gradient2.addColorStop(0.3, "#FD7697");
//
//      const gradient3 = ctx.createLinearGradient(0, 0, 0, 900);
//      gradient3.addColorStop(0, "#667EEA");
//      gradient3.addColorStop(0.8, "#764BA2");
//      //gradient3.addColorStop(0, "#1CB5E0");
//      //gradient3.addColorStop(0.8, "#B95EFF");
//
//      return {
//        datasets: [
//          {
//            data: !isEmpty(taskStatusBreakdown) && taskStatusBreakdown[1],
//            // data: countData,
//            backgroundColor: [gradient1, gradient2, gradient3],
//            label: "",
//            borderColor: "transparent",
//           borderWidth: 0,
//            hoverBorderColor: "transparent",
//          },
//        ],
//        labels: labelArray,
//        // labels: lebelsData,
//      };
//    };
//
//    const options = {
//     legend: {
//        labels: {
//          fontSize: 12,
//          fontColor: "#ffffff",
//          fontFamily: "Nunito-Regular",
//          usePointStyle: true,
//          boxWidth: 5,
//        },
//      },
//      tooltips: {
//        backgroundColor: "#4a5055",
//        titleFontFamily: "Nunito-Regular",
//        bodyFontFamily: "Nunito-Regular",
//      },
//    };

    // console.log(this.state.socialMediaGraph);
//    return (
//      <div>
//        <Pie
//          data={data}
//          options={options}
//          width={100}
//          //height={80}
//          height={70}
//        />
//      </div>
//    );
//  }
//}

//const mapStateToProps = (state) => ({
//  taskStatusBreakdown: state.projects.taskStatusBreakdown,
//});

export default connect(mapStateToProps, {})(TaskStatusChart);
