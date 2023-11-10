import React, { Component } from "react";
import TemplateOption from "../../ReusableComponents/TemplateOption";
import TextComponent from "../../ReusableComponents/TextComponent";
import CompareIconComponent from "../../ReusableComponents/CompareIconComponent";

export class Comparison_TemplateOne extends Component {
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

export default Comparison_TemplateOne;

export const TemplateArea = (props) => {
  const backgroundColor = props.template_data.backgroundColor;
  // console.log( props.template_data );
  return (
    <div
      id="comparison_template_one"
      className="comparison_template_one template_main_container_display_area"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="comparison_template_one_headline">
        <TextComponent
          data_text={props.template_data.headline}
          noEditMode={props.noEditMode}
          onChange={props.onTemplateEditorChangeHandler(
            "headline",
            props.template_index
          )}
        />
      </div>
      <div className="comparison_template_one_table">
        {/* Block 1 */}
        <div className="comparison_template_one_table_block_one">
          {/* Bock 1 col 1 */}
          <div className="comparison_template_one_table_block_column"></div>
          {/* Bock 1 col 2 */}
          <div className="comparison_template_one_table_block_one_column">
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
          <div className="comparison_template_one_table_block_one_column">
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
          <div className="comparison_template_one_table_block_one_column">
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
          <div className="comparison_template_one_table_block_one_column">
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
        <div className="comparison_template_one_table_block">
          {/* Bock 2 col 1 */}
          <div className="comparison_template_one_table_block_column_text">
            <TextComponent
              data_text={props.template_data.para_one_headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_one_headline",
                props.template_index
              )}
            />
          </div>
          {/* Bock 2 col 2 */}
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
        <div className="comparison_template_one_table_block">
          {/* Bock 3 col 1 */}
          <div className="comparison_template_one_table_block_column_text">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
        <div className="comparison_template_one_table_block">
          {/* Bock 4 col 1 */}
          <div className="comparison_template_one_table_block_column_text">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
          <div className="comparison_template_one_table_block_column">
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
        {/* Block 5 */}
        <div className="comparison_template_one_table_block">
          {/* Bock 5 col 1 */}
          <div className="comparison_template_one_table_block_column_text">
            <TextComponent
              data_text={props.template_data.para_four_headline}
              noEditMode={props.noEditMode}
              onChange={props.onTemplateEditorChangeHandler(
                "para_four_headline",
                props.template_index
              )}
            />
          </div>
          {/* Bock 5 col 2 */}
          <div className="comparison_template_one_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_thirteen}
              icon_background={props.template_data.icon_background_thirteen}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_thirteen_color}
              icon_name_id={"icon_name_thirteen"}
              stackClass={`icon_name_thirteen${props.template_index}`}
              icon_background_name={"icon_background_thirteen"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_thirteen_modal"}
              icon_color_name={"icon_thirteen_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 5 col 3 */}
          <div className="comparison_template_one_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_fourteen}
              icon_background={props.template_data.icon_background_thirteen}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_fourteen_color}
              icon_name_id={"icon_name_fourteen"}
              stackClass={`icon_name_fourteen${props.template_index}`}
              icon_background_name={"icon_background_thirteen"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_fourteen_modal"}
              icon_color_name={"icon_fourteen_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 5 col 4 */}
          <div className="comparison_template_one_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_fifteen}
              icon_background={props.template_data.icon_background_thirteen}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_fifteen_color}
              icon_name_id={"icon_name_fifteen"}
              stackClass={`icon_name_fifteen${props.template_index}`}
              icon_background_name={"icon_background_thirteen"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_fifteen_modal"}
              icon_color_name={"icon_fifteen_color"}
              onTemplateItemChange={props.onTemplateItemChange}
              onTemplateItemChangeWithoutEvent={
                props.onTemplateItemChangeWithoutEvent
              }
              template_index={props.template_index}
              noEditMode={props.noEditMode}
            />
          </div>
          {/* Bock 5 col 5 */}
          <div className="comparison_template_one_table_block_column">
            <CompareIconComponent
              icon_name={props.template_data.icon_name_sixteen}
              icon_background={props.template_data.icon_background_thirteen}
              icon_size={props.template_data.icon_size_one}
              icon_color={props.template_data.icon_sixteen_color}
              icon_name_id={"icon_name_sixteen"}
              stackClass={`icon_name_sixteen${props.template_index}`}
              icon_background_name={"icon_background_thirteen"}
              icon_size_name={"icon_size_one"}
              icon_modal_name={"icon_sixteen_modal"}
              icon_color_name={"icon_sixteen_color"}
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
