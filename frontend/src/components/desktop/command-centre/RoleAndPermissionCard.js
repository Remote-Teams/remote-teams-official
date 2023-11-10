import React, { useState, useEffect } from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import {
  updateRoleById,
  deleteRoleById,
} from "./../../../store/actions/commandCenterAction";
import displaySmallText from "./../../../store/utils/sliceString";

const tableArray = [
  {
    title: "Projects",
    edit: "project-edit",
    create: "project-create",
    view: "project-view",
    all: "project-all",
  },
  {
    title: "Resources",
    edit: "resources-edit",
    create: "resources-create",
    view: "resources-view",
    all: "resources-all",
  },
  {
    title: "Finances",
    edit: "finances-edit",
    create: "finances-create",
    view: "finances-view",
    all: "finances-all",
  },
  {
    title: "Customers",
    edit: "customers-edit",
    create: "customers-create",
    view: "customers-view",
    all: "customers-all",
  },
  {
    title: "Reports",
    edit: "reports-edit",
    create: "reports-create",
    view: "reports-view",
    all: "reports-all",
  },
  {
    title: "Support",
    edit: "support-edit",
    create: "support-create",
    view: "support-view",
    all: "support-all",
  },
];

export default function RoleAndPermissionCard({
  title,
  imgPath,
  roleData,
  allData,
}) {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);

  // roleData = [
  //   "lead:create",
  //   "lead:edit",
  //   "lead:delete",
  //   "lead:view",
  //   "task:create",
  //   // "task:delete",
  //   // "task:view",
  // ];

  const [values, setValues] = useState({
    tableData: [],
  });

  useEffect(() => {
    if (!isEmpty(roleData)) {
      let roleNames = [];

      roleData.forEach((element) => {
        let [name, role] = element.split(":");
        roleNames.push(name);
      });

      let uniqueRoleNameArray = roleNames.filter(function(item, pos) {
        return roleNames.indexOf(item) == pos;
      });

      // Making data map with checkboxes

      const leftNames = uniqueRoleNameArray;

      let finalArray = [];
      let moduleArray = [];

      roleData.forEach((element) => {
        let [name, role] = element.split(":");

        moduleArray.push({
          title: name,
          viewChecked: role === "view" ? true : false,
          createChecked: role === "create" ? true : false,
          editChecked: role === "edit" ? true : false,
          deleteChecked: role === "delete" ? true : false,
        });
      });

      leftNames.forEach((ele) => {
        let objectWanted = {
          title: ele,
          viewChecked: false,
          createChecked: false,
          editChecked: false,
          deleteChecked: false,
        };
        let filterData = moduleArray.filter((element) => element.title === ele);

        if (!isEmpty(filterData)) {
          // console.log(filterData);

          filterData.forEach((element) => {
            if (element.title === ele) {
              if (element.viewChecked === true) {
                objectWanted.viewChecked = true;
              }
              if (element.createChecked === true) {
                objectWanted.createChecked = true;
              }
              if (element.editChecked === true) {
                objectWanted.editChecked = true;
              }
              if (element.deleteChecked === true) {
                objectWanted.deleteChecked = true;
              }
            }
          });

          finalArray.push(objectWanted);
        }
      });
      setValues({ ...values, tableData: finalArray });
    }
  }, []);

  /*==================================
              Handler
  ==================================*/
  const handleClick = () => {
    setIsEdit(true);
    console.log("on click edit", isEdit);
  };

  const callBackUpdate = (status) => {};

  const handleSaveClick = () => {
    setIsEdit(false);
    console.log("checkedItems: ", checkedItems);
    // const { roleData, allData } = this.props;
    // console.log(this.state.tableData);
    // console.log(dummyData.permissions);
    const { tableData } = values;
    let finalArray = [];
    !isEmpty(roleData) &&
      roleData.forEach((element) => {
        let [name] = element.split(":");
        let filterData = tableData.filter((ele) => ele.title === name);
        if (!isEmpty(filterData)) {
          if (filterData[0].viewChecked === true) {
            finalArray.push(`${filterData[0].title}:view`);
          }
          if (filterData[0].createChecked === true) {
            finalArray.push(`${filterData[0].title}:create`);
          }
          if (filterData[0].editChecked === true) {
            finalArray.push(`${filterData[0].title}:edit`);
          }
          if (filterData[0].deleteChecked === true) {
            finalArray.push(`${filterData[0].title}:delete`);
          }
          if (
            filterData[0].viewChecked === false &&
            filterData[0].createChecked === false &&
            filterData[0].editChecked === false &&
            filterData[0].deleteChecked === false
          ) {
            finalArray.push(`${filterData[0].title}:view`);
          }
        } else {
          finalArray.push(element);
        }
      });

    let uniqueArray = finalArray.filter(function(item, pos) {
      return finalArray.indexOf(item) === pos;
    });
    console.log(uniqueArray);

    let formData = allData;
    formData.permissions = uniqueArray;

    console.log(formData);
    dispatch(updateRoleById(formData._id, formData, callBackUpdate));
  };

  const [checkedItems, setCheckedItems] = useState({});

  const handleChange = (event, index) => {
    // setCheckedItems({
    //   ...checkedItems,
    //   [event.target.name]: event.target.checked,
    // });
    // console.log("checkedItems: ", checkedItems);

    // console.log(event, index);
    let tableDataObj = values.tableData;
    // check specific indexed row checkbox
    tableDataObj[index][event.target.name] = event.target.checked;

    console.log(tableDataObj);
    setValues({ ...values, tableData: tableDataObj });
    // this.setState({
    //   tableData: tableDataObj,
    // });
  };

  // console.log(values.tableData);

  const handleDelete = () => {
    console.log("handle delete");
    const formData = allData;
    dispatch(deleteRoleById(formData._id));
  };

  const renderDeleteButton = () => {
    // console.log(allData);
    if (
      allData.category !== "Admin" &&
      allData.category !== "Client" &&
      allData.category !== "Employee" &&
      allData.name !== "Project Manager"
    ) {
      return (
        <button
          className="cmd-roles-and-permission-delete-btn-div"
          onClick={handleDelete}
        >
          <i className="fa fa-trash" />
        </button>
      );
    } else {
      return null;
    }
  };

  /*==================================
              return
  ==================================*/
  return (
    <div className="cmd-roles-and-permission-card">
      <div className="cmd-roles-and-permission-img-div">
        <div className="text-center">
          {imgPath ? <img src={imgPath} alt={title} /> : ""}
          <h4 className="cmd-roles-and-permission-text1">
            {displaySmallText(title, 15, true)}
          </h4>
          {renderDeleteButton()}
          {isEdit ? (
            <button
              className="cmd-roles-and-permission-edit-btn-div"
              onClick={handleSaveClick}
            >
              <i className="fa fa-save" />
              Save
            </button>
          ) : (
            allData.name !== "Administrator" && (
              <button
                className="cmd-roles-and-permission-edit-btn-div"
                onClick={handleClick}
              >
                <img
                  src={require("../../../assets/img/command-centre/edit-icon.svg")}
                  alt="edit"
                />
                Edit
              </button>
            )
          )}
        </div>
      </div>
      <div className="cmd-role-and-permission-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>edit</th>
              <th>create</th>
              <th>view</th>
              <th>delete</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="cmd-role-and-permission-table cmd-role-and-permission-table--tbody">
        <table>
          <tbody>
            {!isEmpty(values.tableData) &&
              values.tableData.map((data, index) => (
                <tr key={index}>
                  <td>{data.title}</td>
                  <td>
                    <div className="customCheckbox customCheckbox--cmd-checkbox">
                      <Checkbox
                        name="editChecked"
                        // name={data.edit}
                        checked={data.editChecked}
                        onChange={(event) => handleChange(event, index)}
                        disabled={isEdit ? false : true}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="customCheckbox customCheckbox--cmd-checkbox">
                      <Checkbox
                        name="createChecked"
                        // name={data.create}
                        checked={data.createChecked}
                        onChange={(event) => handleChange(event, index)}
                        disabled={isEdit ? false : true}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="customCheckbox customCheckbox--cmd-checkbox">
                      <Checkbox
                        name="viewChecked"
                        // name={data.view}
                        checked={data.viewChecked}
                        onChange={(event) => handleChange(event, index)}
                        disabled={isEdit ? false : true}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="customCheckbox customCheckbox--cmd-checkbox">
                      <Checkbox
                        name="deleteChecked"
                        // name={data.all}
                        checked={data.deleteChecked}
                        onChange={(event) => handleChange(event, index)}
                        disabled={isEdit ? false : true}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
