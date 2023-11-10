import React, { useState, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import isEmpty from "../../../store/validations/is-empty";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { updateWorkFlowInstanceAction } from "./../../../store/actions/workflowApiAction";
import { useDispatch } from "react-redux";

export default function WorkflowDetailsDisplayContentEditable({
  seletectedStepData,
  singleInstanceData,
  activeStepIndex,
}) {
  const dispatch = useDispatch();
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
          { subTaskTitle: "I-23 Form", isSubTaskChecked: false },
          {
            subTaskTitle: "Background Information Form",
            isSubTaskChecked: false,
          },
          { subTaskTitle: "Self Identification Form", isSubTaskChecked: false },
          { subTaskTitle: "Declaration form", isSubTaskChecked: false },
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

  useEffect(() => {
    if (!isEmpty(seletectedStepData)) {
      setValues({
        ...values,
        taskAndSubTaskData: seletectedStepData.tasks,
      });
    }
  }, [seletectedStepData]);

  /*========================================================================
             renderAccordion
  ========================================================================*/
  // handlers
  const handleOnClickStepChecked = () => {
    let newObj = [...values.taskAndSubTaskData];
    // check all tasks
    newObj.map((data, index) => (data.task_completed = true));
    // check all subtasks
    newObj.map((data, index) =>
      data.subtasks.map((d, i) => (d.subtask_completed = true))
    );
    let finalInstanceData = singleInstanceData;
    let finalStepData = seletectedStepData;
    finalStepData.step_completed = true;
    finalStepData.tasks = newObj;

    finalInstanceData.data.steps[activeStepIndex] = finalStepData;

    if (!isEmpty(finalInstanceData.data.steps)) {
      let filteredSteps = finalInstanceData.data.steps.filter(
        (step) => step.step_completed === true
      );

      if (filteredSteps.length === finalInstanceData.data.steps.length) {
        finalInstanceData.completed = true;
        finalInstanceData.instanceInfo.completionDate = new Date().toISOString();
      } else {
        finalInstanceData.completed = false;
      }
    }

    dispatch(
      updateWorkFlowInstanceAction(finalInstanceData, finalInstanceData._id)
    );
    // console.log(finalInstanceData);
    // setValues({
    //   ...values,
    //   sendAndCompelete: newObj,
    // });
  };

  const handleCheckboxTask = (taskMapIndex) => (e) => {
    let newObj = [...values.taskAndSubTaskData];
    // check current task
    newObj[taskMapIndex].task_completed = e.target.checked;
    // check all subtasks of current checked task
    newObj[taskMapIndex].subtasks.map(
      (data, index) => (data.subtask_completed = e.target.checked)
    );

    let finalInstanceData = singleInstanceData;

    finalInstanceData.data.steps[activeStepIndex].tasks = newObj;
    //CHECK IF ALL TASKS COMPLETED OR NOT
    if (!isEmpty(finalInstanceData.data.steps[activeStepIndex].tasks)) {
      let filteredTasks = finalInstanceData.data.steps[
        activeStepIndex
      ].tasks.filter((task) => task.task_completed === true);

      if (
        filteredTasks.length ===
        finalInstanceData.data.steps[activeStepIndex].tasks.length
      ) {
        finalInstanceData.data.steps[activeStepIndex].step_completed = true;
      } else {
        finalInstanceData.data.steps[activeStepIndex].step_completed = false;
      }
    }
    //CHECK IF ALL STEPS COMPLETED OR NOT
    if (!isEmpty(finalInstanceData.data.steps)) {
      let filteredSteps = finalInstanceData.data.steps.filter(
        (step) => step.step_completed === true
      );

      if (filteredSteps.length === finalInstanceData.data.steps.length) {
        finalInstanceData.completed = true;
        finalInstanceData.instanceInfo.completionDate = new Date().toISOString();
      } else {
        finalInstanceData.completed = false;
      }
    }

    dispatch(
      updateWorkFlowInstanceAction(finalInstanceData, finalInstanceData._id)
    );

    // setValues({
    //   ...values,
    //   taskAndSubTaskData: newObj,
    // });
  };

  const handleSubTaskCheckbox = (taskMapIndex, subTaskMapIndex) => (e) => {
    let newObj = [...values.taskAndSubTaskData];
    // check current subtask
    newObj[taskMapIndex].subtasks[subTaskMapIndex].subtask_completed =
      e.target.checked;

    let finalInstanceData = singleInstanceData;

    finalInstanceData.data.steps[activeStepIndex].tasks = newObj;
    //CHECK IF ALL SUBTASKS COMPLETED OR NOT
    if (
      !isEmpty(
        finalInstanceData.data.steps[activeStepIndex].tasks[taskMapIndex]
          .subtasks
      )
    ) {
      let filteredSubtask = finalInstanceData.data.steps[activeStepIndex].tasks[
        taskMapIndex
      ].subtasks.filter((subtask) => subtask.subtask_completed === true);

      if (
        filteredSubtask.length ===
        finalInstanceData.data.steps[activeStepIndex].tasks[taskMapIndex]
          .subtasks.length
      ) {
        finalInstanceData.data.steps[activeStepIndex].tasks[
          taskMapIndex
        ].task_completed = true;
      } else {
        finalInstanceData.data.steps[activeStepIndex].tasks[
          taskMapIndex
        ].task_completed = false;
      }
    }
    //CHECK IF ALL TASKS COMPLETED OR NOT
    if (!isEmpty(finalInstanceData.data.steps[activeStepIndex].tasks)) {
      let filteredTasks = finalInstanceData.data.steps[
        activeStepIndex
      ].tasks.filter((task) => task.task_completed === true);

      if (
        filteredTasks.length ===
        finalInstanceData.data.steps[activeStepIndex].tasks.length
      ) {
        finalInstanceData.data.steps[activeStepIndex].step_completed = true;
      } else {
        finalInstanceData.data.steps[activeStepIndex].step_completed = false;
      }
    }
    //CHECK IF ALL STEPS COMPLETED OR NOT
    if (!isEmpty(finalInstanceData.data.steps)) {
      let filteredSteps = finalInstanceData.data.steps.filter(
        (step) => step.step_completed === true
      );

      if (filteredSteps.length === finalInstanceData.data.steps.length) {
        finalInstanceData.completed = true;
        finalInstanceData.instanceInfo.completionDate = new Date().toISOString();
      } else {
        finalInstanceData.completed = false;
      }
    }

    dispatch(
      updateWorkFlowInstanceAction(finalInstanceData, finalInstanceData._id)
    );

    // if subtask is false make the respective task's checkvalue false
    // if (!e.target.checked) {
    //   newObj[taskMapIndex].task_completed = false;
    // } else {
    //   let allSubTaskChecked = true;
    //   newObj[taskMapIndex].subtasks.map((d, i) =>
    //     !d.subTaskMapIndex ? (allSubTaskChecked = false) : ""
    //   );
    //   if (allSubTaskChecked) {
    //     newObj[taskMapIndex].task_completed = true;
    //   }

    // }

    // setValues({
    //   ...values,
    //   taskAndSubTaskData: newObj,
    // });
  };

  // renderAccordion
  const renderAccordion = () => {
    return (
      <>
        <div className="workflow-details-accordian-div workflow-details-accordian-div--edit">
          {!isEmpty(values.taskAndSubTaskData) ? (
            <Accordion allowZeroExpanded={true}>
              {values.taskAndSubTaskData.map((taskMapData, taskMapIndex) => (
                <AccordionItem key={taskMapIndex}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div className="customCheckbox customCheckbox--workflow-details--AccordionBtn">
                        <Checkbox
                          name="isTaskChecked"
                          checked={taskMapData.task_completed}
                          onChange={handleCheckboxTask(taskMapIndex)}
                        />
                      </div>
                      <h3 className="workflow-details-accordian-div--edit__btn-title">
                        {taskMapData.name}
                      </h3>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    {!isEmpty(taskMapData.subtasks) ? (
                      taskMapData.subtasks.map(
                        (subTaskMapData, subTaskMapIndex) => (
                          <div
                            key={subTaskMapIndex}
                            className="row mx-0 align-items-center mb-30"
                          >
                            <div className="customCheckbox  customCheckbox--workflow-details--send-and-complete">
                              <Checkbox
                                name="isSubTaskChecked"
                                checked={subTaskMapData.subtask_completed}
                                onChange={handleSubTaskCheckbox(
                                  taskMapIndex,
                                  subTaskMapIndex
                                )}
                              />
                            </div>
                            <h5 className="font-18-medium pl-20">
                              {subTaskMapData.name}
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
    );
  };

  /*========================================================================
             main
  ========================================================================*/
  return (
    <div className="workflow-details-right-card  flex-shrink-0">
      <div className="row mx-0 justify-content-between flex-nowrap align-items-center workflow-details-right-card-title-div">
        {/*<h2 className="workflow-details-right-card-title">
          <img
            src={require("../../../assets/img/workflow/step-name-icon.svg")}
            alt="workflow step name"
            className="workflow-step-name-icon"
          />
          step name
  </h2>*/}
        <div className="row mx-0 align-items-center flex-nowrap">
          <h5 className="pr-30 font-36-bold">
            {" "}
            {!isEmpty(seletectedStepData) &&
              seletectedStepData.additionalInfo.emojiSelected}
          </h5>
          <h2 className="workflow-details-right-card-title">
            {/*<img
              src={require("../../../assets/img/workflow/step-name-icon.svg")}
              alt="workflow step name"
              className="workflow-step-name-icon"
            />*/}
            {!isEmpty(seletectedStepData) && seletectedStepData.name}
          </h2>
        </div>

        {!isEmpty(values.taskAndSubTaskData) && (
          <GreenButtonSmallFont
            text={"Mark Step Complete "}
            onClick={handleOnClickStepChecked}
            extraClassName="workflow-edit-details-mark-step"
          />
        )}
      </div>
      <div className="workflow-details-right-block-inner-div">
        <h5 className="workflow-details-right-card-description">Description</h5>
        <h5 className="workflow-details-right-card-description-text pt-20">
          {!isEmpty(seletectedStepData) && seletectedStepData.description}
        </h5>
        {renderAccordion()}
      </div>
    </div>
  );
}
