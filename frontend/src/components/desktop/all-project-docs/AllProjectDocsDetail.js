import React, { useEffect, useState } from "react";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import PageTitle from "../common/PageTitle";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import { useParams } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";
import { getProjectDocById } from "./../../../store/actions/projectAction";

export default function AllProjectDocsDetail() {
  const params = useParams();
  const dispatch = useDispatch();

  const [docData, setDocData] = useState({});

  useEffect(() => {
    if (!isEmpty(params)) {
      // console.log(params);
      dispatch(getProjectDocById(params.id));
    }
  }, [params]);

  const singleProjectDoc = useSelector(
    (state) => state.projects.singleProjectDoc
  );
  useEffect(() => {
    if (!isEmpty(singleProjectDoc)) {
      setDocData(singleProjectDoc);
    }
  }, [singleProjectDoc]);
  let projectData = JSON.parse(localStorage.getItem("projectData"));
  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="all projects" />
      <div className="main-page-padding">
        {/* pagetitle and topnavbar */}
        <div className="pageTitle-topNavbar-div">
          <PageTitle title="Project Name" />
          <TopNavbar />
        </div>

        <BreadcrumbMenu
          menuObj={[
            {
              title: "Projects",
              link: "/all-projects",
            },
            {
              title: `${projectData.name}`,
              type: "goBackButton",
            },
            {
              title: "Docs",
              type: "goBackButton",
            },
            {
              title: `${docData.name}`,
            },
          ]}
        />
        <div className="pt-50 mb-40">
          <h2 className="add-project-select-cover-img-text">{docData.name}</h2>
        </div>
        <div className="rt-all-project-doc-details-content-block">
          <p
            dangerouslySetInnerHTML={{
              __html: !isEmpty(docData) && docData.description.body,
            }}
            className="font-18-semiBold color-white-79"
          ></p>
        </div>
      </div>
    </>
  );
}
