import React, { useState } from "react";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import PageTitle from "../common/PageTitle";
import BreadcrumbMenu from "../common/BreadcrumbMenu";
import InputFieldEmailTextPassword from "../common/InputFieldEmailTextPassword";
import GreenButtonSmallFont from "../common/GreenButtonSmallFont";
import EditorQuillCommon from "../common/EditorQuillCommon";
import { useDispatch } from "react-redux";
import { createProjectDocs } from "./../../../store/actions/projectAction";
import { useHistory } from "react-router";
import { addDocValidation } from "./../../../store/validations/projectValidation/AddDocValidation";

export default function AllProjectAddDocs() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    docName: "",
    editorQuillTextValue: "",
    errors: {},
  });

  const [errors, setErrors] = useState({});

  /*===================================
             handler
  ====================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleOnChangeEditor = (editor) => {
    setValues({ ...values, editorQuillTextValue: editor.getHTML() });
    // console.log(editor.getHTML());
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);
    let projectData = JSON.parse(localStorage.getItem("projectData"));

    const { errors, isValid } = addDocValidation(values);

    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = {
        name: values.docName,
        project: projectData._id,
        description: {
          body: values.editorQuillTextValue,
        },
        additionalInfo: {
          info: "",
        },
      };
      dispatch(createProjectDocs(formData, history));
    }
  };

  /*===================================
             return
  ====================================*/

  return (
    <>
      {/* left navbar */}
      <LeftNavbar activeMenu="all-projects" />
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
              title: "Project Name",
              type: "goBackButton",
            },
            {
              title: "Docs",
              type: "goBackButton",
            },
            {
              title: "New Docs",
            },
          ]}
        />
        <div className="all-project-add-docs-div">
          <h2 className="create-new-doc-text">Create New Doc</h2>
          <InputFieldEmailTextPassword
            containerClassName="container-login-flow-input container-login-flow-input--all-project-add-docs container-login-flow-input--forms"
            placeholder="Document Name"
            name="docName"
            value={values.docName}
            onChange={handleChange}
            type="text"
            error={errors.docName}
          />
          <div className="custom-editor-quill custom-editor-quill--addDoc">
            <EditorQuillCommon
              placeholder="Enter Description"
              editorState={values.editorQuillTextValue}
              handleOnChangeEditor={handleOnChangeEditor}
              // error={values.errors.editorQuillTextValue}
            />
          </div>
          <GreenButtonSmallFont
            text="Save &amp; Add"
            extraClassName={"mt-40"}
            onClick={handleSave}
          />
        </div>
      </div>
    </>
  );
}
