import React, { useEffect } from "react";
import GSTC from "./GSTC";
import CalendarScroll from "gantt-schedule-timeline-calendar/dist/CalendarScroll.plugin.js";
// import ItemMovement from "gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js";
import WeekendHighlight from "gantt-schedule-timeline-calendar/dist/WeekendHighlight.plugin.js";
import Selection from "gantt-schedule-timeline-calendar/dist/Selection.plugin.js";

function Gant() {
  const config = {
    plugins: [
      // ItemMovement({
      //   moveable: "x",
      //   resizerContent: '<div class="resizer">-></div>',
      //   ghostNode: false,
      //   // snap item start time to start of the day
      //   snapStart(time, diff, item) {
      //     return api.time
      //       .date(time)
      //       .add(diff, "milliseconds")
      //       .startOf("day")
      //       .valueOf();
      //   },
      //   // snap item end time to end of the day
      //   snapEnd(time, diff, item) {
      //     return api.time
      //       .date(time)
      //       .add(diff, "milliseconds")
      //       .endOf("day")
      //       .valueOf();
      //   }
      // }),
      Selection({
        items: false,
        rows: false,
        grid: true, // select only grid cells
        rectStyle: { opacity: "0.0" }, // hide selecting rectangle
        // if there is an item in the current selected cell - do not select that cell
        canSelect(type, currentlySelecting) {
          if (type === "chart-timeline-grid-row-block") {
            // check if there is any item that lives inside current cell
            return currentlySelecting.filter((selected) => {
              if (!selected.row.canSelect) return false;
              for (const item of selected.row._internal.items) {
                if (
                  (item.time.start >= selected.time.leftGlobal &&
                    item.time.start <= selected.time.rightGlobal) ||
                  (item.time.end >= selected.time.leftGlobal &&
                    item.time.end <= selected.time.rightGlobal) ||
                  (item.time.start <= selected.time.leftGlobal &&
                    item.time.end >= selected.time.rightGlobal)
                ) {
                  return false;
                }
              }
              return true;
            });
          }
          return currentlySelecting;
        },
        canDeselect(type, currently, all) {
          if (type === "chart-timeline-grid-row-blocks") {
            // if we are selecting we can clear previous selection by returning [] else if
            // we are not selecting but something is already selected let it be selected - currently
            return all.selecting["chart-timeline-grid-row-blocks"].length
              ? []
              : currently;
          }
          return [];
        },
        selecting(data, type) {
          //console.log(`selecting ${type}`, data);
        },
        deselecting(data, type) {
          //console.log(`deselecting ${type}`, data);
        },
        selected(data, type) {
          //console.log(`selected ${type}`, data);
        },
        deselected(data, type) {
          //console.log(`deselected ${type}`, data);
        },
      }),
      CalendarScroll({
        speed: 1,
        hideScroll: true,
        onChange(time) {
          console.log(time);
        },
      }),
      WeekendHighlight({
        weekdays: [6, 0], // Saturnday, Sunday
        className: "weekdays_color",
      }),
    ],
    height: 300,
    list: {
      rows: {
        "1": {
          id: "1",
          label: "Row 1",
        },
        "2": {
          id: "2",
          label: "Row 2",
        },
        "3": {
          id: "3",
          label: "Row 3",
        },
        "4": {
          id: "4",
          label: "Row 4",
        },
      },
      columns: {
        data: {
          id: {
            id: "id",
            data: "id",
            width: 50,
            header: {
              content: "ID",
            },
          },
          label: {
            id: "label",
            data: "label",
            width: 200,
            header: {
              content: "Label",
            },
          },
        },
      },
    },
    chart: {
      items: {
        "1": {
          id: "1",
          rowId: "1",
          label: "item1",
          moveable: ["1"], // NOT MOVEABLE
          resizeable: true, // NOT RESIZEABLE
          time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 24 * 60 * 60 * 1000,
          },
        },
        "2": {
          id: "2",
          rowId: "2",
          label: "item2",
          moveable: ["1"], // NOT MOVEABLE
          resizeable: true, // NOT RESIZEABLE
          time: {
            start: new Date().getTime() + 4 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
          },
        },
        "3": {
          id: "3",
          rowId: "2",
          label: "item3",
          moveable: ["1"], // NOT MOVEABLE
          resizeable: true, // NOT RESIZEABLE
          time: {
            start: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
          },
        },
        "4": {
          id: "4",
          rowId: "3",
          label: "item4",
          moveable: ["1"], // NOT MOVEABLE
          resizeable: true, // NOT RESIZEABLE
          time: {
            start: new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
          },
        },
        "5": {
          id: "5",
          rowId: "4",
          moveable: "y", // NOT MOVEABLE
          resizeable: true, // NOT RESIZEABLE
          label: "item5",
          time: {
            start: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 14 * 24 * 60 * 60 * 1000,
          },
        },
      },
    },
  };

  let subs = [];

  function onState(state) {
    state.update("config.chart.items.1", (item1) => {
      // item1.label = "Gantt schedule timeline calendar";
      // item1.time.end = item1.time.end + 2 * 24 * 60 * 60 * 1000;
      return item1;
    });
    subs.push(
      state.subscribe("config.chart.items", (items) => {
        // console.log("items changed", items);
      })
    );
    subs.push(
      state.subscribe("config.list.rows", (rows) => {
        // console.log("rows changed", rows);
      })
    );
  }

  useEffect(() => {
    return () => {
      subs.forEach((unsub) => unsub());
    };
  });

  return (
    <div className="App">
      <GSTC config={config} onState={onState} />
    </div>
  );
}

export default Gant;
