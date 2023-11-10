import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import SchedulerTwo from "./SchedulerTwo";
import { connect } from "react-redux";
import {
  searchScheduleWithQuery,
  getScheduleByResource,
} from "./../../../store/actions/scheduleAction";
import { getResourceDataById } from "./../../../store/actions/resourcesAction";
import AddNewSchedule from "./AddNewSchedule";
import isEmpty from "../../../store/validations/is-empty";
// import getYear from "date-fns/get_year";
// import getMonth from "date-fns/get_month";
// import getDate from "date-fns/get_date";
// import getHours from "date-fns/get_hours";
// import getMinutes from "date-fns/get_minutes";
import { getAllProjectAction } from "./../../../store/actions/projectAction";
import { getAllResourceAction } from "./../../../store/actions/resourcesAction";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import { useSelector, useDispatch } from "react-redux";
import { startOfDay, endOfDay } from "date-fns";
import { startOfWeek, endOfWeek } from "date-fns";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import MemberDetailsNew from "./MemberDetailsNew";
import { getAllFieldsValue } from "./../../../store/actions/commandCenterAction";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import AddMemberWarning from "./AddMemberWarning";

const data = [
  {
    _id: "ef3fb2e0-e2d6-11eb-85e1-19934486d62a",
    assignedTo: "0c92f820-e2d2-11eb-85e1-19934486d62a",
    module: [
      {
        _id: "1265d5e0-e2d4-11eb-85e1-19934486d62a",
        status: "UPCOMING",
        name: "module one",
        project: "4d774110-e2d3-11eb-85e1-19934486d62a",
        startDate: "2021-07-12T05:43:08.206Z",
        endDate: "2021-07-16T05:43:08.000Z",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-12T05:43:23.457Z",
        updatedAt: "2021-07-12T05:43:23.457Z",
        __v: 0,
      },
    ],
    project: [
      {
        _id: "4d774110-e2d3-11eb-85e1-19934486d62a",
        resources: [],
        name: "demo",
        client: "42957500-e2d3-11eb-85e1-19934486d62a",
        logo: "",
        startDate: "2021-06-30T18:30:00.000Z",
        endDate: "2021-07-30T18:30:00.000Z",
        estimatedCTC: 5000,
        estimatedHours: 200,
        description: "asdsd",
        status: "UPCOMING",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-12T05:37:53.060Z",
        updatedAt: "2021-07-12T05:37:53.060Z",
        __v: 0,
      },
    ],
    sprint: [
      {
        _id: "17cd0b70-e2d4-11eb-85e1-19934486d62a",
        status: "UPCOMING",
        name: "sprint one",
        module: "1265d5e0-e2d4-11eb-85e1-19934486d62a",
        project: "4d774110-e2d3-11eb-85e1-19934486d62a",
        startDate: "2021-07-12T05:43:08.208Z",
        endDate: "2021-07-17T05:43:08.000Z",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-12T05:43:32.521Z",
        updatedAt: "2021-07-12T05:43:32.521Z",
        __v: 0,
      },
    ],
    task: [
      {
        _id: "1f911cc0-e2d4-11eb-85e1-19934486d62a",
        name: "task one",
        module: "1265d5e0-e2d4-11eb-85e1-19934486d62a",
        project: "4d774110-e2d3-11eb-85e1-19934486d62a",
        sprint: "17cd0b70-e2d4-11eb-85e1-19934486d62a",
        startDate: "2021-07-12T05:43:08.209Z",
        endDate: "2021-07-19T05:43:08.000Z",
        status: "UPCOMING",
        createdBy: "akshaynagargoje0716@gmail.com",
        lastModifiedBy: "akshaynagargoje0716@gmail.com",
        createdAt: "2021-07-12T05:43:45.556Z",
        updatedAt: "2021-07-12T05:43:45.556Z",
        __v: 0,
      },
    ],
    fromDate: "2021-07-12T06:03:21.279Z",
    toDate: "2021-07-12T06:03:21.279Z",
    fromTime: "2021-07-12T06:03:21.279Z",
    toTime: "2021-07-12T07:30:00.279Z",
    taskColor: "#737AAE",
    bookedBy: "0c92f820-e2d2-11eb-85e1-19934486d62a",
    groupId: "GROUP1626069832",
    bookingName: "demoBooking",
    createdBy: "akshaynagargoje0716@gmail.com",
    lastModifiedBy: "akshaynagargoje0716@gmail.com",
    createdAt: "2021-07-12T06:03:52.979Z",
    updatedAt: "2021-07-12T06:03:52.979Z",
    __v: 0,
  },
];

// const membersList = [
//   { value: "anjali M.", label: "anjali M." },
//   { value: "iza neu.", label: "iza neu." },
//   { value: "Rita M.", label: "Rita M." },
// ];

function SchedulerTwoMain() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    singleResourceSchedule: [],
    activeMember: {},
  });

  const [membersList, setmembersList] = useState([]);

  const singleResourceSchedule = useSelector(
    (state) => state.schedule.singleResourceSchedule
  );
  const singleResourceData = useSelector(
    (state) => state.resources.singleResourceData
  );

  const resources = useSelector((state) => state.resources.allResources);
  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    var userData = JSON.parse(localStorage.getItem("UserData"));

    dispatch(getAllProjectAction());
    dispatch(getAllResourceAction());
  }, []);

  useEffect(() => {
    if (!isEmpty(singleResourceSchedule)) {
      setValues({
        ...values,
        singleResourceSchedule: singleResourceSchedule,
      });
    } else {
      setValues({
        ...values,
        singleResourceSchedule: [],
      });
    }
  }, [singleResourceSchedule]);

  useEffect(() => {
    if (!isEmpty(resources)) {
      let newArray = [];
      resources.forEach((ele) => {
        newArray.push({ value: ele._id, label: ele.name });
      });
      setmembersList(newArray);
      setValues({
        ...values,
        activeMember: newArray[0],
      });
      dispatch(getResourceDataById(newArray[0].value));
      let startWeek = startOfWeek(new Date());
      let endWeek = endOfWeek(new Date());

      let newStartDate = startOfDay(startWeek);
      let endStartDate = endOfDay(endWeek);
      const scheduleData = {
        query: {
          assignedTo: newArray[0].value,
          $and: [
            { fromDate: { $lte: new Date(endStartDate) } },
            { fromDate: { $gte: new Date(newStartDate) } },
          ],
        },
      };

      dispatch(searchScheduleWithQuery(scheduleData));
      // setResourcesOption(newArray);
      // setValues({
      //   ...values,
      //   selectOption: newArray[0],
      //   displayListSelected: [newArray[0]],
      // });
    }
  }, [resources]);

  // const { singleResourceSchedule, allResourceSchedule } = values;
  // const { allResources } = this.props;

  // for loading a page
  // useEffect(() => {
  //   if (window.localStorage) {
  //     if (!localStorage.getItem("firstLoad")) {
  //       localStorage["firstLoad"] = true;
  //       window.location.reload();
  //       console.log("page loaded");
  //     } else localStorage.removeItem("firstLoad");
  //   }
  // }, []);

  /*===============================================================
        renderMembersFold
  ===============================================================*/

  const handleOnClickMemberButton = (val) => (e) => {
    setValues({
      ...values,
      activeMember: val,
    });
    console.log(val);
    let startWeek = startOfWeek(new Date());
    let endWeek = endOfWeek(new Date());

    let newStartDate = startOfDay(startWeek);
    let endStartDate = endOfDay(endWeek);
    const scheduleData = {
      query: {
        assignedTo: val.value,
        $and: [
          { fromDate: { $lte: new Date(endStartDate) } },
          { fromDate: { $gte: new Date(newStartDate) } },
        ],
      },
    };

    dispatch(searchScheduleWithQuery(scheduleData));
    dispatch(getResourceDataById(val.value));
    dispatch(
      getAllFieldsValue({
        entity_Id: val.value,
      })
    );
  };

  const renderMembersFold = () => {
    return (
      <>
        <div className="row mx-0 align-items-center members-fold-one-row">
          {membersList.map((data, index) => (
            <button
              key={index}
              className="members-fold-one-row__block-main"
              onClick={handleOnClickMemberButton(data)}
            >
              <div
                className={
                  values.activeMember.value === data.value
                    ? "members-fold-one-row__block-outer members-fold-one-row__block-outer--active"
                    : "members-fold-one-row__block-outer"
                }
              >
                <div className="members-fold-one-row__block-inner">
                  <span className="members-fold-one-row__block-text-1">
                    {data.label.charAt(0)}
                  </span>
                </div>
              </div>
              <p className="members-fold-one-row__block-text">{data.label}</p>
            </button>
          ))}
          {/* new member */}
          {membersList.length === 10 ? (
            <AddMemberWarning />
          ) : (
            <Link to="/add-member-new">
              <div className="members-fold-one-row__block-main">
                <div className="members-fold-one-row__block-outer">
                  <div className="members-fold-one-row__block-inner">
                    <span className="members-fold-one-row__block-text-1">
                      +
                    </span>
                  </div>
                </div>
                <p className="members-fold-one-row__block-text">new member</p>
              </div>
            </Link>
          )}
        </div>
      </>
    );
  };

  /*===============================================================
        main
  ===============================================================*/
  return (
    <Fragment>
      {loader === true && (
        <Loader type="Triangle" color="#57cba1" className="remote-loader" />
      )}

      {/* left navbar */}
      <LeftNavbar activeMenu="members" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle
            title="Members"
            isLinkDisplay={true}
            linkPath="/add-member-new"
            linkText="+ New Member"
          />
          <TopNavbar />
        </div>
        {/* pagetitle and topnavbar end */}
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Members",
            },
          ]}
        />

        {renderMembersFold()}

        <Fragment>
          <div className="schedule-title-div row mx-0 align-items-center justify-content-between">
            <MemberDetailsNew />
            <h4 className="schedule-title">
              {!isEmpty(singleResourceData) &&
                `${singleResourceData.firstName}'s`}{" "}
              schedule
            </h4>
            <div className="add_new_scheduler_button1 text-right">
              <AddNewSchedule activeMember={values.activeMember} />
            </div>
          </div>
          <div className="scheduler_display">
            <SchedulerTwo
              appointments={singleResourceSchedule}
              activeMember={values.activeMember}
            />
          </div>
        </Fragment>
      </div>
    </Fragment>
  );
}

export default SchedulerTwoMain;
