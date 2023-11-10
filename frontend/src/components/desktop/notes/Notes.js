import React, { Component, Fragment } from "react";
import PageTitle from "../common/PageTitle";
import TopNavbar from "../header/TopNavbar";
import LeftNavbar from "../header/LeftNavbar";
import GreenLinkSmallFont from "../common/GreenLinkSmallFont";
import NotesCard from "./NotesCard";
// api
import isEmpty from "../../../store/validations/is-empty";
import { connect } from "react-redux";
import { getAllNotes } from "./../../../store/actions/notesAction";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const addNote = (
  <>
    <img
      src={require("../../../assets/img/icons/add-vault-doc-icon.svg")}
      alt="add note"
      className="vault-add-doc-img"
    />
  </>
);

class Notes extends Component {
  constructor() {
    super();
    this.state = {
      // api
      allNotes: {},
    };
  }

  /*==========================================================================
        lifecycle methods
  ============================================================================*/
  componentDidMount() {
    this.props.getAllNotes();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.allNotes !== nextState.allNotes) {
      return {
        allNotes: nextProps.allNotes,
      };
    }

    return null;
  }

  /*============================================================
      main
  ============================================================*/
  render() {
    const { allNotes } = this.state;
    const { loader } = this.props;
    return (
      <>
        {loader === true && (
          <Loader type="Triangle" color="#57cba1" className="remote-loader" />
        )}
        {/* left navbar */}
        <LeftNavbar />
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="Notes" />
            <TopNavbar activeMenu={"notes"} />
          </div>
          {/* pagetitle and topnavbar end */}
          <div className="row mx-0 notes-cards-overflow-div">
            <GreenLinkSmallFont
              path={{
                pathname: "/manage-note",
                state: {
                  isFormTypeAdd: true,
                },
              }}
              //text="+ New Notes"
              text={addNote}
              extraClassName="add-note-btn"
            />
            {isEmpty(allNotes) ? (
              <h3 className="font-14-semibold opacity-35 notes-empty-data-message mb-30">
                There are no notes to display yet
              </h3>
            ) : (
              allNotes.map((data, index) => (
                <Fragment key={index}>
                  <NotesCard cardData={data} />
                </Fragment>
              ))
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToprops = (state) => ({
  allNotes: state.notes.allNotes,
  loader: state.auth.loader,
});

export default connect(mapStateToprops, {
  getAllNotes,
})(Notes);
