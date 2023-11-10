import React, { useState } from "react";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import Modal from "react-responsive-modal";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import Toggle from "../common/Toggle";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import { createRoles } from "./../../../store/actions/commandCenterAction";
import { newRoleIconOptions } from "./newRoleIconOptions";
import { validateAddRole } from "./../../../store/validations/commandCenterValidation/AddRoleValidation";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
// const dummyDataIcon = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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

const dummyData = {
  permissions: [
    "user:view",
    "user:create",
    "user:edit",
    "role:view",
    "role:create",
    "role:edit",
    "role:delete",
    "workinghour:view",
    "workinghour:create",
    "workinghour:edit",
    "workinghour:delete",
    "memberdayoff:view",
    "memberdayoff:create",
    "memberdayoff:edit",
    "memberdayoff:delete",
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "organisation:view",
    "organisation:edit",
    "organisation:delete",
    "client:view",
    "client:create",
    "client:edit",
    "client:delete",
    "invoice:view",
    "invoice:create",
    "invoice:edit",
    "invoice:delete",
    "task:view",
    "task:create",
    "task:edit",
    "task:delete",
    "scrum:view",
    "scrum:create",
    "scrum:edit",
    "scrum:delete",
    "ticket:view",
    "ticket:create",
    "ticket:edit",
    "ticket:delete",
    "faqs:view",
    "faqs:edit",
    "faqs:delete",
    "leave:view",
    "leave:create",
    "leave:edit",
    "leave:delete",
    "activity:view",
    "activity:create",
    "activity:edit",
    "activity:delete",
    "note:view",
    "note:create",
    "note:edit",
    "note:delete",
    "expense:view",
    "expense:create",
    "expense:edit",
    "expense:delete",
    "subscription:view",
    "subscription:create",
    "subscription:edit",
    "subscription:delete",
    "vault:view",
    "vault:create",
    "vault:edit",
    "vault:delete",
    "email:view",
    "email:create",
    "email:edit",
    "email:delete",
    "worklog:view",
    "worklog:create",
    "worklog:edit",
    "worklog:delete",
    "workboard:view",
    "workboard:create",
    "workboard:edit",
    "workboard:delete",
    "widget:view",
    "widget:create",
    "widget:edit",
    "widget:delete",
    "pin:view",
    "pin:create",
    "pin:edit",
    "pin:delete",
    "dashboard:view",
    "dashboard:create",
    "dashboard:edit",
    "dashboard:delete",
    "meeting:view",
    "meeting:create",
    "meeting:edit",
    "meeting:delete",
    "emailTemplate:view",
    "emailTemplate:create",
    "emailTemplate:edit",
    "emailTemplate:delete",
    "call:view",
    "call:create",
    "call:edit",
    "call:delete",
    "followup:view",
    "followup:create",
    "followup:edit",
    "followup:delete",
    "payment:view",
    "folder:view",
    "folder:create",
    "folder:edit",
    "folder:delete",
    "file:view",
    "file:create",
    "file:edit",
    "file:delete",
    "stage:view",
    "stage:create",
    "stage:edit",
    "stage:delete",
    "pipeline:view",
    "pipeline:create",
    "pipeline:edit",
    "pipeline:delete",
    "workflow:view",
    "workflow:create",
    "workflow:edit",
    "workflow:delete",
    "wstep:view",
    "wstep:create",
    "wstep:edit",
    "wstep:delete",
    "wtask:view",
    "wtask:create",
    "wtask:edit",
    "wtask:delete",
    "wsubtask:view",
    "wsubtask:create",
    "wsubtask:edit",
    "wsubtask:delete",
    "winstance:view",
    "winstance:create",
    "winstance:edit",
    "winstance:delete",
    "field:view",
    "field:create",
    "field:edit",
    "field:delete",
    "app:view",
    "entityConstant:view",
    "proposal:view",
    "proposal:create",
    "proposal:edit",
    "proposal:delete",
  ],
};

let roleNames = [];

dummyData.permissions.forEach((element) => {
  let [name, role] = element.split(":");
  roleNames.push(name);
});

let uniqueRoleNameArray = roleNames.filter(function(item, pos) {
  return roleNames.indexOf(item) == pos;
});

const leftNames = uniqueRoleNameArray;

let finalArray = [];
let moduleArray = [];

dummyData.permissions.forEach((element) => {
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

export default function AddNewRole() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    roleName: "",
    tableData: finalArray,
    selectedIcon: "",
  });

  const [frontEndErrors, setFrontEndErrors] = useState({});

  const [activeIndex, setActiveIndex] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  /*==========================================
              handler
 ===========================================*/

  const handleChange = (e) => {
    setFrontEndErrors({});
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setActiveIndex(null);
  };

  const callBackAddRole = (status) => {
    if (status === 200) {
      setOpen(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // console.log(values, "values");
    // console.log(checkedItems, "CheckBox");
    // const { tableData, activeIconButtonIndex } = this.state;
    let finalArray = [];
    dummyData.permissions.forEach((element) => {
      let [name, role] = element.split(":");
      let filterData = values.tableData.filter((ele) => ele.title === name);
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
      } else {
        finalArray.push(element);
      }
    });

    let uniqueArray = finalArray.filter(function(item, pos) {
      return finalArray.indexOf(item) == pos;
    });
    // console.log(uniqueArray);
    const { errors, isValid } = validateAddRole(values);
    if (!isValid) {
      // console.log(errors);
      setFrontEndErrors(errors);
    } else {
      const formData = {
        permissions: uniqueArray,
        name: values.roleName,
        status: "ACTIVE",
        category: "Manager",
        url: values.selectedIcon,
      };

      dispatch(createRoles(formData, callBackAddRole));
    }
  };

  const handleIconSelected = (img, index) => {
    setValues({ ...values, selectedIcon: img });
    setActiveIndex(index);
    console.log(img);
  };
  /*=================================
      renderTable
  ===================================*/
  const handleChangeRowCheckbox = (event, index) => {
    // setCheckedItems({
    //   ...checkedItems,
    //   [event.target.name]: event.target.checked,
    // });
    // console.log("checkedItems: ", checkedItems);
    let tableDataObj = values.tableData;
    // check specific indexed row checkbox
    tableDataObj[index][event.target.name] = event.target.checked;

    console.log(tableDataObj);
    setValues({ ...values, tableData: tableDataObj });
  };

  const renderTable = () => {
    return (
      <div>
        <div className="cmd-role-and-permission-table cmd-role-and-permission-table--add-role">
          <table>
            <thead>
              <tr>
                <th>
                  <span className="font-18-bold common-peach-color-text">
                    Add Permissions
                  </span>
                </th>
                <th>edit</th>
                <th>create</th>
                <th>view</th>
                <th>all</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="cmd-role-and-permission-table cmd-role-and-permission-table--add-role cmd-role-and-permission-table--add-role-tbody">
          <table>
            <tbody>
              {!isEmpty(values.tableData) &&
                values.tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.title}</td>
                    <td>
                      <div className="customCheckbox customCheckbox--cmd-checkbox">
                        <Checkbox
                          // name={data.edit}
                          name="editChecked"
                          checked={data.editChecked}
                          onChange={(event) =>
                            handleChangeRowCheckbox(event, index)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="customCheckbox customCheckbox--cmd-checkbox">
                        <Checkbox
                          name="createChecked"
                          // name={data.create}
                          checked={data.createChecked}
                          onChange={(event) =>
                            handleChangeRowCheckbox(event, index)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="customCheckbox customCheckbox--cmd-checkbox">
                        <Checkbox
                          name="viewChecked"
                          // name={data.view}
                          checked={data.viewChecked}
                          onChange={(event) =>
                            handleChangeRowCheckbox(event, index)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="customCheckbox customCheckbox--cmd-checkbox">
                        <Checkbox
                          name="deleteChecked"
                          // name={data.all}
                          checked={data.deleteChecked}
                          onChange={(event) =>
                            handleChangeRowCheckbox(event, index)
                          }
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
  };
  /*=================================
      renderMain
  ===================================*/
  return (
    <div>
      <GreenButtonSmallFont
        text={"Add New Role"}
        extraClassName="cmd-roles-and-permission-add-btn"
        onClick={handleOpenModal}
      />
      <Modal
        open={open}
        onClose={handleCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--cmd-custom-fields",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={handleCloseModal} />
        {/* content */}
        <div className="add-new-role-div">
          <h1 className="add-new-custom-fields-title">Add New Role</h1>
          <div className="pt-65 add-new-role-fields-div">
            <h5 className="font-18-bold common-peach-color-text">Role Name</h5>
            <InputFieldEmailTextPassword
              containerClassName="container-login-flow-input container-login-flow-input--cmd-role-name mt-40"
              name="roleName"
              value={values.roleName}
              onChange={handleChange}
              type="text"
              placeholder={"Role Name"}
              error={!isEmpty(frontEndErrors) && frontEndErrors.roleName}
              maxLength={maxLengths.char50}
            />
            <h5 className="font-18-bold common-peach-color-text">
              Select Icon
            </h5>
            <div className="row mx-0 align-items-start justify-content-start pt-40">
              {newRoleIconOptions.map((data, index) => (
                <div key={index} className="cmd-add-role-icon-outer-div">
                  <div
                    className={
                      activeIndex === index
                        ? "cmd-add-role-icon-inner-div cmd-add-role-icon-inner-div--active"
                        : "cmd-add-role-icon-inner-div"
                    }
                    onClick={() => handleIconSelected(data.img, index)}
                  >
                    <img src={data.img} alt="" />
                  </div>
                </div>
              ))}
            </div>
            {renderTable()}
            <div className="text-center">
              <GreenButtonSmallFont
                text={"Save"}
                onClick={handleSave}
                extraClassName={"add-custom-fields-save-btn mb-0"}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
