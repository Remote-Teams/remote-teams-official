import React, { Component } from "react";
import Modal from "react-responsive-modal";
import Select from "react-select";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { getAllClients } from "./../../../store/actions/clientAction";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

let countComponentUpdate = 0;
let optionsAssignTo = [];

export class ProposalAddNew extends Component {
  constructor() {
    super();
    this.state = {
      proposalName: "",
      selectedOptionAssignTo: [],
      redirect: false,
      // api
      allClients: {},
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.props.getAllClients();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allClients) &&
      nextProps.allClients !== nextState.allClients
    ) {
      return {
        allClients: nextProps.allClients,
      };
    }
    return null;
  }

  componentDidUpdate() {
    let { allClients } = this.state;

    if (!isEmpty(allClients)) {
      countComponentUpdate += 1;
    }
    // update optionsAssignTo
    if (!isEmpty(allClients) && countComponentUpdate === 1) {
      let newArray = allClients.map((client) => ({
        value: client._id,
        label: client.name,
      }));
      optionsAssignTo.push(...newArray);
      this.setState({
        selectedOptionAssignTo: optionsAssignTo[0],
      });
    }
  }

  componentWillUnmount() {
    countComponentUpdate = 0;
    optionsAssignTo = [];
  }

  /*==========================================================================
        handlers
  ============================================================================*/
  handleChangeAssignToDropdown = (selectedOptionAssignTo) => {
    this.setState({ selectedOptionAssignTo });
  };

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnClickSave = (e) => {
    e.preventDefault();
    const proposalTitle = this.state.proposalName;
    let selectedLeadData = this.state.allClients.filter(
      (a) => a.name === this.state.selectedOptionAssignTo.label
    );

    selectedLeadData = selectedLeadData[0];

    localStorage.setItem(
      "proposalData",
      JSON.stringify({ proposalTitle, selectedLeadData })
    );
    this.setState({
      redirect: true,
    });
  };

  /*============================================================
      main
  ============================================================*/
  render() {
    const { isModalOpen, onCloseModal } = this.props;
    return (
      <>
        {this.state.redirect && <Redirect to="/proposal-editor" />}
        <div>
          <Modal
            open={isModalOpen}
            onClose={onCloseModal}
            closeOnEsc={false}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "customOverlay",
              modal: "customModal customModal--addProposalModal",
              closeButton: "customCloseButton",
            }}
          >
            {/* close modal */}
            <span className="closeIconInModal" onClick={onCloseModal} />
            {/* content */}
            <div className="add-proposal-modal-content">
              <div className="add-meeting-title-div add-meeting-title-div--add-task">
                <h2 className="add-meeting-title">Add Proposal</h2>
              </div>
              <div className="row mx-0 mb-50 add-proposal-modal-content__row">
                <div className="col-12 px-0">
                  <InputFieldEmailTextPassword
                    containerClassName="container-login-flow-input container-login-flow-input--forms container-login-flow-input--forms--proposal"
                    label="Proposal Name"
                    name="proposalName"
                    value={this.state.proposalName}
                    onChange={this.handleOnChange}
                    type="text"
                  />
                </div>
                <div className="col-12 px-0">
                  {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                    assign to
          </h3>}*/}
                  <Select
                    isSearchable={false}
                    className="react-select-container react-select-container--addMember react-select-container--addMember--proposal"
                    classNamePrefix="react-select-elements"
                    value={this.state.selectedOptionAssignTo}
                    onChange={this.handleChangeAssignToDropdown}
                    options={optionsAssignTo}
                    placeholder="assign to"
                  />
                </div>
              </div>

              <div className="row mx-0 pt-10 ">
                <div className="col-12 text-center">
                  <GrayButtonSmallFont text="Cancel" onClick={onCloseModal} />
                  <GreenButtonSmallFont
                    text="Save"
                    onClick={this.handleOnClickSave}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  allClients: state.client.allClients,
});

export default connect(mapStateToprops, {
  getAllClients,
})(withRouter(ProposalAddNew));
