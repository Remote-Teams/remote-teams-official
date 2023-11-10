import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-responsive-modal";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import TextareaField from "../common/TextareaField";
import { connect } from "react-redux";
import { createToDo } from "./../../../store/actions/dashboardAction";

class DashboardAddNewTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "",
      desc: "",
      dueDate: new Date(),
    };
  }

  /*=================================================================
      handlers
  =================================================================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false, title: "", desc: "", dueDate: new Date() });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        dueDate: new Date(),
      });
    } else {
      this.setState({
        dueDate: date,
      });
    }
  };

  callBackAddTodo = (status) => {
    if (status === 200) {
      this.setState({
        open: false,
      });
    }
  };

  handleOnClickAdd = () => {
    console.log(this.state);
    const formData = {
      name: this.state.title,
      desc: this.state.desc,
      dueDate: this.state.dueDate.toISOString(),
      status: "NOT_STARTED",
    };
    this.props.createToDo(formData, this.callBackAddTodo);
  };

  render() {
    const { open } = this.state;
    return (
      <div>
        <GreenButtonSmallFont text="Add New" onClick={this.onOpenModal} />
        <Modal
          open={open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addTaskDashboard",
            closeButton: "customCloseButton",
          }}
        >
          {/* close modal */}
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="add-task-dashboard-content-div">
            <div className="add-meeting-title-div pt-0">
              {/*<h1 className="add-meeting-title">Add To Do</h1>*/}
              <h1 className="add-meeting-title">Add New To-Do</h1>
            </div>
            <div className="row mx-0 pt-65">
              <div className="col-7 px-0">
                <InputFieldEmailTextPassword
                  containerClassName="container-login-flow-input container-login-flow-input--forms"
                  //label="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  placeholder="Title"
                  type="text"
                />
              </div>
              <div className="col-5 px-0">
                <div className="date-picker-common datepicker-nav-arrow-login-dash">
                  {/*<h3 className="font-18-bold-space-light-uppercase mb-20">
                    Due date
        </h3>*/}
                  <DatePicker
                    minDate={new Date()}
                    selected={this.state.dueDate}
                    onChange={this.handleChangeDate}
                    placeholderText="Due date"
                  />
                  <div className="datepeacker-date-icon-div">
                    <img
                      src={require("../../../assets/img/icons/new-date-icon.svg")}
                      alt="date"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 px-0">
              <TextareaField
                containerClassName="container-login-flow-textarea container-login-flow-textarea--addTaskDashboard"
                //label="Description"
                name="desc"
                value={this.state.desc}
                onChange={this.handleChange}
                placeholder="Description"
              />
            </div>
            {/* save */}
            <div className="row mx-0">
              <div className="col-12 text-center">
                <GreenButtonSmallFont
                  text="Add"
                  onClick={this.handleOnClickAdd}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { createToDo })(DashboardAddNewTaskModal);
