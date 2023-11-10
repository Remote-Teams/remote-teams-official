import React, { useState, useEffect } from "react";
import PainterroMain from "./PainterroMain";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWorkboardOfProject,
  deleteWorkboardById,
} from "./../../../store/actions/workboardAction";
import isEmpty from "../../../store/validations/is-empty";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";

export default function WorkboardContent() {
  const disptach = useDispatch();
  const [allWorkboardOfProject, setallWorkboardOfProject] = useState([]);

  useEffect(() => {
    var projectData = JSON.parse(localStorage.getItem("projectData"));
    const formData = {
      query: {
        project: projectData._id,
      },
    };
    disptach(getAllWorkboardOfProject(formData));
  }, []);

  const allWorkboard = useSelector((state) => state.workboard.allWorkboard);

  useEffect(() => {
    if (!isEmpty(allWorkboard)) {
      setallWorkboardOfProject(allWorkboard);
    } else {
      setallWorkboardOfProject([]);
    }
  }, [allWorkboard]);

  const openHandler = (workboardData) => (e) => {
    window.open(
      `${workboardData.data.fileUrl}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs`
    );
  };

  const deleteHandler = (workboardData) => (e) => {
    disptach(deleteWorkboardById(workboardData._id));
  };

  return (
    <div>
      <div className="row mx-0 align-items-start mt-40">
        <PainterroMain />
        {!isEmpty(allWorkboardOfProject) &&
          allWorkboardOfProject.map((data, index) => {
            return (
              <div className=" all-project-workboard-card">
                {/*workboard_card workboard_card-img font-18-bold-space-light-uppercase*/}
                <div
                  className="all-project-workboard-card-img-div"
                  //style={{
                  //  backgroundImage:
                  //    "url(https://login.dominate.ai/public/download?filename=file-2021-04-16T10:41:46.415Z.undefined&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjQ2M2RkODUwLTk4M2MtMTFlYi04YjhjLWQxNTRlNDIxMzFlNSIsImVtYWlsIjoiYWtzaGF5bmFnYXJnb2plMDcxNkBnbWFpbC5jb20iLCJ3b3Jrc3BhY2VJZCI6ImRlbW8zMDIifSwic3ViIjoiU3lzdGVtX1Rva2VuIiwiaXNzIjoiZG9taW5hdGUuYWkiLCJhdWQiOiJkb21pbmF0ZWFkbWluQGRvbWluYXRlLmFpIiwiaWF0IjoxNjE4NDc4NzEwLCJleHAiOjE2Mzg0Nzg3MTB9.-appa9PXDxbpFSOeNzeZYEZkTI3DGfBBlxaPZkHZDBs)",
                  //}}

                  onClick={openHandler(data)}
                >
                  <img
                    src={require("../../../assets/img/workboard/workboard.svg")}
                    alt="workboard"
                  />
                </div>
                <div className="row mx-0 flex-nowrap justify-content-between w-100 align-items-start">
                  <div className="all-project-workboard-card-text-div">
                    <h3 className="all-project-workboard-card-title">
                      {data.name}
                    </h3>
                    <p className="all-project-workboard-card-time">
                      {" "}
                      {data.description}
                    </p>
                  </div>
                  {/*                <div className="row mx-0 justify-content-between flex-nowrap">
                  <GreenButtonSmallFont
                    onClick={openHandler(data)}
                    text="View"
                    extraClassName="workboard_card-btn"
                  />
                  <GreenButtonSmallFont
                    onClick={deleteHandler(data)}
                    text="Delete"
                    extraClassName="workboard_card-btn"
                  />
            </div>*/}
                  <button
                    className="all-project-workboard-card-delete-btn"
                    onClick={deleteHandler(data)}
                  >
                    <i className="fa fa-trash" />
                  </button>
                </div>
                {/*<button onClick={openHandler(data)}>View</button>
                  <button onClick={deleteHandler(data)}>Delete</button>*/}
              </div>
            );
          })}
      </div>
    </div>
  );
}
