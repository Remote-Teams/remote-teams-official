import React, { Component } from "react";
import { Link } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import {
  createPinProject,
  deletePin,
} from "./../../../store/actions/projectAction";
import { connect } from "react-redux";

export class AllProjectsCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: this.props.project,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.pinProjects) &&
      nextProps.pinProjects !== nextState.pinProjects
    ) {
      return {
        pinProjects: nextProps.pinProjects,
      };
    }
    return null;
  }

  handleOnClickPinProject = () => {
    const { projectData } = this.state;

    const formData = {
      project: projectData._id,
    };
    this.props.createPinProject(formData);
  };

  handleOnClickUnPinProject = () => {
    const { pinProjects, projectData } = this.state;
    let pinedProject = [];
    if (!isEmpty(pinProjects)) {
      pinedProject = pinProjects.filter(
        (element) => element.project === projectData._id
      );
    }

    this.props.deletePin(pinedProject[0]._id);
  };

  render() {
    const { pinProjects, projectData } = this.state;

    console.log(projectData);
    let alreadyPinned = "";

    if (!isEmpty(pinProjects)) {
      pinProjects.forEach((element) => {
        if (element.project === projectData._id) {
          alreadyPinned = true;
        }
      });
    }
    console.log(alreadyPinned);

    const pinText = (
      <>
        <img
          //src={require("../../../assets/img/icons/green-pin-icon.svg")}
          src={require("../../../assets/img/icons/gradient-pin-icon-new.svg")}
          alt="pin"
          className="project-green-pin-img"
        />
        <span>Pin to Dashboard</span>
      </>
    );

    const unpinText = (
      <>
        <img
          src={require("../../../assets/img/icons/gradient-pin-icon-new.svg")}
          alt="pin"
          className="project-green-pin-img"
        />
        <span>Unpin from Dashboard</span>
      </>
    );

    return (
      <>
        <div
          className={`row mx-0 flex-nowrap all-project-card-block ${this.props.extraClassName}`}
        >
          <div className="all-project-card-block__colm1">
            <img
              src={require("../../../assets/img/dummy/project-without-border.svg")}
              alt="project"
              className="img-wh-100"
            />
          </div>
          <div className="all-project-card-block__colm2">
            <h3 className="font-18-bold-space-light-uppercase">project Name</h3>
            <h4 className="all-project-card-block-text2">{projectData.name}</h4>
            <h3 className="font-18-bold-space-light-uppercase">client name</h3>
            <h4 className="all-project-card-block-text2">Jason D</h4>
          </div>
          <div className="all-project-card-block__colm3">
            <h3 className="font-18-bold-space-light-uppercase">
              Total modules
            </h3>
            <h4 className="all-project-card-block-text2">
              {projectData.moduleCount}
            </h4>
            <h3 className="font-18-bold-space-light-uppercase">
              Total sprints
            </h3>
            <h4 className="all-project-card-block-text2">
              {projectData.sprintCount}
            </h4>
          </div>
          <div className="all-project-card-block__colm4">
            <h3 className="font-18-bold-space-light-uppercase">STATUS</h3>
            <h4 className="all-project-card-block-text2">
              {projectData.status}
            </h4>
            <h3 className="font-18-bold-space-light-uppercase">open tasks</h3>
            <h4 className="all-project-card-block-text2">
              {projectData.openTaskCount}
            </h4>
          </div>
          <div className="all-project-card-block__colm5">
            <h3 className="font-18-bold-space-light-uppercase">team members</h3>
            <div className="row mx-0 flex-nowrap align-items-center mt-20 mb-15">
              {!isEmpty(projectData.resources) && (
                <>
                  <img
                    //src={require("../../../assets/img/dummy/access-role-resource.svg")}
                    //src={require("../../../assets/img/dummy/selected-member-profile-new.svg")}
                    src={require("../../../assets/img/dummy/new-profile-img.svg")}
                    alt="person"
                    className="project-team-member-img"
                  />
                  <span className="font-24-semiBold text-lowercase">x</span>
                  <span className="project-team-member-count-text">
                    {projectData.resources.length}
                  </span>
                </>
              )}
            </div>
            {!isEmpty(alreadyPinned) && alreadyPinned === true ? (
              <GrayButtonSmallFont
                text={unpinText}
                extraClassName="project-pin-button project-pin-button--unpin"
                onClick={this.handleOnClickUnPinProject}
              />
            ) : (
              <GrayButtonSmallFont
                text={pinText}
                extraClassName="project-pin-button"
                onClick={this.handleOnClickPinProject}
              />
            )}
          </div>
          <div className="all-project-card-block__colm6-outer">
            <Link
              to={{
                pathname: "/all-projects-detail",
                state: {
                  projectData: this.props.project,
                },
              }}
            >
              <div className="all-project-card-block__colm6">
                <img
                  src={require("../../../assets/img/icons/arrow-right-project.png")}
                  alt=""
                />
              </div>
            </Link>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  pinProjects: state.projects.pinProjects,
});

export default connect(mapStateToProps, { createPinProject, deletePin })(
  AllProjectsCards
);
