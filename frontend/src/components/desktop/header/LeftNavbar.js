import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import { useState } from "react";
import { useSelector } from "react-redux";
import { setFeaturesArray } from "./../../../store/actions/authAction";
import { useDispatch } from "react-redux";
import PermissionWarning from "./../popups/PermissionWarning";
import store from "../../../store/store";
import { SET_ERROR_CODE } from "./../../../store/types";

const menuData = [
  {
    tooltip: "command centre",
    link: "/command-centre",
    imgPath: require("../../../assets/img/icons-left-navbar/command-centre.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/command-centre-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "CommandCenter",
    isDisable: false,
  },
  {
    tooltip: "dashboard",
    link: "/dashboard",
    imgPath: require("../../../assets/img/icons-left-navbar/dashboard.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/dashboard-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-dashboard-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "Dashboard",
    isDisable: false,
  },
  {
    tooltip: "all projects",
    link: "/all-projects",
    imgPath: require("../../../assets/img/icons-left-navbar/project.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/project-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-project-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "Project",
    isDisable: false,
  },
  {
    tooltip: "clients",
    link: "/clients",
    imgPath: require("../../../assets/img/icons-left-navbar/clients.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/clients-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-client-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "Client",
    isDisable: false,
  },

  {
    tooltip: "members",
    // link: "/resources",
    link: "/scheduler-two",
    imgPath: require("../../../assets/img/icons-left-navbar/resources.svg"),
    // activeImgPath: require("../../../assets/img/icons-left-navbar/resources-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-resource-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "Member",
    isDisable: false,
  },
  {
    tooltip: "workflows",
    link: "/workflows",
    imgPath: require("../../../assets/img/icons-left-navbar/workflows-icon.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/workflows-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/workflows-lock-icon.svg"),
    featureName: "Workflow",
    isDisable: false,
  },
  {
    tooltip: "proposals",
    link: "/proposals",
    imgPath: require("../../../assets/img/icons-left-navbar/proposals.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/proposals-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-proposal-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/proposals-disable-icon.svg"),
    isDisable: false,
    featureName: "Presentation",
  },
  {
    tooltip: "reports",
    link: "/reports",
    imgPath: require("../../../assets/img/icons-left-navbar/reports.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/reports-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-report-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    isDisable: false,
    featureName: "Report",
  },
  {
    tooltip: "finances",
    link: "/finances",
    imgPath: require("../../../assets/img/icons-left-navbar/finances.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/finances-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-finance-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/finances-gray-icon.svg"),
    isDisable: false,
    featureName: "Finance",
  },
  {
    tooltip: "vault",
    link: "/vault",
    imgPath: require("../../../assets/img/icons-left-navbar/vault.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/vault-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-vault-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/vault-disable-icon.svg"),
    isDisable: false,
    featureName: "Vault",
  },
  {
    tooltip: "settings",
    link: "/settings",
    imgPath: require("../../../assets/img/icons-left-navbar/settings.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/settings-white.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/new-support-active-icon.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    featureName: "Setting",
    isDisable: false,
  },
  {
    tooltip: "support",
    link: "/support",
    imgPath: require("../../../assets/img/icons-left-navbar/support.svg"),
    activeImgPath: require("../../../assets/img/icons-left-navbar/support-white.svg"),
    // disableIcon: require("../../../assets/img/icons-left-navbar/reports-disable-icon.svg"),
    //activeImgPath: require("../../../assets/img/icons-left-navbar/new-support-active-icon.svg"),
    featureName: "Support",
    isDisable: false,
  },
];

// let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));

// let finalFeatures = [];
// /*==============================
//        if condition added
// ===============================*/

// if (!isEmpty(featureArray)) {
//   featureArray.forEach((element) => {
//     let [name, role] = element.split(":");
//     finalFeatures.push(name);
//   });
// }
// menuData.forEach((menu) => {
//   let filteredFeature = finalFeatures.filter((ele) => ele === menu.featureName);
//   if (!isEmpty(filteredFeature)) {
//     menu.isDisable = false;
//   } else {
//     menu.isDisable = true;
//   }
// });

function LeftNavbar({ activeMenu }) {
  let featureArray = JSON.parse(localStorage.getItem("UserFeatures"));
  const dispatch = useDispatch();
  const [mouseOverMenu, setMouseOverMenu] = useState("");
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );
  const [permissionModel, setPermissionModel] = useState(false);

  const errorCode = useSelector((state) => state.errors.errorCode);

  useEffect(() => {
    let OrganizationData = JSON.parse(localStorage.getItem("OrganizationData"));
    dispatch(
      setFeaturesArray({
        plan:
          OrganizationData.planName === "FREE"
            ? "Free-Plan"
            : OrganizationData.planName === "ARK"
            ? "Ark"
            : "Metaverse",
      })
    );
  }, []);

  useEffect(() => {
    if (!isEmpty(featureArray)) {
      let finalFeatures = [];
      /*==============================
             if condition added
      ===============================*/

      if (!isEmpty(featureArray)) {
        featureArray.forEach((element) => {
          let [name, role] = element.split(":");
          finalFeatures.push(name);
        });
      }

      menuData.forEach((menu) => {
        let filteredFeature = finalFeatures.filter(
          (ele) => ele === menu.featureName
        );
        if (!isEmpty(filteredFeature)) {
          menu.isDisable = false;
        } else {
          menu.isDisable = true;
        }
      });
    }
  }, [featureArray]);

  useEffect(() => {
    // alert(JSON.stringify(errorCode));
    if (errorCode === 405) {
      setPermissionModel(true);
    }
  }, [errorCode]);

  const onCloseHandler = () => {
    store.dispatch({
      type: SET_ERROR_CODE,
      payload: "",
    });
    setPermissionModel(false);
  };

  return (
    <>
      <PermissionWarning
        permissionWarning={permissionModel}
        onCloseHandler={onCloseHandler}
      />
      <div
        className={
          activeWalkthroughPage === "navbar-1"
            ? "nav left-navbar-container new-walkthrough-active-leftnavbar"
            : "nav left-navbar-container "
        }
      >
        <ul>
          <>
            {menuData.map((data, index) => (
              <li
                key={index}
                className={
                  activeMenu === data.tooltip ? "left-navbar-active-menu" : ""
                }
              >
                {data.isDisable ? (
                  <div className="disabled-link">
                    <Link
                      to={{
                        pathname: "/preview-features",
                        state: { feature: data.featureName },
                      }}
                    >
                      <div className="disabled-link-img">
                        <img
                          src={
                            activeMenu === data.tooltip ||
                            mouseOverMenu === data.tooltip
                              ? data.activeImgPath
                              : data.imgPath
                          }
                          alt={data.tooltip}
                        />
                      </div>{" "}
                      <div className="disabled-link-lock-img">
                        <img
                          src={require("../../../assets/img/icons/lock-emoji.svg")}
                          alt={"lock"}
                        />
                      </div>
                    </Link>
                    {/* <div className="left-navbar-disable-icon">
                      <img
                        src={require("../../../assets/img/icons/lock-emoji.svg")}
                        alt="lock emoji"
                        className="navbar-lock-emoji-icon"
                      />
                      <span>This is a locked feature</span>
                      <img
                        src={require("../../../assets/img/icons/eye-emoji.svg")}
                        alt="eye emoji"
                        className="navbar-eye-emoji-icon"
                      />
                      <Link to="/preview-features">
                        <span className="sneack-a-preview-text">
                          Sneak a preview
                        </span>
                      </Link>
                    </div> */}
                  </div>
                ) : (
                  <Link
                    to={data.link}
                    onMouseOver={() => setMouseOverMenu(data.tooltip)}
                    onMouseLeave={() => setMouseOverMenu("")}
                    className={
                      (data.link === "/all-projects" &&
                        activeWalkthroughPage === "all-project-1") ||
                      (data.link === "/finances" &&
                        activeWalkthroughPage === "finances-1")
                        ? "new-walkthrough-active-leftnavbar-menu"
                        : ""
                    }
                  >
                    <img
                      src={
                        activeMenu === data.tooltip ||
                        mouseOverMenu === data.tooltip
                          ? data.activeImgPath
                          : data.imgPath
                      }
                      alt={data.tooltip}
                    />
                    {activeMenu === data.tooltip ? (
                      ""
                    ) : (
                      <span className="tooltip-menu">{data.tooltip}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </>
        </ul>
      </div>
    </>
  );
}

LeftNavbar.defaultProps = {
  activeMenu: "",
};

export default LeftNavbar;
