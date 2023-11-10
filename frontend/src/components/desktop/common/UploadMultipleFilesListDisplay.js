import React from "react";
import isEmpty from "../../../store/validations/is-empty";

export default function UploadMultipleFilesListDisplay({
  dataDocuments,
  handleOnClickDocumentName,
}) {
  return (
    <>
      {isEmpty(dataDocuments) ? (
        <p className="font-14-semibold table-data-empty-message">
          Document not attached
        </p>
      ) : (
        dataDocuments.map((data, index) => (
          <div key={index} className="row mx-0 flex-nowrap align-items-start">
            <img
              src={require("../../../assets/img/icons/common-file-icon.svg")}
              alt="file"
              className="common-file-icon mt-1 opacity-1"
            />
            <p
              className="font-18-semiBold mb-30 display-discussion-text-underline"
              onClick={handleOnClickDocumentName(data)}
            >
              {data.originalname}
            </p>
          </div>
        ))
      )}
    </>
  );
}
