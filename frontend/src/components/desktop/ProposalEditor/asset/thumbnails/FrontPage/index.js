import { url } from "../../../../../../store/actions/config";
export default [
  {
    id: "front_page_template_one",
    thumbnail: require("./1.png"),
    headline:
      "<h1><strong><span style='font-size:36px'>BUSINESS PROPOSAL</strong></h1>",
    backgroundColor: "#282F32",
    image_one_src: `${url}/public/download?filename=file-2020-08-03T12:50:56.072Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_text: "<p><span style='font-size:14px'>PRESENTED BY </span></p>",
  },
  {
    id: "front_page_template_two",
    thumbnail: require("./2.png"),
    headline:
      "<h1><strong><span style='font-size:36px '>BUSINESS PROPOSAL</strong></h1>",
    text:
      "<p>Lorem ipsLorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>",
    backgroundColor: "#282F32",
    // image_one_src:require('./img/2.png'),
    image_one_src: `${url}/public/download?filename=file-2020-08-03T12:10:00.972Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_text: "<p><span style='font-size:14px'>PRESENTED BY </span></p>",
  },
  {
    id: "front_page_template_three",
    thumbnail: require("./3.png"),
    headline:
      "<h1><span style='font-size:36px'><strong>BUSINESS PROPOSAL</strong></span></h1>",
    text:
      "<p>Lorem ipsLorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>",
    backgroundColor: "#282F32",
    lineColor: "#FFCB5D",
    // image_one_src:require('./img/2.png'),
    image_one_src: `${url}/public/download?filename=file-2020-08-26T07:13:38.174Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_text: "<p><span style='font-size:14px'>PRESENTED BY </span></p>",
  },
];
