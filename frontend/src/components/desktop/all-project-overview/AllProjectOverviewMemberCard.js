import React from "react";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import {
  updateProject,
  getProjectDataById,
} from "./../../../store/actions/projectAction";

const options = [{ value: "Delete", label: "Delete" }];

export default function AllProjectOverviewMemberCard({
  resourceData,
  singleProjectData,
}) {
  const dispatch = useDispatch();
  const handleChangeDropdown = (selectedOption) => {
    if (selectedOption.value === "Delete") {
      console.log("delete the card");
      // console.log(resourceData);
      // console.log(singleProjectData);

      let resourcesArray = singleProjectData.resourcesData;
      let finalResourceArray = resourcesArray.filter(
        (ele) => ele._id !== resourceData._id
      );
      let newArray = [];
      if (!isEmpty(finalResourceArray)) {
        finalResourceArray.forEach((element) => {
          newArray.push(element._id);
        });
      }
      let formData = singleProjectData;
      formData.resourcesData = newArray;
      formData.resources = newArray;

      console.log(formData);

      dispatch(
        updateProject(
          singleProjectData._id,
          formData,
          "",
          "",
          "",
          callBackUpdateProject,
          "Project Updated"
        )
      );
    }
  };

  const callBackUpdateProject = (status) => {
    if (status === 200) {
      dispatch(getProjectDataById(singleProjectData._id));
    }
  };

  const iconLabel = (
    <img
      src={"/img/project-details/vr-three-dots.svg"}
      alt="export"
      className="new-select-img"
    />
  );

  return (
    <>
      {/* client resources content  */}
      <div className="project-overview-members-card">
        <div className="row mx-0 flex-nowrap justify-content-between align-items-start pb-10">
          <div className="row mx-0 flex-nowrap align-items-start">
            <div className="project-overview-members-card__icon">
              <img
                src={require("./../../../assets/img/dummy/new-profile-img.svg")}
                alt="person"
                className="img-wh-100"
              />
            </div>
            <div className="project-overview-members-card__text-colm">
              <h3 className="font-14-bold color-offwhite">
                {resourceData.name}
              </h3>
              <p className="font-12-semibold color-white-50">
                {resourceData.role.name}
              </p>
              <p className="font-13-regular-italic">
                <i className="fa fa-circle project-fa-circle-green"></i>
                Available
              </p>
            </div>
          </div>
          {/* here not used DropdownIcon from rc-dropdown since it's dropdown options scrolling when we scroll in div */}
          <Select
            isSearchable={false}
            className="react-select-container react-select-container--icon"
            classNamePrefix="react-select-elements"
            value={{ label: iconLabel, value: "" }}
            onChange={handleChangeDropdown}
            options={options}
          />
        </div>
        <h3 className="project-overview-members-card__text1">Tasks</h3>
        <div className="row mx-0 justify-content-between">
          <div className="project-overview-members-card__tasksColm1">
            <p className="project-overview-members-card__taskText1">
              <img
                src="/img/project-details/tasks-total-circle-icon.svg"
                alt=""
              />
              <span className="pr-10">Total</span>
              <span>{resourceData.LOW}</span>
            </p>
            <p className="project-overview-members-card__taskText1">
              <img
                src="/img/project-details/tasks-ongoing-circle-icon.svg"
                alt=""
              />
              <span className="pr-10">Normal</span>
              <span>{resourceData.NORMAL}</span>
            </p>
          </div>
          <div className="project-overview-members-card__tasksColm2">
            <p className="project-overview-members-card__taskText1">
              <img
                src="/img/project-details/tasks-pending-circle-icon.svg"
                alt=""
              />
              <span className="pr-10">Important</span>
              <span>{resourceData.IMPORTANT}</span>
            </p>
            <p className="project-overview-members-card__taskText1">
              <img
                src="/img/project-details/tasks-completed-circle-icon.svg"
                alt=""
              />
              <span className="pr-10">Critical</span>
              <span>{resourceData.CRITICAL}</span>
            </p>
          </div>
        </div>
        <div className="project-overview-members-card__hoursBlock">
          <div className="row mx-0 flex-nowrap justify-content-between">
            <h3 className="project-overview-members-card__text1 pr-10">
              Hours spent
            </h3>
            <h5 className="font-13-regular-italic">{resourceData.userHours}</h5>
          </div>
          <div className="row mx-0 flex-nowrap justify-content-between">
            <h3 className="project-overview-members-card__text1 pr-10">
              efficiency rate
            </h3>
            <h5 className="font-13-regular-italic">
              {resourceData.efficiencypercent}
            </h5>
          </div>
        </div>
      </div>
    </>
  );
}
