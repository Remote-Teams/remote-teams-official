import React, { useState, useEffect } from "react";
import AllProjectScrumAddNewEntry from "./AllProjectScrumAddNewEntry";
import PageTitle from "../common/PageTitle";
import DatepickerFromTo from "../common/DatepickerFromTo";
//import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import { useHistory, useParams } from "react-router-dom";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { useDispatch, useSelector } from "react-redux";
import {
  getScrumById,
  getScrumNotesByScrumId,
  deleteNoteById,
} from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";
import AllProjectScrumMeetingNotes from "./AllProjectScrumMeetingNotes";
import { startOfDay, endOfDay } from "date-fns";
import TopNavbar from "../header/TopNavbar";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import LeftNavbar from "../header/LeftNavbar";

export default function AllProjectScrumDetails() {
  const params = useParams();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [allScrumNotes, setallScrumNotes] = useState([]);
  let history = useHistory();

  useEffect(() => {
    console.log(startOfDay(new Date()));
    console.log(endOfDay(new Date()));

    let newStartDate = startOfDay(new Date());
    let endStartDate = endOfDay(new Date());

    if (!isEmpty(params)) {
      dispatch(getScrumById(params.id));
      const formData = {
        query: {
          $and: [
            { scrumId: params.id },
            { createdAt: { $lte: new Date(endStartDate) } },
            { createdAt: { $gte: new Date(newStartDate) } },
          ],
        },
      };
      dispatch(getScrumNotesByScrumId(formData));
    }
  }, [params]);

  const allNotesByScrum = useSelector(
    (state) => state.projects.allNotesByScrum
  );

  const singleScrumData = useSelector(
    (state) => state.projects.singleScrumData
  );

  useEffect(() => {
    if (!isEmpty(allNotesByScrum)) {
      setallScrumNotes(allNotesByScrum);
    } else {
      setallScrumNotes([]);
    }
  }, [allNotesByScrum]);

  /*============================================================
      renderDateFromTo
  ============================================================*/
  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleOnClickDateArrowIcon = () => {
    // console.log("clicked on arrow icon");
    let newStartDate = startOfDay(values.startDate);
    let endStartDate = endOfDay(values.endDate);
    const formData = {
      query: {
        $and: [
          { scrumId: params.id },
          { createdAt: { $lte: new Date(endStartDate) } },
          { createdAt: { $gte: new Date(newStartDate) } },
        ],
      },
    };
    dispatch(getScrumNotesByScrumId(formData));
  };

  const renderDateFromTo = () => {
    return (
      <div className="datepicker-no-border datepicker-no-border--expenses">
        <DatepickerFromTo
          startDateValue={values.startDate}
          endDateValue={values.endDate}
          handleChangeStart={handleChangeStart}
          handleChangeEnd={handleChangeEnd}
          handleOnClickDateArrowIcon={handleOnClickDateArrowIcon}
        />
      </div>
    );
  };

  /*============================================================
      renderScrumTable
  ============================================================*/
  // handlers

  const handleOnClickExportIcon = () => {
    console.log("clicked on export icon");
  };

  const handleClick = () => {
    console.log("onclick edit");
  };

  const handleDelete = (noteData) => (e) => {
    console.log("onclick delete");
    dispatch(deleteNoteById(noteData._id, singleScrumData._id));
  };

  const handleGoBack = () => {
    history.goBack();
  };

  // renderScrumTable
  const renderScrumTable = () => {
    return (
      <>
        <div className="scrum-table-div scrum-table-div--head row mx-0 align-items-center justify-content-between">
          <div className="scrum-table-div-colm1">
            <span>Title</span>
          </div>
          {/*<div className="scrum-table-div-colm1">
            <span>Date</span>
          </div>
          <div className="scrum-table-div-colm2">
            <span>timings</span>
    </div>*/}
          <div className="scrum-table-div-colm3">
            <span>meeting notes</span>
          </div>
          <div className="opacity-0 scrum-table-div-colm4">0</div>
        </div>
        <div className="scrum-table-div scrum-table-div-body">
          {!isEmpty(allScrumNotes) &&
            allScrumNotes.map((data, index) => (
              <div
                key={index}
                className="scrum-bottom-border-div row mx-0 align-items-start justify-content-between"
              >
                <div className="scrum-table-div-colm1">
                  <span>{data.addtionalObject.title}</span>
                </div>
                {/*<div className="scrum-table-div-colm1">
                  <span>02-Jan-2020</span>
                </div>
                <div className="scrum-table-div-colm2">
                  <span>10:00 AM - 10:15 AM</span>
            </div>*/}
                <div className="scrum-table-div-colm3">
                  <span>{data.message}</span>
                </div>
                <div className="scrum-table-div-colm4">
                  <span className="row mx-0 flex-nowrap align-items-start justify-content-center">
                    <AllProjectScrumMeetingNotes
                      notesData={data}
                      isEdit={true}
                    />
                    <button onClick={handleDelete(data)}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <AllProjectScrumMeetingNotes
                      notesData={data}
                      isEdit={false}
                    />
                  </span>
                </div>
              </div>
            ))}
          {/* for empty data array */}
          {/* <div className="text-center">
                  <span className="font-14-semibold table-data-empty-message">No data found</span>
              </div> */}
        </div>
      </>
    );
  };

  let projectData = JSON.parse(localStorage.getItem("projectData"));
  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="all projects" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title={projectData.name} />
          <TopNavbar />
        </div>

        {/*<GrayLinkSmallFont text={"Go Back"} path={"/all-projects"} />*/}
        {/* <GrayButtonSmallFont text={"Go Back"} onClick={handleGoBack} /> */}

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Projects",
              link: "/all-projects",
            },
            {
              title: `${projectData.name}`,
              type: "goBackButton",
            },
            {
              title: "Scrum/Standup",
              type: "goBackButton",
            },
            {
              title: `${singleScrumData.name}`,
            },
          ]}
        />
        <div className="pt-50 mb-40">
          <h2 className="add-project-select-cover-img-text">
            {singleScrumData.name}
          </h2>
        </div>
        <div className="pb-30">{renderDateFromTo()}</div>
        {renderScrumTable()}
        <AllProjectScrumAddNewEntry />
      </div>
    </>
  );
}
