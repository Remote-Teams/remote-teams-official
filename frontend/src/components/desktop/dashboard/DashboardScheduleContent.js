import React, { useEffect, useState } from "react";
import SchedulerTwoDashboard from "./SchedulerTwoDashboard";
// import AddNewSchedule from "./../../../components/desktop/scheduler-two/AddNewSchedule";
import { useDispatch } from "react-redux";
import { getPipelineOfUser } from "./../../../store/actions/pipelineAction";
import { getScheduleWithCalender } from "./../../../store/actions/scheduleAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";
import DashboardAddNewSchedule from "./DashboardAddNewSchedule";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";

const data = [
  {
    _id: "4efca810-edd5-11eb-a6df-3db9d7334396",
    groupId: "GROUP1627278597",
    bookingName: "demo",
    assignedTo: "8a7f84a0-edd2-11eb-9051-ebd907e612fb",
    task: {
      assignees: ["8a7f84a0-edd2-11eb-9051-ebd907e612fb"],
      _id: "49bfb6d0-edd5-11eb-a6df-3db9d7334396",
      name: "demo",
      project: {
        resources: [],
        _id: "cf6267e0-edd2-11eb-9051-ebd907e612fb",
        name: "dominate",
        client: "c58efe90-edd2-11eb-9051-ebd907e612fb",
        logo: "",
        startDate: "2021-06-30T18:30:00.000Z",
        endDate: "2021-07-30T18:30:00.000Z",
        estimatedCTC: 5000,
        estimatedHours: 200,
        description: "asdasd",
        status: "UPCOMING",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-26T05:32:04.323Z",
        updatedAt: "2021-07-26T05:32:04.323Z",
        __v: 0,
      },
      startDate: "2021-07-26T05:49:32.029Z",
      endDate: "2021-07-31T05:49:32.000Z",
      stage: "cf6463b0-edd2-11eb-9051-ebd907e612fb",
      priority: "LOW",
      emoji: "🚣‍♀️",
      createdBy: "akshaynagargoje0716@gmail.com",
      lastModifiedBy: "akshaynagargoje0716@gmail.com",
      createdAt: "2021-07-26T05:49:48.641Z",
      updatedAt: "2021-07-26T05:49:48.641Z",
      __v: 0,
    },
    fromDate: "2021-07-26T04:30:00.000Z",
    toDate: "2021-07-26T05:30:00.000Z",
    fromTime: "2021-07-26T04:30:00.000Z",
    toTime: "2021-07-26T05:30:00.000Z",
    type: "PROJECT",
    taskColor:
      "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
    bookedBy: "8a7f84a0-edd2-11eb-9051-ebd907e612fb",
    emoji: "🌪️",
    createdBy: "akshaynagargoje0716@gmail.com",
    lastModifiedBy: "akshaynagargoje0716@gmail.com",
    createdAt: "2021-07-26T05:49:57.397Z",
    updatedAt: "2021-07-26T05:49:57.397Z",
    __v: 0,
    CATEGORY: "SCHEDULE",
  },
  {
    attendees: [
      {
        contract: { attachments: [] },
        memberType: "FULLTIME",
        _id: "8a7f84a0-edd2-11eb-9051-ebd907e612fb",
        email: "akshaynagargoje0716@gmail.com",
        firstName: "akshay",
        lastName: "nagargoje",
        demo: false,
        role: "89c47200-edd2-11eb-9051-ebd907e612fb",
        profileImage:
          "/public/download?filename=file-2019-11-18T17:38:30.307Z.jpeg",
        name: "akshay nagargoje",
        status: "ACTIVE",
        dateOfJoining: "2021-07-26T05:30:08.738Z",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-26T05:30:08.753Z",
        updatedAt: "2021-07-26T05:30:25.658Z",
        __v: 0,
      },
    ],
    _id: "dca06f40-edd9-11eb-a6df-3db9d7334396",
    bookingName: "meeting",
    fromDate: "2021-07-26T18:30:00.000Z",
    toDate: "2021-07-26T18:30:00.000Z",
    fromTime: "2021-07-26T06:30:00.223Z",
    toTime: "2021-07-26T07:30:00.224Z",
    organizer: {
      contract: { attachments: [] },
      memberType: "FULLTIME",
      _id: "8a7f84a0-edd2-11eb-9051-ebd907e612fb",
      email: "akshaynagargoje0716@gmail.com",
      firstName: "akshay",
      lastName: "nagargoje",
      demo: false,
      role: "89c47200-edd2-11eb-9051-ebd907e612fb",
      profileImage:
        "/public/download?filename=file-2019-11-18T17:38:30.307Z.jpeg",
      name: "akshay nagargoje",
      status: "ACTIVE",
      dateOfJoining: "2021-07-26T05:30:08.738Z",
      createdBy: "akshaynagargoje0716@gmail.com",
      lastModifiedBy: "akshaynagargoje0716@gmail.com",
      createdAt: "2021-07-26T05:30:08.753Z",
      updatedAt: "2021-07-26T05:30:25.658Z",
      __v: 0,
    },
    createdBy: "akshaynagargoje0716@gmail.com",
    lastModifiedBy: "akshaynagargoje0716@gmail.com",
    createdAt: "2021-07-26T06:22:33.023Z",
    updatedAt: "2021-07-26T06:22:33.023Z",
    __v: 0,
    CATEGORY: "MEETING",
    taskColor:
      "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
    emoji: "🌪️",
  },
];

export default function DashboardScheduleContent() {
  const dispatch = useDispatch();
  const [allScheduleData, setAllScheduleData] = useState([]);

  const singleResourceScheduleCalender = useSelector(
    (state) => state.schedule.singleResourceScheduleCalender
  );

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));
    const formData = {
      query: {
        user: userData.id,
        dismissed: false,
        bookingCreated: false,
      },
    };
    let startWeek = startOfWeek(new Date());
    let endWeek = endOfWeek(new Date());

    let newStartDate = startOfDay(startWeek);
    let endStartDate = endOfDay(endWeek);

    const scheduleData = {
      startDate: newStartDate,
      endDate: endStartDate,
      member: userData.id,
    };

    dispatch(getPipelineOfUser(formData));
    dispatch(getScheduleWithCalender(scheduleData));
    dispatch(getAllResourceAction());
  }, []);

  useEffect(() => {
    if (!isEmpty(singleResourceScheduleCalender)) {
      let finalData = [];
      singleResourceScheduleCalender.forEach((element) => {
        if (element.CATEGORY === "MEETING") {
          finalData.push({
            bookingName: element.subject,
            fromDate: element.meetingDate,
            toDate: element.meetingDate,
            fromTime: element.meetingTimeFrom,
            toTime: element.meetingTimeTo,
            taskColor:
              "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
            emoji: "🌪️",
            ...element,
          });
        } else if (element.CATEGORY === "DAYOFF") {
          finalData.push({
            CATEGORY: element.CATEGORY,
            bookingName: element.reason,
            fromDate: element.fromDate,
            toDate: element.toDate,
            fromTime: "2021-07-26T04:30:32.987Z",
            toTime: "2021-07-26T13:30:00.987Z",
            taskColor:
              "linear-gradient(360deg,rgba(45, 49, 53, 1) 100%,rgba(45, 49, 53, 1) 100%),linear-gradient(270.01deg,rgba(253, 117, 66, 1) 12.81%,rgba(246, 211, 101, 1) 93.06%)",
            emoji: "🌪️",
            _id: element._id,
            leaveType: element.leaveType,
            // ...element,
          });
        } else if (element.CATEGORY === "SCHEDULE") {
          finalData.push(element);
        }
      });

      setAllScheduleData(finalData);
    } else {
      setAllScheduleData([]);
    }
  }, [singleResourceScheduleCalender]);

  // console.log(allScheduleData);
  return (
    <div className="dashboard-schedule-row__colm1 flex-shrink-0">
      {/* content */}
      <div className="row mx-0 align-items-center flex-nowrap dashboard-schedule-title-div">
        <h4 className="dashboard-schedule-title">your schedule this week</h4>
        <DashboardAddNewSchedule />
      </div>

      <SchedulerTwoDashboard appointments={allScheduleData} />
    </div>
  );
}
