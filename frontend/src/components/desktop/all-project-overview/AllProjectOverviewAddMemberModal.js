import React from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  updateProject,
  getProjectDataById,
} from "./../../../store/actions/projectAction";

class AllProjectOverviewAddMemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectOption: "",
      displayListSelected: [],
      allResources: this.props.allResources,
      options: [],
    };
  }

  /*=================================================================
      handlers
  =================================================================*/

  onOpenModal = () => {
    let allResources = this.props.allResources;
    let singleProjectData = this.props.singleProjectData;
    let newArray =
      !isEmpty(allResources) &&
      allResources.map((user) => ({
        value: user._id,
        label: user.firstName,
      }));
    this.setState({
      options: newArray,
    });

    let defaultMemeber = !isEmpty(singleProjectData.resourcesData)
      ? singleProjectData.resourcesData.map((user) => ({
          value: user._id,
          label: user.firstName,
        }))
      : [];
    this.setState({
      options: newArray,
      displayListSelected: defaultMemeber,
      // selectOption: defaultMemeber,
    });
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleChangeSelectClient = (selectedOption) => {
    const { singleProjectData } = this.props;
    this.setState({
      selectOption: selectedOption,
    });

    // add option to list if it's not present in list
    let newList = this.state.displayListSelected;

    if (!isEmpty(singleProjectData.resourcesData)) {
      singleProjectData.resourcesData.map((user, index) => {
        if (
          newList.indexOf(selectedOption) === -1 &&
          selectedOption.value !== user._id
        ) {
          newList.push(selectedOption);
          this.setState({
            displayListSelected: newList,
          });
        }
      });
    } else {
      if (newList.indexOf(selectedOption) === -1) {
        newList.push(selectedOption);
        this.setState({
          displayListSelected: newList,
        });
      }
    }
    // console.log(`Option selected:`, selectedOption);
  };

  handleRemoveMember = (index) => (e) => {
    let newList = this.state.displayListSelected;
    newList.splice(index, 1);
    this.setState({
      displayListSelected: newList,
    });
  };

  callBackUpdateProject = (status) => {
    if (status === 200) {
      this.props.getProjectDataById(this.props.singleProjectData._id);
      this.setState({
        open: false,
      });
    }
  };

  handleOnClickSave = () => {
    const { singleProjectData } = this.props;
    const { displayListSelected } = this.state;
    let newArray = [];
    if (!isEmpty(displayListSelected)) {
      let data = displayListSelected.map((member) => member.value);
      newArray = data;
    }

    let formData = singleProjectData;
    formData.resourcesData = newArray;
    formData.resources = newArray;
    this.props.updateProject(
      singleProjectData._id,
      formData,
      "",
      "",
      "",
      this.callBackUpdateProject,
      "Project Updated"
    );
  };

  render() {
    const { open, displayListSelected } = this.state;
    return (
      <div>
        {/* <div className="all-project-overview-add-member-btn-div">
          <GrayButtonSmallFont
            onClick={this.onOpenModal}
            //text="+ Add Member"
            text="+"
            extraClassName="all-project-overview-add-member-btn"
          />
          <span className="font-14-regular-italic">Add</span>
        </div> */}

        <GrayButtonSmallFont
          onClick={this.onOpenModal}
          text="+"
          extraClassName="all-project-overview-add-member-btn-new"
        />

        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--createProjectAddMemberModal",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="create-project-add-member-modal-content">
            {/*<h1 className="font-32-extraBold-letterspace text-center mb-40">
              Add Member
        </h1>*/}
            <h2 className="add-meeting-title add-meeting-title--disucssion">
              Add Member
            </h2>

            {/* select */}
            <AddMemberSelectAndDisplayList
              selectedOptionValue={this.state.selectOption}
              handleChangeSelectClient={this.handleChangeSelectClient}
              options={this.state.options}
              displayListSelected={this.state.displayListSelected}
              handleRemoveMember={this.handleRemoveMember}
            />
            {/* save */}
            <div className="row mx-0">
              <div className="col-12 text-right">
                <GrayLinkSmallFont
                  //text="+ New Member"
                  path="all-project-add-new-member"
                  text="Add new Member"
                  extraClassName="all-project-add-new-member-btn"
                />

                <GreenButtonSmallFont
                  text="Save"
                  onClick={this.handleOnClickSave}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { updateProject, getProjectDataById })(
  AllProjectOverviewAddMemberModal
);
