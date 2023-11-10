import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import WorkflowDetailsDisplayContent from "./WorkflowDetailsDisplayContent";
import WorkflowStartNewInstance from "./WorkflowStartNewInstance";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import isEmpty from "../../../store/validations/is-empty";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getWorkflowDataById,
  getPerticularWorkFlowStepsAction,
  getAllWorkFlowTaskAction,
  getAllWorkFlowSubTaskAction,
} from "./../../../store/actions/workflowApiAction";

const dummyData = [1, 2, 3, 4, 5];
const totalSteps = dummyData.length - 1;

export default function WorkflowCardDetails() {
  const params = useParams();
  const dispatch = useDispatch();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [singleWorkflowData, setSingleWorkflowData] = useState({});
  const [workflowAllStepsData, setWorkflowAllSteps] = useState([]);
  const [workflowAllTasksData, setWorkflowAllTasks] = useState([]);
  const [workflowAllSubTasksData, setWorkflowAllSubTasks] = useState([]);

  useEffect(() => {
    if (!isEmpty(params)) {
      dispatch(getWorkflowDataById(params.id));
      const formData = {
        query: {
          workflow: params.id,
        },
      };
      const formDataTasks = {
        query: {
          // additionalInfo: {
          //   workflow: params.id,
          // },
        },
      };
      const formDataSubTasks = {
        query: {
          // additionalInfo: {
          //   workflow: params.id,
          // },
        },
      };
      dispatch(getPerticularWorkFlowStepsAction(formData));
      dispatch(getAllWorkFlowTaskAction(formDataTasks));
      dispatch(getAllWorkFlowSubTaskAction(formDataSubTasks));
    }
  }, [params]);

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

  useEffect(() => {
    if (!isEmpty(addOrEditSingleWorkflowData)) {
      setSingleWorkflowData(addOrEditSingleWorkflowData);
    } else {
      setSingleWorkflowData({});
    }
  }, [addOrEditSingleWorkflowData]);

  useEffect(() => {
    if (!isEmpty(workFlowAllSteps)) {
      // console.log(workFlowAllSteps);
      setWorkflowAllSteps(workFlowAllSteps);
    } else {
      setWorkflowAllSteps([]);
    }
  }, [workFlowAllSteps]);

  useEffect(() => {
    if (!isEmpty(workflowAllTasks)) {
      setWorkflowAllTasks(workflowAllTasks);
    } else {
      setWorkflowAllTasks([]);
    }
  }, [workflowAllTasks]);

  useEffect(() => {
    if (!isEmpty(workflowAllSubTasks)) {
      setWorkflowAllSubTasks(workflowAllSubTasks);
    } else {
      setWorkflowAllSubTasks([]);
    }
  }, [workflowAllSubTasks]);

  /*=============================================================================
          handlers
  =============================================================================*/
  const handleOnClickDelete = () => {
    console.log("workflow delete");
  };

  /*=============================================================================
          renderLeftBlock
  =============================================================================*/
  // handlers
  const handleOnClickOfStep = (index) => (e) => {
    setActiveStepIndex(index);
  };

  // renderBlockLeft
  const renderBlockLeft = () => {
    return (
      <div className="mt-30 flex-shrink-0">
        {!isEmpty(workflowAllStepsData) &&
          workflowAllStepsData.map((data, index) => (
            <button
              key={index}
              className="row mx-0 mb-20 align-items-center workflow-card-details-step-name-button"
              onClick={handleOnClickOfStep(index)}
            >
              {/*<div
              className={
                activeStepIndex === index
                  ? "workflow-card-details-green-circle workflow-card-details-green-circle--solidGreen"
                  : "workflow-card-details-green-circle workflow-card-details-green-circle--greenBorder"
              }
            >
              <h5 className="font-18-bold font-18-bold-workflow">
                {index + 1}
              </h5>
            </div>*/}

              <div
                className={
                  activeStepIndex === index
                    ? "workflow-card-details-gray-block workflow-card-details-gray-block--active"
                    : "workflow-card-details-gray-block"
                }
              >
                <h3 className="workflow-card-details-gray-block-text">
                  {/*stage {index + 1}*/}
                  {data.name}
                </h3>
              </div>
            </button>
          ))}
        <h3 className="font-18-bold start-of-workflow-text pt-30">
          End of Workflow
        </h3>
      </div>
    );
  };
  /*=============================================================================
          renderArrow
  =============================================================================*/
  const handleNext = (e) => {
    setActiveStepIndex(activeStepIndex + 1);
  };

  const handlePrev = (e) => {
    setActiveStepIndex(activeStepIndex - 1);
  };

  const renderArrow = () => {
    return (
      <div className="workflow-details-arrow-div">
        {activeStepIndex >= 0 && activeStepIndex < totalSteps && (
          <button
            className="workflow-details-next-arrow-btn"
            onClick={handleNext}
          >
            <div className="workflow-details-next-back-arrow"></div>
          </button>
        )}
        {activeStepIndex > 0 && activeStepIndex <= totalSteps && (
          <button
            className="workflow-details-back-arrow-btn"
            onClick={handlePrev}
          >
            <div className="workflow-details-next-back-arrow"></div>
          </button>
        )}
      </div>
    );
  };
  /*=============================================================================
          main
  =============================================================================*/

  return (
    <>
      {/* left navbar */}
      <LeftNavbar />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="workflows" />
          <TopNavbar />
        </div>
        <div>
          <BreadcrumbMenu
            menuObj={[
              {
                title: "Workflows",
                link: "/workflows",
              },
              {
                title: `${!isEmpty(singleWorkflowData) &&
                  singleWorkflowData.name}`,
              },
            ]}
          />
        </div>
        <div className="mt-40 mb-50 pl-10 row mx-0 flex-nowrap align-items-center justify-content-between">
          <div className="mr-20">
            <h2 className="workflow-details-right-card-title mb-20">
              {!isEmpty(singleWorkflowData) && singleWorkflowData.name}
            </h2>
            {/*<h2 className="font-29-light-italic">created by Another member</h2>*/}
            <div className="row mx-0 align-items-center">
              <h3 className="workflow-created-by-text">created by</h3>
              <span className="workflow-created-by-span-name">
                {!isEmpty(singleWorkflowData) &&
                  singleWorkflowData.additionalInfo.firstName.charAt(0)}

                {!isEmpty(singleWorkflowData) &&
                  singleWorkflowData.additionalInfo.lastName.charAt(0)}
              </span>
              <h4 className="workflow-created-by-name">
                {!isEmpty(singleWorkflowData) &&
                  singleWorkflowData.additionalInfo.createdBy}
              </h4>
            </div>
          </div>
          <div className="row mx-0 flex-nowrap justify-content-end align-items-center">
            {/*<GrayLinkSmallFont
              path="/workflows"
              text="Go back"
              extraClassName="workflow-card-details-gray-button"
            />            */}
            <div className="workflow-card-edit-img-btn">
              <Link
                //to={"/workflow-edit-new"}
                to={{
                  pathname: `/workflow-edit-new/${params.id}`,
                  state: {
                    isEdit: true,
                  },
                }}
              >
                <img
                  src={require("../../../assets/img/icons/all-project-card-edit-icon.svg")}
                  alt="edit"
                  //className="project-green-pin-img"
                />
                <span>Edit Workflow</span>
              </Link>
            </div>
            <WorkflowStartNewInstance singleWorkflowData={singleWorkflowData} />
            {/* <div className="workflow-card-delete-img-div">
              <Link
                to={{
                  pathname: "/workflow-add-new",
                  state: {
                    isEdit: true,
                  },
                }}
              >
                <img
                  src={require("../../../assets/img/workflow/edit.svg")}
                  alt="edit"
                  className="workflow-card-delete-img"
                />
              </Link>
            </div> */}
            {/* <button
              className="workflow-card-delete-img-div ml-20"
              onClick={handleOnClickDelete}
            >
              <img
                src={require("../../../assets/img/workflow/delete.svg")}
                alt="delete"
                className="workflow-card-delete-img"
              />
            </button> */}
          </div>
        </div>
        <h3 className="font-18-bold start-of-workflow-text">
          Start of Workflow
        </h3>
        <div className="row flex-nowrap workflow-details-right-card-outer-div mx-0">
          {renderBlockLeft()}
          <div className="mt-30 ">
            <WorkflowDetailsDisplayContent
              activeStepIndex={activeStepIndex}
              workflowAllStepsData={workflowAllStepsData}
              workflowAllTasksData={workflowAllTasksData}
              workflowAllSubTasksData={workflowAllSubTasksData}
            />
            {renderArrow()}
          </div>
        </div>
      </div>
    </>
  );
}
