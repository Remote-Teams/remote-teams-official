import React, { Component } from "react";

import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsData from "highcharts/modules/data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import HC_More from "highcharts/highcharts-more";

export class HighchartWindrose extends Component {
  componentDidMount() {
    // Initialize exporting module
    HighchartsExporting(Highcharts);
    HC_More(Highcharts);
    HighchartsData(Highcharts);
    HighchartsAccessibility(Highcharts);

    Highcharts.chart("wind-rose-chart-container", {
      data: {
        table: "freq",
        startRow: 1,
        endRow: 17,
        endColumn: 7,
      },

      chart: {
        polar: true,
        type: "column",
        backgroundColor: "transparent",
      },

      title: {
        style: {
          color: "#ffffff",
        },
        text: "Wind rose for South Shore Met Station, Oregon",
      },

      pane: {
        size: "85%",
      },

      legend: {
        align: "right",
        verticalAlign: "top",
        y: 100,
        layout: "vertical",
      },

      xAxis: {
        tickmarkPlacement: "on",
      },

      yAxis: {
        min: 0,
        endOnTick: false,
        showLastLabel: true,
        title: {
          text: "Frequency (%)",
        },
        labels: {
          formatter: function() {
            return this.value + "%";
          },
        },
        reversedStacks: false,
      },

      tooltip: {
        valueSuffix: "%",
      },

      plotOptions: {
        series: {
          stacking: "normal",
          shadow: false,
          groupPadding: 0,
          pointPlacement: "on",
        },
      },
    });
  }

  render() {
    return (
      <div>
        <figure>
          <div id="wind-rose-chart-container"></div>
        </figure>
        <div style={{ display: "none" }}>
          <table id="freq" border="0" cellSpacing="0" cellPadding="0">
            <tbody>
              <tr nowrap="true" bgcolor="#CCCCFF">
                <th colSpan="9" className="hdr">
                  Table of Frequencies (percent)
                </th>
              </tr>
              <tr nowrap="true" bgcolor="#CCCCFF">
                <th className="freq">Direction</th>
                <th className="freq">&lt; 0.5 m/s</th>
                <th className="freq">0.5-2 m/s</th>
                <th className="freq">2-4 m/s</th>
                <th className="freq">4-6 m/s</th>
                <th className="freq">6-8 m/s</th>
                <th className="freq">8-10 m/s</th>
                <th className="freq">&gt; 10 m/s</th>
                <th className="freq">Total</th>
              </tr>
              <tr nowrap="true">
                <td className="dir">N</td>
                <td className="data">1.81</td>
                <td className="data">1.78</td>
                <td className="data">0.16</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">3.75</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">NNE</td>
                <td className="data">0.62</td>
                <td className="data">1.09</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">1.71</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">NE</td>
                <td className="data">0.82</td>
                <td className="data">0.82</td>
                <td className="data">0.07</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">1.71</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">ENE</td>
                <td className="data">0.59</td>
                <td className="data">1.22</td>
                <td className="data">0.07</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">1.88</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">E</td>
                <td className="data">0.62</td>
                <td className="data">2.20</td>
                <td className="data">0.49</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">3.32</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">ESE</td>
                <td className="data">1.22</td>
                <td className="data">2.01</td>
                <td className="data">1.55</td>
                <td className="data">0.30</td>
                <td className="data">0.13</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">5.20</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">SE</td>
                <td className="data">1.61</td>
                <td className="data">3.06</td>
                <td className="data">2.37</td>
                <td className="data">2.14</td>
                <td className="data">1.74</td>
                <td className="data">0.39</td>
                <td className="data">0.13</td>
                <td className="data">11.45</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">SSE</td>
                <td className="data">2.04</td>
                <td className="data">3.42</td>
                <td className="data">1.97</td>
                <td className="data">0.86</td>
                <td className="data">0.53</td>
                <td className="data">0.49</td>
                <td className="data">0.00</td>
                <td className="data">9.31</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">S</td>
                <td className="data">2.66</td>
                <td className="data">4.74</td>
                <td className="data">0.43</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">7.83</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">SSW</td>
                <td className="data">2.96</td>
                <td className="data">4.14</td>
                <td className="data">0.26</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">7.37</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">SW</td>
                <td className="data">2.53</td>
                <td className="data">4.01</td>
                <td className="data">1.22</td>
                <td className="data">0.49</td>
                <td className="data">0.13</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">8.39</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">WSW</td>
                <td className="data">1.97</td>
                <td className="data">2.66</td>
                <td className="data">1.97</td>
                <td className="data">0.79</td>
                <td className="data">0.30</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">7.70</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">W</td>
                <td className="data">1.64</td>
                <td className="data">1.71</td>
                <td className="data">0.92</td>
                <td className="data">1.45</td>
                <td className="data">0.26</td>
                <td className="data">0.10</td>
                <td className="data">0.00</td>
                <td className="data">6.09</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">WNW</td>
                <td className="data">1.32</td>
                <td className="data">2.40</td>
                <td className="data">0.99</td>
                <td className="data">1.61</td>
                <td className="data">0.33</td>
                <td className="data">0.00</td>
                <td className="data">0.00</td>
                <td className="data">6.64</td>
              </tr>
              <tr nowrap="true">
                <td className="dir">NW</td>
                <td className="data">1.58</td>
                <td className="data">4.28</td>
                <td className="data">1.28</td>
                <td className="data">0.76</td>
                <td className="data">0.66</td>
                <td className="data">0.69</td>
                <td className="data">0.03</td>
                <td className="data">9.28</td>
              </tr>
              <tr nowrap="true" bgcolor="#DDDDDD">
                <td className="dir">NNW</td>
                <td className="data">1.51</td>
                <td className="data">5.00</td>
                <td className="data">1.32</td>
                <td className="data">0.13</td>
                <td className="data">0.23</td>
                <td className="data">0.13</td>
                <td className="data">0.07</td>
                <td className="data">8.39</td>
              </tr>
              <tr nowrap="true">
                <td className="totals">Total</td>
                <td className="totals">25.53</td>
                <td className="totals">44.54</td>
                <td className="totals">15.07</td>
                <td className="totals">8.52</td>
                <td className="totals">4.31</td>
                <td className="totals">1.81</td>
                <td className="totals">0.23</td>
                <td className="totals">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default HighchartWindrose;
