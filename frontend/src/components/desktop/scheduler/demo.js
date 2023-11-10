import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DateNavigator,
  TodayButton,
  Resources,
  // WeekView,
  MonthView,
  // DayView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  GroupingPanel,
  Toolbar,
  ViewSwitcher,
  DragDropProvider,
  ConfirmationDialog,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import { blue, orange } from "@material-ui/core/colors";

import { data as appointments } from "./demo-data/grouping";

// const resources = [
//   {
//     fieldName: "memberId",
//     title: "Members",
//     instances: [
//       { text: "Arnie Schwartz", id: 1, color: blue },
//       { text: "Andrew Glover", id: 2, color: orange },
//       { text: "John Heart", id: 3, color: blue },
//       { text: "Taylor Riley", id: 4, color: orange },
//       { text: "Brad Farkus", id: 5, color: blue },
//     ],
//   },
// ];
const groupOrientation = (viewName) => viewName.split(" ")[0];
const grouping = [
  {
    resourceName: "memberId",
  },
];

export default class Demo extends Component {
  constructor() {
    super();
    this.state = {
      data: appointments,
      currentDate: new Date(),
      resources: [
        {
          fieldName: "memberId",
          title: "Members",
          instances: [
            { text: "Arnie Schwartz", id: 1, color: blue },
            { text: "Andrew Glover", id: 2, color: orange },
            { text: "John Heart", id: 3, color: blue },
            { text: "Taylor Riley", id: 4, color: orange },
            { text: "Brad Farkus", id: 5, color: blue },
          ],
        },
      ],
    };
  }

  // const [data, setData] = React.useState(appointments);
  // const onCommitChanges = React.useCallback(
  //   ({ added, changed, deleted }) => {
  //     if (added) {
  //       const startingAddedId =
  //         data.length > 0 ? data[data.length - 1].id + 1 : 0;
  //       setData([...data, { id: startingAddedId, ...added }]);
  //     }
  //     if (changed) {
  //       setData(
  //         data.map((appointment) =>
  //           changed[appointment.id]
  //             ? { ...appointment, ...changed[appointment.id] }
  //             : appointment
  //         )
  //       );
  //     }
  //     if (deleted !== undefined) {
  //       setData(data.filter((appointment) => appointment.id !== deleted));
  //     }
  //   },
  //   [setData, data]
  // );
  commitChanges({ added, changed, deleted }) {
    console.log(added);
    console.log(changed);
    console.log(deleted);
    // this.setState((state) => {
    //   let { data } = state;
    //   if (added) {
    //     const startingAddedId =
    //       data.length > 0 ? data[data.length - 1].id + 1 : 0;
    //     data = [...data, { id: startingAddedId, ...added }];
    //   }
    //   if (changed) {
    //     data = data.map((appointment) =>
    //       changed[appointment.id]
    //         ? { ...appointment, ...changed[appointment.id] }
    //         : appointment
    //     );
    //   }
    //   if (deleted !== undefined) {
    //     data = data.filter((appointment) => appointment.id !== deleted);
    //   }
    //   return { data };
    // });
  }

  currentDateChange = (currentDate) => {
    this.setState({ currentDate, loading: true });
  };

  render() {
    const { data, currentDate, resources } = this.state;
    return (
      <Paper>
        <Scheduler data={data} height={660}>
          <ViewState
            defaultCurrentDate={currentDate}
            onCurrentDateChange={this.currentDateChange}
          />
          <EditingState onCommitChanges={this.commitChanges} />
          <IntegratedEditing />
          <GroupingState
            grouping={grouping}
            groupOrientation={groupOrientation}
          />

          <MonthView
            startDayHour={10}
            endDayHour={20}
            excludedDays={[0, 6]}
            cellDuration={60}
            name="Vertical Orientation"
          />
          <MonthView
            startDayHour={10}
            endDayHour={20}
            excludedDays={[0, 6]}
            name="Horizontal Orientation"
          />

          <ConfirmationDialog />
          <AllDayPanel />
          <Appointments />
          <Resources data={resources} mainResourceName="memberId" />

          <IntegratedGrouping />
          <IntegratedEditing />
          <AppointmentTooltip showOpenButton showCloseButton />
          <AppointmentForm />

          <GroupingPanel />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    );
  }
}
