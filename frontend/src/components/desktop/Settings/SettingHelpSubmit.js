import React, { Component } from "react";
import TextareaField from "../common/TextareaField";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import { submitQuery } from "./../../../store/actions/supportAction";
import { connect } from "react-redux";

class SettingHelpSubmit extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  callBackAdd = (status) => {
    if (status === 200) {
      this.setState({
        description: "",
      });
    }
  };
  handleSubmit = () => {
    console.log(this.state);

    const formData = {
      description: this.state.description,
      attachments: [{}],
      additionalObject: {},
    };

    this.props.submitQuery(formData, this.callBackAdd);
  };

  render() {
    return (
      <div className="setting-submit-div">
        <TextareaField
          containerClassName="container-login-flow-textarea container-login-flow-textarea--submit"
          name="description"
          value={this.state.description}
          onChange={this.handleChange}
        />
        <GreenButtonSmallFont
          text="Post"
          onClick={this.handleSubmit}
          extraClassName="setting-submit-btn-div"
        />
      </div>
    );
  }
}

export default connect(null, { submitQuery })(SettingHelpSubmit);
