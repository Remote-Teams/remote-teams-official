import React, { Component } from "react";
import Select from "react-select";
import Toggle from "../common/Toggle";
import EditResourcesModal from "./EditResourcesModal";
import { connect } from "react-redux";
import {
  deleteResourceAction,
  updateResourceAction,
} from "./../../../store/actions/resourcesAction";
import store from "../../../store/store";
import { SET_API_STATUS } from "./../../../store/types";
import DisplayResourcesModal from "./DisplayResourcesModal";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";

const options = [{ value: "Delete", label: "Delete" }];

class ResourcesCard extends Component {
  constructor(props) {
    super(props);
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
    let data = this.props.cardData;
    if (e.target.checked === true) {
      data.status = "ACTIVE";
      this.props.updateResourceAction(data._id, data);
    } else {
      data.status = "INACTIVE";
      this.props.updateResourceAction(data._id, data);
    }
  };

  onCloseModal = () => {
    this.setState({
      isEditModalOpen: false,
      isDisplayModalOpen: false,
    });
  };

  handleOnClickViewEditCard = (val) => (e) => {
    if (val === "Edit") {
      store.dispatch({
        type: SET_API_STATUS,
        payload: {},
      });
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
    const { cardData } = this.props;
    if (selectedOption.value === "Delete") {
      console.log("delete the card");
      this.props.deleteResourceAction(cardData._id);
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
        alt=""
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
    let upcomingCount = [];
    let pendingCount = [];
    let ongoingCount = [];
    let completedCount = [];
    if (!isEmpty(cardData.taskGroup)) {
      upcomingCount = cardData.taskGroup.filter(
        (task) => task._id === "UPCOMING"
      );
      pendingCount = cardData.taskGroup.filter(
        (task) => task._id === "PENDING"
      );
      ongoingCount = cardData.taskGroup.filter(
        (task) => task._id === "ONGOING"
      );
      completedCount = cardData.taskGroup.filter(
        (task) => task._id === "COMPLETED"
      );
    }
    // console.log(completedCount.count);

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
        {/* edit resources modal */}
        {isDisplayModalOpen && (
          <DisplayResourcesModal
            editCardData={cardData}
            isDisplayModalOpen={isDisplayModalOpen}
            onCloseModal={this.onCloseModal}
          />
        )}
        {/* client resources content  */}
        <div className={`web-client-card-div ${this.props.extraClassName}`}>
          <div className="row mx-0 flex-nowrap justify-content-between align-items-start">
            <div className="row mx-0 flex-nowrap align-items-start">
              <div className="web-client-icon web-client-icon--resource">
                {/*<i className="fa fa-circle fa-green-circle"></i>*/}
                <img
                  //src={require("../../../assets/img/dummy/resource-without-border.svg")}
                  src={require("../../../assets/img/dummy/new-resources-profile-img.png")}
                  alt="person"
                  className="img-wh-100"
                />
              </div>
              <div className="column">
                <h3 className="font-18-bold">{cardData.name}</h3>
                <h3 className="reasource-card-tasks">Basic</h3>
                <div className="row mx-0 flex-nowrap card-view-edit-buttons-block pt-10">
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
              <h5 className="web-reasource-circle1">
                {!isEmpty(upcomingCount) ? upcomingCount[0].count : 0}
              </h5>
              {/*<h5 className="client-card-subtittle-text">Upcoming</h5>*/}
              <h5 className="client-card-subtittle-text">Total</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--2">
                {!isEmpty(ongoingCount) ? ongoingCount[0].count : 0}
              </h5>
              <h5 className="client-card-subtittle-text">Ongoing</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--3">
                {!isEmpty(pendingCount) ? pendingCount[0].count : 0}
              </h5>
              <h5 className="client-card-subtittle-text">Pending</h5>
            </div>
            <div>
              <h5 className="web-reasource-circle1 web-reasource-circle1--4">
                {!isEmpty(completedCount) ? completedCount[0].count : 0}
              </h5>
              <h5 className="client-card-subtittle-text">Completed</h5>
            </div>
          </div>
          <div className="column">
            {/*<h3 className="client-card-subtittle">Project</h3>*/}
            <h3 className="client-card-subtittle">on products</h3>
            {!isEmpty(cardData.projects)
              ? cardData.projects.map((projectName, index) => {
                  return (
                    <h5 key={index} className="client-card-subtittle-text">
                      <i className="fa fa-circle fa-yellow-circle"></i>
                      {projectName}
                    </h5>
                  );
                })
              : "No projects assign"}

            {/* <h5 className="client-card-subtittle-text">
              <i className="fa fa-circle fa-orange-circle"></i>Throtl
            </h5> */}
          </div>
          <h3 className="client-card-subtittle">NEXT AVAILABLE FROM</h3>
          <div className="row mx-0 justify-content-between resource-card-text-next">
            <h5 className="client-card-subtittle-text">23rd january</h5>
            <h5 className="client-card-subtittle-text">15:00 pm</h5>
          </div>
          <h3 className="client-card-subtittle">status</h3>
          <Toggle
            textClassName="client-card-subtittle-text"
            name="isStatusActive"
            text1={"Active"}
            text2={"Inactive"}
            onChange={this.handleOnChangeToggle}
            defaultChecked={cardData.status === "ACTIVE" ? true : false}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  deleteResourceAction,
  updateResourceAction,
})(ResourcesCard);
