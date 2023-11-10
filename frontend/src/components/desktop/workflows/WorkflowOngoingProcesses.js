import React from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import WorkflowStartNewInstance from "./WorkflowStartNewInstance";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import {
  deleteWorkFlowInstanceAction,
  updateWorkFlowInstanceAction,
} from "./../../../store/actions/workflowApiAction";

const dummyData = [1, 2, 3];

export default function WorkflowOngoingProcesses({
  onGoingInstances,
  handleOnSelect,
}) {
  const dispatch = useDispatch();
  /*==================================================================
            renderTable
  ==================================================================*/

  const handleDelete = (instanceId) => (e) => {
    dispatch(deleteWorkFlowInstanceAction(instanceId));
  };

  const pauseResumeHandler = (status, instanceData) => (e) => {
    const formData = instanceData;
    instanceData.instanceInfo.status = status;

    dispatch(updateWorkFlowInstanceAction(formData, instanceData._id));
  };

  const renderTable = () => {
    return (
      <div className="ongoing-table-margin-div">
        <div className="finances-table finances-table-head">
          <table className="finances-table finances-table--workflow">
            <thead>
              <tr>
                {/*<th></th>*/}
                <th>
                  <span>workflow name</span>
                </th>
                <th>
                  <span>instance name</span>
                </th>
                <th>
                  <span>start date</span>
                </th>
                <th>
                  <span>current step</span>
                </th>
                {/*<th>
                  <span>Duration</span>
                </th>*/}

                <th>
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--workflow">
          <table className="finances-table finances-table--workflow">
            <tbody>
              {!isEmpty(onGoingInstances) &&
                onGoingInstances.map((data, key) => (
                  <Fragment key={key}>
                    <tr>
                      {/*<td>
                      <div className="workflow-vector-img-div">
                        <img
                          src={require("../../../assets/img/workflow/vector.svg")}
                          alt="vector"
                        />
                      </div>
                    </td>*/}
                      <td>
                        <span>{data.data.name}</span>
                      </td>
                      <td>
                        <span>{data.instanceInfo.instanceName}</span>
                      </td>
                      <td>
                        <span>{format(data.createdAt, "DD/MM/YYYY")}</span>
                      </td>
                      <td>
                        <span>{data.data.steps.length}</span>
                      </td>
                      {/*<td>
                      <span>2 Days</span>
                    </td>*/}
                      <td>
                        <span className="row mx-0 align-items-center justify-content-end">
                          {data.instanceInfo.status !== "ACTIVE" ? (
                            <div>
                              <span
                                onClick={pauseResumeHandler("ACTIVE", data)}
                                className="login-next-green-btn ongoing-green-button mr-25"
                              >
                                <i className="fa fa-play pause-font pr-10" />
                                Resume Instance
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span
                                onClick={pauseResumeHandler("DEACTIVE", data)}
                                className="login-dashboard-btn workflow-ongoing-gray-button mr-25"
                              >
                                <i className="fa fa-pause pause-font pr-10" />
                                Pause Instance
                              </span>
                            </div>
                          )}
                          {/*<WorkflowStartNewInstance />*/}
                          {/*<GreenButtonSmallFont
                          text="Start New Instance"
                          extraClassName="workflow-ongoing-processes-green-btn mr-20"
                          //onClick={handleOnClickMarkComplete}
                        />*/}
                          <GrayLinkSmallFont
                            //text="view"
                            //text="Check Details"
                            text="Open Instance"
                            extraClassName="workflow-ongoing-gray-button ml-20"
                            path={`/workflow-details/${data._id}`}
                            extraClassNameLink={"mx-0"}
                          />
                          <button
                            className="font-24-semiBold--ongoing"
                            onClick={handleDelete(data._id)}
                          >
                            <i className="fa fa-trash  " />
                          </button>
                        </span>
                      </td>
                    </tr>
                    <tr className="rt-workflow-space-tr">
                      <td colSpan="100"></td>
                    </tr>
                  </Fragment>
                ))}
              {isEmpty(onGoingInstances) && (
                <tr className="rt-workflow-space-tr rt-workflow-space-tr--empty-cell">
                  <td colSpan="100">
                    <div className="no-workflow-history-found-div">
                      <img
                        src={require("../../../assets/img/illustrations/workflow-ongoing-instance.png")}
                        alt="workflow history"
                        className="workflow-no-history-img"
                      />
                      <span className="workflow-no-history-text">
                        No History Yet
                      </span>
                      <GreenButtonSmallFont
                        text={"Go to Library"}
                        extraClassName="no-workflow-history-btn"
                        onClick={() => handleOnSelect(0)}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /*==================================================================
            main
  ==================================================================*/
  return (
    <>
      <div className="row align-items-center mx-0 justify-content-end"></div>
      {renderTable()}
    </>
  );
}
