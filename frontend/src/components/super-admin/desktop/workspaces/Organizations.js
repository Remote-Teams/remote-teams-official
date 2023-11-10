import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import SuperAdminNavbar from "../header/SuperAdminNavbar";
import Cards from "../common/Cards";
import SearchBlock from "../common/SearchBlock";
import { connect } from "react-redux";
import { getAllOraganizations } from "./../../../../store/actions/superAdminActions";
import isEmpty from "./../../../../store/validations/is-empty";
import dateFns from "date-fns";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const tempRow = ["1", "2", "3"];

// pagination
const totalRecordsInOnePage = 10;

class Organizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*=====================================
    Componenet Lifecycle method
======================================*/
  componentDidMount() {
    this.props.getAllOraganizations("1", "10");
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allOrganizations) &&
      nextProps.allOrganizations !== nextState.allOrganizations
    ) {
      return {
        allOrganizations: nextProps.allOrganizations,
        getItemsList: nextProps.allOrganizations,
      };
    }
    return null;
  }

  /*==================================
              Pagination
  ===================================*/
  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
    this.props.getAllOraganizations(`${page}`, "10");
  };

  /*
   * handlers
   */
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  /*
   * renderOverview
   */
  renderOverview = () => {
    return (
      <>
        <h1 className="font-24-semibold mb-30">Throtl Workspace</h1>

        <div className="row mx-0 mb-48 pb-10">
          <Cards gradient="sa-gradient1" count={24} desc="Total Users" />
          <Cards gradient="sa-gradient3" count={15} desc="Paid Users" />
          <Cards gradient="sa-gradient2" count={15} desc="Active Users" />
        </div>
      </>
    );
  };

  /*
   * renderList
   */
  renderList = () => {
    const { allOrganizations } = this.state;

    return (
      <>
        <h1 className="font-24-semibold mb-48">All Users</h1>
        <SearchBlock
          name="search"
          className="sa-users-search"
          searchVal={this.state.search}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <div className="row mx-0">
          <div className="sa-workspaces__list">
            <div className="sa-workspaces__list-heading">
              <div className="sa-workspaces__list-heading-block">
                Workspace name
              </div>
              <div className="sa-workspaces__list-heading-block">Admin</div>
              <div className="sa-workspaces__list-heading-block">
                Joining Date
              </div>
              <div className="sa-workspaces__list-heading-block">
                Total Users
              </div>
              <div className="sa-workspaces__list-heading-block">Plan Type</div>
              <div className="sa-workspaces__list-heading-block">
                Renewal Date
              </div>
            </div>

            <div className="sa-workspaces__list-content-container">
              {!isEmpty(allOrganizations) &&
                allOrganizations.map((organization, index) => (
                  <Fragment key={index}>
                    <Link
                      to={{
                        pathname: "/organization-workspace",
                        state: { detail: organization.workspaceId },
                      }}
                      key={index}
                      className="sa-workspaces__list-content"
                    >
                      {/* if need to delete link then use the commented div */}
                      {/* <div className="sa-workspaces__list-content" key={index}> */}
                      <div className="sa-workspaces__list-content-block row mx-0 align-items-center">
                        <img
                          src={require("../../../../assets/img/leads/ben-1.png")}
                          alt="person"
                          className="sa-workspaces__table-person-img"
                        />
                        {organization.workspaceId}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        John Dorian
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {dateFns.format(organization.createdAt, "Do MMM YYYY")}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {organization.userCount}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {organization.billingType}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {dateFns.format(
                          organization.expirationDate,
                          "Do MMM YYYY"
                        )}
                      </div>
                      {/* </div> */}
                    </Link>
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
        <div className="sa-pagination">
          <Pagination
            onChange={this.onChangePagination}
            current={this.state.currentPagination}
            defaultPageSize={totalRecordsInOnePage}
            total={100}
            showTitle={false}
          />
        </div>
      </>
    );
  };

  render() {
    console.log(this.state.allOrganizations);
    return (
      <div className="superadmin-main-div">
        <SuperAdminNavbar />
        <div className="sa-workspaces">
          {this.renderOverview()}
          {this.renderList()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  allOrganizations: state.superAdmin.allOrganizations,
});

export default connect(mapStateToProps, { getAllOraganizations })(
  Organizations
);
