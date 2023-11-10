import React, { Component } from "react";
import format from "date-fns/format";
import differenceInHours from "date-fns/difference_in_hours";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { url } from "../../../store/actions/config";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  addNewAllProjectDiscussionComment,
  deleteAllProjectDiscussionComment,
} from "./../../../store/actions/allProjectDiscussionAction";
import UploadMultipleFilesListDisplay from "../common/UploadMultipleFilesListDisplay";
import AllProjectDiscussionAddNew from "./AllProjectDiscussionAddNew";

class AllProjectDiscussionDisplayNew extends Component {
  constructor() {
    super();
    this.state = {
      comment: "",
      allProjectDiscussionComments: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allProjectDiscussionComments) &&
      nextProps.allProjectDiscussionComments !==
        nextState.allProjectDiscussionComments
    ) {
      return {
        allProjectDiscussionComments: nextProps.allProjectDiscussionComments,
      };
    }
    return null;
  }

  /*=================================================================
              handlers
  =================================================================*/

  handelChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackIsSuccess = (data) => {
    if (data) {
      this.setState({
        comment: "",
      });
    }
  };

  handleOnClickPost = () => {
    // console.log(this.state);
    let formData = {
      comment: this.state.comment,
      discussion: this.props.discussionData._id,
      additionObject: {},
    };
    this.props.addNewAllProjectDiscussionComment(
      formData,
      this.callBackIsSuccess
    );
  };

  /*=================================================================
        renderContent
  =================================================================*/

  calculateDayTimeDifference = (val) => {
    let today = new Date();
    let min = differenceInMinutes(today, val);
    let hr = differenceInHours(today, val);
    let day = differenceInCalendarDays(today, val);
    return (
      <p className="font-12-extrabold-space-light-uppercase discussion-display-block-posted-time-text">
        {min < 60 ? (
          min === 0 ? (
            "Now"
          ) : (
            <>{min} Min Ago</>
          )
        ) : hr < 24 ? (
          hr === 1 ? (
            <>{hr} Hour Ago</>
          ) : (
            <>{hr} Hours Ago</>
          )
        ) : day === 1 ? (
          <>{day} Day Ago</>
        ) : day < 7 ? (
          <>{day} Days Ago</>
        ) : (
          format(val, "DD-MMM-YYYY")
        )}
      </p>
    );
  };

  handleOnClickDeleteIcon = (id) => (e) => {
    this.props.deleteAllProjectDiscussionComment(id);
  };

  /*=================================================================
        renderListOfDocumentsAttached
  =================================================================*/
  handleOnClickDocumentName = (data) => (e) => {
    let dataToken = JSON.parse(localStorage.getItem("UserData"));
    return window.open(
      `${
        data.fileUrl
      }&token=${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs"}`,
      "_blank"
    );
  };

  renderListOfDocumentsAttached = (discussionData) => {
    return (
      <>
        <UploadMultipleFilesListDisplay
          dataDocuments={discussionData.attachments}
          handleOnClickDocumentName={this.handleOnClickDocumentName}
        />
      </>
    );
  };

  /*=================================================================
        renderContent
  =================================================================*/
  renderContent = () => {
    const { discussionData } = this.props;
    const { allProjectDiscussionComments } = this.state;
    const commentOverflowDivClass =
      discussionData.status === "ENDED"
        ? "discussion-modal-overflow-block-comments-disabled"
        : "discussion-modal-overflow-block-comments";
    return (
      <>
        <div className="pt-30 pr-90">
          <div className="row mx-0 flex-nowrap align-items-start">
            <img
              src={require("../../../assets/img/dummy/all-projects-discussion-card-img.svg")}
              alt="discussion profile"
              className="all-project-discussion-card-img"
            />
            <div className="col-5 px-0 all-project-discussion-card-text-div">
              <h3 className="all-project-discussion-card-text1">
                Created by {discussionData.userData[0].name}{" "}
              </h3>
              <h5 className="all-project-discussion-card-text2">
                {" "}
                {this.calculateDayTimeDifference(discussionData.updatedAt)}
              </h5>
            </div>
            <div className="row mx-0 flex-nowrap align-items-center all-project-discussion-card-action-btns-row">
              {discussionData.status === "ENDED" ? (
                <div className="opacity-0">
                  <AllProjectDiscussionAddNew
                    extraClassNameEditBtn="discussion-new-edit-btn--display"
                    editBtnText="Edit Details"
                    isFormTypeAdd={false}
                    discussionData={discussionData}
                    projectId={this.props.projectId}
                  />
                </div>
              ) : (
                <AllProjectDiscussionAddNew
                  extraClassNameEditBtn="discussion-new-edit-btn--display"
                  editBtnText="Edit Details"
                  isFormTypeAdd={false}
                  discussionData={discussionData}
                  projectId={this.props.projectId}
                />
              )}
              {/* <i
                className="fa fa-trash finances-table__fa-icon-delete mr-0"
                onClick={this.props.handleOnClickDeleteIcon(discussionData._id)}
              ></i> */}
            </div>
          </div>
          <div className="row mx-0 align-items-start">
            <div className="col-7 px-0">
              <h2 className="all-project-discussion-card-text3 all-project-discussion-card-text3--display">
                {discussionData.subject}
              </h2>
              <p className="all-project-discussion-card-text4 font-14-semibold">
                {discussionData.description}
              </p>
            </div>
          </div>

          {/* row 1 */}
          {/* <div className="row mx-0">            
            <div className="col-4 px-0">
              <h3 className="font-12-extrabold-space-light-uppercase discussion-display-block-last-activity  mb-25">
                last activity
              </h3>
              <p className="font-12-extrabold-space-light-uppercase discussion-display-block-last-activity-date-text pb-10">
                {format(discussionData.updatedAt, "DD-MMM-YYYY")}
              </p>
            </div>
          </div> */}

          {/* row 2 */}
          <div className="row mx-0 mt-40">
            <div className="col-3 px-0">
              <h3 className="font-12-extrabold-space-light-uppercase discussion-display-block-attachments-text pb-10">
                {/*View attachment*/}
                attachements
              </h3>
            </div>
            <div className="col-9 px-0">
              <div className="font-12-extrabold-space-light-uppercase discussion-modal-overflow-block-attachments">
                {this.renderListOfDocumentsAttached(discussionData)}
              </div>
            </div>
          </div>

          {/* row 3 */}
          <div className="row mx-0">
            <div className="col-8 px-0">
              <h3 className="font-18-bold discussion-display-block-comment-text mb-20">
                comments
              </h3>
            </div>
            {/*<div className="col-4 px-0">
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  posted on
                </h3>
      </div>*/}
          </div>

          {/* row 4 */}
          <div className={commentOverflowDivClass}>
            {!isEmpty(allProjectDiscussionComments) ? (
              allProjectDiscussionComments.map((data, index) => (
                <div key={index}>
                  <div className="row mx-0 flex-nowrap mb-15">
                    <div className="flex-shrink-0">
                      <img
                        src={require("../../../assets/img/dummy/all-projects-discussion-card-img.svg")}
                        alt="discussion profile"
                        className="all-project-discussion-card-img"
                      />
                    </div>
                    <div className="col-6 px-0">
                      <h4 className="font-12-extrabold-space-light-uppercase discussion-display-block-comment-data-text pb-10 opacity-41">
                        {data.userData[0].name}
                      </h4>
                      {this.calculateDayTimeDifference(data.updatedAt)}
                    </div>

                    {/* {discussionData.status !== "ENDED" && (
                      <div className="col-1 px-0 text-left">
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={this.handleOnClickDeleteIcon(data._id)}
                        ></i>
                      </div>
                    )} */}
                  </div>
                  <div className="row mx-0 mb-30 pb-10">
                    <div className="col-7 px-0">
                      <p className="discussion-display-block-comment-desc-text">
                        {data.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-6 px-0 text-center">
                <p className="font-20-semiBold opacity-41">No Comments</p>
              </div>
            )}
          </div>

          {/* row 5 */}
          {discussionData.status !== "ENDED" && (
            <>
              <div className="col-12 px-0">
                <TextareaField
                  containerClassName="container-login-flow-textarea container-login-flow-textarea--discussionDispaly"
                  label="Type your comment"
                  name="comment"
                  value={this.state.comment}
                  onChange={this.handelChange}
                />
              </div>
              <div className="row mx-0">
                <div className="col-7 px-0 text-right">
                  <GreenButtonSmallFont
                    text="Comment"
                    onClick={this.handleOnClickPost}
                    extraClassName="discussion-display-save-and-post-btn"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  /*=================================================================
        main
  =================================================================*/
  render() {
    return <>{this.renderContent()}</>;
  }
}

const mapStateToprops = (state) => ({
  allProjectDiscussionComments: state.projects.allProjectDiscussionComments,
});

export default connect(mapStateToprops, {
  addNewAllProjectDiscussionComment,
  deleteAllProjectDiscussionComment,
})(AllProjectDiscussionDisplayNew);
