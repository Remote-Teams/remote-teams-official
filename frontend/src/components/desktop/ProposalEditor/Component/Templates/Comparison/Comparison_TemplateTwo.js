import React, { Component, useState } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import TextComponent from "../../ReusableComponents/TextComponent";
import CompareIconComponent from "../../ReusableComponents/CompareIconComponent";
import Modal from "react-bootstrap/Modal";
import { SketchPicker } from "react-color";
import TextAndColor from "../../ReusableComponents/TextAndColor";

export class Comparison_TemplateTwo extends Component {
  render() {
    return (
      <div className="template_main_container">
        {!this.props.noEditMode ? (
          <TemplateOption
            backgroundColor={this.props.template_data.backgroundColor}
            displayLogo={this.props.template_data.display_logo}
            onTemplateItemChangeWithoutEvent={
              this.props.onTemplateItemChangeWithoutEvent
            }
            template_index={this.props.template_index}
            {...this.props}
          />
        ) : null}
        <div className="template_display_area">
          <TemplateArea {...this.props} />
        </div>
      </div>
    );
  }
}

export default Comparison_TemplateTwo;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  const [open, close] = useState(false);
  //console.log(props.template_data);
  function borderModal(borderColor) {
    return (
      <div>
        <Modal show={open} size={"sm"} centered onHide={() => close(false)}>
          {console.log("in modal")}
          <Modal.Body>
            <div className="modal_main_container">
              <div className="modal__close_icon_container">
                <div className="modal__close_icon" onClick={() => close(false)}>
                  {props.closeicon}
                </div>
              </div>
              <div className="template_option_main_container__modal">
                <div className="template_headline">Border color</div>
                <div className="background_color">
                  <SketchPicker
                    color={borderColor}
                    onChangeComplete={(e) =>
                      props.onTemplateItemChangeWithoutEvent(
                        "borderColor",
                        props.template_index,
                        e.hex
                      )
                    }
                  />
                </div>
              </div>
              <div className="modal__button_container">
                <button onClick={() => close(false)}>Save</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
  return (
    <div
      id="comparison_template_two"
      className="comparison_template_two template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      {borderModal(props.template_data.borderColor)}
      <div className="comparison_template_two_headline">
        <TextComponent
          data_text={props.template_data.headline}
          noEditMode={props.noEditMode}
          onChange={props.onTemplateEditorChangeHandler(
            "headline",
            props.template_index
          )}
        />
      </div>
      <div className="comparison_template_two_table">
        {/* Block 1 */}
        <div className="comparison_template_two_table_block_one">
          {/* Bock 1 col 1 */}
          <div className="comparison_template_two_table_block_column"></div>
          {/* Bock 1 col 2 */}
          <div className="comparison_template_two_table_block_one_column">
            <TextComponent
              data_text={props.template_data.para_one_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_one_text",
                props.template_index
              )}
            />
          </div>
          {/* Bock 1 col 3 */}
          <div className="comparison_template_two_table_block_one_column">
            <TextComponent
              data_text={props.template_data.para_two_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_two_text",
                props.template_index
              )}
            />
          </div>
          {/* Bock 1 col 4 */}
          <div className="comparison_template_two_table_block_one_column">
            <TextComponent
              data_text={props.template_data.para_three_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_three_text",
                props.template_index
              )}
            />
          </div>
          {/* Bock 1 col 5 */}
          <div className="comparison_template_two_table_block_one_column">
            <TextComponent
              data_text={props.template_data.para_four_text}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_four_text",
                props.template_index
              )}
            />
          </div>
        </div>
        {/* Block 2 */}
        <div className="comparison_template_two_table_block_two">
          {/* Bock 2 col 1 */}
          <TextAndColor
            data_text={props.template_data.para_one_headline}
            noEditMode={props.noEditMode}
            onChange={props.onTemplateEditorChangeHandler(
              "para_one_headline",
              props.template_index
            )}
            backgroundColor={props.template_data.textbackgroundColor}
            onTemplateItemChangeWithoutEvent={
              props.onTemplateItemChangeWithoutEvent
            }
            template_index={props.template_index}
            {...props}
            noEditMode={props.noEditMode}
            classNameOfLineDiv="comparison_template_two_table_block_column_text comparison_template_two_table_block_column_text--top"
            classNameString="textbackgroundColor"
          />

          {/* Bock 2 col 2 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_one}
              icon_background={props.template_data.icon_background_one}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_one_color}
              icon_name_id={"icon_name_one"}
              stackClass={`icon_name_one${props.template_index}`}
              icon_background_name={"icon_background_one"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_one_modal"}
              icon_color_name={"icon_one_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 2 col 3 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_two}
              icon_background={props.template_data.icon_background_one}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_two_color}
              icon_name_id={"icon_name_two"}
              stackClass={`icon_name_two${props.template_index}`}
              icon_background_name={"icon_background_one"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_two_modal"}
              icon_color_name={"icon_two_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 2 col 4 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_three}
              icon_background={props.template_data.icon_background_one}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_three_color}
              icon_name_id={"icon_name_three"}
              stackClass={`icon_name_three${props.template_index}`}
              icon_background_name={"icon_background_one"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_three_modal"}
              icon_color_name={"icon_three_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 2 col 5 */}
          <div className="comparison_template_two_table_block_column comparison_template_two_table_block_column_bottom">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_four}
              icon_background={props.template_data.icon_background_one}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_four_color}
              icon_name_id={"icon_name_four"}
              stackClass={`icon_name_four${props.template_index}`}
              icon_background_name={"icon_background_one"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_four_modal"}
              icon_color_name={"icon_four_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
        </div>
        {/* Block 3 */}
        <div
          className="comparison_template_two_table_block"
          onClick={() => close(true)}
          style={{ borderColor: props.template_data.borderColor }}
        >
          {/* Bock 3 col 1 */}
          <div className="comparison_template_two_table_block_column_text">
            <TextComponent
              data_text={props.template_data.para_two_headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_two_headline",
                props.template_index
              )}
            />
          </div>
          {/* Bock 3 col 2 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_five}
              icon_background={props.template_data.icon_background_five}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_five_color}
              icon_name_id={"icon_name_five"}
              stackClass={`icon_name_five${props.template_index}`}
              icon_background_name={"icon_background_five"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_five_modal"}
              icon_color_name={"icon_five_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 3 col 3 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_six}
              icon_background={props.template_data.icon_background_five}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_six_color}
              icon_name_id={"icon_name_six"}
              stackClass={`icon_name_six${props.template_index}`}
              icon_background_name={"icon_background_five"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_six_modal"}
              icon_color_name={"icon_six_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 3 col 4 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_seven}
              icon_background={props.template_data.icon_background_five}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_seven_color}
              icon_name_id={"icon_name_seven"}
              stackClass={`icon_name_seven${props.template_index}`}
              icon_background_name={"icon_background_five"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_seven_modal"}
              icon_color_name={"icon_seven_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 3 col 5 */}
          <div className="comparison_template_two_table_block_column comparison_template_two_table_block_column_bottom">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_eight}
              icon_background={props.template_data.icon_background_five}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_eight_color}
              icon_name_id={"icon_name_eight"}
              stackClass={`icon_name_eight${props.template_index}`}
              icon_background_name={"icon_background_five"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_eight_modal"}
              icon_color_name={"icon_eight_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
        </div>
        {/* Block 4 */}
        <div
          className="comparison_template_two_table_block"
          onClick={() => close(true)}
          style={{ borderColor: props.template_data.borderColor }}
        >
          {/* Bock 4 col 1 */}
          <div className="comparison_template_two_table_block_column_text">
            <TextComponent
              data_text={props.template_data.para_three_headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_three_headline",
                props.template_index
              )}
            />
          </div>
          {/* Bock 4 col 2 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_nine}
              icon_background={props.template_data.icon_background_nine}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_nine_color}
              icon_name_id={"icon_name_nine"}
              stackClass={`icon_name_nine${props.template_index}`}
              icon_background_name={"icon_background_nine"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_nine_modal"}
              icon_color_name={"icon_nine_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 4 col 3 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_ten}
              icon_background={props.template_data.icon_background_nine}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_ten_color}
              icon_name_id={"icon_name_ten"}
              stackClass={`icon_name_ten${props.template_index}`}
              icon_background_name={"icon_background_nine"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_ten_modal"}
              icon_color_name={"icon_ten_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 4 col 4 */}
          <div className="comparison_template_two_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_eleven}
              icon_background={props.template_data.icon_background_nine}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_eleven_color}
              icon_name_id={"icon_name_eleven"}
              stackClass={`icon_name_eleven${props.template_index}`}
              icon_background_name={"icon_background_nine"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_eleven_modal"}
              icon_color_name={"icon_eleven_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 4 col 5 */}
          <div className="comparison_template_two_table_block_column comparison_template_two_table_block_column_bottom">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_twelve}
              icon_background={props.template_data.icon_background_nine}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_twelve_color}
              icon_name_id={"icon_name_twelve"}
              stackClass={`icon_name_twelve${props.template_index}`}
              icon_background_name={"icon_background_nine"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_twelve_modal"}
              icon_color_name={"icon_twelve_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
