import React, { Component } from "react";
import Select from "react-select";
import EditResourcesModal from "../resources/EditResourcesModal";
import DisplayResourcesModal from "../resources/DisplayResourcesModal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

const options = [{ value: "Delete", label: "Delete" }];

export default class AllProjectResourcesCard extends Component {
  constructor() {
    super();
    this.state = {
      isStatusActive: true,
      isEditModalOpen: false,
      isDisplayModalOpen: false,
    };
  }

  /*===========================================================================
      handlers
  ===========================================================================*/

  handleOnChangeToggle = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
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
      console.log("delete the card");
    }
  };

  /*===========================================================================
      main
  ===========================================================================*/
  render() {
    const { cardData } = this.props;
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
        {/* edit resources modal */}
        {isEditModalOpen && (
          <EditResourcesModal
            editCardData={cardData}
            isEditModalOpen={isEditModalOpen}
            onCloseModal={this.onCloseModal}
          />
        )}
        {/* display resources modal */}
        {isDisplayModalOpen && (
          <DisplayResourcesModal
            editCardData={cardData}
            isDisplayModalOpen={isDisplayModalOpen}
            onCloseModal={this.onCloseModal}
          />
        )}
        {/* client resources content  */}
        <div className="web-client-card-div">
          <div className="row mx-0 flex-nowrap justify-content-between align-items-start">
            <div className="row mx-0 flex-nowrap align-items-start">
              <div className="web-client-icon web-client-icon--resource">
                {/*<i className="fa fa-circle fa-green-circle"></i>*/}
                <img
                  src={require("../../../assets/img/dummy/new-square-profile-img.png")}
                  //src={require("../../../assets/img/dummy/resource-without-border.svg")}
                  //src={require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg")}
                  alt="person"
                  className="img-wh-100"
                />
              </div>
              <div className="column">
                <h3 className="font-24-bold color-offwhite">Jen Doe</h3>
                <h3 className="reasource-card-tasks reasource-card-tasks--allProjectResourcesCard">
                  Designer
                </h3>
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
            <Select
              isSearchable={false}
              className="react-select-container react-select-container--icon"
              classNamePrefix="react-select-elements"
              value={{ label: iconLabel, value: "" }}
              onChange={this.handleChangeDropdown}
              options={options}
            />
          </div>
          <h3 className="client-card-subtittle">Tasks</h3>
          <div className="row web-reasource-circle-div justify-content-around">
            <div>
              <h5 className="web-reasource-circle1">12</h5>
              <h5 className="client-card-subtittle-text">Total</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--2">
                12
              </h5>
              <h5 className="client-card-subtittle-text">Ongoing</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--3">
                0
              </h5>
              <h5 className="client-card-subtittle-text">Pending</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--4">
                0
              </h5>
              <h5 className="client-card-subtittle-text">Completed</h5>
            </div>
          </div>
          <div className="column">
            <h3 className="client-card-subtittle">Hours spent</h3>
            <h5 className="client-card-subtittle-text">44 H 23 M</h5>
          </div>
          <h3 className="client-card-subtittle">efficiency rate</h3>
          <h5 className="client-card-subtittle-text pb-0">Average</h5>
        </div>
      </>
    );
  }
}
