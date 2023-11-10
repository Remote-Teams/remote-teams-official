import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { Link } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";

export default function WorkflowDetailsDisplayContent({
  activeStepIndex,
  workflowAllStepsData,
  workflowAllTasksData,
  workflowAllSubTasksData,
}) {
  const [values, setValues] = useState({
    taskAndSubTaskData: [
      {
        taskTitle: "Send and complete new hire paperwork",
        isTaskChecked: false,
        subtaskData: [
          {
            subTaskTitle: "workflow-send-and-complete-icon",
            isSubTaskChecked: false,
          },
        ],
      },
      {
        taskTitle: "Prepare equipment",
        isTaskChecked: false,
        subtaskData: [],
      },
      {
        taskTitle: "Orientation",
        isTaskChecked: false,
        subtaskData: [],
      },
      {
        taskTitle: "set up their profile",
        isTaskChecked: false,
        subtaskData: [],
      },
      {
        taskTitle: "track progress",
        isTaskChecked: false,
        subtaskData: [],
      },
    ],
  });

  const [seletectedStepData, setSeletectedStepData] = useState({});

  useEffect(() => {
    if (!isEmpty(activeStepIndex)) {
      if (!isEmpty(workflowAllStepsData)) {
        setSeletectedStepData(workflowAllStepsData[activeStepIndex]);
      }
    }
  }, [activeStepIndex, workflowAllStepsData]);

  const returnSubTaskData = (taskId) => {
    let subTaskData = [];

    if (!isEmpty(workflowAllSubTasksData)) {
      workflowAllSubTasksData.forEach((subtask) => {
        if (subtask.wtask === taskId) {
          subTaskData.push({
            subTaskTitle: subtask.name,
            isSubTaskChecked: false,
            emojiSelected: subtask.additionalInfo.emojiSelected,
          });
        }
      });
    }

    return subTaskData;
  };

  useEffect(() => {
    if (!isEmpty(activeStepIndex)) {
      let activeStepData =
        !isEmpty(workflowAllStepsData) && workflowAllStepsData[activeStepIndex];
      let taskData = [];
      if (!isEmpty(workflowAllTasksData)) {
        workflowAllTasksData.forEach((task) => {
          if (task.wstep === activeStepData._id)
            taskData.push({
              taskTitle: task.name,
              isTaskChecked: false,
              subtaskData: returnSubTaskData(task._id),
              emojiSelected: task.additionalInfo.emojiSelected,
            });
        });
      }
      setValues({
        ...values,
        taskAndSubTaskData: taskData,
      });
    }
  }, [
    activeStepIndex,
    workflowAllStepsData,
    workflowAllTasksData,
    workflowAllSubTasksData,
  ]);

  /*==============================
             handler
  ==============================*/

  const handleDelete = () => {
    console.log("handle delete");
  };

  /*==============================
             renderAccordion
  ==============================*/
  const renderAccordion = () => {
    return (
      <>
        <>
          <div className="workflow-details-accordian-div">
            {!isEmpty(values.taskAndSubTaskData) ? (
              <Accordion allowZeroExpanded={true}>
                {values.taskAndSubTaskData.map((taskMapData, taskMapIndex) => (
                  <AccordionItem key={taskMapIndex}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <h3 className="workflow-details-accordian-div--edit__btn-title">
                          {/*<img
                            src={require("../../../assets/img/workflow/send-and-complete-icon.svg")}
                            alt="workflow details send and complete"
                            className="workflow-send-and-complete-icon"
                          />*/}
                          <span className="workflow-details-accordian-div--edit__btn-title-span">
                            📒
                          </span>
                          {taskMapData.taskTitle}
                        </h3>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      {!isEmpty(taskMapData.subtaskData) ? (
                        taskMapData.subtaskData.map(
                          (subTaskMapData, subTaskMapIndex) => (
                            <div
                              key={subTaskMapIndex}
                              className="row mx-0 align-items-center mb-30"
                            >
                              <h5 className="font-18-medium pl-20">
                                {/*<img
                                  src={require("../../../assets/img/workflow/send-content-icon.svg")}
                                  alt=""
                                  className="workflow-send-and-complete-content-icon"
                                />*/}
                                <span className="workflow-details-accordian-div--edit__btn-title-span">
                                  ⭐
                                </span>
                                {subTaskMapData.subTaskTitle}
                              </h5>
                            </div>
                          )
                        )
                      ) : (
                        <h5 className="font-18-medium pl-20">
                          No sub task found
                        </h5>
                      )}
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <h3 className="workflow-details-accordian-div--edit__btn-title">
                No task found
              </h3>
            )}
          </div>
        </>
      </>
    );
  };
  /*=============================================================================
          main
  =============================================================================*/

  return (
    <>
      <div className="workflow-details-right-card">
        <div className="row mx-0 justify-content-between align-items-center workflow-details-right-card-title-div">
          {/**font-24-bold */}
          <div className="row mx-0 align-items-center flex-nowrap">
            <h5 className="pr-30 font-36-bold">🧭</h5>
            <h2 className="workflow-details-right-card-title">
              {/*<img
              src={require("../../../assets/img/workflow/step-name-icon.svg")}
              alt="workflow step name"
              className="workflow-step-name-icon"
            />*/}
              {!isEmpty(seletectedStepData) && seletectedStepData.name}
            </h2>
          </div>
          <div className="row mx-0 ">
            {/* <Link
              to={{
                pathname: "/workflow-add-new",
                state: {
                  isEdit: true,
                },
              }}
            >
              <div className="view-kanban-task-edit-btn">
                <img
                  src={require("../../../assets/img/icons/dashboard-to-do-edit-icon.svg")}
                  alt="edit"
                  className="view-kanban-task-edit-img"
                />
                Edit
              </div>
            </Link> */}
            {/* <button
              className="view-kanban-task-edit-btn mr-0"
              onClick={handleDelete}
            >
              <img
                src={require("../../../assets/img/icons/dashboard-to-do-delete-icon.svg")}
                alt="delete"
                className="view-kanban-task-edit-img"
              />
              Delete
            </button> */}
          </div>
        </div>

        <div className="workflow-details-right-block-inner-div">
          <h4 className="workflow-details-right-card-description">
            Description
          </h4>
          <p className="workflow-details-right-card-description-text pt-20">
            {!isEmpty(seletectedStepData) && seletectedStepData.description}
          </p>
          {renderAccordion()}
        </div>
      </div>
    </>
  );
}
