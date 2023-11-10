import React from "react";
import { Checkbox } from "@material-ui/core";
import { StarBorder, Star } from "@material-ui/icons";
import dateFns from "date-fns";

const DisplayDraft = (props) => {
  let all_threads = [];
  if (props.connectappEmail.all_threds.messages) {
    all_threads = props.connectappEmail.all_threds.messages;
  }
  return (
    <div className="display_thread_main_container">
      {all_threads.map((thread, index) => {
        console.log(thread);
        let starred = false;
        thread.messages.forEach((element) => {
          if (element.labelIds.includes("STARRED")) {
            starred = true;
          }
        });
        const message = thread.messages[0];
        let subject = message.payload.headers.find(
          (data) => data.name === "Subject"
        );
        let snippet = message.snippet;
        let date = message.payload.headers.find((data) => data.name === "Date");
        let name = message.payload.headers.find((data) => data.name === "From");
        return (
          <div key={index} className="thread_block_container">
            <div className="checkbox_container">
              <Checkbox
                // checked={state.checkedB}
                // onChange={handleChange}
                name="checkedB"
                color="primary"
                size="medium"
              />
            </div>
            <div
              className="star_container"
              onClick={props.onStarChangeHandler({
                id: thread.id,
                starred: starred,
              })}
            >
              {!starred ? (
                <StarBorder fontSize={"large"} />
              ) : (
                <Star fontSize={"large"} />
              )}{" "}
            </div>
            <div
              className="name_container"
              onClick={props.viewthreadHandler(thread)}
            >
              {name ? name.value.substring(0, 20) : ""}
            </div>
            <div
              className="subject_container"
              onClick={props.viewthreadHandler(thread)}
            >
              {subject && subject.value !== ""
                ? subject.value.substring(0, 50) + " ..."
                : "(no subject)"}
            </div>
            <div
              className="snippet_container"
              onClick={props.viewthreadHandler(thread)}
            >
              {snippet ? snippet.substring(0, 50) + " ..." : ""}
            </div>
            <div
              className="date_container"
              onClick={props.viewthreadHandler(thread)}
            >
              {date
                ? dateFns.format(dateFns.parse(date.value), "Do MMM YYYY HH:mm")
                : ""}
            </div>
            <div className="edit_icon_containers">
              <div
                className="edit_cion"
                onClick={props.onDelete(thread, index)}
              >
                <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayDraft;
