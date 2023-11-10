import React from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import WorkboardContent from "./WorkboardContent";

function Workboard() {
  return (
    <div>
      <>
        <LeftNavbar activeMenu="Workboard" />

        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Workboard" />
            <TopNavbar />
          </div>
          <WorkboardContent />
        </div>
      </>
    </div>
  );
}

export default Workboard;
