import React, { Component } from "react";
import { Link } from "react-router-dom";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
// api
import { connect } from "react-redux";
import { deleteNote } from "./../../../store/actions/notesAction";
import displaySmallText from "./../../../store/utils/sliceString";

class NotesCard extends Component {
  /*==========================================================================
        handlers
  ============================================================================*/
  handelDelete = () => {
    this.props.deleteNote(this.props.cardData._id);
  };

  /*==========================================================================
        main
  ============================================================================*/
  render() {
    const { cardData } = this.props;
    const daysCalculated = differenceInCalendarDays(
      new Date(),
      cardData.createdAt
    );
    return (
      <div className="web-notes-outer-div">
        <Link
          to={{
            pathname: "/manage-note",
            state: {
              isFormTypeAdd: false,
              noteData: cardData,
            },
          }}
        >
          <div className="notes-panel">
            <p className="note-name-panel-text">{cardData.description}</p>
          </div>
        </Link>
        <div className=" notes-text-div">
          <h2 className="note-name-text">
            {" "}
            {displaySmallText(cardData.name, 20, true)}{" "}
          </h2>
          <h5 className="notes-delete-icon" onClick={this.handelDelete}>
            <i className="fa fa-trash" />
          </h5>
        </div>
        <h3 className="notes-created-day-text">
          {daysCalculated === 0
            ? "created today"
            : daysCalculated === 1
            ? "created 1 day ago"
            : `created ${daysCalculated} days ago`}
        </h3>
      </div>
    );
  }
}

export default connect(null, {
  deleteNote,
})(NotesCard);
