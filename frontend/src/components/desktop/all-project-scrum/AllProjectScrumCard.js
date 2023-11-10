import React, { useState, useEffect } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
//import GrayButtonSmallFont from "../common/GrayButtonSmallFont";
import Toggle from "../common/Toggle";
import AllProjectModifyScrum from "./AllProjectModifyScrum";
import { format } from "date-fns";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import { useDispatch } from "react-redux";
import {
  deleteScrumById,
  updateScrumById,
} from "./../../../store/actions/projectAction";
import isEmpty from "../../../store/validations/is-empty";

export default function AllProjectScrumCard({ id, scrumData }) {
  const dispatch = useDispatch();
  const [isScrumActive, setIsScrumActive] = useState("");
  const [isMailNotification, setIsMailNotification] = useState("");

  useEffect(() => {
    if (!isEmpty(scrumData)) {
      console.log(scrumData);
      setIsScrumActive(scrumData.daily_scrum);
      setIsMailNotification(scrumData.emailNotify);
    }
  }, [scrumData]);
  /*===========================================================================
      handlers
  ===========================================================================*/
  const handleOnChangeToggle = (e) => {
    setIsScrumActive({
      isScrumActive: e.target.checked,
    });
    console.log(isScrumActive);
    let fomrData = scrumData;
    fomrData.daily_scrum = e.target.checked;

    dispatch(updateScrumById(fomrData));
  };
  const handleOnChangeMailToggle = (e) => {
    // setIsMailNotification({
    //   isMailNotification: e.target.checked,
    // });
    // console.log(isScrumActive);
    console.log(scrumData);

    let fomrData = scrumData;
    fomrData.emailNotify = e.target.checked;

    dispatch(updateScrumById(fomrData));
  };

  const onSelect = (action, scrumData) => {
    if (action === "delete") {
      console.log("delete");
      dispatch(deleteScrumById(scrumData._id));
    }
  };

  const renderFileDropdown = (scrumData) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => onSelect("delete", scrumData)}>
          Delete
        </MenuItem>
      </Menu>
    );

    const onVisibleChange = () => {
      console.log("");
    };

    return (
      <div className="product-overview-icon-dropdown product-overview-icon-dropdown--projectScrumCard">
        <DropdownIcon
          trigger={["click"]}
          overlay={menu}
          animation="none"
          onVisibleChange={onVisibleChange}
        >
          <img
            src="/img/icons/peach-gradient-ellipsis-v.svg"
            alt=""
            className="ellipsis-gradient-img"
          />
        </DropdownIcon>
      </div>
    );
  };

  return (
    <>
      <div className="web-client-card-div web-client-card-div--scrum">
        <div className="row mx-0 flex-nowrap justify-content-between align-items-start">
          <div className="web-client-icon web-client-icon--resource">
            <img
              //src={require("../../../assets/img/dummy/resource-without-border.svg")}
              //src={require("../../../assets/img/dummy/new-profile-placeholder-with-border.svg")}
              src={require("../../../assets/img/dummy/new-square-profile-img.png")}
              alt="person"
              className="img-wh-100"
            />
          </div>
          <div className="column">
            <h3 className="font-24-bold color-offwhite">{scrumData.name}</h3>
            <h3 className="reasource-card-tasks reasource-card-tasks--scrum-text">
              Upcoming in{" "}
              <span className="reasource-card-tasks--scrum">40 mins</span>
            </h3>
            <div className="row mx-0 flex-nowrap card-view-edit-buttons-block">
              <GrayLinkSmallFont
                text={"View"}
                path={`/all-projects-scrum-detail/${id}`}
                extraClassName="all-project-scrum-view-btn"
              />
              <AllProjectModifyScrum scrumData={scrumData} />
            </div>
          </div>
          <div>{renderFileDropdown(scrumData)}</div>
        </div>
        <div>
          <h3 className="client-card-subtittle">Date</h3>
          {/* <h3 className="font-24-bold color-offwhite">{scrumData.name}</h3> */}
          <h5 className="client-card-subtittle-text">
            {format(scrumData.fromDate, "DD-MMM-YYYY")} to{" "}
            {format(scrumData.toDate, "DD-MMM-YYYY")}
          </h5>
        </div>
        <div>
          <h3 className="client-card-subtittle">time</h3>
          <h5 className="client-card-subtittle-text">
            {format(scrumData.fromTime, "hh:mm A")}-{" "}
            {format(scrumData.toTime, "hh:mm A")}
          </h5>
        </div>
        <div>
          <h3 className="client-card-subtittle">daily scrum</h3>
          <Toggle
            //textClassName="client-card-subtittle-text"
            name="isScrumActive"
            text1={"Yes"}
            text2={"Inactive"}
            onChange={handleOnChangeToggle}
            defaultChecked={scrumData.daily_scrum === true ? true : false}
          />
        </div>
        <div>
          <h3 className="client-card-subtittle">mail notification</h3>
          <Toggle
            //textClassName="client-card-subtittle-text"
            name="isMailNotification"
            text1={"Yes"}
            text2={"Inactive"}
            onChange={handleOnChangeMailToggle}
            defaultChecked={scrumData.emailNotify === true ? true : false}
          />
        </div>
      </div>
    </>
  );
}
