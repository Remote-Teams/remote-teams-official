import React from "react";
import Select from "react-select";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import store from "../../../store/store";
import { SET_SELECTED_MEMBERS } from "./../../../store/types";
import Toast from "light-toast";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";

// const options = [
//   { value: "John", label: "John" },
//   { value: "Anna", label: "Anna" },
//   { value: "Paul", label: "Paul" },
// ];

class LoginFlowDashboardAddProjectAddMemberModal extends React.Component {
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

  /*===============================================================
                      Lifecycle Methods
  ================================================================*/
  componentDidMount() {
    console.log(this.props.allResources);
    let allResources = this.props.allResources;
    let newArray =
      !isEmpty(allResources) &&
      allResources.map((user) => ({
        value: user._id,
        label: user.firstName,
      }));
    this.setState({
      options: newArray,
    });
    console.log(allResources);
  }

  /*=================================================================
      handlers
  =================================================================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleChangeSelectClient = (selectedOption) => {
    this.setState({
      selectOption: selectedOption,
    });

    // add option to list if it's not present in list
    let newList = this.state.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      this.setState({
        displayListSelected: newList,
      });
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

  handleOnClickSave = () => {
    console.log(this.state);
    console.log(this.state.displayListSelected);
    const { displayListSelected } = this.state;
    if (!isEmpty(displayListSelected)) {
      store.dispatch({
        type: SET_SELECTED_MEMBERS,
        payload: this.state.displayListSelected,
      });
      this.setState({
        open: false,
      });
    } else {
      Toast.info("Please select member", 3000);
    }
  };

  render() {
    const { open, displayListSelected } = this.state;
    return (
      <div>
        <div className="create-project-add-member-outer-div">
          <div
            className="create-project-add-member-btn"
            onClick={this.onOpenModal}
          >
            <i className="fa fa-plus"></i>
          </div>
        </div>
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
            <div className="add-meeting-title-div mb-30 pt-0">
              <h2 className="add-meeting-title  text-center">Add Member</h2>
            </div>
            {/*<h1 className="font-38-semiBold text-center mb-40">Add Member</h1>*/}
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
                  //extraClassName="add-project-new-member-btn"
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
const mapStateToProps = (state) => ({
  allResources: state.resources.allResources,
});

export default connect(
  mapStateToProps,
  {}
)(LoginFlowDashboardAddProjectAddMemberModal);
