import React, { useState, useEffect } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import WorkflowStartNewInstance from "./WorkflowStartNewInstance";
// import AddNewWorkflowsNameModal from "../workflows-add-new/AddNewWorkflowsNameModal";
import { Link } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export default function WorkflowLibrary() {
  const [values, setValues] = useState({
    isOnMouseOver: false,
    mouseOverIndex: "",
  });

  const [allWorkflowData, setAllWorkFlowData] = useState([]);

  //REDUCERS
  const allWorkflows = useSelector((state) => state.workflowApi.allWorkflows);

  useEffect(() => {
    if (!isEmpty(allWorkflows)) {
      setAllWorkFlowData(allWorkflows);
    } else {
      setAllWorkFlowData([]);
    }
  }, [allWorkflows]);

  /*==================================================================
            handlers
  ==================================================================*/

  const handleOnMouseOver = (index) => (e) => {
    setValues({
      ...values,
      isOnMouseOver: true,
      mouseOverIndex: index,
    });
  };

  const handleOnMouseLeave = (index) => (e) => {
    setValues({
      ...values,
      isOnMouseOver: false,
      mouseOverIndex: "",
    });
  };

  /*==================================================================
            main
  ==================================================================*/
  return (
    <>
      <div className="row mx-0 workflow-library-overflow-div">
        {/* <AddNewWorkflowsNameModal /> */}

        <Link to={`/workflow-add-new/1`}>
          <div className="workflow-library-first-card workflow-library-first-card--btn">
            <h5 className="workflow-library-first-card-add">+</h5>
          </div>
        </Link>

        {!isEmpty(allWorkflowData) &&
          allWorkflowData.map((data, index) => (
            <div
              key={index}
              onMouseOver={handleOnMouseOver(index)}
              onMouseLeave={handleOnMouseLeave(index)}
            >
              {values.isOnMouseOver && values.mouseOverIndex === index ? (
                <div className="workflow-library-second-card">
                  <GrayLinkSmallFont
                    text="open"
                    path={`/workflow-card-details/${data._id}`}
                    extraClassName="workflow-labrary-button"
                    extraClassNameLink={"mx-0"}
                  />
                  <WorkflowStartNewInstance singleWorkflowData={data} />
                </div>
              ) : (
                <div className="workflow-library-third-card">
                  <div className="workflow-library-third-card-img-div">
                    <img
                      //src={require("../../../assets/img/workflow/library.svg")}
                      src={require("../../../assets/img/workflow/library-new.svg")}
                      alt="workflow library"
                      className="workflow-library-third-card-img"
                    />
                  </div>
                  <h5 className="workflow-name-text">{data.name}</h5>
                  {/*<h5 className="workflow-18-italic">created by name</h5>*/}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
