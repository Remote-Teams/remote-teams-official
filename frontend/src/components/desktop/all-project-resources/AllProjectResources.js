import React, { Component } from "react";
import SearchInput from "../common/SearchInput";
import AllProjectResourcesCard from "./AllProjectResourcesCard";
import AllProjectResourcesAddMemberModal from "./AllProjectResourcesAddMemberModal";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

class AllProjectResources extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      allResources: {},
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.singleProjectData) &&
      nextProps.singleProjectData !== nextState.singleProjectData
    ) {
      return {
        singleProjectData: nextProps.singleProjectData,
      };
    }
    return null;
  }

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { singleProjectData } = this.state;
    const { allResources } = this.props;
    // console.log(this.state.singleProjectData);
    return (
      <div className="all-project-tab-panel">
        <div className="row mx-0 justify-content-between align-items-center mb-30 all-project-resources-container">
          <AllProjectResourcesAddMemberModal
            allResources={allResources}
            singleProjectData={singleProjectData}
          />
          <SearchInput
            name="searchInput"
            placeholder="Search"
            onChange={this.handleChangeSearchInput}
            value={this.state.SearchInput}
          />
        </div>
        <div className="row mx-0 all-project-resources-card-overflow-div">
          {!isEmpty(singleProjectData) &&
            singleProjectData.resources.map((resource, index) => {
              return (
                <AllProjectResourcesCard key={index} cardData={resource} />
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  singleProjectData: state.projects.singleProjectData,
  allResources: state.resources.allResources,
});

export default connect(mapStateToProps, {})(AllProjectResources);
