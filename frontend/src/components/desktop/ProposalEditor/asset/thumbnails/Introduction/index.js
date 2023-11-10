import { url } from "../../../../../../store/actions/config";
export default [
  {
    id: "introduction_template_one",
    thumbnail: require("./1.png"),
    headline:
      "<h1><span style='font-size:36px'><strong>INTRODUCTION</strong></span></h1>",
    backgroundColor: "#282F32",
    image_one_src: `${url}/public/download?filename=file-2020-08-03T12:13:52.170Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_text:
      "<p><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum</span></p>",
    para_two_text:
      "<p><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur.  </span></p>",
  },
  {
    id: "introduction_template_two",
    thumbnail: require("./2.png"),
    headline:
      "<h1><span style='font-size:36px'><strong>INTRODUCTION</strong></span></h1>",
    backgroundColor: "#282F32",
    image_one_src: `${url}/public/download?filename=file-2020-08-03T06:00:46.635Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_heading:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_two_heading:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_three_heading:
      "<h1 style='text-align:center'><span style='font-size:12px'><strong>HEADING</strong></h1>",
    para_one_text:
      "<p style='text-align:center'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum</span></p>",
    para_two_text:
      "<p style='text-align:center'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum</span></p>",
    para_three_text:
      "<p style='text-align:center'><span style='font-size:12px'>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum</span></p>",
  },
  /*{
    id: "introduction_template_three",
    thumbnail: require("./3.png"),
    headline:
      "<h1><span style='font-size:36px'><strong>Introduction</strong></span></h1>",
    backgroundColor: "#C3C9ED",
    img_block_line_background: "#D8DEED",
    image_one_src: `${url}/public/download?filename=file-2020-07-31T11:35:05.119Z.png`,
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    introduction_template_headline_sq__bgColor: "#303030",
    heading_one_text:
      "<h2><span style='font-size:30px'><strong>Heading1</strong></span></h2>",
    para_one_text:
      "<p><strong><span style='font-size:12px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></strong></p>",
    heading_two_text:
      "<h2><span style='font-size:30px'><strong>Heading2</strong></span></h2>",
    para_two_text:
      "<p><span style='font-size:12px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. is aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat noproident, sunt in culpa qui officia deserunt mollit anim id est laborum .</span></p>",
  },
  {
    id: "introduction_template_four",
    thumbnail: require("./4.png"),
    headline:
      "<h1><span style='font-size:36px'><strong>INTRODUCTION</strong></span></h1>",
    backgroundColor: "#FFE5E1",
    image_one_src:
      "https://login.dominate.ai/public/download?filename=file-2020-06-23T11:49:00.548Z.png",
    image_one_width: "100%",
    image_one_crop: { unit: "%" },
    display_logo: false,
    icon_name_one: "fa-crop",
    icon_background_one: "grey",
    icon_size_one: "fa-lg",
    icon_one_color: "white",
    para_one_text:
      "<p><strong><span style='font-size:12px'>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION</span></strong></p>",
    para_two_text:
      "<p><span style='font-size:12px'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. is aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat noproident, sunt in culpa qui officia deserunt mollit anim id est laborum .</span></p>",
  },*/
];
