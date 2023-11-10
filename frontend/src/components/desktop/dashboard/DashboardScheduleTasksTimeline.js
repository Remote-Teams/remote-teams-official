import React, { useState, useEffect, Fragment } from "react";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import { updatePipelineById } from "./../../../store/actions/pipelineAction";
import AddPipelineTaskToSchedule from "./AddPipelineTaskToSchedule";
import DashboardTaskPipelineFeaturesIllustration from "../features-illustration/DashboardTaskPipelineFeaturesIllustration";

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let featureOne = { name: "Tasks_Pipeline", isDisabled: false };

export default function DashboardScheduleTasksTimeline() {
  let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
  const dispatch = useDispatch();
  const [allPipelines, setAllPipelines] = useState([]);

  const userPipelines = useSelector((state) => state.pipeline.userPipelines);

  useEffect(() => {
    if (!isEmpty(userPipelines)) {
      setAllPipelines(userPipelines);
    } else {
      setAllPipelines([]);
    }
  }, [userPipelines]);

  useEffect(() => {
    let filterFeatureOne = featureArray.filter(
      (ele) => ele === featureOne.name
    );
    if (!isEmpty(filterFeatureOne)) {
      featureOne.isDisabled = false;
    } else {
      featureOne.isDisabled = true;
    }
  }, []);

  const handleDismiss = (data) => (e) => {
    const formData = data;
    formData.dismissed = true;
    dispatch(updatePipelineById(formData._id, formData, "Pipeline Dismissed"));
    console.log("Onclick dismiss");
  };

  const handleAddSchedule = () => {
    console.log("Onclick add to schedule");
  };
  const renderTaskPipelineCard = (data) => {
    return (
      <div className="schedule-tasks-pipeline-card-div">
        <div className="row mx-0 justify-content-between">
          <h3 className="schedule-tasks-pipeline-card-title">
            <img
              src={require("../../../assets/img/icons/dashboard-pipeline-circle-icon.svg")}
              alt=""
            />
            {data.task.name}
            {/* lorem */}
          </h3>
          <h5 className="schedule-tasks-pipeline-card-text1 pr-10">
            {" "}
            {dateFns.format(data.task.startDate, "do MMM")} -{" "}
            {dateFns.format(data.task.endDate, "do MMM")}
            {/* {dateFns.format(new Date(), "do MMM")} -{" "}
            {dateFns.format(new Date(), "do MMM")} */}
          </h5>
        </div>
        <div className="row mx-0 align-items-start justify-content-between">
          <h4 className="col-6 schedule-tasks-pipeline-card-text1 pt-10">
            <span className="schedule-tasks-pipeline-card-text2">
              booked by
            </span>
            {data.bookedBy}
            {/* lorem */}
          </h4>
          <h4 className="col-6 pr-0 schedule-tasks-pipeline-card-text1 pt-10">
            <span className="schedule-tasks-pipeline-card-text2">project</span>
            {data.task.project.name}
          </h4>
        </div>
        <div className="row mx-0 align-items-start justify-content-between flex-nowrap schedule-tasks-pipeline-card-btn-div">
          <GrayButtonSmallFont
            text="Dismiss"
            extraClassName="schedule-tasks-pipeline-card-btn2"
            onClick={handleDismiss(data)}
          />
          {/* <GreenButtonSmallFont
            text="Add to Schedule"
            extraClassName="schedule-tasks-pipeline-card-btn1 mx-0"
            onClick={handleAddSchedule}
          />*/}

          <AddPipelineTaskToSchedule pipelineData={data} />
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-schedule-row__colm2 flex-grow-1">
      <h3 className="text-center font-18-bold-space-light-uppercase font-18-bold-space-light-upper--schedule-tasks">
        tasks pipeline
      </h3>
      <div className="schedule-tasks-pipeline-card-overflow-div">
        {featureOne.isDisabled === false ? (
          !isEmpty(allPipelines) &&
          allPipelines.map((data, index) => (
            <Fragment key={index}>{renderTaskPipelineCard(data)}</Fragment>
          ))
        ) : (
          <>
            {/* "Shoa illustartion component here" */}
            <DashboardTaskPipelineFeaturesIllustration />
          </>
        )}
      </div>
    </div>
  );
}
