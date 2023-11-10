import React, { useState, useEffect } from "react";

import projectSchedule from "../../../assets/img/projects-detail/project-schedule-gray-icon.svg";
import projectScheduleActive from "../../../assets/img/projects-detail/project-schedule-gradient-icon.svg";
import kanbanBoard from "../../../assets/img/projects-detail/kanban-board-gray-icon.svg";
import kanbanBoardActive from "../../../assets/img/projects-detail/kanban-board-gradient-icon.svg";
import tasksTable from "../../../assets/img/projects-detail/task-table-gray-icon.svg";
import AddNewTask from "./AddNewTask";
import GanttViewMain from "./GanttViewMain";
import KanbanMainNew from "./KanbanMainNew";
import { getStackOfPerticularProject } from "./../../../store/actions/kanbanAction";
import {
  getGanttChartData,
  getAllProjectAction,
} from "./../../../store/actions/projectAction";
import { useDispatch } from "react-redux";
import {
  getAllResourceAction,
  resourceSearchApi,
} from "./../../../store/actions/resourcesAction";
import { getAllSchedulesForBookCalender } from "./../../../store/actions/bookTheirCalenderAction";
import PriorityMatrix from "./PriorityMatrix";
import priorityMatrix from "../../../assets/img/projects-detail/priority-matrix-gray-icon.svg";
import priorityMatrixActive from "../../../assets/img/projects-detail/priority-matrix-gradient-icon.svg";
import AllProjectPlanningTasksTable from "./AllProjectPlanningTasksTable";
import isEmpty from "../../../store/validations/is-empty";
import ProjectPlanningPriorityMatrixFeaturesIllustration from "../features-illustration/ProjectPlanningPriorityMatrixFeaturesIllustration";

const buttonOptions = [
  {
    title: "Project Schedule",
    img: projectSchedule,
    activeImg: projectScheduleActive,
  },
  { title: "Kanban Board", img: kanbanBoard, activeImg: kanbanBoardActive },
  { title: "Tasks Table", img: tasksTable, activeImg: tasksTable },
  {
    title: "Priority Matrix",
    img: priorityMatrix,
    activeImg: priorityMatrixActive,
  },
];

let featureOne = { name: "Priority_Matrix", isDisabled: false };

export default function AllProjectPlanning() {
  let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
  const dispatch = useDispatch();
  const [currentTabValue, setCurrentTabValue] = useState(
    buttonOptions[0].title
  );

  useEffect(() => {
    let projectData = JSON.parse(localStorage.getItem("projectData"));
    const ganttData = {
      query: {
        project: projectData._id,
      },
    };
    dispatch(getStackOfPerticularProject(projectData._id));
    dispatch(getGanttChartData(ganttData));
    const formData = {
      query: {},
    };
    dispatch(resourceSearchApi(formData));
    // dispatch(getAllResourceAction());
    dispatch(getAllProjectAction());
    dispatch(getAllSchedulesForBookCalender({ query: {} }));
  }, []);

  useEffect(() => {
    if (!isEmpty(featureOne)) {
      let filterFeatureOne = featureArray.filter(
        (ele) => ele === featureOne.name
      );
      if (!isEmpty(filterFeatureOne)) {
        featureOne.isDisabled = false;
      } else {
        featureOne.isDisabled = true;
      }
    }
  }, [featureOne]);

  const handleOnClick = (val) => (e) => {
    setCurrentTabValue(val);
  };

  return (
    <>
      <div className="project-details-planning-main-div">
        <div className="project-details-planning-btn-div row mx-0 flex-nowrap">
          {/* three buttons */}
          {buttonOptions.map((data, index) => (
            <button
              key={index}
              className={
                data.title === currentTabValue
                  ? "project-details-planning-btn project-details-planning-btn--active"
                  : "project-details-planning-btn"
              }
              onClick={handleOnClick(data.title)}
            >
              {data.title === currentTabValue ? (
                <img src={data.activeImg} alt="" />
              ) : (
                <img src={data.img} alt="" />
              )}
              <span>{data.title}</span>
            </button>
          ))}

          {/* add new task  */}
          <AddNewTask />
        </div>
        <div>
          {currentTabValue === "Project Schedule" ? (
            <GanttViewMain />
          ) : currentTabValue === "Kanban Board" ? (
            <KanbanMainNew />
          ) : currentTabValue === "Priority Matrix" ? (
            featureOne.isDisabled === false ? (
              <PriorityMatrix />
            ) : (
              <>
                {/* "Show illustartion component here" */}
                <ProjectPlanningPriorityMatrixFeaturesIllustration />
              </>
            )
          ) : currentTabValue === "Tasks Table" ? (
            <AllProjectPlanningTasksTable />
          ) : (
            currentTabValue
          )}
        </div>
      </div>
    </>
  );
}
