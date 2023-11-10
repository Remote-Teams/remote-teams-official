import React, { Component, Fragment } from "react";
import format from "date-fns/format";
import SearchInput from "../common/SearchInput";
import AllProjectDiscussionAddNew from "./AllProjectDiscussionAddNew";
import Select from "react-select";
import AllProjectDiscussionDisplay from "./AllProjectDiscussionDisplay";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getAllProjectDiscussions,
  updateAllProjectDiscussion,
  deleteAllProjectDiscussion,
  getAllProjectDiscussionComments,
} from "./../../../store/actions/allProjectDiscussionAction";
import AllProjectDiscussionCard from "./AllProjectDiscussionCard";
import AllProjectDiscussionDisplayNew from "./AllProjectDiscussionDisplayNew";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

const optionsStatus = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "ENDED", label: "Ended" },
];

const dummyCardData = [
  {
    id: "1",
    title: "Questions and Answers",
  },
  {
    id: "2",
    title: "Remote teams New changes-Scheduler",
  },
  {
    id: "3",
    title: "Questions and Answers",
  },
  {
    id: "4",
    title: "Remote teams New changes-Scheduler",
  },
];
class AllProjectDiscussion extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      selectedOptionStatus: optionsStatus[0],
      isViewDiscussion: false,
      viewDiscussionId: "",
      // api
      allProjectDiscussions: {},
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.props.getAllProjectDiscussions();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.allProjectDiscussions !== nextState.allProjectDiscussions) {
      return {
        allProjectDiscussions: nextProps.allProjectDiscussions,
      };
    }

    return null;
  }

  /*============================================================
      handlers
  ============================================================*/
  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*============================================================
      renderScrumTable
  ============================================================*/
  // handlers
  callBackIsSuccess = (data) => {
    if (data) {
      // nothing to do
    }
  };

  handleChangeStatusDropdown = (data) => (selectedOptionStatus) => {
    this.setState({ selectedOptionStatus });
    let formData = {
      status: selectedOptionStatus.value,
    };
    this.props.updateAllProjectDiscussion(
      data._id,
      formData,
      this.callBackIsSuccess
    );
  };

  renderLastComment = (data) => {
    let len = isEmpty(data) ? 0 : data.length;
    return len <= 0 ? (
      <span className="opacity-35">No comments</span>
    ) : (
      <span>{data[len - 1].comment}</span>
    );
  };

  handleOnClickDeleteIcon = (id) => (e) => {
    this.props.deleteAllProjectDiscussion(id);
  };

  // renderDiscussionTable
  renderdiscussiontable = () => {
    const { allProjectDiscussions } = this.state;
    return (
      <>
        <div className="finances-table-thead">
          <table className="finances-table finances-table--discussion">
            <thead>
              <tr>
                <th>
                  <span>subject</span>
                </th>
                <th>
                  <span>last activity</span>
                </th>
                <th>
                  <span>no of comments</span>
                </th>
                <th>
                  <span className="pl-30">Status</span>
                </th>
                <th>
                  <span>last comment</span>
                </th>
                <th>
                  <span className="opacity-0">0</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="finances-table-tbody finances-table-tbody--discussion">
          <table className="finances-table finances-table--discussion">
            <tbody>
              {!isEmpty(allProjectDiscussions) ? (
                allProjectDiscussions.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <span>{data.subject}</span>
                    </td>
                    <td>
                      <span>{format(data.updatedAt, "DD-MMM-YYYY")}</span>
                    </td>
                    <td>
                      <span className="pl-30">
                        {isEmpty(data.comments) ? 0 : data.comments.length}
                      </span>
                    </td>
                    <td>
                      <span>
                        {data.status === "ENDED" ? (
                          // disabled
                          <Select
                            className="react-select-container react-select-container--addInvoice react-select-container--addInvoice-disabled"
                            classNamePrefix="react-select-elements"
                            value={optionsStatus.filter(
                              (a) => a.value === data.status
                            )}
                            options={optionsStatus}
                            placeholder="Select"
                            isDisabled={true}
                          />
                        ) : (
                          // active
                          <Select
                            isSearchable={false}
                            className="react-select-container react-select-container--addInvoice"
                            classNamePrefix="react-select-elements"
                            value={optionsStatus.filter(
                              (a) => a.value === data.status
                            )}
                            onChange={this.handleChangeStatusDropdown(data)}
                            options={optionsStatus}
                            placeholder="Select"
                          />
                        )}
                      </span>
                    </td>
                    <td>{this.renderLastComment(data.comments)}</td>
                    <td>
                      <span className="row mx-0 flex-nowrap align-items-start">
                        {data.status === "ENDED" ? (
                          <div className="opacity-0">
                            <AllProjectDiscussionAddNew
                              isFormTypeAdd={false}
                              discussionData={data}
                              projectId={this.props.projectId}
                            />
                          </div>
                        ) : (
                          <AllProjectDiscussionAddNew
                            isFormTypeAdd={false}
                            discussionData={data}
                            projectId={this.props.projectId}
                          />
                        )}
                        <i
                          className="fa fa-trash finances-table__fa-icon-delete"
                          onClick={this.handleOnClickDeleteIcon(data._id)}
                        ></i>
                        <AllProjectDiscussionDisplay
                          discussionData={data}
                          projectId={this.props.projectId}
                        />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={0} className="text-center">
                    <span className="font-14-semibold table-data-empty-message">
                      No data found
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  handleviewDiscussion = (id) => (e) => {
    this.setState({ isViewDiscussion: true, viewDiscussionId: id });
    this.props.getAllProjectDiscussionComments(id);
  };

  handleOnClickBack = () => {
    this.setState({ isViewDiscussion: false });
  };

  render() {
    const {
      allProjectDiscussions,
      isViewDiscussion,
      viewDiscussionId,
    } = this.state;
    return (
      <div className="all-project-tab-panel">
        {!isViewDiscussion ? (
          <>
            <div className="row justify-content-between align-items-center mx-0 discussion-btn-div">
              <AllProjectDiscussionAddNew
                isFormTypeAdd={true}
                projectId={this.props.projectId}
              />
              {/*<SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={this.handleChangeSearchInput}
            value={this.state.SearchInput}
          />*/}
            </div>
            {/*{this.renderdiscussiontable()}*/}
            <div className="row mx-0 align-items-start all-projects-discussion-card-outer-div">
              {!isEmpty(allProjectDiscussions) &&
                allProjectDiscussions.map((data, index) => (
                  <Fragment key={index}>
                    <AllProjectDiscussionCard
                      data={data}
                      projectId={this.props.projectId}
                      handleOnClickDeleteIcon={this.handleOnClickDeleteIcon}
                      handleviewDiscussion={this.handleviewDiscussion}
                    />
                  </Fragment>
                ))}
            </div>
          </>
        ) : (
          <>
            <GrayButtonSmallFont
              onClick={this.handleOnClickBack}
              text="Go back"
            />
            <AllProjectDiscussionDisplayNew
              discussionData={
                allProjectDiscussions.filter(
                  (a) => a._id === viewDiscussionId
                )[0]
              }
              projectId={this.props.projectId}
              handleOnClickDeleteIcon={this.handleOnClickDeleteIcon}
            />
          </>
        )}
      </div>
    );
  }
}

const mapStateToprops = (state) => ({
  allProjectDiscussions: state.projects.allProjectDiscussions,
});

export default connect(mapStateToprops, {
  getAllProjectDiscussions,
  updateAllProjectDiscussion,
  deleteAllProjectDiscussion,
  getAllProjectDiscussionComments,
})(AllProjectDiscussion);
