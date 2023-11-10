import React, { Component } from "react";
import Select from "react-select";
import "rc-dropdown/assets/index.css";
import Toggle from "../common/Toggle";
import EditClientModal from "./EditClientModal";
import {
  deleteClient,
  updateClientStatusWithId,
} from "./../../../store/actions/clientAction";
import { connect } from "react-redux";
import DisplayClientModal from "./DisplayClientModal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";

const options = [{ value: "Delete", label: "Delete" }];

class ClientCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStatusActive: true,
      isEditModalOpen: false,
      isDisplayModalOpen: false,
      clientData: this.props.cardData,
    };
  }

  /*===========================================================================
      handlers
  ===========================================================================*/

  handleOnChangeToggle = (clientData) => (e) => {
    console.log(clientData);
    console.log(e.target.checked);
    let data = clientData;
    if (e.target.checked === true) {
      clientData.status = "ACTIVE";
      this.props.updateClientStatusWithId(clientData._id, clientData);
    } else {
      clientData.status = "INACTIVE";
      this.props.updateClientStatusWithId(clientData._id, clientData);
    }
    // this.setState({
    //   [e.target.name]: e.target.checked,
    // });
  };

  onCloseModal = () => {
    this.setState({
      isEditModalOpen: false,
      isDisplayModalOpen: false,
    });
  };

  handleOnClickViewEditCard = (val) => (e) => {
    if (val === "Edit") {
      this.setState({
        isEditModalOpen: true,
      });
    } else if (val === "Open") {
      this.setState({
        isDisplayModalOpen: true,
      });
    }
  };

  handleChangeDropdown = (selectedOption) => {
    if (selectedOption.value === "Delete") {
      const { clientData } = this.state;
      this.props.deleteClient(clientData._id);
    }
  };

  /*===========================================================================
      main
  ===========================================================================*/
  render() {
    const { clientData } = this.state;
    console.log(clientData);
    const { isEditModalOpen, isDisplayModalOpen } = this.state;
    //const iconLabel = <i className="fa fa-ellipsis-v" />;
    const iconLabel = (
      <img
        src={require("../../../assets/img/icons/new-dots.svg")}
        alt="export"
        className="new-select-img"
      />
    );
    const viewButtonText = (
      <span>
        {/*<img
          src={require("../../../assets/img/icons/export-icon.svg")}
          alt="export"
        />*/}
        View
      </span>
    );

    const editButtonText = (
      <span>
        {/*<i className="fa fa-pencil"></i>*/}
        Edit
      </span>
    );
    return (
      <>
        {/* edit client modal */}
        {isEditModalOpen && (
          <EditClientModal
            editCardData={clientData}
            isEditModalOpen={isEditModalOpen}
            onCloseModal={this.onCloseModal}
          />
        )}
        {/* display client modal */}
        {isDisplayModalOpen && (
          <DisplayClientModal
            editCardData={clientData}
            isDisplayModalOpen={isDisplayModalOpen}
            onCloseModal={this.onCloseModal}
          />
        )}
        {/* client card content  */}
        <div className="web-client-card-div">
          <div className="row align-items-start justify-content-between flex-nowrap mx-0">
            <div className="row flex-nowrap align-items-start mx-0">
              <div className="web-client-icon web-client-icon--client">
                <img
                  //src={`${clientData.coverImg}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs`}
                  //src={require("../../../assets/img/clients/new-client-profile.svg")}
                  src={require("../../../assets/img/clients/new-client-profile-img.png")}
                  alt="person"
                  className="img-wh-100"
                />
              </div>
              <div>
                <h2 className="web-client-name">{clientData.name}</h2>
                <div className="row mx-0 flex-nowrap card-view-edit-buttons-block">
                  <GrayButtonSmallFont
                    text={viewButtonText}
                    onClick={this.handleOnClickViewEditCard("Open")}
                  />

                  <GrayButtonSmallFont
                    text={editButtonText}
                    onClick={this.handleOnClickViewEditCard("Edit")}
                  />
                </div>
              </div>
            </div>
            {/* here not used DropdownIcon from rc-dropdown since it's dropdown options scrolling when we scroll in div */}
            <div>
              <Select
                isSearchable={false}
                className="react-select-container react-select-container--icon"
                classNamePrefix="react-select-elements"
                value={{ label: iconLabel, value: "" }}
                onChange={this.handleChangeDropdown}
                options={options}
              />
            </div>
          </div>
          <div className="column">
            <h2 className="client-card-subtittle">Primary contact</h2>
            <h3 className="client-card-subtittle-text client-card-subtittle-text--italic">
              {clientData.primaryContactPerson.name}
            </h3>
            <h2 className="client-card-subtittle">Primary contact Details</h2>
            <h3 className="client-card-subtittle-text">
              {clientData.primaryContactPerson.country_code +
                clientData.primaryContactPerson.phone}
            </h3>
            <h3 className="client-card-subtittle-text">
              {clientData.primaryContactPerson.email}
            </h3>
            <h2 className="client-card-subtittle">Projects</h2>
            {!isEmpty(clientData.projects) ? (
              <div className="row mx-0 align-items-start">
                <h3 className="client-card-subtittle-text client-card-subtittle-text--project-name">
                  <i className="fa fa-circle fa-yellow-circle"></i>
                  {!isEmpty(clientData.projects)
                    ? clientData.projects[0].name
                    : ""}
                </h3>
                {/* <h3 className="client-card-subtittle-text client-card-subtittle-text--project-name">
                  <i className="fa fa-circle fa-orange-circle"></i>
                  {!isEmpty(clientData.projects)
                    ? clientData.projects[0].name
                    : ""}
                </h3> */}
              </div>
            ) : (
              "No projects assigned"
            )}

            <h2 className="client-card-subtittle">Status</h2>
            <Toggle
              textClassName="client-card-subtittle-text"
              name="isStatusActive"
              text1={"Active"}
              text2={"Inactive"}
              onChange={this.handleOnChangeToggle(clientData)}
              defaultChecked={clientData.status === "ACTIVE" ? true : false}
            />
            {console.log()}
          </div>
        </div>
      </>
    );
  }
}

export default connect(null, { deleteClient, updateClientStatusWithId })(
  ClientCard
);
