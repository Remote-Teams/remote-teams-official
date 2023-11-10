import React from "react";
import { Base64 } from "js-base64";
import ViewThreadOptions from "./ViewThreadOptions";

const ViewThreads = (props) => {
  return (
    <div className="display_thread_main_container">
      {props.viewThread.messages.map((message, index) => {
        let subject = message.payload.headers.find(
          (data) => data.name === "Subject"
        );
        let snippet = message.snippet;
        let date = message.payload.headers.find((data) => data.name === "Date");
        let name = message.payload.headers.find((data) => data.name === "From");
        return (
          <div key={index} className="single_message_main_container">
            <div className="col_one_m">
              <NameDetails {...message} />
              <div className="option_container">
                <ViewThreadOptions message={message} {...props} />
              </div>
            </div>
            <div className="col_two_m">
              <SubjectDetails {...message} />
            </div>
            <div className="col_three_m">
              <div id="sandy"></div>
              <BodyDetails message={message} {...message} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewThreads;

export const NameDetails = (props) => {
  let headers = props.payload.headers;
  let from = headers.find((data) => data.name === "From");
  let to = headers.find((data) => data.name === "To");
  return (
    <div className="address_container_m">
      <div className="from_email_details">
        {" "}
        <span className="view_labels">From : &nbsp;</span>{" "}
        {from ? from.value : ""}
      </div>
      <div className="to_email_details">
        {" "}
        <span className="view_labels">To : &nbsp;</span> {to ? to.value : ""}
      </div>
    </div>
  );
};

export const SubjectDetails = (props) => {
  let headers = props.payload.headers;
  let subject = headers.find((data) => data.name === "Subject");
  return <div className="subject_details">{ subject ? subject.value : ""}</div>;
};

export const BodyDetails = (props) => {
  console.log(props.message);
  let parts = props.payload.parts;
  let body = "";
  if (parts !== undefined) {
    let textbody = parts.find((data) => data.mimeType === "text/plain");
    let htmlbody = parts.find((data) => data.mimeType === "text/html");

    if (htmlbody) {
      body = htmlbody.body.data;
    } else if (textbody) {
      body = textbody.body.data;
    } else {
      body = undefined;
    }
  } else {
    body = props.payload.body.data;
  }
  if (body) {
    body = Base64.decode(body);
  }
  if (!body) {
    return (
      <div>
        There is attachement. Please visit google gmail for this . This feature
        will be added soon
      </div>
    );
  } else {
    return (
      <div className="body_details">
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    );
  }
};
