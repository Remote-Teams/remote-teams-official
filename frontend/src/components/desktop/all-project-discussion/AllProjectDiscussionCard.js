import React from "react";
import "rc-dropdown/assets/index.css";
import Select from "react-select";
import AllProjectDiscussionDisplay from "./AllProjectDiscussionDisplay";
import AllProjectDiscussionAddNew from "./AllProjectDiscussionAddNew";
import differenceInHours from "date-fns/difference_in_hours";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";

const options = [
  { value: "Edit", label: "Edit" },
  { value: "Remove", label: "Remove" },
];

export default function AllProjectDiscussionCard({
  data,
  projectId,
  handleOnClickDeleteIcon,
  handleviewDiscussion,
}) {
  // const iconLabel = (
  //   <img
  //     src={require("../../../assets/img/icons/discussion-dropdown-icon.svg")}
  //     alt=""
  //     className="discussion-dropdown-img"
  //   />
  // );

  /*========================================
           handler
  =========================================*/

  // const handleChangeDropdown = (selectedOption) => {
  //   console.log("Onclick", selectedOption);
  // };

  // const handleviewDiscussion = () => {
  //   console.log("Onclick view discussion");
  // };

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

  return (
    <div className="all-project-discussion-card-div">
      <div className="row mx-0 flex-nowrap align-items-start">
        <img
          src={require("../../../assets/img/dummy/all-projects-discussion-card-img.svg")}
          alt="discussion profile"
          className="all-project-discussion-card-img"
        />
        <div className="all-project-discussion-card-text-div">
          <h3 className="all-project-discussion-card-text1">
            Created by {data.userData[0].name}{" "}
          </h3>
          <h5 className="all-project-discussion-card-text2">
            {calculateDayTimeDifference(data.updatedAt)}
          </h5>
        </div>
        <div className="row mx-0 flex-nowrap align-items-center all-project-discussion-card-action-btns-row">
          {data.status === "ENDED" ? (
            <div className="opacity-0">
              <AllProjectDiscussionAddNew
                isFormTypeAdd={false}
                discussionData={data}
                projectId={projectId}
              />
            </div>
          ) : (
            <AllProjectDiscussionAddNew
              isFormTypeAdd={false}
              discussionData={data}
              projectId={projectId}
            />
          )}
          <i
            className="fa fa-trash finances-table__fa-icon-delete mr-0"
            onClick={handleOnClickDeleteIcon(data._id)}
          ></i>
          {/* here not used DropdownIcon from rc-dropdown since it's dropdown options scrolling when we scroll in div */}
          {/* <Select
            isSearchable={false}
            className="react-select-container react-select-container--icon"
            classNamePrefix="react-select-elements"
            value={{ label: iconLabel, value: "" }}
            onChange={handleChangeDropdown}
            options={options}
          /> */}
        </div>
      </div>
      <h2 className="all-project-discussion-card-text3 font-24-extraBold-montserrat-letter-spacing">
        {data.subject}
      </h2>
      <p className="all-project-discussion-card-text4 font-14-semibold">
        {data.description}
      </p>
      <div className="row mx-0 align-items-start pt-25">
        <div className="all-project-discussion-card-ans-div row mx-0 align-items-center justify-content-center">
          <span> {data.commentCount} Answers </span>
        </div>

        <button
          className="all-project-discussion-card-view-btn"
          onClick={handleviewDiscussion(data._id)}
        >
          View Discussion
        </button>
        {/* <AllProjectDiscussionDisplay
          discussionData={data}
          projectId={projectId}
        /> */}
      </div>
    </div>
  );
}
