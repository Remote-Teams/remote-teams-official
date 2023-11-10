import React, { Component } from "react";
import PageTitle from "../common/PageTitle";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
// import GrayButtonSmallFont from "../common/GrayButtonSmallFont";

class LoginFlowDashboardAddMembersDayOffsOLD extends Component {
  constructor() {
    super();
    this.state = {
      displayColumnTitle: "",
      memberTypes: [
        {
          memberDayOffsColmTitle: "fulltime member day offs",
          counter: [
            {
              title: "Annual paid leaves",
              value: 17,
            },
            {
              title: "Medical leave",
              value: 7,
            },
            {
              title: "Work from home per month",
              value: 2,
            },
          ],
        },
        {
          memberDayOffsColmTitle: "freelancers day offs",
          counter: [
            {
              title: "Annual paid leaves",
              value: 0,
            },
            { title: "Medical leave", value: 0 },
            { title: "Work from home per month", value: 0 },
          ],
        },
      ],
    };
  }

  /*=======================================================
      handlers
  =======================================================*/

  handleOnChangeEditColmTitle = (index) => (e) => {
    let memberTypes = this.state.memberTypes;

    memberTypes[index].memberDayOffsColmTitle = e.target.value;

    this.setState({ memberTypes });
  };

  handleOnClickMemberType = (index) => {
    let memberTypes = this.state.memberTypes;

    let obj = {
      memberDayOffsColmTitle: "member type title",
      counter: [
        {
          title: "Annual paid leaves",
          value: 0,
        },
        { title: "Medical leave", value: 0 },
        { title: "Work from home per month", value: 0 },
      ],
    };

    // push object to last
    // memberTypes.push(obj);

    // push object to first
    memberTypes.unshift(obj);
    this.setState({ memberTypes, displayColumnTitle: 0 });
  };

  handleOnClickEditIcon = (index) => (e) => {
    this.setState({
      displayColumnTitle: index,
    });
  };

  handleOnClickDeleteIcon = (index) => (e) => {
    let memberTypes = this.state.memberTypes;
    memberTypes.splice(index, 1);

    this.setState({ memberTypes });
  };

  handleOnClickSaveIcon = (e) => {
    this.setState({
      displayColumnTitle: "",
    });
    console.log("saved data:", this.state);
  };

  handleOnClickDiscardIcon = () => {
    this.setState({
      displayColumnTitle: "",
    });
  };

  handleOnChangeEditColmCounterTitle = (idMain, idCounter) => (e) => {
    let memberTypes = this.state.memberTypes;
    memberTypes[idMain].counter[idCounter].title = e.target.value;

    this.setState({ memberTypes });
  };

  handleCounterChange = (idMain, idCounter) => (e) => {
    let memberTypes = this.state.memberTypes;
    memberTypes[idMain].counter[idCounter].value = e.target.validity.valid
      ? e.target.value
      : 0;

    this.setState({ memberTypes });
  };

  handleCounterMinus = (indexMain, indexCounter) => (e) => {
    let memberTypes = this.state.memberTypes;
    let value = memberTypes[indexMain].counter[indexCounter].value;
    value = value - 1;
    if (value < 0) {
      value = 0;
    }
    memberTypes[indexMain].counter[indexCounter].value = value;
    this.setState({ memberTypes });
  };

  handleCounterPlus = (indexMain, indexCounter) => (e) => {
    let memberTypes = this.state.memberTypes;
    let value = memberTypes[indexMain].counter[indexCounter].value;
    console.log(value + 1);
    value = value + 1;

    memberTypes[indexMain].counter[indexCounter].value = value;
    this.setState({ memberTypes });
  };

  handleOnClickAddDayOffType = (indexMain) => (e) => {
    let memberTypes = this.state.memberTypes;
    let obj = {
      title: "Day off type",
      value: 0,
    };
    memberTypes[indexMain].counter.push(obj);
    this.setState({ memberTypes, displayColumnTitle: indexMain });
  };

  /*=======================================================
      main
  =======================================================*/
  render() {
    const { displayColumnTitle } = this.state;
    let indexMemberType = "";
    return (
      <div className="login-member-day-offs">
        {/* page title */}
        <PageTitle title="member day offs" />

        <div className="login-member-day-offs__content">
          {/* add member type button */}
          <GreenButtonSmallFont
            text="+ Member Type"
            onClick={this.handleOnClickMemberType}
          />

          {/* content */}
          <div className="row mx-0">
            {/* counter column */}
            {this.state.memberTypes.map((data, index) => (
              <div key={index} className="login-member-day-offs__content-colm">
                <div className="d-none">
                  {/* set member type index in variable */}
                  {(indexMemberType = index)}
                </div>

                {/* column title row */}
                <div className="login-member-day-offs__content-colm-title-row row mx-0">
                  {/* column title -- text*/}
                  <div className="login-member-day-offs__content-colm-title-div">
                    {displayColumnTitle !== index ? (
                      <h2 className="font-18-bold-space-light-uppercase">
                        {data.memberDayOffsColmTitle}
                      </h2>
                    ) : (
                      <InputFieldEmailTextPassword
                        containerClassName="container-login-flow-input container-login-flow-input--memberDayOffsInputTitle"
                        label=""
                        name={"memberDayOffsColmTitle"}
                        value={data.memberDayOffsColmTitle}
                        onChange={this.handleOnChangeEditColmTitle(index)}
                        type="text"
                      />
                    )}
                  </div>
                  {/* column title -- text end*/}

                  {/* column title -- icons*/}
                  {displayColumnTitle !== index ? (
                    <div className="row mx-0">
                      <i
                        className="fa fa-pencil mr-3"
                        aria-hidden="true"
                        onClick={this.handleOnClickEditIcon(index)}
                      ></i>
                      <i
                        className="fa fa-trash"
                        onClick={this.handleOnClickDeleteIcon(index)}
                      ></i>
                    </div>
                  ) : (
                    <div className="row mx-0">
                      <i
                        className="fa fa-save mr-3"
                        onClick={this.handleOnClickSaveIcon}
                      ></i>
                      <i
                        className="fa fa-times"
                        onClick={this.handleOnClickDiscardIcon}
                      ></i>
                    </div>
                  )}
                  {/* column title -- icons end*/}
                </div>
                {/* column title row end */}

                {/* counter */}
                {data.counter.map((element, index) => (
                  <div
                    key={index}
                    className="row mx-0 flex-nowrap login-member-day-offs__content-colm-dataRow"
                  >
                    {displayColumnTitle === indexMemberType ? (
                      <>
                        {(element.title === "Annual paid leaves" ||
                          element.title === "Medical leave" ||
                          element.title === "Work from home per month") && (
                          <h3 className="font-24-semiBold">{element.title}</h3>
                        )}
                        {element.title !== "Annual paid leaves" &&
                          element.title !== "Medical leave" &&
                          element.title !== "Work from home per month" && (
                            <InputFieldEmailTextPassword
                              containerClassName="container-login-flow-input container-login-flow-input--memberDayOffsInput"
                              label=""
                              id={`title${indexMemberType}${index}`}
                              name="title"
                              value={element.title}
                              onChange={this.handleOnChangeEditColmCounterTitle(
                                indexMemberType,
                                index
                              )}
                              type="text"
                              autoFocus={true}
                            />
                          )}
                        {/*  edit main count */}
                        <div className="row mx-0 flex-nowrap login-member-day-offs__content-colm-counterRow">
                          <i
                            className="fa fa-minus"
                            onClick={this.handleCounterMinus(
                              indexMemberType,
                              index
                            )}
                          ></i>
                          <input
                            id={`count${indexMemberType}${index}`}
                            type="text"
                            pattern="[0-9]*"
                            maxLength="2"
                            value={element.value}
                            onChange={this.handleCounterChange(
                              indexMemberType,
                              index
                            )}
                          />
                          <i
                            className="fa fa-plus"
                            onClick={this.handleCounterPlus(
                              indexMemberType,
                              index
                            )}
                          ></i>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* display counter title and count */}
                        <h3 className="font-24-semiBold">{element.title}</h3>
                        <div className="row mx-0 flex-nowrap login-member-day-offs__content-colm-counterRow">
                          {/* <i className="fa fa-minus opacity-0"></i> */}
                          <input
                            type="text"
                            value={element.value}
                            readOnly
                            disabled
                          />
                          {/* <i className="fa fa-plus opacity-0"></i> */}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {/* counter end */}
                {/* <GrayButtonSmallFont
                  text="+ Day Off Type"
                  onClick={this.handleOnClickAddDayOffType(indexMemberType)}
                /> */}
              </div>
            ))}
            {/* counter column end */}
          </div>
          {/* content end */}
        </div>
      </div>
    );
  }
}

export default LoginFlowDashboardAddMembersDayOffsOLD;
