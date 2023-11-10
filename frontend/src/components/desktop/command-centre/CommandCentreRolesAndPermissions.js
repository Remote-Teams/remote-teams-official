import React, { Fragment, useState, useEffect } from "react";
//import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import AddNewRole from "./AddNewRole";
import RoleAndPermissionCard from "./RoleAndPermissionCard";
import { useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
const imgPath = "/img/add-new-role-icon-options";

const dummyData = [
  {
    title: "admin",
    imgPath: require("../../../assets/img/dummy/command-center-profile-img1.svg"),
  },
  {
    title: "project manager",
    imgPath: require("../../../assets/img/dummy/command-center-profile-img2.svg"),
  },
  {
    title: "RESOURCE",
    imgPath: require("../../../assets/img/dummy/command-center-profile-img4.svg"),
  },
  {
    title: "client",
    imgPath: require("../../../assets/img/dummy/command-center-profile-img3.svg"),
  },
];
export default function CommandCentreRolesAndPermissions() {
  const [allRoles, setAllRoles] = useState([]);

  const memberAllRoles = useSelector(
    (state) => state.commandCenter.memberAllRoles
  );

  useEffect(() => {
    if (!isEmpty(memberAllRoles)) {
      setAllRoles(memberAllRoles);
    }
  }, [memberAllRoles]);

  let img = "../../../assets/img/dummy/command-center-profile-img3.svg";
  /*==================================
              Handler
  ==================================*/

  const handleAdd = () => {
    console.log("Onclick add new");
  };

  /*==================================
            return
   =================================*/

  return (
    <div className="command-center-roles-and-permission-div">
      <div className="row mx-0 justify-content-between align-items-center">
        <div>
          <h3 className="font-24-bold">Here are the default roles</h3>
          <h5 className="font-20-semiBold font-20-semiBold--roles-and-permission">
            You can select these when you are adding a member on board
          </h5>
        </div>
        {/*<GreenButtonSmallFont
          text={"Add New Role"}
          extraClassName="cmd-roles-and-permission-add-btn"
          onClick={handleAdd}
        />*/}
        <AddNewRole />
      </div>
      <div className="row mx-0 role-and-permission-outer-div align-items-start">
        {!isEmpty(allRoles) &&
          allRoles.map((data, index) => (
            <Fragment key={index}>
              <RoleAndPermissionCard
                allData={data}
                roleData={data.permissions}
                title={data.name}
                imgPath={
                  data.category === "Admin"
                    ? require("../../../assets/img/dummy/command-center-profile-img1.svg")
                    : data.category === "Client"
                    ? require("../../../assets/img/dummy/command-center-profile-img3.svg")
                    : data.url === undefined
                    ? require("../../../assets/img/dummy/command-center-profile-img2.svg")
                    : `${data.url}`
                }
              />
            </Fragment>
          ))}
      </div>
    </div>
  );
}
