import React, { Component, Fragment } from "react";
import InputFieldEmailTextPassword from "./../common/InputFieldEmailTextPassword";
// import isEmpty from "../../../store/validations/is-empty";
import UploadImage from "../common/UploadImage";
import GreenButtonSmallFont from "./../common/GreenButtonSmallFont";
import { connect } from "react-redux";
import {
  fileUpload,
  updateUserAction,
} from "./../../../store/actions/resourcesAction";

export class ProfileDetailsTab extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      emailAddress: "",
      lastName: "",
      userRole: "",
      fileName:
        "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg",
    };
  }

  /*============================================
            Lifecycle Methods
  =============================================*/
  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("UserData"));
    this.setState({
      firstName: userData.firstName,
      emailAddress: userData.email,
      lastName: userData.lastName,
      userRole: userData.role.name,
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmitDetails = (e) => {
    e.preventDefault();
    console.log(this.state);
    let userData = JSON.parse(localStorage.getItem("UserData"));
    userData.firstName = this.state.firstName;
    userData.lastName = this.state.lastName;
    userData.profileImage = this.state.profileImg;
    this.props.updateUserAction(userData, userData.id);
  };

  callBackFileUpload = (data) => {
    console.log(data);
    this.setState({
      profileImg: data.fileUrl,
    });
  };

  handleOnChangeUploadImg = (e) => {
    e.preventDefault();
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);
    this.setState({
      fileName:
        e.target.files.length > 0
          ? URL.createObjectURL(e.target.files[0])
          : e.target.value,
    });
    this.props.fileUpload(data, this.callBackFileUpload);
  };

  render() {
    return (
      <Fragment>
        <div className="profile_details_main_container">
          <form
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmitDetails}
          >
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="First Name"
                placeholder="First Name"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleChange}
                type="text"
                //placeholder="Ex. Akshay"
              />
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="EMAIL ADDRESS"
                name="emailAddress"
                value={this.state.emailAddress}
                onChange={this.handleChange}
                type="text"
                placeholder="Ex. akshay@mgail.com"
              />
              <div>
                <GreenButtonSmallFont
                  onClick={this.handleSubmitDetails}
                  text={"Save"}
                />
              </div>
            </div>
            <div>
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="LAST NAME"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleChange}
                type="text"
                placeholder="Ex. Nagargoje"
              />
              <InputFieldEmailTextPassword
                containerClassName="container-login-flow-input container-login-flow-input--forms"
                //label="ROLE"
                name="userRole"
                value={this.state.userRole}
                onChange={this.handleChange}
                type="text"
                placeholder=" Ex. Admin"
              />
            </div>
            <div>
              <UploadImage
                containerClassName="upload-img__mainBlock upload-img__mainBlock--profile upload-img__mainBlock--new-client-img"
                buttonName="+ Upload Image"
                fileNameValue={this.state.fileName}
                acceptType="image/jpeg, image/png"
                onChange={this.handleOnChangeUploadImg}
              />
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { fileUpload, updateUserAction })(
  ProfileDetailsTab
);
