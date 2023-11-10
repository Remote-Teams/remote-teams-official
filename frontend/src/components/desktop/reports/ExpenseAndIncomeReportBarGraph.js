import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

let letTicksFontSize = 0;
let letLegendFontSize = 0;

if (window.innerWidth > 880) {
  letLegendFontSize = 12;
  letTicksFontSize = 9;
} else {
  letLegendFontSize = 9;
  letTicksFontSize = 7;
}

export const optionsCurrency = {
  curvature: 1,
  legend: {
    display: true,
    labels: {
      fontSize: letLegendFontSize,
      fontColor: "rgba(255, 255, 255, 1)",
      fontFamily: "Nunito-SemiBold",
      usePointStyle: true,
      boxWidth: 5,
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
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, 1)",
          fontFamily: "Nunito-Regular",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          // Include a string value in the ticks
          callback: function(value, index, values) {
            if (value === 0) return null;
            else return value + " $ " + "  ";
          },
        },
        gridLines: {
          display: true,
          drawBorder: false,
          borderDash: [8],
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: "rgba(255, 255, 255, 1)",
          fontFamily: "Nunito-SemiBold",
        },
        categoryPercentage: 0.6,
        barPercentage: 0.9,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

class ExpenseAndIncomeReportBarGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.expenseVsIncomeChartExpense) &&
      nextProps.expenseVsIncomeChartExpense !==
        nextState.expenseVsIncomeChartExpense
    ) {
      return {
        expenseVsIncomeChartExpense: nextProps.expenseVsIncomeChartExpense,
      };
    }
    if (
      !isEmpty(nextProps.expenseVsIncomeChartIncome) &&
      nextProps.expenseVsIncomeChartIncome !==
        nextState.expenseVsIncomeChartIncome
    ) {
      return {
        expenseVsIncomeChartIncome: nextProps.expenseVsIncomeChartIncome,
      };
    }

    return null;
  }

  render() {
    const {
      expenseVsIncomeChartExpense,
      expenseVsIncomeChartIncome,
    } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient1.addColorStop(0, "rgba(252, 151, 71, 1)");
      gradient1.addColorStop(0.3, "rgba(253, 118, 151, 1)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "rgba(234, 175, 200, 1)");
      gradient2.addColorStop(0.3, "rgba(101, 78, 163, 1)");

      // shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = letTicksFontSize;
      ctx.shadowColor = "rgba(35, 37, 39, 0.7)";

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Expense",
            backgroundColor: gradient1,
            borderWidth: 0,
            data:
              !isEmpty(expenseVsIncomeChartExpense) &&
              expenseVsIncomeChartExpense,
          },
          {
            label: "Income",
            backgroundColor: gradient2,
            borderWidth: 0,
            data:
              !isEmpty(expenseVsIncomeChartIncome) &&
              expenseVsIncomeChartIncome,
          },
        ],
      };
    };
    return (
      <>
        <Bar data={data} options={optionsCurrency} width={90} height={28} />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expenseVsIncomeChartExpense: state.reports.expenseVsIncomeChartExpense,
  expenseVsIncomeChartIncome: state.reports.expenseVsIncomeChartIncome,
});

export default connect(mapStateToProps, {})(ExpenseAndIncomeReportBarGraph);
