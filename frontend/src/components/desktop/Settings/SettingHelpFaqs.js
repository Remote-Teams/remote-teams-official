import React, { Component } from "react";
import SearchInput from "../common/SearchInput";

const list = [
  {
    Que: "lerom ipsum dolor sit amet,concsectetur",
    Ans: "lerom ipsum dolor sit amet,concsectetur",
  },
  {
    Que: "lerom ipsum dolor sit amet,concsectetur",
    Ans: "lerom ipsum dolor sit amet,concsectetur",
  },
  {
    Que: "lerom ipsum dolor sit amet,concsectetur",
    Ans: "lerom ipsum dolor sit amet,concsectetur",
  },
];

export default class SettingHelpFaqs extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
    };
  }

  handleChangeSearchInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <>
        <SearchInput
          name="searchInput"
          placeholder="Search"
          onChange={this.handleChangeSearchInput}
          value={this.state.SearchInput}
        />
        <div className="faqs-ques-ans-div"></div>
        {list.map((val, key) => (
          <div key={key}>
            <div className="row mx-0 align-items-start">
              <img
                src={require("../../../assets/img/settings/setting-faq-placeholder.svg")}
                alt=""
                className="settings-faq-que-img"
              />
              <div>
                <h3 className="faqs-que-text">{val.Que}</h3>
                <h3 className="faqs-ans-text">{val.Ans}</h3>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}
