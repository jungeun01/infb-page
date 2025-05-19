import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function MyEditor({ content, setContent, isEditing, setFormDate }) {
  const [editorValue, setEditorValue] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const quillRef = useRef();

  const handleChange = (value) => {
    if (isEditing) {
      // setFormDate 대신 setContent로 수정
      setContent(value); // 여기서 setContent가 호출됩니다.
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "strike"],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
    ],
  };

  useEffect(() => {
    setEditorValue(content);
  }, [content]);

  return (
    <div className="w-full">
      <div className="flex border-b mb-2 ">
        <button
          onClick={() => setActiveTab("write")}
          className={`px-2 text-[14px] ${
            activeTab === "write"
              ? "border-b border-blue-500   font-bold "
              : "text-gray-500"
          }`}
        >
          Write
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-2 text-[14px] ${
            activeTab === "preview"
              ? "border-b-2 border-blue-500 font-bold "
              : "text-gray-500"
          }`}
        >
          Preview
        </button>
      </div>

      {activeTab === "write" ? (
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleChange}
          theme="snow"
          modules={modules}
          className="h-80"
        />
      ) : (
        <div className="border p-4 h-96 prose max-w-none bg-white">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
}

export default MyEditor;
