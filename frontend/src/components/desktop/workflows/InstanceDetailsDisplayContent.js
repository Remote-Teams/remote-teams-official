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

export default function InstanceDetailsDisplayContent({
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
                          disabled
                          // onChange={handleCheckboxTask(taskMapIndex)}
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
                                disabled
                                // onChange={handleSubTaskCheckbox(
                                //   taskMapIndex,
                                //   subTaskMapIndex
                                // )}
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

        {/* {!isEmpty(values.taskAndSubTaskData) && (
          <GreenButtonSmallFont
            text={"Mark Step Complete "}
            onClick={handleOnClickStepChecked}
            extraClassName="workflow-edit-details-mark-step"
          />
        )} */}
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
