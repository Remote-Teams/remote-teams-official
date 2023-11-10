import React, { useState, Fragment, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
//import check from "../../../assets/img/workflow/check.svg";
import check from "../../../assets/img/workflow/new-check.svg";
import InstanceDetailsDisplayContent from "./InstanceDetailsDisplayContent";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import isEmpty from "../../../store/validations/is-empty";
import {
  getSingleInstanceDataById,
  updateWorkFlowInstanceAction,
} from "./../../../store/actions/workflowApiAction";
import { useDispatch, useSelector } from "react-redux";
import WorkflowStartNewInstance from "./WorkflowStartNewInstance";

export default function InstanceCardDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const [values, setValues] = useState({
    dummyData: [
      { isChecked: false },
      { isChecked: false },
      { isChecked: false },
      { isChecked: false },
    ],
    activeStepIndex: 0,
    isMarkInstanceCompleteClicked: false,
  });

  const [seletectedStepData, setSeletectedStepData] = useState({});
  const [singleInstanceData, setSingleInstanceData] = useState({});

  let totalSteps = values.dummyData.length - 1;

  //REDUCERS
  const singleInstanceDataReducer = useSelector(
    (state) => state.workflowApi.singleInstanceData
  );

  useEffect(() => {
    if (!isEmpty(params)) {
      dispatch(getSingleInstanceDataById(params.id));
    }
  }, [params]);

  useEffect(() => {
    if (!isEmpty(singleInstanceDataReducer)) {
      let allSteps = singleInstanceDataReducer.data.steps;
      let finalData = [];
      allSteps.forEach((step) => {
        finalData.push(step);
      });
      setValues({
        ...values,
        dummyData: finalData,
      });
      totalSteps = values.dummyData.length - 1;
      setSingleInstanceData(singleInstanceDataReducer);
    } else {
      setSingleInstanceData({});
    }
  }, [singleInstanceDataReducer]);

  useEffect(() => {
    if (!isEmpty(singleInstanceDataReducer)) {
      // console.log(singleInstanceData.data.steps[values.activeStepIndex]);
      setSeletectedStepData(
        singleInstanceDataReducer.data.steps[values.activeStepIndex]
      );
    }
  }, [values.activeStepIndex, singleInstanceDataReducer]);

  /*=============================================================================
          handlers
  =============================================================================*/

  /*=============================================================================
          renderLeftBlock
  =============================================================================*/
  // handlers

  const handleOnClickOfStep = (index) => (e) => {
    setValues({
      ...values,
      activeStepIndex: index,
    });
  };

  // renderLeftBlock
  const renderLeftBlock = () => {
    return (
      <>
        <div className="workflow-details-column-div">
          {values.dummyData.map((data, index) => (
            <Fragment key={index}>
              <>
                <div
                  className="row mx-0 flex-nowrap align-items-center workflow-left-side-gray-div"
                  onClick={handleOnClickOfStep(index)}
                >
                  <div
                    className={
                      values.activeStepIndex === index
                        ? "workflow-left-side-green-block row mx-0 flex-nowrap align-items-center justify-content-between"
                        : "workflow-left-side-gray-block row mx-0 flex-nowrap align-items-center justify-content-between"
                    }
                  >
                    <h3 className="font-18-bold">{data.name}</h3>
                    <span className="workflow-left-side-gray-block-text2">
                      2/11
                    </span>
                  </div>

                  <div
                    className={
                      values.activeStepIndex !== index
                        ? "workflow-left-side-green-circle-div"
                        : "workflow-left-side-green-circle-div workflow-left-side-green-circle-div--activeBlockCheckbox"
                    }
                  >
                    <div className="customCheckbox customCheckbox--workflow-details">
                      <Checkbox
                        name="isChecked"
                        checked={data.step_completed}
                        disabled
                        // onChange={handleOnClickStepChecked(index)}
                      />
                    </div>
                  </div>
                </div>
              </>
            </Fragment>
          ))}
          <h5 className="font-18-bold start-of-workflow-text pt-30">
            End of Workflow
          </h5>
        </div>
      </>
    );
  };

  /*=============================================================================
          renderArrow
  =============================================================================*/
  const handleNext = (e) => {
    setValues({
      ...values,
      activeStepIndex: values.activeStepIndex + 1,
    });
  };

  const handlePrev = (e) => {
    setValues({
      ...values,
      activeStepIndex: values.activeStepIndex - 1,
    });
  };

  const renderArrow = () => {
    return (
      <div className="workflow-details-arrow-div">
        {values.activeStepIndex >= 0 && values.activeStepIndex < totalSteps && (
          <button
            className="workflow-details-next-arrow-btn"
            onClick={handleNext}
          >
            <div className="workflow-details-next-back-arrow"></div>
          </button>
        )}
        {values.activeStepIndex > 0 && values.activeStepIndex <= totalSteps && (
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
                title: `${!isEmpty(singleInstanceData) &&
                  singleInstanceData.data.name}`,
                link: "/workflows",
              },
              {
                title: `${!isEmpty(singleInstanceData.instanceInfo) &&
                  singleInstanceData.instanceInfo.instanceName}`,
              },
            ]}
          />
        </div>

        {/* <h5 className="workflow-light-italic-18-font">Created by User Name</h5> */}
        {/* <h3 className="font-29-nunito-medium">Instance name</h3>
         */}
        <div className="mt-40 mb-50 pl-10 row mx-0 flex-nowrap align-items-center justify-content-between">
          <div className="mr-20">
            <h2 className="workflow-details-right-card-title">
              {" "}
              {!isEmpty(singleInstanceData.instanceInfo) &&
                singleInstanceData.instanceInfo.instanceName}
            </h2>
            <h3 className="font-18-semiBold workflow-details-workflow-text-1">
              {!isEmpty(singleInstanceData) && singleInstanceData.data.name}
            </h3>
            <div className="row mx-0 align-items-center">
              <h3 className="workflow-created-by-text">created by</h3>
              <span className="workflow-created-by-span-name">
                {" "}
                {!isEmpty(singleInstanceData.instanceInfo) &&
                  singleInstanceData.instanceInfo.firstName.charAt(0)}
                {!isEmpty(singleInstanceData.instanceInfo) &&
                  singleInstanceData.instanceInfo.lastName.charAt(0)}
              </span>
              <h4 className="workflow-created-by-name">
                {" "}
                {!isEmpty(singleInstanceData.instanceInfo) &&
                  singleInstanceData.instanceInfo.createdBy}
              </h4>
            </div>
          </div>
          <div className="row mx-0 flex-nowrap">
            <WorkflowStartNewInstance
              singleWorkflowData={singleInstanceData.data}
            />
          </div>
        </div>
        <h3 className="font-18-bold start-of-workflow-text">
          Start of Workflow
        </h3>

        <div className="row mx-0 flex-nowrap pt-30 workflow-details-right-card-outer-div">
          {renderLeftBlock()}
          <InstanceDetailsDisplayContent
            seletectedStepData={seletectedStepData}
            singleInstanceData={singleInstanceData}
            activeStepIndex={values.activeStepIndex}
          />
          {renderArrow()}
        </div>
      </div>
    </>
  );
}
