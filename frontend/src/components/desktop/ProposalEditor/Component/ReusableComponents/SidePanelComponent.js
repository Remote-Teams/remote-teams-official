import React from "react";

const SidePanelComponent = (props) => {
  return (
    <div className="side_panel_main_component_container">
      <SelectedTemplateList {...props} />
      <ButtonList {...props} />
    </div>
  );
};

export default SidePanelComponent;

export const SelectedTemplateList = (props) => {
  return (
    <div className="seleected_template_list_main_container">
      {props.state.data.allselectedTemplates.map((template, index) => (
        <div
          onClick={props.onClickselectedTemplateCurrentIndex(index)}
          key={index}
          className={
            props.state.data.selectedTemplateCurrentIndex === index
              ? "selected_template selected_template_active"
              : "selected_template"
          }
        >
          <div
            className="delete_icons"
            onClick={props.onDeleteSelectedTemplateCurrentIndex(index)}
          >
            {props.deleteicon}
            {/* <span className="font-18-bold-space-light-uppercase">REMOVE</span> */}
          </div>
          <img
            src={template.thumbnail}
            alt="thumbnailview"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      ))}
    </div>
  );
};

export const ButtonList = (props) => {
  return (
    <div className="button_list_main_container">
      <div className="button_curve">
        <button
          className={
            props.state.data.isEditOpen ? "buttons buttons_active" : "buttons"
          }
          onClick={props.onEditPanelToggler(true)}
        >
          {props.editicon}
        </button>
        <button
          className={
            !props.state.data.isEditOpen ? "buttons buttons_active" : "buttons"
          }
          onClick={props.onEditPanelToggler(false)}
        >
          {props.maximizeicon}
        </button>
      </div>
      <button className="buttons_round" onClick={props.onSaveDraftHandler}>
        {props.saveicon}
      </button>
      <button
        className="buttons_preview"
        onClick={props.onPreviewPanelToggler(true)}
      >
        Preview
      </button>
    </div>
  );
};
