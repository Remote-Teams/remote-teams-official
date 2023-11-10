import React from "react";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import isEmpty from "../../../store/validations/is-empty";

export default function SettingsNewFaqs() {
  const [isViewMore, setIsViewMore] = useState(false);

  const [values, setValues] = useState({
    faqData: [
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
      {
        Que: "What Is Remote Teams?",
        Ans: "lerom ipsum dolor sit amet,concsectetur",
      },
    ],
    faqDataListOne: [],
    faqDataListTwo: [],
  });

  useEffect(() => {
    if (!isEmpty(values.faqData)) {
      if (values.faqData.length <= 4) {
        setValues({
          ...values,
          faqDataListOne: values.faqData,
        });
      } else {
        let faqs = [...values.faqData];
        /* here faqDataListOne will contain first 4 records and 
           remaining records will be in faqs */
        let faqDataListOne = faqs.splice(0, 4);

        setValues({
          ...values,
          faqDataListOne,
          faqDataListTwo: faqs,
        });
      }
    }
  }, []);

  /*============================================================================
        handlers
  ============================================================================*/

  const handleOnClickViewMore = () => {
    setIsViewMore(!isViewMore);
  };

  /*============================================================================
        renderAccordionItemContent
  ============================================================================*/
  const renderAccordionItemContent = (data) => {
    return (
      <>
        <AccordionItemHeading>
          <AccordionItemButton>
            <div className="row mx-0 flex-nowrap align-items-center">
              <img
                src={require("../../../assets/img/settings/setting-faq-placeholder.svg")}
                alt=""
                className="settings-faq-que-img flex-shrink-0"
              />
              <span className="faqs-que-text"></span> {data.Que}
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <p className="faqs-ans-text">{data.Ans}</p>
        </AccordionItemPanel>
      </>
    );
  };

  /*============================================================================
        main
  ============================================================================*/
  return (
    <div className="settings-content-new__colm3__faqBlock mb-50">
      <div className="row mx-0 flex-nowrap align-items-start justify-content-between">
        <h2 className="add-new-member-title mb-10 mr-20">FAQs</h2>
        {!isEmpty(values.faqData) && values.faqData.length > 4 && (
          <button
            className="settings-content-new__colm3__faqBlock-view-more-btn"
            onClick={handleOnClickViewMore}
          >
            <span className="font-14-semibold">
              {isViewMore ? "View Less" : "View More"}
            </span>
          </button>
        )}
      </div>

      <div className="accordion-div accordion-div--settingsFaq">
        <Accordion allowZeroExpanded={true}>
          {/* display first 4 records */}
          {!isEmpty(values.faqDataListOne) &&
            values.faqDataListOne.map((data, index) => (
              <AccordionItem key={index}>
                {renderAccordionItemContent(data)}
              </AccordionItem>
            ))}
          {/* display remaining records */}
          {isViewMore &&
            !isEmpty(values.faqDataListTwo) &&
            values.faqDataListTwo.map((data, index) => (
              <AccordionItem key={index}>
                {renderAccordionItemContent(data)}
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
