import React from "react";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { updateProject } from "./../../../store/actions/projectAction";

class AllProjectResourcesAddMemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectOption: "",
      displayListSelected: [],
      options: [
        { value: "John", label: "John" },
        { value: "Anna", label: "Anna" },
        { value: "Paul", label: "Paul" },
      ],
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

    let defaultMemeber = !isEmpty(singleProjectData.resources)
      ? singleProjectData.resources.map((user) => ({
          value: user._id,
          label: user.firstName,
        }))
      : [];
    this.setState({
      options: newArray,
      displayListSelected: defaultMemeber,
      selectOption: defaultMemeber,
    });
    // console.log(allResources);
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

    if (!isEmpty(singleProjectData.resources)) {
      singleProjectData.resources.map((user, index) => {
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

    console.log(`Option selected:`, selectedOption);
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
    formData.resources = newArray;

    this.props.updateProject(
      singleProjectData._id,
      formData,
      this.callBackUpdateProject
    );
  };

  render() {
    const { open, displayListSelected } = this.state;

    return (
      <div>
        <GreenButtonSmallFont
          onClick={this.onOpenModal}
          text="Add Member"
          extraClassName="add-discussion-btn"
        />
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--discussion",
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
                  text="Add new Member"
                  path="all-project-add-new-member"
                  extraClassName="all-project-add-new-member-btn"
                />
                <GreenButtonSmallFont
                  text="Save"
                  onClick={this.handleOnClickSave}
                  extraClassName="all-project-add-member-save-btn"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   allResources: state.resources.allResources,
// });

export default connect(null, { updateProject })(
  AllProjectResourcesAddMemberModal
);
