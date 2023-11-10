let letTicksFontSize = 0;
let letLegendBoxWidth = 0;

if (window.innerWidth > 880) {
  letTicksFontSize = 9;
  letLegendBoxWidth = 5;
} else {
  letTicksFontSize = 5;
  letLegendBoxWidth = 3;
}

export const optionsCurrency = {
  curvature: 1,
  legend: {
    display: true,
    labels: {
      fontSize: letTicksFontSize,
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
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

export const optionsHours = {
  legend: {
    display: true,
    labels: {
      fontSize: letTicksFontSize,
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
            else return value + " H " + "  ";
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
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};

export const optionsDays = {
  legend: {
    display: true,
    labels: {
      fontSize: letTicksFontSize,
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
            else return value + " Days " + "  ";
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
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: "rgba(112, 112, 112, .1)",
        },
      },
    ],
  },
};
