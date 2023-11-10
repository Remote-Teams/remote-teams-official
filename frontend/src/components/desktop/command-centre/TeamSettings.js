import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import Toggle from "../common/Toggle";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  sendInviteMailAgain,
  inviteTeamMember,
  updateResourceAction,
} from "./../../../store/actions/authAction";
import Toast from "light-toast";
import MemberDetailsNew from "./MemberDetailsNew";
import store from "../../../store/store";
import { SET_SINGLE_RSOURCE_DATA } from "./../../../store/types";
import Select from "react-select";
import { validateTeamSettings } from "./../../../store/validations/commandCenterValidation/TeamSettingsValidation";

const dummyData = [1, 2, 3];

const options = [
  { value: "Admin", label: "Admin" },
  { value: "Project manager", label: "Project manager" },
  { value: "Resource", label: "Resource" },
];

export default function TeamSettings() {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    isToggle: true,
    accessRole: "",
  });

  const [open, setOpen] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [allUsersInvite, setAllUsersInviteLinks] = useState([]);
  const [errors, setErrors] = useState({});
  // REDUCERS

  const allResources = useSelector((state) => state.resources.allResources);
  const allUsersInviteLinks = useSelector(
    (state) => state.auth.allUsersInviteLinks
  );

  useEffect(() => {
    if (!isEmpty(allResources)) {
      setAllUsers(allResources);
    } else {
      setAllUsers(allResources);
    }
  }, [allResources]);

  useEffect(() => {
    if (!isEmpty(allUsersInviteLinks)) {
      setAllUsersInviteLinks(allUsersInvite);
    } else {
      setAllUsersInviteLinks([]);
    }
  }, [allUsersInviteLinks]);
  /*========================================================
                   
                           handler
                          
      ==========================================================*/
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);

    const { errors, isValid } = validateTeamSettings(values);
    if (!isValid) {
      console.log(errors);
      setErrors(errors);
    } else {
      const formData = {
        recipients: [
          {
            email: values.email,
            firstName: values.fname,
            lastName: values.lname,
            profileImage:
              "/public/download?filename=file-2021-08-04T11:30:02.174Z.png",
            additionalInfo: {
              dateOfBirth: "",
              country_code: +1,
            },
            memberType: "FULLTIME",
            phone: "",
            location: "",
            // timezone: "",
            contract: {
              start_date: "",
              end_date: "",
              working_hrs_to: "",
              working_hrs_from: "",
              ctc: "",
              attachments: "",
            },
            demo: false,
            role: "2832d910-1b99-11ec-bd6f-0f68b5ee9fdd",
            dateOfJoining: new Date().toISOString(),
            jobTitle: "",
          },
        ],
      };
      dispatch(inviteTeamMember(formData));
    }
  };

  const toggleFunction = (userData) => (e) => {
    console.log(userData);

    const formData = userData;
    if (e.target.checked === true) {
      formData.status = "ACTIVE";
    } else {
      formData.status = "INACTIVE";
    }

    dispatch(updateResourceAction(formData._id, formData));
    // setValues({
    //   [e.target.name]: e.target.checked,
    // });
    // console.log(values.isToggle);
  };

  const onCloseModal = () => {
    setOpen(false);
    setEdit(false);
  };

  const handleClickInviteLink = (userData) => (e) => {
    console.log("Onclick invite link");
    console.log(userData);
    dispatch(sendInviteMailAgain({ email: userData.email }));
  };

  const handleEditDetails = (userData) => (e) => {
    console.log("handle edit detail");
    store.dispatch({
      type: SET_SINGLE_RSOURCE_DATA,
      payload: userData,
    });
    setOpen(true);
  };

  const handleChangeSelectRole = (selectedOption) => {
    setValues({ ...values, accessRole: selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  /*============================================================
                              renderAddMember
      ============================================================*/
  const renderAddMember = () => {
    return (
      <div className="team-settings-add-member-outer-block">
        <h5 className="font-18-bold team-settings-add-member-title">
          Invite new member
        </h5>
        <div className="team-settings-add-member-block ">
          <div className="row mx-0 align-items-start flex-nowrap justify-content-between">
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--teams-setting-name"
              name="fname"
              value={values.fname}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              error={!isEmpty(errors.fname) && errors.fname}
            />
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--teams-setting-name"
              name="lname"
              value={values.lname}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              error={!isEmpty(errors.lname) && errors.lname}
            />
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--team-settings-email"
              name="email"
              value={values.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              error={!isEmpty(errors.email) && errors.email}
            />
            <div>
              <Select
                className="react-select-container react-select-container--addMember react-select-container--teams-settings-role"
                classNamePrefix="react-select-elements"
                value={values.accessRole}
                onChange={handleChangeSelectRole}
                options={options}
                placeholder="Access role"
                isSearchable={false}
              />
              {errors.accessRole ? (
                <p className="error-message">{errors.accessRole}</p>
              ) : (
                <p className="error-message opacity-0"></p>
              )}
            </div>
            <button
              onClick={handleSave}
              className="team-settings-send-invitation-btn font-18-bold"
            >
              Send Invitation
            </button>
          </div>{" "}
        </div>
      </div>
    );
  };
  /*============================================================
                              renderTeamTable
  ============================================================*/

  const renderLinks = (userId) => {
    let filteredArray = [];
    if (!isEmpty(allUsersInviteLinks)) {
      filteredArray = allUsersInviteLinks.filter(
        (user) => user.userId === userId
      );
    }

    return !isEmpty(filteredArray) ? `${filteredArray[0].link}` : "";
  };

  const copyUrlHanlder = (link) => (e) => {
    navigator.clipboard.writeText(link);
    Toast.info("Link Copied", 3000);
  };
  const renderTeamTable = () => {
    return (
      <div>
        <div className="cmd-team-settings-table">
          <table>
            <thead>
              <tr>
                <th className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--team-setting">
                  Member name
                </th>
                <th className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--team-setting">
                  status
                </th>
                <th className="font-18-bold-space-light-uppercase font-18-bold-space-light-uppercase--team-setting">
                  invite link
                </th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="cmd-team-settings-table cmd-team-settings-table--tbody">
          <table>
            <tbody>
              {!isEmpty(allUsers) &&
                allUsers.map((data, index) => (
                  <Fragment key={index}>
                    <tr>
                      <td className="font-18-bold">{data.name}</td>
                      <td>
                        <Toggle
                          //textClassName="client-card-subtittle-text"
                          containerClassName="timesheet-toggle-all-project-history"
                          name="isToggle"
                          text1={"Active"}
                          text2={"Inactive"}
                          onChange={toggleFunction(data)}
                          defaultChecked={
                            data.status === "ACTIVE" ? true : false
                          }
                        />
                      </td>
                      <td className="font-18-bold">
                        {renderLinks(data._id) ===
                        "user is already ACTIVATED" ? (
                          "ACCOUNT ACTIVATED"
                        ) : (
                          <div className="row mx-0 align-items-start flex-nowrap justify-content-center team-settings-invite-link-div">
                            <img
                              src={require("../../../assets/img/icons/copy-icon.svg")}
                              alt="copy"
                            />
                            <span
                              onClick={copyUrlHanlder(renderLinks(data._id))}
                            >
                              {renderLinks(data._id)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="text-right">
                          {renderLinks(data._id) !==
                            "user is already ACTIVATED" && (
                            <button
                              className="team-settings-send-invitation-btn font-18-bold"
                              onClick={handleClickInviteLink(data)}
                            >
                              Send Invitation Again
                            </button>
                          )}

                          <button
                            className="team-settings-edit-btn font-18-bold"
                            onClick={handleEditDetails(data)}
                          >
                            <i className="fa fa-pencil" /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="empty-cell">
                      <td colSpan="100"></td>
                    </tr>
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <>
      <MemberDetailsNew
        open={open}
        onCloseModal={onCloseModal}
        setEdit={setEdit}
        edit={edit}
      />
      <div className="team-settings-main-div">
        <h2 className="font-24-bold">Manage your team on the workspace</h2>
        <h5 className="font-20-semiBold cmd-team-setting-subtitle">
          Add or Invite New members{" "}
        </h5>
        {renderAddMember()}
        <h5 className="font-18-bold cmd-team-setting-workspace-subtitle">
          Added on workspace
        </h5>
        {renderTeamTable()}
      </div>
    </>
  );
}
