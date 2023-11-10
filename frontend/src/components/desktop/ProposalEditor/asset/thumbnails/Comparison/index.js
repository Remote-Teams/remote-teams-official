import { url } from "../../../../../../store/actions/config";
export default [
  {
    id: "comparison_template_one",
    thumbnail: require("./1.png"),
    headline:
      "<h1 style='text-align:center'><span style='font-size:36px'><strong>COMPARISON</strong></span></h1>",
    backgroundColor: "#282F32",
    // image_one_src:require('./img/1.png'),
    image_one_src: `${url}/public/download?filename=file-2020-08-05T11:31:01.203Z.png`,
    image_one_width: "90%",
    image_one_crop: { unit: "%" },
    display_logo: false,

    icon_name_one: "fa-check",
    icon_background_one: "#DDB4B3",
    icon_size_one: "fa-3x",
    icon_one_color: "black",

    icon_name_two: "fa-check",
    icon_two_color: "black",

    icon_name_three: "fa-check",
    icon_three_color: "black",

    icon_name_four: "fa-check",
    icon_four_color: "black",

    icon_name_five: "fa-minus",
    icon_background_five: "#FDDDDF",
    icon_five_color: "black",

    icon_name_six: "fa-check",
    icon_six_color: "black",

    icon_name_seven: "fa-minus",
    icon_seven_color: "black",

    icon_name_eight: "fa-minus",
    icon_eight_color: "black",

    icon_name_nine: "fa-minus",
    icon_background_nine: "#BCCCCA",
    icon_nine_color: "black",

    icon_name_ten: "fa-check",
    icon_ten_color: "black",

    icon_name_eleven: "fa-minus",
    icon_eleven_color: "black",

    icon_name_twelve: "fa-minus",
    icon_twelve_color: "black",

    icon_name_thirteen: "fa-minus",
    icon_background_thirteen: "#9DB4B1",
    icon_thirteen_color: "black",

    icon_name_fourteen: "fa-check",
    icon_fourteen_color: "black",

    icon_name_fifteen: "fa-minus",
    icon_fifteen_color: "black",

    icon_name_sixteen: "fa-minus",
    icon_sixteen_color: "black",

    para_one_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_two_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_three_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_four_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_one_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet</span></p>",
    para_two_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
    para_three_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
    para_four_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
  },
  {
    id: "comparison_template_two",
    thumbnail: require("./2.png"),
    headline:
      "<h1 style='text-align:center'><span style='font-size:36px'><strong>COMPARISON</strong></span></h1>",
    backgroundColor: "#282F32",
    // image_one_src:require('./img/1.png'),
    image_one_src: `${url}/public/download?filename=file-2020-08-05T11:31:01.203Z.png`,
    image_one_width: "90%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    borderColor: "rgba(137, 161, 239, 1)",
    textbackgroundColor: "rgba(85, 116, 216, 1)",
    icon_name_one: "fa-check",
    icon_background_one: "rgba(85, 116, 216, 1)",
    icon_size_one: "fa-3x",
    icon_one_color: "white",

    icon_name_two: "fa-check",
    icon_two_color: "white",

    icon_name_three: "fa-check",
    icon_three_color: "white",

    icon_name_four: "fa-check",
    icon_four_color: "white",

    icon_name_five: "fa-minus",
    //icon_background_five: "#FDDDDF",
    icon_five_color: "white",

    icon_name_six: "fa-check",
    icon_six_color: "white",

    icon_name_seven: "fa-minus",
    icon_seven_color: "white",

    icon_name_eight: "fa-minus",
    icon_eight_color: "white",

    icon_name_nine: "fa-minus",
    //icon_background_nine: "#BCCCCA",
    icon_nine_color: "white",

    icon_name_ten: "fa-check",
    icon_ten_color: "white",

    icon_name_eleven: "fa-minus",
    icon_eleven_color: "white",

    icon_name_twelve: "fa-minus",
    icon_twelve_color: "white",

    para_one_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_two_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_three_headline:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_one_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet</span></p>",
    para_two_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
    para_three_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
    para_four_text:
      "<p style='text-align:left'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet,</span></p>",
  },
  // {
  //     id:"thank_you_three",
  //     thumbnail:require('./3.png'),
  //     headline:"<h1><span style='font-size:36px'><strong>Introduction</strong></span></h1>",
  //     backgroundColor:"white",
  //     // image_one_src:require('./img/1.png'),
  //     image_one_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:42:02.948Z.png",
  //     image_one_width:'100%',
  //     image_one_crop:{ unit:"%" },
  //     image_two_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:48:25.032Z.png",
  //     image_two_width:'100%',
  //     image_two_crop:{ unit:"%" },
  //     image_three_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:00.001Z.png",
  //     image_three_width:'100%',
  //     image_three_crop:{ unit:"%" },
  //     image_four_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:28.983Z.png",
  //     image_four_width:'100%',
  //     image_four_crop:{ unit:"%" },
  //     display_logo:false,
  //     icon_name_one:"fa-crop",
  //     icon_background_one:"grey",
  //     icon_size_one:"fa-lg",
  //     icon_one_color:"white",
  //     para_two_text:"<p style='text-align:justify'><span style='font-family:Arial,Helvetica,sans-serif'><strong><span style='font-size:12px'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></strong></span></p>",
  //     para_one_text:"<p style='text-align:justify'><span style='font-size:12px'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",
  // },
  // {
  //     id:"thank_you_four",
  //     thumbnail:require('./4.png'),
  //     headline:"<h1><span style='font-size:36px'><strong>Introduction</strong></span></h1>",
  //     backgroundColor:"white",
  //     // image_one_src:require('./img/1.png'),
  //     image_one_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:42:02.948Z.png",
  //     image_one_width:'100%',
  //     image_one_crop:{ unit:"%" },
  //     image_two_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:48:25.032Z.png",
  //     image_two_width:'100%',
  //     image_two_crop:{ unit:"%" },
  //     image_three_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:00.001Z.png",
  //     image_three_width:'100%',
  //     image_three_crop:{ unit:"%" },
  //     image_four_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:28.983Z.png",
  //     image_four_width:'100%',
  //     image_four_crop:{ unit:"%" },
  //     image_five_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:28.983Z.png",
  //     image_five_width:'100%',
  //     image_five_crop:{ unit:"%" },
  //     image_six_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T08:49:28.983Z.png",
  //     image_six_width:'100%',
  //     image_six_crop:{ unit:"%" },
  //     display_logo:false,
  //     icon_name_one:"fa-crop",
  //     icon_background_one:"grey",
  //     icon_size_one:"fa-lg",
  //     icon_one_color:"white",
  //     para_two_text:"<p style='text-align:justify'><span style='font-family:Arial,Helvetica,sans-serif'><strong><span style='font-size:12px'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></strong></span></p>",
  //     para_one_text:"<p style='text-align:justify'><span style='font-size:12px'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",

  // },
  // {
  //     id:"thank_you_five",
  //     thumbnail:require('./5.png'),
  //     headline:"<h1><span style='font-size:36px'><strong>Introduction</strong></span></h1>",
  //     backgroundColor:"white",
  //     // image_one_src:require('./img/1.png'),
  //     image_one_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T10:33:22.836Z.png",
  //     image_one_width:'100%',
  //     image_one_crop:{ unit:"%" },
  //     image_two_src:"https://login.dominate.ai/public/download?filename=file-2020-01-23T10:34:50.296Z.png",
  //     image_two_width:'100%',
  //     image_two_crop:{ unit:"%" },
  //     display_logo:false,
  //     icon_name_one:"fa-crop",
  //     icon_background_one:"grey",
  //     icon_size_one:"fa-lg",
  //     icon_one_color:"white",
  //     para_one_text:"<p style='text-align:justify'><span style='font-size:11px'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",
  // },
];
