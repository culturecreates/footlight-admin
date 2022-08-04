import React,{useState} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import {    Form  } from "antd";

var Size = Quill.import("attributors/style/size");
Size.whitelist = ["12px", "16px", "18px"];
const EventEditor = function ({currentLang
}) {
    const [htmlFile, setHtmlFile] = useState("");

    const modules = {
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          // [{ size: ["14px", "px", "18px"] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
              ],
            },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
      };
      /*
       * Quill editor formats
       * See https://quilljs.com/docs/formats/
       */
      const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
      ];
    
      const handleChangeDesc = (html) => {
        setHtmlFile(html);
      };
      
  return (
    <Form.Item name={"desc"} rules={[{ required: false }]}>
    <ReactQuill
    theme={"snow"}
    value={htmlFile || ""}
    bounds={".app"}
    placeholder="Add event descieption"
    modules={modules}
    // formats={formats}
    onChange={handleChangeDesc}
  />
  </Form.Item>
  );
};
export default EventEditor;

