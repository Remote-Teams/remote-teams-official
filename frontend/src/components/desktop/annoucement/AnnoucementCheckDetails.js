import React, { Component } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import isEmpty from "../../../store/validations/is-empty";
import PageTitle from "../common/PageTitle";
import LeftNavbar from "../header/LeftNavbar";
import TopNavbar from "../header/TopNavbar";
import BreadcrumbMenu from "../common/BreadcrumbMenu";

export default class AnnoucementCheckDetails extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
    };
  }

  componentDidMount() {
    console.log(this.props.history.location.state);
    if (!isEmpty(this.props.history.location.state)) {
      this.setState({
        title: this.props.history.location.state.announcementData.title,
        description: this.props.history.location.state.announcementData.message,
      });
    }
  }

  render() {
    return (
      <>
        {/* left navbar */}
        <LeftNavbar />
        <div className="main-page-padding">
          {/* pagetitle and topnavbar */}
          <div className="pageTitle-topNavbar-div">
            <PageTitle title="announcement" />
            <TopNavbar activeMenu={"announcement"} />
          </div>
          <div>
            <BreadcrumbMenu
              menuObj={[
                {
                  title: "announcement",
                  link: "/announcement",
                },
                {
                  title: "announcement title",
                },
              ]}
            />
          </div>

          <div className="annoucement-details-title-div">
            <h2 className="annouement-check-details-title">
              {this.state.title}
            </h2>
            {/*<PageTitle title={this.state.title} />
            <GrayLinkSmallFont path="/announcement" text="Go Back" />*/}
            <div className="annoucement-details-description-div">
              {/*<h1 className="annoucement-description-text">description</h1>*/}
              {/*<h5 className="annoucement-details-subtitle text-uppercase mb-20">
                Heading
          </h5>*/}
              <p className="annoucement-description-para">
                {this.state.description}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
