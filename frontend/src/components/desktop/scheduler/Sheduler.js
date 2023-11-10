import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Resources,
  WeekView,
  MonthView,
  DayView,
  Appointments,
  AppointmentTooltip,
  EditRecurrenceMenu,
  AppointmentForm,
  DateNavigator,
  TodayButton,
  ViewSwitcher,
  Toolbar,
  AllDayPanel,
  ConfirmationDialog,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import { blue } from "@material-ui/core/colors";

// const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

/*===============================================
                Tablecell css
================================================*/

const style = (theme) => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    "&:focus": {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    "&:hover": {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    "&:focus": {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
});

const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDate() === new Date().getDate()) {
    return (
      <WeekView.TimeTableCell
        {...restProps}
        className={classes.todayCell}
        onDoubleClick={undefined}
      />
    );
  }
  if (date.getDay() === 0 || date.getDay() === 6) {
    return (
      <WeekView.TimeTableCell
        {...restProps}
        className={classes.weekendCell}
        onDoubleClick={undefined}
      />
    );
  }
  return <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />;
};

const TimeTableCell = withStyles(style, { name: "TimeTableCell" })(
  TimeTableCellBase
);

const DayScaleCellBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;
  if (today) {
    return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
  }
  if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
  }
  return <WeekView.DayScaleCell {...restProps} />;
};

const DayScaleCell = withStyles(style, { name: "DayScaleCell" })(
  DayScaleCellBase
);

/*=====================================
          Appointment css
=======================================*/

const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: "#FFC107",
      borderRadius: "8px",
    }}
  >
    {children}
  </Appointments.Appointment>
);

/*=======================================
        Drag and Drop appointments
========================================*/

const dragDisableIds = new Set([3, 8, 10, 12]);

const allowDrag = ({ id }) => !dragDisableIds.has(id);
const appointmentComponent = (props) => {
  if (allowDrag(props.data)) {
    return <Appointments.Appointment {...props} />;
  }
  return (
    <Appointments.Appointment
      {...props}
      style={{ ...props.style, cursor: "not-allowed" }}
    />
  );
};

/*=========================================
            Resource switcher
===========================================*/

const styles = (theme) => ({
  container: {
    display: "flex",
    marginBottom: theme.spacing(2),
    justifyContent: "flex-end",
  },
  text: {
    ...theme.typography.h6,
    marginRight: theme.spacing(2),
  },
});

const ResourceSwitcher = withStyles(styles, { name: "ResourceSwitcher" })(
  ({ mainResourceName, onChange, classes, resources }) => (
    <div className={classes.container}>
      <div className={classes.text}>Main resource name:</div>
      <Select
        value={mainResourceName}
        onChange={(e) => onChange(e.target.value)}
      >
        {resources.map((resource) => (
          <MenuItem key={resource.fieldName} value={resource.fieldName}>
            {resource.title}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
);

const appointments = [
  {
    title: "Website Re-Design Plan",
    startDate: new Date(2020, 3, 10, 12, 35),
    endDate: new Date(2020, 3, 10, 16, 30),
    id: 0,
    members: [1],
    Privority: "Low",
  },
  {
    title: "Book Flights to San Fran for Sales Trip",
    startDate: new Date(2020, 3, 8, 12, 35),
    endDate: new Date(2020, 3, 8, 15, 0),
    id: 1,
    members: [1],
    Privority: "Medium",
  },
  {
    title: "Install New Router in Dev Room",
    startDate: new Date(2020, 3, 9, 12, 35),
    endDate: new Date(2020, 3, 9, 15, 0),
    id: 2,
    members: [3],
    Privority: "Low",
  },
  {
    title: "Approve Personal Computer Upgrade Plan",
    startDate: new Date(2020, 3, 28, 10, 35),
    endDate: new Date(2020, 3, 28, 11, 0),
    id: 3,
    members: [4, 1],
    Privority: "High",
  },
  {
    title: "Final Budget Review",
    startDate: new Date(2020, 3, 29, 12, 35),
    endDate: new Date(2020, 3, 29, 15, 0),
    id: 4,
    members: [5, 1, 3],
    Privority: "Room 5",
  },
];

export class Sheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      currentViewName: "Year",
      data: appointments,
      mainResourceName: "members",
      resources: [
        {
          fieldName: "Privority",
          title: "Privority",
          instances: [
            { id: "Low", text: "Low" },
            { id: "High", text: "High" },
            { id: "Medium", text: "Medium" },
            // { id: "Room 4", text: "Room 4" },
            // { id: "Room 5", text: "Room 5" },
          ],
        },
        {
          fieldName: "members",
          title: "Members",
          allowMultiple: true,
          instances: [
            { id: 1, text: "Andrew Glover" },
            { id: 2, text: "Arnie Schwartz" },
            { id: 3, text: "John Heart" },
            { id: 4, text: "Taylor Riley" },
            { id: 5, text: "Brad Farkus" },
          ],
        },
      ],
    };
  }

  currentViewNameChange = (currentViewName) => {
    this.setState({ currentViewName, loading: true });
  };
  currentDateChange = (currentDate) => {
    this.setState({ currentDate, loading: true });
  };

  changeMainResource = (mainResourceName) => {
    this.setState({ mainResourceName });
  };

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

  render() {
    const {
      data,
      resources,
      mainResourceName,
      currentViewName,
      currentDate,
    } = this.state;

    return (
      <React.Fragment>
        <Paper>
          <Scheduler data={data}>
            <ResourceSwitcher
              resources={resources}
              mainResourceName={mainResourceName}
              onChange={this.changeMainResource}
            />
            <ViewState
              currentDate={currentDate}
              currentViewName={currentViewName}
              onCurrentViewNameChange={this.currentViewNameChange}
              onCurrentDateChange={this.currentDateChange}
            />
            <EditingState onCommitChanges={this.commitChanges} />
            <IntegratedEditing />
            <EditRecurrenceMenu />
            <MonthView
              startDayHour={10}
              endDayHour={20}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />
            <WeekView
              startDayHour={10}
              endDayHour={20}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />
            <DayView
              startDayHour={10}
              endDayHour={20}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />
            <ConfirmationDialog />
            <AllDayPanel />
            <Appointments
              appointmentComponent={(Appointment, appointmentComponent)}
            />
            <Toolbar
            // {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
            />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <AppointmentTooltip showOpenButton showCloseButton />
            {/* <AppointmentTooltip showOpenButton /> */}
            <AppointmentForm />
            <Resources data={resources} mainResourceName={mainResourceName} />
            <DragDropProvider allowDrag={allowDrag} />
          </Scheduler>
        </Paper>
      </React.Fragment>
    );
  }
}

export default Sheduler;
