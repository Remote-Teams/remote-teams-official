import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  getAllProjectDocs,
  deleteProjectDocs,
} from "./../../../store/actions/projectAction";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import differenceInHours from "date-fns/difference_in_hours";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";

const dummyData = [1, 2, 3, 4, 5, 6, 7];

export default function AllProjectDocs() {
  const [allProjectDocs, setallProjectDocs] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    if (!isEmpty(projectData)) {
      const formData = {
        query: {
          project: projectData._id,
        },
      };
      dispatch(getAllProjectDocs(formData));
    }
  }, []);

  const allProjectDocsReducer = useSelector(
    (state) => state.projects.allProjectDocs
  );

  useEffect(() => {
    if (!isEmpty(allProjectDocsReducer)) {
      setallProjectDocs(allProjectDocsReducer);
    } else {
      setallProjectDocs([]);
    }
  }, [allProjectDocsReducer]);
  /*=========================================

                     renderCard

    ========================================*/

  const deleteHandler = (data) => (e) => {
    dispatch(deleteProjectDocs(data._id));
  };

  const calculateDayTimeDifference = (val) => {
    let today = new Date();
    let min = differenceInMinutes(today, val);
    let hr = differenceInHours(today, val);
    let day = differenceInCalendarDays(today, val);
    return (
      <p className="font-12-extrabold-space-light-uppercase discussion-display-block-posted-time-text">
        {min < 60 ? (
          min === 0 ? (
            "Now"
          ) : (
            <>{min} Min Ago</>
          )
        ) : hr < 24 ? (
          hr === 1 ? (
            <>{hr} Hour Ago</>
          ) : (
            <>{hr} Hours Ago</>
          )
        ) : day === 1 ? (
          <>{day} Day Ago</>
        ) : day < 7 ? (
          <>{day} Days Ago</>
        ) : (
          format(val, "DD-MMM-YYYY")
        )}
      </p>
    );
  };

  const renderCard = (data) => {
    return (
      <div className="all-project-docs-card">
        <Link to={`/all-projects-detail-doc/${data._id}`}>
          <div className="all-project-docs-card-para-div">
            <p
              dangerouslySetInnerHTML={{ __html: data.description.body }}
              className="all-project-docs-card-para"
            >
              {/* Lorem ipsum dolor sit amet,consectetur adipiscing elit , sed do
            eiusmod tempor incididunt ut labore et dolor emagna aliqua */}
            </p>
          </div>
        </Link>
        <div className="row mx-0 flex-nowrap align-items-start justify-content-between w-100">
          <div className="all-project-docs-card-name-col">
            <h4 className="all-project-docs-card-note-name">{data.name}</h4>
            <h5 className="all-project-docs-card-time">
              last edited {calculateDayTimeDifference(data.updatedAt)}
            </h5>
          </div>
          <button
            onClick={deleteHandler(data)}
            className="all-project-docs-card-delete-btn"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      </div>
    );
  };

  /*=========================================

                     return

    ========================================*/
  return (
    <div className="all-project-docs-div row mx-0 align-items-start">
      <Link to={"/all-projects-add-docs"}>
        <button className="all-project-add-docs-btn">
          <span>
            <i className="fa fa-plus" />
          </span>
        </button>
      </Link>
      {!isEmpty(allProjectDocs) &&
        allProjectDocs.map((data, index) => (
          <Fragment key={index}>{renderCard(data)}</Fragment>
        ))}
    </div>
  );
}
