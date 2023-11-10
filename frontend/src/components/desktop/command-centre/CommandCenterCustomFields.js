import React, { useEffect, useState } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import AddNewCustomFields from "./AddNewCustomFields";
import EditCustomFields from "./EditCustomFields";
import { useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { deleteCustomField } from "./../../../store/actions/commandCenterAction";
import { useDispatch } from "react-redux";

export default function CommandCenterCustomFields() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allCustomFields: [],
    projectFields: [],
    memberFields: [],
    clientFields: [],
  });

  const allCustomFields = useSelector(
    (state) => state.commandCenter.allCustomFields
  );

  useEffect(() => {
    if (!isEmpty(allCustomFields)) {
      let projectFields = allCustomFields.filter(
        (element) => element.entity === "PROJECT"
      );

      let memberFields = allCustomFields.filter(
        (element) => element.entity === "MEMBER"
      );
      let clientFields = allCustomFields.filter(
        (element) => element.entity === "CLIENT"
      );

      setValues({
        ...values,
        allCustomFields: allCustomFields,
        projectFields: projectFields,
        memberFields: memberFields,
        clientFields: clientFields,
      });
    } else {
      setValues({
        ...values,
        allCustomFields: [],
        projectFields: [],
        memberFields: [],
        clientFields: [],
      });
    }
  }, [allCustomFields]);

  /*============================================
                      handler
  ============================================*/

  //const handleEdit = () => {
  //  console.log("Onclick edit");
  //};

  const callBackDelete = (status) => {};

  const handleDelete = (customFieldData) => (e) => {
    e.preventDefault();
    console.log("Onclick delete");
    dispatch(deleteCustomField(customFieldData._id, callBackDelete));
  };
  const renderProject = () => {
    const { projectFields } = values;

    return (
      <div className="cumstom-fields-col-1">
        <div className="row mx-0 align-items-center justify-content-between custom-fields-title-div">
          <h5 className="coustom-fields-title">
            <img
              src={require("../../../assets/img/icons/custom-fields-icon1.svg")}
              alt=""
              className="custom-fields-play-icon-img"
            />
            <span>Projects</span>
          </h5>
          <AddNewCustomFields entity="PROJECT" />
        </div>
        <div className="command-center-custom-fields-content-div ">
          {!isEmpty(projectFields) ? (
            projectFields.map((data, index) => {
              return (
                <div key={index}>
                  <div className="command-center-custom-fields-cards  align-items-center justify-content-between">
                    <div>
                      <h4 className="font-24-bold">{data.name}</h4>
                      <h5 className="command-center-custom-fields-cards-text1">
                        {data.type}
                      </h5>
                    </div>
                    <div className="row mx-0 align-items-center">
                      {/*<button
                        className="command-center-custom-fields-cards-edit-btn"
                        onClick={handleEdit}
                      >
                        <i className="fa fa-pencil" />
                        Edit
                      </button>*/}
                      <EditCustomFields customFieldData={data} />
                      <button
                        className="command-center-custom-fields-cards-edit-btn command-center-custom-fields-cards-edit-btn--delete"
                        onClick={handleDelete(data)}
                      >
                        <i className="fa fa-trash" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <img
                src={require("../../../assets/img/command-centre/custom-fields-no-project-icon.png")}
                alt=""
                className="custom-fields-no-flelds-icon-img"
              />
              <h5 className="custom-fields-not-found-text">
                No fields added yet
              </h5>
              <AddNewCustomFields entity="PROJECT" />{" "}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMembers = () => {
    const { memberFields } = values;
    return (
      <div className="cumstom-fields-col-1 cumstom-fields-col-1--2">
        <div className="row mx-0 align-items-center justify-content-between custom-fields-title-div">
          <h5 className="coustom-fields-title">
            <img
              src={require("../../../assets/img/icons/custom-fields-icon2.svg")}
              alt=""
              className="custom-fields-play-icon-img"
            />
            <span>Members</span>
          </h5>
          <AddNewCustomFields entity="MEMBER" />
        </div>
        <div className="command-center-custom-fields-content-div">
          {!isEmpty(memberFields) ? (
            memberFields.map((data, index) => {
              return (
                <div key={index}>
                  <div className="command-center-custom-fields-cards  align-items-center justify-content-between">
                    <div>
                      <h4 className="font-24-bold">{data.name}</h4>
                      <h5 className="command-center-custom-fields-cards-text1">
                        {data.type}
                      </h5>
                    </div>
                    <div className="row mx-0 align-items-center">
                      {/*<button
                        className="command-center-custom-fields-cards-edit-btn"
                        onClick={handleEdit}
                      >
                        <i className="fa fa-pencil" />
                        Edit
                      </button>*/}
                      <EditCustomFields customFieldData={data} />
                      <button
                        className="command-center-custom-fields-cards-edit-btn command-center-custom-fields-cards-edit-btn--delete"
                        onClick={handleDelete(data)}
                      >
                        <i className="fa fa-trash" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <img
                src={require("../../../assets/img/command-centre/custom-fields-no-member-icon.png")}
                alt=""
                className="custom-fields-no-flelds-icon-img"
              />
              <h5 className="custom-fields-not-found-text">
                No fields added yet
              </h5>
              <AddNewCustomFields entity="MEMBER" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderClients = () => {
    const { clientFields } = values;
    return (
      <div className="cumstom-fields-col-1 cumstom-fields-col-1--3">
        <div className="row mx-0 align-items-center justify-content-between custom-fields-title-div">
          <h5 className="coustom-fields-title">
            <img
              src={require("../../../assets/img/icons/custom-fields-icon3.svg")}
              alt=""
              className="custom-fields-play-icon-img"
            />
            <span>Clients</span>
          </h5>
          <AddNewCustomFields entity="CLIENT" />
        </div>
        <div className="command-center-custom-fields-content-div">
          {!isEmpty(clientFields) ? (
            clientFields.map((data, index) => {
              return (
                <div key={index}>
                  <div className="command-center-custom-fields-cards  align-items-center justify-content-between">
                    <div>
                      <h4 className="font-24-bold">{data.name}</h4>
                      <h5 className="command-center-custom-fields-cards-text1">
                        {data.type}
                      </h5>
                    </div>
                    <div className="row mx-0 align-items-center">
                      {/*<button
                        className="command-center-custom-fields-cards-edit-btn"
                        onClick={handleEdit}
                      >
                        <i className="fa fa-pencil" />
                        Edit
                      </button>*/}
                      <EditCustomFields customFieldData={data} />
                      <button
                        className="command-center-custom-fields-cards-edit-btn command-center-custom-fields-cards-edit-btn--delete"
                        onClick={handleDelete(data)}
                      >
                        <i className="fa fa-trash" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <img
                src={require("../../../assets/img/command-centre/custom-fields-no-client-icon.png")}
                alt=""
                className="custom-fields-no-flelds-icon-img"
              />
              <h5 className="custom-fields-not-found-text">
                No fields added yet
              </h5>
              <AddNewCustomFields entity="CLIENT" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-40">
      <h3 className="font-24-bold">Here are the custom fields</h3>
      <h5 className="font-20-semiBold font-20-semiBold--roles-and-permission">
        Which are optional in nature, but you can use for your tracking
      </h5>
      <div className="row mx-0 align-items-start flex-nowrap command-center-custom-fields-row-div">
        {renderProject()}
        {renderMembers()}
        {renderClients()}
      </div>
    </div>
  );
}
