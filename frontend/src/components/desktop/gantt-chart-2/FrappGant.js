import React, { Component } from "react";
import ReactGantt from "gantt-for-react";
import isEmpty from "../../../store/validations/is-empty";

const data = [
  {
    _id: "92ee8260-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Module 1",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-06-01T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:52:41.865Z"),
    updatedAt: new Date("2020-06-07T01:52:41.865Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "c5e9a820-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Sprint 1",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-20T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:07.396Z"),
    updatedAt: new Date("2020-06-07T01:54:07.396Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "ca5566b0-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Task 1",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-10T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:14.813Z"),
    updatedAt: new Date("2020-06-07T01:54:14.813Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "cb5566b0-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Task 2",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-10T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:14.813Z"),
    updatedAt: new Date("2020-06-07T01:54:14.813Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "c2e9a820-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Sprint 2",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-20T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:07.396Z"),
    updatedAt: new Date("2020-06-07T01:54:07.396Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "c25566b0-a861-11ea-b00d-932726f17576",
    status: "UPCOMING",
    name: "Task 1",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-10T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:14.813Z"),
    updatedAt: new Date("2020-06-07T01:54:14.813Z"),
    __v: 0,
    progress: 36,
  },
  {
    _id: "c25566b0-a861-11ea-b00d-932726f17571",
    status: "UPCOMING",
    name: "Task 2",
    module: "9fac8880-a861-11ea-b00d-932726f17576",
    project: "6cc538e0-a861-11ea-b00d-932726f17576",
    start: new Date("2020-05-01T07:03:47.995Z"),
    end: new Date("2020-05-10T07:03:47.995Z"),
    createdBy: "akhil.sharma@myrl.tech",
    lastModifiedBy: "akhil.sharma@myrl.tech",
    createdAt: new Date("2020-06-07T01:54:14.813Z"),
    updatedAt: new Date("2020-06-07T01:54:14.813Z"),
    __v: 0,
    progress: 36,
  },
];

const backEndData = [
  {
    _id: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
    status: "UPCOMING",
    name: "Frontend Designs",
    project: "86817f90-a96b-11ea-971e-efebdf62e815",
    startDate: "2020-06-08T09:33:43.102Z",
    endDate: "2020-07-08T09:33:43.102Z",
    createdBy: "shubham.rauniyar@myrl.tech",
    lastModifiedBy: "shubham.rauniyar@myrl.tech",
    createdAt: "2020-06-08T09:38:28.027Z",
    updatedAt: "2020-06-08T09:38:28.027Z",
    sprints: [
      {
        _id: "0b03ec30-a96c-11ea-971e-efebdf62e815",
        status: "UPCOMING",
        name: "Authentication Dessign",
        module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
        project: "86817f90-a96b-11ea-971e-efebdf62e815",
        startDate: "2020-06-08T09:33:43.102Z",
        endDate: "2020-06-12T09:33:43.102Z",
        createdBy: "shubham.rauniyar@myrl.tech",
        lastModifiedBy: "shubham.rauniyar@myrl.tech",
        createdAt: "2020-06-08T09:40:09.465Z",
        updatedAt: "2020-06-08T09:40:09.465Z",
        __v: 0,
        tasks: [
          {
            _id: "495cc4c0-a96c-11ea-971e-efebdf62e815",
            name: "Login",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "0b03ec30-a96c-11ea-971e-efebdf62e815",
            startDate: "2020-06-08T09:33:43.102Z",
            endDate: "2020-06-09T09:33:43.102Z",
            status: "UPCOMING",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-08T09:41:54.064Z",
            updatedAt: "2020-06-08T09:41:54.064Z",
            __v: 0,
          },
          {
            _id: "73caa050-a96d-11ea-971e-efebdf62e815",
            name: "SignUp",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "0b03ec30-a96c-11ea-971e-efebdf62e815",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "UPCOMING",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-08T09:50:14.744Z",
            updatedAt: "2020-06-08T09:50:14.744Z",
            __v: 0,
          },
          {
            _id: "98d95dd0-a988-11ea-9cb5-fd2c4b6b2a76",
            name: "Login Integrations",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "0b03ec30-a96c-11ea-971e-efebdf62e815",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "ONGOING",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-08T13:04:33.337Z",
            updatedAt: "2020-06-08T13:04:33.337Z",
            __v: 0,
          },
          {
            _id: "a6c70a50-a988-11ea-9cb5-fd2c4b6b2a76",
            name: "Signup Integrations",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "0b03ec30-a96c-11ea-971e-efebdf62e815",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "PENDING",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-08T13:04:56.698Z",
            updatedAt: "2020-06-08T13:04:56.698Z",
            __v: 0,
          },
          {
            _id: "aefbb7c0-a988-11ea-9cb5-fd2c4b6b2a76",
            name: "Login Designs",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "0b03ec30-a96c-11ea-971e-efebdf62e815",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "COMPLETED",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-08T13:05:10.464Z",
            updatedAt: "2020-06-08T13:05:10.464Z",
            __v: 0,
          },
        ],
      },
      {
        _id: "1ba18d60-aba4-11ea-b696-4d04f2f2d565",
        status: "UPCOMING",
        name: "Leads Page Design",
        module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
        project: "86817f90-a96b-11ea-971e-efebdf62e815",
        startDate: "2020-06-12T09:33:43.102Z",
        endDate: "2020-06-28T09:33:43.102Z",
        createdBy: "shubham.rauniyar@myrl.tech",
        lastModifiedBy: "shubham.rauniyar@myrl.tech",
        createdAt: "2020-06-11T05:26:31.486Z",
        updatedAt: "2020-06-11T05:26:31.486Z",
        __v: 0,
        tasks: [
          {
            _id: "df2806b0-aba4-11ea-b696-4d04f2f2d565",
            name: "Lead Addtions Designs",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "1ba18d60-aba4-11ea-b696-4d04f2f2d565",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "COMPLETED",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-11T05:31:59.522Z",
            updatedAt: "2020-06-11T05:31:59.522Z",
            __v: 0,
          },
          {
            _id: "e427a0d0-aba4-11ea-b696-4d04f2f2d565",
            name: "Lead Deletion Designs",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "1ba18d60-aba4-11ea-b696-4d04f2f2d565",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "COMPLETED",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-11T05:32:07.904Z",
            updatedAt: "2020-06-11T05:32:07.904Z",
            __v: 0,
          },
          {
            _id: "e6f62a20-aba4-11ea-b696-4d04f2f2d565",
            name: "Lead Update Designs",
            module: "ce8ddd60-a96b-11ea-971e-efebdf62e815",
            project: "86817f90-a96b-11ea-971e-efebdf62e815",
            sprint: "1ba18d60-aba4-11ea-b696-4d04f2f2d565",
            startDate: "2020-06-10T09:33:43.102Z",
            endDate: "2020-06-11T09:33:43.102Z",
            status: "COMPLETED",
            createdBy: "shubham.rauniyar@myrl.tech",
            lastModifiedBy: "shubham.rauniyar@myrl.tech",
            createdAt: "2020-06-11T05:32:12.617Z",
            updatedAt: "2020-06-11T05:32:12.617Z",
            __v: 0,
          },
        ],
      },
    ],
  },
  {
    _id: "65141240-aba1-11ea-b696-4d04f2f2d565",
    status: "UPCOMING",
    name: "Integration",
    project: "86817f90-a96b-11ea-971e-efebdf62e815",
    startDate: "2020-08-01T09:33:43.102Z",
    endDate: "2020-08-30T09:33:43.102Z",
    createdBy: "shubham.rauniyar@myrl.tech",
    lastModifiedBy: "shubham.rauniyar@myrl.tech",
    createdAt: "2020-06-11T05:07:06.217Z",
    updatedAt: "2020-06-11T05:07:06.217Z",
    sprints: [
      {
        tasks: [],
      },
    ],
  },
  {
    _id: "53f3ea80-aba1-11ea-b696-4d04f2f2d565",
    status: "UPCOMING",
    name: "Backend",
    project: "86817f90-a96b-11ea-971e-efebdf62e815",
    startDate: "2020-06-11T09:33:43.102Z",
    endDate: "2020-07-31T09:33:43.102Z",
    createdBy: "shubham.rauniyar@myrl.tech",
    lastModifiedBy: "shubham.rauniyar@myrl.tech",
    createdAt: "2020-06-11T05:06:37.486Z",
    updatedAt: "2020-06-11T05:06:37.486Z",
    sprints: [
      {
        tasks: [],
      },
    ],
  },
];

export default class FrappGant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: "Day",
      tasks: data,
    };
  }

  componentDidMount() {
    // window.setInterval(
    //   function () {
    //     this.setState({
    //       viewMode: ["Quarter Day", "Half Day", "Day", "Week", "Month"][
    //         parseInt(Math.random() * 5 + 1) - 1
    //       ],
    //       tasks: this.getTasks().slice(0, parseInt(Math.random() * 4 + 1)),
    //     });
    //   }.bind(this),
    //   5000
    // );
  }

  componentDidUpdate() {}

  getTasks = () => {
    let names = [
      ["Module 1", [0, 7]],
      ["Write new content", [0, 3]],
      ["Apply new styles", [3, 6]],
      ["Review", [7, 7]],
      ["Deploy", [8, 9]],
      ["Go Live!", [20, 25]],
    ];

    let tasks = names.map(function(name, i) {
      console.log(name);
      let today = new Date();
      let start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      let end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      start.setDate(today.getDate() + name[1][0]);
      end.setDate(today.getDate() + name[1][1]);
      return {
        start: start,
        end: end,
        // custom_class: "c-red",
        name: name[0],
        id: "Task " + i,
        progress: parseInt(Math.random() * 100, 10),
        type: "module",
      };
    });
    tasks[1].dependencies = "Task 0";
    tasks[2].dependencies = "Task 0";
    // tasks[2].dependencies = "Task 1, Task 0";
    // tasks[3].dependencies = "Task 2";
    // tasks[5].dependencies = "Task 4";

    // tasks[0].custom_class = "bar-milestone";
    // tasks[0].progress = 60;
    return tasks;
  };

  customPopupHtml = (task) => {
    const end_date = task._end.format("MMM D");
    return `
      <div class="details-container">
        <h5>${task.name}</h5>
        <p>Expected to finish by ${end_date}</p>
        <p>${task.progress}% completed!</p>
      </div>
    `;
  };

  onProgressChange = (args) => {
    console.log("Progress changed", args);
  };

  onClickHandler = (args) => {
    console.log("on clcik handler", args);
    if (args.type === "module") {
      alert("this is module");
    }
  };

  dateChangeHandler = (args) => {
    console.log("date changed", args);
  };

  viewChangeHandler = (args) => {
    console.log("view changed", args);
  };

  render() {
    // console.log(backEndData);
    let finalArray = [];
    backEndData.forEach((module) => {
      finalArray.push(module);
      if (!isEmpty(module)) {
        module.sprints.map((sprint) => {
          // console.log(sprint);
          if (!isEmpty(sprint) && !isEmpty(sprint._id)) {
            // console.log(finalArray);
            finalArray.push(sprint);
          }

          if (!isEmpty(sprint)) {
            sprint.tasks.map((task) => {
              if (!isEmpty(task)) {
                // console.log(task);
                finalArray.push(task);
              }
            });
          }
        });
        // console.log(module.sprints);
      }
    });

    let newArray = finalArray.map((element) => ({
      _id: element._id,
      status: "UPCOMING",
      name: element.name,
      // project: "6cc538e0-a861-11ea-b00d-932726f17576",
      start: new Date(element.startDate),
      end: new Date(element.endDate),
      createdBy: element.createdBy,
      lastModifiedBy: element.lastModifiedBy,
      createdAt: new Date(element.createdAt),
      updatedAt: new Date(element.updatedAt),
      __v: 0,
      progress: 36,
    }));

    console.log(finalArray);

    return (
      <div style={{ overflow: "scroll" }}>
        <ReactGantt
          tasks={newArray}
          viewMode={this.state.viewMode}
          onClick={this.onClickHandler}
          //   customPopupHtml={this.customPopupHtml}
          onProgressChange={this.onProgressChange}
          scrollOffsets={this.state.scrollOffsets}
          onDateChange={this.dateChangeHandler}
          onViewChange={this.viewChangeHandler}
        />
      </div>
    );
  }
}

// const data = [
//   {
//     dependencies: [],
//     end: "Wed Jun 17 2020 00:00:00 GMT+0530 (India Standard Time)",
//     id: "Task 0",
//     name: "Module 1",
//     progress: 36,
//     start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _end: "Thu Jun 18 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _index: 0,
//     _start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//   },
//   {
//     dependencies: ["Task 0"],
//     end: "Wed Jun 17 2020 00:00:00 GMT+0530 (India Standard Time)",
//     id: "Task 1",
//     name: "Sprint 1",
//     progress: 36,
//     start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _end: "Thu Jun 18 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _index: 0,
//     _start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//   },
//   {
//     dependencies: ["Task 0"],
//     end: "Wed Jun 17 2020 00:00:00 GMT+0530 (India Standard Time)",
//     id: "Task 0",
//     name: "Task 1",
//     progress: 36,
//     start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _end: "Thu Jun 18 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _index: 0,
//     _start: "Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time)",
//   },
// ];

// dependencies: ["Task 0"]
// end: Sat Jun 13 2020 00:00:00 GMT+0530 (India Standard Time) {}
// id: "Task 1"
// name: "Write new content"
// progress: 55
// start: Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time) {}
// _end: Sun Jun 14 2020 00:00:00 GMT+0530 (India Standard Time) {}
// _index: 1
// _start: Wed Jun 10 2020 00:00:00 GMT+0530 (India Standard Time) {}
// __proto__: Object
// 2:
// dependencies: []
// end: Tue Jun 16 2020 00:00:00 GMT+0530 (India Standard Time) {}
// id: "Task 2"
// name: "Apply new styles"
// progress: 33
// start: Sat Jun 13 2020 00:00:00 GMT+0530 (India Standard Time) {}
// _end: Wed Jun 17 2020 00:00:00 GMT+0530 (India Standard Time) {}
// _index: 2
// _start: Sat Jun 13 2020 00:00:00 GMT+0530 (India Standard Time) {}

// [
//   {
//     dependencies: [],
//     end: new Date(2020, 5, 13, 10, 33, 30, 0),
//     id: "Task 0",
//     name: "Module 1",
//     progress: 36,
//     start: new Date(),
//     _end: "Sun Jun 14 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _index: 0,
//     _start: new Date(),
//   },
//   {
//     dependencies: ["Task 0"],
//     end: new Date(2020, 5, 13, 10, 33, 30, 0),
//     id: "Task 1",
//     name: "task 2",
//     progress: 36,
//     start: new Date(),
//     _end: "Sun Jun 14 2020 00:00:00 GMT+0530 (India Standard Time)",
//     _index: 0,
//     _start: new Date(),
//   },
// ],
