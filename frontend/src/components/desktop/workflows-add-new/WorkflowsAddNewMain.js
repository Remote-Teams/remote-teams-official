import React, { Fragment, useState, useEffect } from "react";
import isEmpty from "../../../store/validations/is-empty";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import LeftNavbar from "../header/LeftNavbar";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TextareaField from "../common/TextareaField";
import emoji from "node-emoji";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  // WORKFLOW ACTIONS
  createWorkFlowAction,
  getWorkflowDataById,
  // STEP ACTIONS
  getPerticularWorkFlowStepsAction,
  createWorkFlowStepsAction,
  deleteWorkFlowStepAction,
  updateWorkFlowStepSAction,
  // TASK ACTIONS
  getAllWorkFlowTaskAction,
  updateWorkFlowTaskAction,
  deleteWorkFlowTaskAction,
  createWorkFlowTaskAction,
  //SUB TASKS
  getAllWorkFlowSubTaskAction,
  updateWorkFlowSubTaskAction,
  deleteWorkFlowSubTaskAction,
  createWorkFlowSubTaskAction,
} from "./../../../store/actions/workflowApiAction";
import store from "./../../../store/store";
import {
  addOrEditSingleWorkflowData,
  SET_WORKFLOW_ALL_STEPS,
  SET_WORKFLOW_ALL_TASKS,
  SET_WORKFLOW_ALL_SUBTASKS,
} from "./../../../store/types";

//  multiStepData object structure:
//   {
//     isSaved: false,
//     stepName: "step name",
//     stepDesc: "desc",
//     emojiSelected: emoji.random().emoji,
//     isStepTitleAndDescSaved: false,
//     taskData: [
//       {
//         taskName: "task name",
//         taskIcon: "",
//         isTaskSaved: false,
//         isDisplaySubTasks:false,
//         emojiSelected: emoji.random().emoji,
//         subTaskData: [
//           {
//             subTaskName: "subtask name",
//             subTaskIcon: "",
//             emojiSelected: emoji.random().emoji,
//             isSubTaskSaved: false,
//           },
//         ],
//       },
//     ],
//   },

export default function WorkflowsAddNewMain() {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    activeStepIndex: 0,
    workspaceName: "",
    multiStepData: [],
  });
  const location = useLocation();
  const [isAddSteps, setIsAddSteps] = useState(false);

  // REDUCERS
  const addOrEditSingleWorkflowData = useSelector(
    (state) => state.workflowApi.addOrEditSingleWorkflowData
  );
  const workFlowAllSteps = useSelector(
    (state) => state.workflowApi.workFlowAllSteps
  );
  const workflowAllTasks = useSelector(
    (state) => state.workflowApi.workflowAllTasks
  );
  const workflowAllSubTasks = useSelector(
    (state) => state.workflowApi.workflowAllSubTasks
  );

  //USEEFFECTS
  useEffect(() => {
    if (!isEmpty(params)) {
      if (params.id !== "1") {
        dispatch(getWorkflowDataById(params.id));
        const formDataSteps = {
          query: {
            workflow: params.id,
          },
        };
        const formDataTasks = {
          query: {
            workflow: params.id,
          },
        };
        const formDataSubTasks = {
          query: {
            workflow: params.id,
          },
        };
        dispatch(getPerticularWorkFlowStepsAction(formDataSteps));
        dispatch(getAllWorkFlowTaskAction(formDataTasks));
        dispatch(getAllWorkFlowSubTaskAction(formDataSubTasks));
      } else if (params.id === "1") {
        store.dispatch({
          type: SET_WORKFLOW_ALL_STEPS,
          payload: [],
        });
        store.dispatch({
          type: SET_WORKFLOW_ALL_TASKS,
          payload: [],
        });
        store.dispatch({
          type: SET_WORKFLOW_ALL_SUBTASKS,
          payload: [],
        });
      }
    }
  }, [params]);

  useEffect(() => {
    if (!isEmpty(addOrEditSingleWorkflowData)) {
      setValues({
        ...values,
        workspaceName: addOrEditSingleWorkflowData.name,
      });
    } else {
      setValues({
        ...values,
        activeStepIndex: 0,
        workspaceName: "",
        multiStepData: [],
      });
    }
  }, [addOrEditSingleWorkflowData]);

  // IMPRTANT FUNCTION TO RETURN ALL SUBTASKS IN TASKS
  const returnSubTasks = (taskId) => {
    let subTaskData = [];

    if (!isEmpty(workflowAllSubTasks)) {
      workflowAllSubTasks.forEach((subtask) => {
        if (subtask.wtask === taskId) {
          subTaskData.push({
            taskId: taskId,
            subTaskId: subtask._id,
            subTaskName: subtask.name,
            subTaskIcon: "",
            emojiSelected: subtask.additionalInfo.emojiSelected,
            isSubTaskSaved: subtask.additionalInfo.isSubTaskSaved,
            isSubTaskNew: subtask.additionalInfo.isSubTaskNew,
          });
        }
      });
    }

    return subTaskData;
  };

  //IMPRTANT FUNCTION TO RETURN ALL TASKS IN STEPS
  const returnStepsTasks = (stepId) => {
    let taskData = [];
    if (!isEmpty(workflowAllTasks)) {
      workflowAllTasks.forEach((task) => {
        if (task.wstep === stepId) {
          taskData.push({
            stepId: stepId,
            taskId: task._id,
            taskName: task.name,
            taskIcon: "",
            isTaskSaved: task.additionalInfo.isTaskSaved,
            emojiSelected: task.additionalInfo.emojiSelected,
            isDisplaySubTasks: task.additionalInfo.isDisplaySubTasks,
            isTaskNew: task.additionalInfo.isTaskNew,
            subTaskData: returnSubTasks(task._id),
          });
        }
      });
    }
    return taskData;
  };

  useEffect(() => {
    if (!isEmpty(workFlowAllSteps)) {
      let multiStepData = [];

      workFlowAllSteps.forEach((step) => {
        multiStepData.push({
          stepId: step._id,
          isSaved: false,
          stepName: step.name,
          stepDesc: step.description,
          emojiSelected: step.additionalInfo.emojiSelected,
          isStepTitleAndDescSaved: step.additionalInfo.isStepTitleAndDescSaved,
          taskData: returnStepsTasks(step._id),
        });
      });
      setValues({
        ...values,
        multiStepData,
        // activeStepIndex: multiStepData.length - 1,
      });
      setIsAddSteps(true);
    } else {
      setValues({
        ...values,
        // activeStepIndex: 0,
        multiStepData: [],
      });
      setIsAddSteps(false);
    }
  }, [workFlowAllSteps, workflowAllTasks, workflowAllSubTasks]);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSteps = () => {
    setIsAddSteps(!isAddSteps);
  };

  /*==================================================================
            renderStepTitleBlock
  ==================================================================*/

  // handlers
  const handleOnClickAddNewStep = () => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData.push({
    //   isSaved: false,
    //   stepName: "step name",
    //   stepDesc: "desc",
    //   taskData: [],
    // });
    // setValues({
    //   ...values,
    //   multiStepData,
    //   activeStepIndex: multiStepData.length - 1,
    // });

    if (params.id === "1") {
      let UserData = JSON.parse(localStorage.getItem("UserData"));
      const createWorkflowData = {
        name: values.workspaceName,
        description: "this is optional, if u want to save for front end",
        additionalInfo: {
          createdBy: UserData.name,
          firstName: UserData.firstName,
          lastName: UserData.lastName,
        },
      };
      dispatch(createWorkFlowAction(createWorkflowData, history));
    }
    if (params.id !== "1") {
      const formData = {
        name: `Step Name ${values.multiStepData.length + 1}`,
        workflow: params.id,
        description: "this is optional, if u want to save for front end",
        position: values.multiStepData.length + 1,
        additionalInfo: {
          emojiSelected: emoji.random().emoji,
          isStepTitleAndDescSaved: false,
        },
      };
      dispatch(createWorkFlowStepsAction(formData, params.id));
    }
    // let multiStepData = [...values.multiStepData];
    // multiStepData.push({
    //   isSaved: false,
    //   stepName: "step name",
    //   stepDesc: "desc",
    //   emojiSelected: emoji.random().emoji,
    //   isStepTitleAndDescSaved: false,
    //   taskData: [],
    // });
    // setValues({
    //   ...values,
    //   multiStepData,
    //   activeStepIndex: multiStepData.length - 1,
    // });
  };

  const handleOnClickSaveStep = (index, stepId) => (e) => {
    let multiStepData = values.multiStepData;
    let updateStepData = multiStepData[index];

    // setValues({ ...values, activeStepIndex: "" });
    const stepUpdateFormData = {
      name: updateStepData.stepName,
      description: updateStepData.stepDesc,
      position: index,
      additionalInfo: {
        emojiSelected: updateStepData.emojiSelected,
        // isStepTitleAndDescSaved: true
      },
    };
    dispatch(
      updateWorkFlowStepSAction(
        updateStepData.stepId,
        stepUpdateFormData,
        params.id
      )
    );
    setValues({ ...values, activeStepIndex: "" });
  };

  const handleOnClickCancelStep = (e) => {
    setValues({ ...values, activeStepIndex: "" });
  };

  const handleOnClickEditStep = (index) => (e) => {
    setValues({ ...values, activeStepIndex: index });
  };

  const handleOnClickDeleteStep = (index, stepId) => (e) => {
    // let multiStepData = values.multiStepData;
    // multiStepData.splice(index, 1);
    // setValues({ ...values, multiStepData, activeStepIndex: "" });
    dispatch(deleteWorkFlowStepAction(stepId, params.id));
  };

  // renderStepTitleBlock
  const renderStepTitleBlock = () => {
    return (
      <>
        {values.multiStepData.map((data, index) => (
          <Fragment key={index}>
            {values.activeStepIndex === index ? (
              <>
                <div
                  key={index}
                  className="row flex-nowrap align-items-center rt-add-new-workflows-step-title-row"
                >
                  <div className="rt-add-new-workflows-step-title-row__iconBlock">
                    <img
                      src="/img/desktop/workflows-new/six-gray-dots-icon.svg"
                      alt=""
                    />
                  </div>
                  <div className="row mr-0 flex-nowrap align-items-center rt-add-new-workflows-step-title-row__titleBlock">
                    <h3 className="rt-add-new-workflows-step-title-row__titleText">
                      {data.stepName}
                    </h3>
                    <button
                      className="rt-add-new-workflows__save-btn ml-12"
                      onClick={handleOnClickSaveStep(index, data.stepId)}
                    >
                      <i className="fa fa-save"></i>
                    </button>
                    <button
                      className="rt-add-new-workflows__save-btn ml-12"
                      onClick={handleOnClickCancelStep}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                key={index}
                className="row flex-nowrap align-items-center rt-add-new-workflows-step-title-row rt-add-new-workflows-step-title-row--gray"
              >
                <div className="rt-add-new-workflows-step-title-row__iconBlock">
                  <img
                    src="/img/desktop/workflows-new/six-gray-dots-icon.svg"
                    alt=""
                  />
                </div>
                <div className="row mr-0 flex-nowrap align-items-center rt-add-new-workflows-step-title-row__titleBlock">
                  <h3 className="rt-add-new-workflows-step-title-row__titleText">
                    {data.stepName}
                  </h3>
                  {values.activeStepIndex === "" ? (
                    <>
                      {/* active buttons */}
                      <button
                        className="rt-add-new-workflows__save-btn"
                        onClick={handleOnClickEditStep(index)}
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        className="rt-add-new-workflows__save-btn"
                        onClick={handleOnClickDeleteStep(index, data.stepId)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* disabled buttons */}
                      <button
                        className="rt-add-new-workflows__save-btn"
                        disabled
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        className="rt-add-new-workflows__save-btn"
                        disabled
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Fragment>
        ))}

        {values.multiStepData.length !== 0 && (
          <>
            {values.activeStepIndex === "" ? (
              <div className="rt-workflows-add-new-step-btn-div">
                <GreenButtonSmallFont
                  extraClassName="rt-workflows-add-new-step-btn"
                  text="+ Add next step"
                  onClick={handleOnClickAddNewStep}
                />
              </div>
            ) : (
              <div className="rt-workflows-add-new-step-btn-div">
                <GreenButtonSmallFont
                  extraClassName="rt-workflows-add-new-step-btn"
                  text="+ Add next step"
                  disabled={"disabled"}
                  onClick={handleOnClickAddNewStep}
                />
              </div>
            )}
          </>
        )}
      </>
    );
  };

  /*==================================================================
          renderStepDetailsTasksTitleAndDesc
  ==================================================================*/

  const [isDisplayDescription, setIsDisplayDescription] = useState(true);

  // handlers
  const handleChangeStepName = (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].stepName = e.target.value;
    setValues({ ...values, multiStepData });
  };

  const handleChangeStepDesc = (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].stepDesc = e.target.value;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickStepRandomiseEmoji = () => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].emojiSelected = emoji.random().emoji;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickSaveStepTitleAndDesc = () => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].isStepTitleAndDescSaved = true;
    // setValues({ ...values, multiStepData });

    let multiStepData = values.multiStepData;
    let updateStepData = multiStepData[values.activeStepIndex];

    // setValues({ ...values, activeStepIndex: "" });
    const stepUpdateFormData = {
      name: updateStepData.stepName,
      description: updateStepData.stepDesc,
      // position: values.activeStepIndex,
      additionalInfo: {
        emojiSelected: updateStepData.emojiSelected,
        isStepTitleAndDescSaved: true,
      },
    };
    dispatch(
      updateWorkFlowStepSAction(
        updateStepData.stepId,
        stepUpdateFormData,
        params.id
      )
    );
  };

  const handleOnClickEditStepTitleAndDesc = () => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].isStepTitleAndDescSaved = false;
    setValues({ ...values, multiStepData });
  };

  // renderStepDetailsTasksTitleAndDesc
  const renderStepDetailsTasksTitleAndDesc = () => {
    return (
      <>
        {!values.multiStepData[values.activeStepIndex]
          .isStepTitleAndDescSaved ? (
          <>
            <label
              htmlFor="stepName"
              className="font-18-bold common-peach-color-text mb-35"
            >
              Enter Step Name
            </label>
            <div className="row mx-0 align-items-start flex-nowrap">
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--workflowsAddStepName"
                // label=""
                placeholder=""
                name="stepName"
                value={values.multiStepData[values.activeStepIndex].stepName}
                onChange={handleChangeStepName}
                type="text"
              />
              <button
                className="rt-workflows-add-task-save-icon-btn rt-workflows-add-task-save-icon-btn--taskIcon"
                onClick={handleOnClickStepRandomiseEmoji}
              >
                <span className="rt-workflows-add-task-save-icon-btn--taskIcon__one">
                  <span className="rt-workflows-add-task-save-icon-btn--taskIcon__two">
                    {/* <i className="fa fa-square"></i> */}
                    {values.multiStepData[values.activeStepIndex].emojiSelected}
                  </span>
                </span>
              </button>
              <button
                className="rt-workflows-add-task-save-icon-btn"
                onClick={handleOnClickSaveStepTitleAndDesc}
              >
                <i className="fa fa-check"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="mb-35">
            <div className="row mx-0 flex-nowrap align-items-start justify-content-between">
              <label
                htmlFor=""
                className="font-18-bold common-peach-color-text mb-35 mr-30"
              >
                Step Name
              </label>
              <button
                className="rt-workflows-add-new-task-edit-task-btn rt-workflows-add-new-task-edit-task-btn--subtask flex-shrink-0"
                onClick={handleOnClickEditStepTitleAndDesc}
              >
                <img
                  src="/img/desktop/workflows-new/add-new-task-pencil-icon.svg"
                  alt=""
                />
                edit
              </button>
            </div>
            <p className="rt-workflows-add-new-task-title-1">
              {values.multiStepData[values.activeStepIndex].stepName}
            </p>
          </div>
        )}

        {!values.multiStepData[values.activeStepIndex]
          .isStepTitleAndDescSaved ? (
          <>
            <label
              htmlFor=""
              className="font-18-bold common-peach-color-text-1 mb-35 cursor-pointer"
              onClick={() => setIsDisplayDescription(!isDisplayDescription)}
            >
              Add Description
              <span className="ml-12">
                {isAddSteps ? (
                  <i className="fa fa-chevron-up" />
                ) : (
                  <i className="fa fa-chevron-down" />
                )}
              </span>
            </label>
            {isDisplayDescription && (
              <TextareaField
                containerClassName="container-login-flow-textarea container-login-flow-textarea--workflowsAddTask"
                // label=""
                name="stepDesc"
                value={values.multiStepData[values.activeStepIndex].stepDesc}
                onChange={handleChangeStepDesc}
              />
            )}
          </>
        ) : (
          <div className="mb-35">
            <label
              htmlFor="stepName"
              className="font-18-bold common-peach-color-text mb-35"
            >
              Description
            </label>
            <p className="rt-workflows-add-new-task-title-1">
              {values.multiStepData[values.activeStepIndex].stepDesc}
            </p>
          </div>
        )}
      </>
    );
  };

  /*==================================================================
          renderStepDetailsTasksSubTaskContent
  ==================================================================*/

  // subtask handlers
  const handleOnClickAddSubTask = (taskIndex) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData.push({
    //   subTaskName: "subtask name",
    //   subTaskIcon: "",
    //   emojiSelected: emoji.random().emoji,
    //   isSubTaskSaved: false,
    // });
    // setValues({
    //   ...values,
    //   multiStepData,
    // });
    let multiStepData = [...values.multiStepData];
    multiStepData = multiStepData[values.activeStepIndex];
    let taskData = multiStepData.taskData[taskIndex];

    const formData = {
      name: `Subtask Name ${taskData.subTaskData.length + 1}`,
      wtask: taskData.taskId,
      position: taskData.subTaskData.length + 1,
      workflow: params.id,
      additionalInfo: {
        // workflow: params.id,
        emojiSelected: emoji.random().emoji,
        isSubTaskSaved: false,
        isSubTaskNew: true,
      },
    };
    dispatch(createWorkFlowSubTaskAction(formData, params.id));
  };

  const handleChangeSubTaskName = (taskIndex, subTaskIndex) => (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
      subTaskIndex
    ].subTaskName = e.target.value;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickSubTaskRandomiseEmoji = (taskIndex, subTaskIndex) => (
    e
  ) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
      subTaskIndex
    ].emojiSelected = emoji.random().emoji;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickSaveSubTask = (taskIndex, subTaskIndex) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
    //   subTaskIndex
    // ].isSubTaskSaved = true;
    // setValues({ ...values, multiStepData });

    let multiStepData = values.multiStepData;
    let updateSubTaskData =
      multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
        subTaskIndex
      ];

    const subTaskUpdateFormData = {
      name: updateSubTaskData.subTaskName,
      position: subTaskIndex,
      additionalInfo: {
        // workflow: params.id,
        emojiSelected: updateSubTaskData.emojiSelected,
        isSubTaskSaved: true,
        isSubTaskNew: false,
      },
    };
    dispatch(
      updateWorkFlowSubTaskAction(
        updateSubTaskData.subTaskId,
        subTaskUpdateFormData,
        params.id
      )
    );
  };

  const handleOnClickCancelSubTask = (taskIndex, subTaskIndex) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
    //   subTaskIndex
    // ].isSubTaskSaved = true;
    // setValues({ ...values, multiStepData });
    let multiStepData = values.multiStepData;
    let updateSubTaskData =
      multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
        subTaskIndex
      ];
    if (updateSubTaskData.isSubTaskNew === true) {
      dispatch(
        deleteWorkFlowSubTaskAction(updateSubTaskData.subTaskId, params.id)
      );
    } else {
      const subTaskUpdateFormData = {
        additionalInfo: {
          isSubTaskSaved: true,
          emojiSelected: updateSubTaskData.emojiSelected,
          isSubTaskNew: updateSubTaskData.isSubTaskNew,
        },
      };
      dispatch(
        updateWorkFlowSubTaskAction(
          updateSubTaskData.subTaskId,
          subTaskUpdateFormData,
          params.id
        )
      );
    }
  };

  const handleOnClickEditSubTask = (taskIndex, subTaskIndex) => (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[taskIndex].subTaskData[
      subTaskIndex
    ].isSubTaskSaved = false;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickDeleteSubTask = (taskIndex, subTaskIndex, subTaskId) => (
    e
  ) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[
    //   taskIndex
    // ].subTaskData.splice(subTaskIndex, 1);
    // setValues({ ...values, multiStepData });
    dispatch(deleteWorkFlowSubTaskAction(subTaskId, params.id));
  };

  // renderStepDetailsTasksSubTaskContent
  const renderStepDetailsTasksSubTaskContent = (taskData, taskIndex) => {
    return (
      <>
        <div className="rt-workflows-add-new-task-subtask-block">
          <ol type="A" className="rt-workflows-add-new-task-ol-type">
            {!isEmpty(taskData.subTaskData) &&
              taskData.subTaskData.map((subTasks, subTaskIndex) => (
                <Fragment key={subTaskIndex}>
                  <li>
                    {subTasks.isSubTaskSaved ? (
                      <>
                        {/* display sub task */}
                        <div className="row mx-0 flex-nowrap align-items-center justify-content-between mb-30">
                          <p className="rt-workflows-add-new-task-title-1">
                            {
                              values.multiStepData[values.activeStepIndex]
                                .taskData[taskIndex].subTaskData[subTaskIndex]
                                .subTaskName
                            }
                          </p>
                          <div className="flex-shrink-0">
                            <button
                              className="rt-workflows-add-new-task-edit-task-btn rt-workflows-add-new-task-edit-task-btn--subtask"
                              onClick={handleOnClickEditSubTask(
                                taskIndex,
                                subTaskIndex
                              )}
                            >
                              <img
                                src="/img/desktop/workflows-new/add-new-task-pencil-icon.svg"
                                alt=""
                              />
                              edit
                            </button>
                            <button
                              className="rt-workflows-add-new-task-edit-task-btn rt-workflows-add-new-task-edit-task-btn--subtask"
                              onClick={handleOnClickDeleteSubTask(
                                taskIndex,
                                subTaskIndex,
                                subTasks.subTaskId
                              )}
                            >
                              <img
                                src="/img/desktop/workflows-new/add-new-task-trash-icon.svg"
                                alt=""
                              />
                              delete
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* add sub task */}
                        <div className="row mx-0 flex-nowrap align-items-center">
                          <InputFieldEmailTextPassword
                            containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--workflowsAddTask3"
                            // label=""
                            placeholder="Enter Sub task"
                            name="subTaskName"
                            value={
                              values.multiStepData[values.activeStepIndex]
                                .taskData[taskIndex].subTaskData[subTaskIndex]
                                .subTaskName
                            }
                            onChange={handleChangeSubTaskName(
                              taskIndex,
                              subTaskIndex
                            )}
                            type="text"
                          />
                          <button
                            className="rt-workflows-add-task-save-icon-btn rt-workflows-add-task-save-icon-btn--taskIcon"
                            onClick={handleOnClickSubTaskRandomiseEmoji(
                              taskIndex,
                              subTaskIndex
                            )}
                          >
                            <span className="rt-workflows-add-task-save-icon-btn--taskIcon__one">
                              <span className="rt-workflows-add-task-save-icon-btn--taskIcon__two">
                                {/* <i className="fa fa-square"></i> */}
                                {
                                  values.multiStepData[values.activeStepIndex]
                                    .taskData[taskIndex].subTaskData[
                                    subTaskIndex
                                  ].emojiSelected
                                }
                              </span>
                            </span>
                          </button>
                          <button
                            className="rt-workflows-add-task-save-icon-btn"
                            onClick={handleOnClickSaveSubTask(
                              taskIndex,
                              subTaskIndex
                            )}
                          >
                            <i className="fa fa-check"></i>
                          </button>
                          <button
                            className="rt-workflows-add-task-save-icon-btn rt-workflows-add-task-save-icon-btn--cancel"
                            onClick={handleOnClickCancelSubTask(
                              taskIndex,
                              subTaskIndex
                            )}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                </Fragment>
              ))}
          </ol>

          {/* add sub task */}
          <div className="ml-30">
            <button
              className="rt-workflows-add-new-sub-task-btn"
              onClick={handleOnClickAddSubTask(taskIndex)}
            >
              <img
                src="/img/desktop/workflows-new/add-new-sub-task-plus-icon.svg"
                alt=""
              />
              add sub task
            </button>
          </div>
        </div>
      </>
    );
  };

  /*==================================================================
          renderStepsDetailsBlock
  ==================================================================*/

  // tasks handlers
  const handleOnClickAddTask = () => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData.push({
    //   taskName: "task name",
    //   taskIcon: "",
    //   isTaskSaved: false,
    //   emojiSelected: emoji.random().emoji,
    //   subTaskData: [],
    // });
    // setValues({
    //   ...values,
    //   multiStepData,
    // });
    let multiStepData = [...values.multiStepData];
    multiStepData = multiStepData[values.activeStepIndex];
    const formData = {
      name: `Task Name ${multiStepData.taskData.length + 1}`,
      wstep: multiStepData.stepId,
      position: multiStepData.taskData.length + 1,
      workflow: params.id,
      additionalInfo: {
        // workflow: params.id,
        emojiSelected: emoji.random().emoji,
        isTaskSaved: false,
        isDisplaySubTasks: false,
        isTaskNew: true,
      },
    };
    dispatch(createWorkFlowTaskAction(formData, params.id));
    // multiStepData[values.activeStepIndex].taskData.push({
    //   taskName: "task name",
    //   taskIcon: "",
    //   isTaskSaved: false,
    //   isDisplaySubTasks: false,
    //   emojiSelected: emoji.random().emoji,
    //   subTaskData: [],
    // });
    // setValues({
    //   ...values,
    //   multiStepData,
    // });
  };

  const handleChangeTaskName = (taskIndex) => (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[taskIndex].taskName =
      e.target.value;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickTaskRandomiseEmoji = (taskIndex) => (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[
      taskIndex
    ].emojiSelected = emoji.random().emoji;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickSaveTask = (taskIndex) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[
    //   taskIndex
    // ].isTaskSaved = true;
    // setValues({ ...values, multiStepData });
    let multiStepData = values.multiStepData;
    let updateTaskData =
      multiStepData[values.activeStepIndex].taskData[taskIndex];

    const taskUpdateFormData = {
      name: updateTaskData.taskName,
      wstep: updateTaskData.stepId,
      position: taskIndex,
      additionalInfo: {
        // workflow: params.id,
        emojiSelected: updateTaskData.emojiSelected,
        isTaskSaved: true,
        isDisplaySubTasks: true,
        isTaskNew: false,
      },
    };
    dispatch(
      updateWorkFlowTaskAction(
        updateTaskData.taskId,
        taskUpdateFormData,
        params.id
      )
    );
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[
    //   taskIndex
    // ].isTaskSaved = true;
    // multiStepData[values.activeStepIndex].taskData[
    //   taskIndex
    // ].isDisplaySubTasks = true;
    // setValues({ ...values, multiStepData });
  };

  const handleOnClickCancelTask = (taskIndex) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData[
    //   taskIndex
    // ].isTaskSaved = true;
    // setValues({ ...values, multiStepData });
    let multiStepData = values.multiStepData;
    let updateTaskData =
      multiStepData[values.activeStepIndex].taskData[taskIndex];

    if (updateTaskData.isTaskNew === true) {
      // alert("delete");
      dispatch(deleteWorkFlowTaskAction(updateTaskData.taskId, params.id));
    } else {
      const taskUpdateFormData = {
        additionalInfo: {
          // workflow: params.id,
          emojiSelected: updateTaskData.emojiSelected,
          isTaskSaved: true,
          isDisplaySubTasks: true,
          isTaskNew: false,
        },
      };
      dispatch(
        updateWorkFlowTaskAction(
          updateTaskData.taskId,
          taskUpdateFormData,
          params.id
        )
      );
    }
  };

  const handleOnClickEditTask = (taskIndex) => (e) => {
    let multiStepData = [...values.multiStepData];
    multiStepData[values.activeStepIndex].taskData[
      taskIndex
    ].isTaskSaved = false;

    multiStepData[values.activeStepIndex].taskData[
      taskIndex
    ].isDisplaySubTasks = false;
    setValues({ ...values, multiStepData });
  };

  const handleOnClickDeleteTask = (taskIndex, taskId) => (e) => {
    // let multiStepData = [...values.multiStepData];
    // multiStepData[values.activeStepIndex].taskData.splice(taskIndex, 1);
    // setValues({ ...values, multiStepData });
    dispatch(deleteWorkFlowTaskAction(taskId, params.id));
  };

  // renderStepsDetailsBlock
  const renderStepsDetailsBlock = () => {
    return (
      <>
        {/* title and desc content */}
        {renderStepDetailsTasksTitleAndDesc()}
        <div className="rt-workflows-add-new-task-border-line-shadow"></div>
        {/* task content */}

        {!isEmpty(values.multiStepData[values.activeStepIndex].taskData) && (
          <>
            <h3 className="font-18-bold common-peach-color-text mb-30">
              Task Name
            </h3>
            <ol type="1" className="rt-workflows-add-new-task-ol-type">
              {values.multiStepData[values.activeStepIndex].taskData.map(
                (taskData, taskIndex) => (
                  <Fragment key={taskIndex}>
                    <li>
                      {!isEmpty(taskData.isTaskSaved) &&
                      taskData.isTaskSaved ? (
                        <>
                          {/* display task */}
                          <div className="row mx-0 flex-nowrap align-items-center justify-content-between mb-30">
                            <p className="rt-workflows-add-new-task-title-1">
                              {
                                values.multiStepData[values.activeStepIndex]
                                  .taskData[taskIndex].taskName
                              }
                            </p>
                            <div className="flex-shrink-0">
                              <button
                                className="rt-workflows-add-new-task-edit-task-btn"
                                onClick={handleOnClickEditTask(taskIndex)}
                              >
                                <img
                                  src="/img/desktop/workflows-new/add-new-task-pencil-icon.svg"
                                  alt=""
                                />
                                edit
                              </button>
                              <button
                                className="rt-workflows-add-new-task-edit-task-btn"
                                onClick={handleOnClickDeleteTask(
                                  taskIndex,
                                  taskData.taskId
                                )}
                              >
                                <img
                                  src="/img/desktop/workflows-new/add-new-task-trash-icon.svg"
                                  alt=""
                                />
                                delete
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* add task */}
                          <div className="row mx-0 flex-nowrap align-items-center">
                            <InputFieldEmailTextPassword
                              containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--workflowsAddTask2"
                              // label=""
                              placeholder="Enter Task Name"
                              name="taskName"
                              value={
                                values.multiStepData[values.activeStepIndex]
                                  .taskData[taskIndex].taskName
                              }
                              onChange={handleChangeTaskName(taskIndex)}
                              type="text"
                            />
                            <button
                              className="rt-workflows-add-task-save-icon-btn rt-workflows-add-task-save-icon-btn--taskIcon"
                              onClick={handleOnClickTaskRandomiseEmoji(
                                taskIndex
                              )}
                            >
                              <span className="rt-workflows-add-task-save-icon-btn--taskIcon__one">
                                <span className="rt-workflows-add-task-save-icon-btn--taskIcon__two">
                                  {/* <i className="fa fa-square"></i> */}
                                  {
                                    values.multiStepData[values.activeStepIndex]
                                      .taskData[taskIndex].emojiSelected
                                  }
                                </span>
                              </span>
                            </button>
                            <button
                              className="rt-workflows-add-task-save-icon-btn"
                              onClick={handleOnClickSaveTask(taskIndex)}
                            >
                              <i className="fa fa-check"></i>
                            </button>
                            <button
                              className="rt-workflows-add-task-save-icon-btn rt-workflows-add-task-save-icon-btn--cancel"
                              onClick={handleOnClickCancelTask(taskIndex)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </>
                      )}

                      {/* subtask content */}
                      {values.multiStepData[values.activeStepIndex].taskData[
                        taskIndex
                      ].isDisplaySubTasks && (
                        <>
                          {renderStepDetailsTasksSubTaskContent(
                            taskData,
                            taskIndex
                          )}
                        </>
                      )}
                      <div className="rt-workflows-add-new-task-border-line-shadow"></div>
                    </li>
                  </Fragment>
                )
              )}
            </ol>
          </>
        )}

        {/* add task */}
        <div className="text-right">
          {values.multiStepData[values.activeStepIndex]
            .isStepTitleAndDescSaved ? (
            <button
              className="rt-workflows-add-new-task-btn"
              onClick={handleOnClickAddTask}
            >
              <img
                src="/img/desktop/workflows-new/add-new-task-square-plus-icon.svg"
                alt=""
              />
              Add Task
            </button>
          ) : (
            <button className="rt-workflows-add-new-task-btn" disabled={true}>
              <img
                src="/img/desktop/workflows-new/add-new-task-square-plus-icon.svg"
                alt=""
              />
              Add Task
            </button>
          )}
        </div>
      </>
    );
  };

  /*==================================================================
          main
  ==================================================================*/
  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="all projects" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="Workflows" />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Workflows",
              link: "/workflows",
            },
            {
              title:
                location.state !== undefined && location.state.isEdit
                  ? "Edit Workflow"
                  : "Add Workflow",
            },
          ]}
        />
        <div className="pt-50 mb-40">
          <h2 className="add-project-select-cover-img-text">
            {location.state !== undefined && location.state.isEdit
              ? "Edit "
              : "Add New "}{" "}
            Workflow
          </h2>
        </div>

        {/* workflow name */}
        <InputFieldEmailTextPassword
          containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--add-new-project"
          // label=""
          placeholder="Workflow Name"
          name="workspaceName"
          value={values.workspaceName}
          onChange={handleChange}
          type="text"
        />

        {/* add steps display arrow button */}
        <button
          className="font-18-bold add-new-project-more-details mb-50"
          onClick={handleAddSteps}
        >
          <u className="add-new-project-more-details__text1">Add Steps</u>
          <span className="add-new-project-more-details__arrows">
            {isAddSteps ? (
              <i className="fa fa-chevron-up" />
            ) : (
              <i className="fa fa-chevron-down" />
            )}
          </span>
        </button>

        {/* add steps content */}
        {isAddSteps && (
          <>
            {/* if steps data empty show Add new step btn */}
            {values.multiStepData.length === 0 && (
              <div className="rt-workflows-add-new-step-btn-div">
                <GreenButtonSmallFont
                  extraClassName="rt-workflows-add-new-step-btn rt-workflows-add-new-step-btn--addNewStep"
                  text="+ Add new step"
                  onClick={handleOnClickAddNewStep}
                />
              </div>
            )}

            {/* steps structure title and details */}
            {!isEmpty(values.multiStepData) && (
              <div className="row mx-0 flex-nowrap">
                {/* steps title */}
                <div className="flex-shrink-0 rt-wf-add-new__colm1">
                  {renderStepTitleBlock()}
                </div>

                {/* steps details */}
                {values.activeStepIndex !== "" && (
                  <div className="flex-grow-1 rt-workflows-add-new-step-details-block">
                    {renderStepsDetailsBlock()}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* save workflow */}
        <div className="text-left">
          <GreenLinkSmallFont
            extraClassName="saveAndGoToWorkflowsButton"
            path="/workflows"
            text="Save Workflow"
          />
        </div>
      </div>
    </>
  );
}
