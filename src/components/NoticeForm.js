import React, { useState, useEffect } from "react";
import MyEditor from "../pages/community/MyEditor";

const NoticeForm = ({ onSave, onClose, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "관리자",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        authorName: initialData.authorName || "관리자",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "공지사항 수정" : "공지사항 작성"}
      </h2>
      <div className="space-y-6">
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700 mb-2"
          >
            제목
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="content"
            className="text-sm font-semibold text-gray-700 mb-2"
          >
            내용
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MyEditor
            content={formData.content}
            setContent={handleEditorChange}
            isEditing={true}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isEdit ? "수정" : "등록"}
        </button>
      </div>
    </div>
  );
};

export default NoticeForm;
