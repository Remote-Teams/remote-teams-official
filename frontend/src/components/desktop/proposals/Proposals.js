import React, { Component, Fragment } from "react";
import LeftNavbar from "../header/LeftNavbar";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import CountCardCommon from "../common/CountCardCommon";
import SearchInput from "../common/SearchInput";
import ProposalsCard from "./ProposalsCard";
import ProposalAddNew from "./ProposalAddNew";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  get_all_proposal_list,
  getProposalsOverview,
} from "../../../components/desktop/ProposalEditor/store/actions/proposalActions";

// const dummyData = [1, 2, 3, 4];

export class Proposals extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      isModalOpen: false,
      // api
      allProposals: {},
      allProposalsCount: {},
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.props.get_all_proposal_list();
    this.props.getProposalsOverview();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.allProposals !== nextState.allProposals) {
      return {
        allProposals: nextProps.allProposals,
      };
    }
    if (
      !isEmpty(nextProps.allProposalsCount) &&
      nextProps.allProposalsCount !== nextState.allProposalsCount
    ) {
      return {
        allProposalsCount: nextProps.allProposalsCount,
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

  handleOnClickAddNewProposal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { isModalOpen, allProposals, allProposalsCount } = this.state;
    return (
      <div>
        {/* left navbar */}
        <LeftNavbar activeMenu="presentations" />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle
              title="Proposals"
              isBtnDisplay={true}
              btnOnClick={this.handleOnClickAddNewProposal}
              btnText="+ New Proposal"
            />
            <TopNavbar />
          </div>
          {/* pagetitle and topnavbar end */}

          <div className="mb-10">
            {/* <GreenButtonSmallFont
              onClick={this.handleOnClickAddNewProposal}
              text="+ New Proposal"
              extraClassName="new-proposal-btn"
            /> */}

            {isModalOpen && (
              <ProposalAddNew
                isModalOpen={isModalOpen}
                onCloseModal={this.onCloseModal}
              />
            )}
          </div>
          <div className="row mx-0 proposals-page-count-row">
            <CountCardCommon
              title="TOTAL Created"
              count={!isEmpty(allProposalsCount) ? allProposalsCount.all : 0}
            />
            <CountCardCommon
              title="Drafts"
              count={!isEmpty(allProposalsCount) ? allProposalsCount.draft : 0}
            />
            <CountCardCommon
              title="Sent"
              count={!isEmpty(allProposalsCount) ? allProposalsCount.sent : 0}
            />
          </div>
          <div className="row mx-0 justify-content-end proposals-btn-search-div">
            <SearchInput
              name="searchInput"
              placeholder="Search"
              onChange={this.handleChangeSearchInput}
              value={this.state.SearchInput}
            />
          </div>

          {!isEmpty(allProposals) ? (
            <div className="row mx-0 proposals-card-overflow">
              {allProposals.map((data, index) => (
                <Fragment key={index}>
                  <ProposalsCard proposalData={data} />
                </Fragment>
              ))}
            </div>
          ) : (
            <h3 className="font-14-semibold table-data-empty-message announcement-empty-message">
              There have been no proposals created yet
            </h3>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToprops = (state) => ({
  allProposals: state.proposals.proposalData.all_proposal_list,
  allProposalsCount: state.proposals.proposalData.proposal_overview,
});

export default connect(mapStateToprops, {
  get_all_proposal_list,
  getProposalsOverview,
})(Proposals);
