import React, { Component } from "react";
import format from "date-fns/format";
import differenceInHours from "date-fns/difference_in_hours";
import differenceInMinutes from "date-fns/difference_in_minutes";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import Modal from "react-responsive-modal";
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

class AllProjectDiscussionDisplay extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      comment: "",
    };
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

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  onOpenModal = () => {
    this.setState({
      open: true,
    });
  };

  /*=================================================================
        renderModal
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
      `${url}${data.fileUrlPath}&token=${dataToken.token}`,
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
        renderModal
  =================================================================*/
  renderModal = () => {
    const { open } = this.state;
    const { discussionData } = this.props;
    const commentOverflowDivClass =
      discussionData.status === "ENDED"
        ? "discussion-modal-overflow-block-comments-disabled"
        : "discussion-modal-overflow-block-comments";
    return (
      <>
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--discussionDispalyModal",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />

          <div className="discussion-display-modal-block">
            {/* row 1 */}
            <div className="row mx-0">
              <div className="col-8">
                {/*<h1 className="font-18-bold-space-light-uppercase pb-10">
                  subject
        </h1>*/}
                <h2 className="add-meeting-title mb-30">
                  {discussionData.subject}
                </h2>
              </div>
              <div className="col-4">
                {/** font-18-bold-space-light-uppercase font-12-extrabold-space-light-uppercase*/}
                <h3 className="font-12-extrabold-space-light-uppercase discussion-display-block-last-activity  mb-25">
                  last activity
                </h3>
                <p className="font-12-extrabold-space-light-uppercase discussion-display-block-last-activity-date-text pb-10">
                  {format(discussionData.updatedAt, "DD-MMM-YYYY")}
                </p>
              </div>
            </div>

            {/* row 2 */}
            <div className="row mx-0">
              <div className="col-3 pr-0">
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
              <div className="col-8">
                <h3 className="font-18-bold discussion-display-block-comment-text mb-20">
                  comments
                </h3>
              </div>
              {/*<div className="col-4">
                <h3 className="font-18-bold-space-light-uppercase mb-20">
                  posted on
                </h3>
      </div>*/}
            </div>

            {/* row 4 */}
            <div className={commentOverflowDivClass}>
              {!isEmpty(discussionData.comments) ? (
                discussionData.comments.map((data, index) => (
                  <div key={index}>
                    <div className="row mx-0">
                      <div className="col-8">
                        <h4 className="font-12-extrabold-space-light-uppercase discussion-display-block-comment-data-text pb-10 opacity-41">
                          {data.createdBy}
                        </h4>
                      </div>
                    </div>
                    <div className="row mx-0 mb-30 pb-10">
                      <div className="col-8">
                        <p className="discussion-display-block-comment-desc-text">
                          {data.comment}
                        </p>
                      </div>
                      <div className="col-2">
                        {this.calculateDayTimeDifference(data.updatedAt)}
                      </div>
                      {discussionData.status !== "ENDED" && (
                        <div className="col-1 text-left">
                          <i
                            className="fa fa-trash finances-table__fa-icon-delete"
                            onClick={this.handleOnClickDeleteIcon(data._id)}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p className="font-20-semiBold opacity-41">No Comments</p>
                </div>
              )}
            </div>

            {/* row 5 */}
            {discussionData.status !== "ENDED" && (
              <>
                <div className="col-12">
                  <TextareaField
                    containerClassName="container-login-flow-textarea container-login-flow-textarea--discussionDispaly"
                    label="post your comment"
                    name="comment"
                    value={this.state.comment}
                    onChange={this.handelChange}
                  />
                </div>
                <div className="row mx-0">
                  <div className="col-9"></div>
                  <div className="col-3 text-right">
                    <GreenButtonSmallFont
                      //text="POST"
                      text="Save &amp; Post"
                      onClick={this.handleOnClickPost}
                      extraClassName="discussion-display-save-and-post-btn"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    );
  };

  /*=================================================================
        main
  =================================================================*/
  render() {
    return (
      <>
        {this.renderModal()}

        <img
          src={require("../../../assets/img/icons/export-icon.svg")}
          alt="export"
          className="finances-table__export-icon-img"
          onClick={this.onOpenModal}
        />
      </>
    );
  }
}

export default connect(null, {
  addNewAllProjectDiscussionComment,
  deleteAllProjectDiscussionComment,
})(AllProjectDiscussionDisplay);
