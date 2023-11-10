import React, { useState, useEffect } from "react";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import { useHistory } from "react-router";
import isEmpty from "../../../store/validations/is-empty";
import {
  createPinProject,
  deletePin,
} from "./../../../store/actions/projectAction";

import { useDispatch, useSelector } from "react-redux";
import EditProject from "../add-project-new/EditProject";
import displaySmallText from "./../../../store/utils/sliceString";

const imgPath = "/img/add-project-cover-img-options";

export default function AllProjectsNewCards({ project }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isPin, setIsPin] = useState(false);
  const [taskCountData, setTaskCountData] = useState([]);

  const pinProjects = useSelector((state) => state.projects.pinProjects);
  const projectCardTaskCount = useSelector(
    (state) => state.projects.projectCardTaskCount
  );

  useEffect(() => {
    if (!isEmpty(pinProjects)) {
      let filteredProject = pinProjects.filter(
        (ele) => ele.project._id === project._id
      );

      if (!isEmpty(filteredProject)) {
        setIsPin(true);
      } else {
        setIsPin(false);
      }
    } else {
      setIsPin(false);
    }
  }, [pinProjects, project]);

  useEffect(() => {
    if (!isEmpty(projectCardTaskCount)) {
      let filterdCount = projectCardTaskCount.filter(
        (ele) => ele.projectId === project._id
      );
      setTaskCountData(filterdCount);
    } else {
      setTaskCountData([
        {
          closedTaskCount: 0,
          openTaskCount: 0,
          totalTaskCount: 0,
        },
      ]);
    }
  }, [projectCardTaskCount]);

  /*====================================================

                   Button Text
                  
=====================================================*/

  const pinText = (
    <>
      <img
        src={require("../../../assets/img/icons/gradient-pin-icon-new.svg")}
        alt="pin"
        className="project-green-pin-img"
      />
      <span>Pin to Dashboard</span>
    </>
  );

  const unpinText = (
    <>
      <img
        src={require("../../../assets/img/icons/gradient-pin-icon-new.svg")}
        alt="pin"
        className="project-green-pin-img"
      />
      <span>Unpin from Dashboard</span>
    </>
  );

  const editText = (
    <>
      <img
        src={require("../../../assets/img/icons/all-project-card-edit-icon.svg")}
        alt="edit"
        //className="project-green-pin-img"
      />
      <span>Edit</span>
    </>
  );

  /*====================================================

                   handler
                  
=====================================================*/
  const handleOnClickPinProject = () => {
    // setIsPin(true);

    const formData = {
      project: project._id,
    };
    dispatch(createPinProject(formData));
  };

  const handleOnClickUnPinProject = () => {
    // setIsPin(false);
    let pinedProject = [];
    if (!isEmpty(pinProjects)) {
      pinedProject = pinProjects.filter(
        (element) => element.project._id === project._id
      );
    }

    dispatch(deletePin(pinedProject[0]._id));
  };

  const handleOnClickEditProject = () => {
    console.log("handle Edit");
  };

  const gotoDetailsHandler = () => {
    history.push({
      pathname: "/all-projects-detail",
      state: {
        projectData: project,
      },
    });
  };
  /*====================================================

                   render Main
                  
=====================================================*/

  return (
    <div>
      <div className="all-projects-cards-new row mx-0 align-items-center justify-content-between flex-nowrap">
        <div className="all-projects-cards-new-col-1">
          {!isEmpty(project.logo) ? (
            <img
              src={`${project.logo}`}
              alt="project"
              //className="img-wh-100"
            />
          ) : (
            <img
              src={`${imgPath}/ci-12.png`}
              alt="project"
              //className="img-wh-100"
            />
          )}
        </div>
        <div className="all-projects-cards-new-col-2">
          <h2 className="font-24-extraBold all-projects-cards-new-project-name">
            {displaySmallText(project.name, 15, true)}
          </h2>
          {!isEmpty(project.client) ? (
            <h5 className="all-projects-cards-new-client-name">
              for {project.client.name}
            </h5>
          ) : (
            <h5 className="all-projects-cards-new-client-name">No client</h5>
          )}

          <div className="row mx-0 align-items-start">
            {!isPin ? (
              <GrayButtonSmallFont
                text={pinText}
                extraClassName="all-projects-cards-new-pin-button"
                onClick={handleOnClickPinProject}
              />
            ) : (
              <GrayButtonSmallFont
                text={unpinText}
                extraClassName="all-projects-cards-new-pin-button all-projects-cards-new-pin-button--unpin"
                onClick={handleOnClickUnPinProject}
              />
            )}
            {/*            <GrayButtonSmallFont
              text={editText}
              extraClassName="all-projects-cards-new-edit-button"
              onClick={handleOnClickEditProject}
            />
*/}
            <EditProject projectData={project} />
          </div>
        </div>
        <div className="all-projects-cards-new-col-3">
          <div className="row mx-0 align-items-start flex-nowrap justify-content-between all-projects-cards-new-col-3-row-1">
            <div className="row mx-0 align-items-center flex-nowrap justify-content-between all-projects-cards-new-member-div">
              <h4 className="all-projects-cards-new-member-text font-14-extraBold all-project-card-new-c3-r1-text1">
                members
              </h4>
              <div className="row mx-0 align-items-center flex-nowrap">
                <div className="row mx-0 align-items-start flex-nowrap  all-project-card-new-c3-r1-member-profile-div">
                  {!isEmpty(project.resources) &&
                    project.resources.map((data, index) => (
                      <div
                        className="all-projects-cards-new-member-profile-img"
                        key={index}
                      >
                        <span>{`${!isEmpty(data.firstName) &&
                          data.firstName.charAt(0)}${!isEmpty(data.lastName) &&
                          data.lastName.charAt(0)}`}</span>
                      </div>
                    ))}
                </div>

                <h5 className="all-project-card-new-c3-r1-member-name">
                  {!isEmpty(project.resources)
                    ? project.resources.length === 1
                      ? `${project.resources[0].name}`
                      : `${project.resources[0].name} & ${project.resources
                          .length - 1} More`
                    : "No members added"}{" "}
                </h5>
              </div>
            </div>
            <div className="row mx-0 align-items-center justify-content-between flex-nowrap all-project-card-new-c3-r1-status-div">
              <h4 className="all-projects-cards-new-member-text font-14-extraBold all-project-card-new-c3-r1-text2">
                status
              </h4>
              <div className="all-projects-cards-new-status-div">
                <span>{project.status}</span>{" "}
              </div>
            </div>
          </div>
          <div className="row mx-0 align-items-center justify-content-between all-project-col3-row2">
            <h4 className="all-projects-cards-new-member-text font-14-extraBold">
              task summary
            </h4>
            <h3 className="all-projects-cards-new-task-summary-count">
              {!isEmpty(taskCountData) && taskCountData[0].totalTaskCount}
            </h3>
            <h5 className="all-projects-cards-new-task-summary-count-text">
              No of Tasks
            </h5>
            <span className="all-projects-cards-new-task-summary-dot">.</span>
            <h3 className="all-projects-cards-new-task-summary-count">
              {!isEmpty(taskCountData) && taskCountData[0].openTaskCount}
            </h3>
            <h5 className="all-projects-cards-new-task-summary-count-text">
              Open Tasks
            </h5>
            <span className="all-projects-cards-new-task-summary-dot">.</span>
            <h3 className="all-projects-cards-new-task-summary-count">
              {!isEmpty(taskCountData) && taskCountData[0].closedTaskCount}
            </h3>
            <h5 className="all-projects-cards-new-task-summary-count-text">
              No of Closed Tasks
            </h5>
          </div>
        </div>
        <div
          onClick={gotoDetailsHandler}
          className="all-projects-cards-new-col-4"
        >
          <h2 className="all-projects-cards-new-view-project-text">
            View Project <br /> Details
          </h2>
          <img
            src={require("../../../assets/img/icons/view-details-arrow.svg")}
            alt="view details"
            className="view-details-arrow"
          />
        </div>
      </div>
    </div>
  );
}
