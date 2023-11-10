import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { url } from "../../../store/actions/config";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";
import QuillResize from "quill-resize-module";
import isEmpty from "../../../store/validations/is-empty";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/resize", QuillResize);

EditorQuillCommon.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
];

var userData = JSON.parse(localStorage.getItem("Data"));

EditorQuillCommon.modules = {
  // #3 Add "image" to the toolbar
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike", "image"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  },
  // # 4 Add module and upload function
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        fetch(
          `https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22`,
          {
            method: "POST",
            body: formData,
            // headers: {
            //   "Content-Type": "application/json",
            //   Authorization: `Bearer ${userData.token}`,
            // },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            resolve(result.data.url);
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  },
  // resize: {
  //   styles: {
  //     // ...
  //     toolbar: {
  //       backgroundColor: "black",
  //       border: "none",
  //       color: "#ffffff",
  //       // other camelCase styles for size display
  //     },
  //     toolbarButton: {
  //       // ...
  //     },
  //     toolbarButtonSvg: {
  //       // ...
  //     },
  //   },
  //   modules: ["Resize", "DisplaySize", "Toolbar"],
  // },
};

export default function EditorQuillCommon({
  placeholder,
  editorState,
  handleOnChangeEditor,
  error,
}) {
  return (
    <>
      <ReactQuill
        onChange={(content, delta, source, editor) =>
          handleOnChangeEditor(editor)
        }
        modules={EditorQuillCommon.modules}
        formats={EditorQuillCommon.formats}
        theme="snow"
        value={editorState}
        placeholder={placeholder}
      ></ReactQuill>

      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <p className="error-message opacity-0">error</p>
      )}
    </>
  );
}
