import React, { Component } from "react";
import GrayLinkSmallFont from "../common/GrayLinkSmallFont";
import PageTitle from "../common/PageTitle";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import SettingHelpFaqs from "./SettingHelpFaqs";
import SettingHelpSubmit from "./SettingHelpSubmit";

export class SettingsHelp extends Component {
  render() {
    return (
      <>
        <div className="help-title-div">
          <PageTitle title="help" />
          <GrayLinkSmallFont path="/settings" text="Go Back" />
        </div>
        <div className="accordion-div">
          <Accordion allowZeroExpanded={true}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <img
                    src={require("../../../assets/img/settings/setting-arrow-icon-1.svg")}
                    alt=""
                    className="settings-organisation-circle-icon"
                  />
                  watch tutorial again
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>
                  Exercitation in fugiat est ut ad ea cupidatat ut in cupidatat
                  occaecat ut occaecat consequat est minim minim esse tempor
                  laborum consequat esse adipisicing eu reprehenderit enim.
                </p>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton className="settings-content-title1 settings-content-title2 pl-30 mb-50">
                  <img
                    src={require("../../../assets/img/settings/setting-arrow-icon-2.svg")}
                    alt=""
                    className="settings-organisation-circle-icon"
                  />
                  FAQs
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <SettingHelpFaqs />
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton className="settings-content-title1 settings-content-title3 pl-30 mb-50">
                  <img
                    src={require("../../../assets/img/settings/setting-arrow-icon-3.svg")}
                    alt=""
                    className="settings-organisation-circle-icon"
                  />
                  submit your query
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <SettingHelpSubmit />
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
      </>
    );
  }
}

export default SettingsHelp;
