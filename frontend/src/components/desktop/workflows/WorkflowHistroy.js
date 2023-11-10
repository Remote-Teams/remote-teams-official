import React from "react";
import { Fragment } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import WorkflowStartNewInstance from "./WorkflowStartNewInstance";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { Link } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { deleteWorkFlowInstanceAction } from "./../../../store/actions/workflowApiAction";

const dummyData = [{ days: "2days" }, { days: "10days" }, { days: "10days" }];

export default function WorkflowHistroy({
  completedInstances,
  handleOnSelect,
}) {
  const dispatch = useDispatch();
  /*==================================================================
            renderTable
  ==================================================================*/

  const handleDelete = (instanceId) => (e) => {
    dispatch(deleteWorkFlowInstanceAction(instanceId));
  };

  const renderTable = () => {
    return (
      <div className="ongoing-table-margin-div">
        <div className="finances-table finances-table-head finances-table--workflow-head--histroy">
          <table className="finances-table finances-table--workflow finances-table--workflow--histroy">
            <thead>
              <tr>
                {/*<th></th>*/}
                <th>
                  <span>workflow name</span>
                </th>
                <th>
                  <span>instance name</span>
                </th>
                {/*                <th>
                  <span>duration</span>
                </th>
*/}
                <th>
                  <span>completed on</span>
                </th>
                {/*<th>
                  <span>start date</span>
                </th>
                <th>
                  <span>current step</span>
                </th>*/}

                <th>
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--workflow finances-table-tbody--workflow--history">
          <table className="finances-table finances-table--workflow finances-table--workflow--histroy">
            <tbody>
              {!isEmpty(completedInstances) &&
                completedInstances.map((data, key) => (
                  <Fragment key={key}>
                    <tr>
                      <td>
                        <span>{data.data.name}</span>
                      </td>
                      <td>
                        <span>{data.instanceInfo.instanceName}</span>
                      </td>
                      <td>
                        {/*<span>{data.days}</span>*/}
                        <span>{format(data.createdAt, "DD/MM/YYYY")}</span>
                      </td>
                      {/*<td>
                      <span>5th</span>
                    </td>*/}
                      <td>
                        <span className="row mx-0 align-items-center justify-content-end">
                          <WorkflowStartNewInstance
                            singleWorkflowData={data.data}
                          />
                          {/*{key === 1 ? (
                          <div>
                            <Link to="/workflow-details">
                              <span className="login-next-green-btn login-next-green-btn--history mr-25">
                                <i className="fa fa-play pause-font pr-10" />
                                Resume Instance
                              </span>
                            </Link>
                          </div>
                        ) : (
                          <div>
                            <Link to="/workflow-details">
                              <span className="login-dashboard-btn workflow-ongoing-gray-button mr-25">
                                <i className="fa fa-pause pause-font pr-10" />
                                Pause Instance
                              </span>
                            </Link>
                          </div>
                        )}*/}
                          <GrayLinkSmallFont
                            //path="/workflow-card-details"
                            path={`/instance-details/${data._id}`}
                            //text="Check Details"
                            text="View Instance Details"
                            extraClassName="workflow-ongoing-gray-button ml-30"
                          />
                          {data.completed === false && (
                            <button
                              className="font-24-semiBold--ongoing"
                              onClick={handleDelete(data._id)}
                            >
                              <i className="fa fa-trash  " />
                            </button>
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr className="rt-workflow-space-tr">
                      <td colSpan="100"></td>
                    </tr>
                  </Fragment>
                ))}
              {isEmpty(completedInstances) && (
                <tr className="rt-workflow-space-tr rt-workflow-space-tr--empty-cell">
                  <td colSpan="100">
                    <div className="no-workflow-history-found-div">
                      <img
                        src={require("../../../assets/img/illustrations/workflow-history.svg")}
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
