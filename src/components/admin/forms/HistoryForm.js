import React, { useState } from "react";
import "../../../styles/components/admin/forms/_historyForm.scss";

const HistoryForm = ({ editData, setEditData }) => {
  const [newYear, setNewYear] = useState("");
  const [newContent, setNewContent] = useState("");

  if (!editData?.timeline) {
    setEditData({
      ...editData,
      timeline: {},
    });
    return null;
  }

  const years = Object.keys(editData.timeline).sort((a, b) => b - a);

  const handleAddYear = () => {
    if (newYear && /^\d{4}$/.test(newYear)) {
      setEditData({
        ...editData,
        timeline: {
          [newYear]: {
            events: [{ content: newContent }],
          },
          ...editData.timeline,
        },
      });
      setNewYear("");
      setNewContent("");
    } else if (newYear) {
      alert("올바른 연도 형식을 입력해주세요 (예: 2024)");
    }
  };

  const handleAddEvent = (year) => {
    const newTimeline = { ...editData.timeline };
    if (!newTimeline[year].events) {
      newTimeline[year].events = [];
    }
    newTimeline[year].events.unshift({ content: "" });
    setEditData({
      ...editData,
      timeline: newTimeline,
    });
  };

  const handleUpdateEvent = (year, index, value) => {
    const newTimeline = { ...editData.timeline };
    newTimeline[year].events[index].content = value;
    setEditData({
      ...editData,
      timeline: newTimeline,
    });
  };

  const handleDeleteEvent = (year, index) => {
    const newTimeline = { ...editData.timeline };
    newTimeline[year].events = newTimeline[year].events.filter(
      (_, i) => i !== index
    );
    if (newTimeline[year].events.length === 0) {
      delete newTimeline[year];
    }
    setEditData({
      ...editData,
      timeline: newTimeline,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddYear();
    }
  };

  return (
    <div className="history-form">
      <div className="form-group">
        <div className="header">
          <label>연혁 관리</label>
          <button
            type="button"
            className="add-year-button"
            onClick={handleAddYear}
          >
            연도 추가
          </button>
        </div>
        <div className="input-group">
          <div className="year-input-group">
            <div className="input-label">연도</div>
            <input
              type="text"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="연도 입력 (예: 2024)"
              className="year-input"
            />
            <div className="input-label">내용</div>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="content-input"
            />
          </div>
        </div>
        {years.map((year) => (
          <div key={year} className="year-section">
            <h3>{year}년</h3>
            <div className="events">
              {editData.timeline[year].events.map((event, index) => (
                <div key={index} className="event-item">
                  <input
                    type="text"
                    value={event.content || ""}
                    placeholder="내용을 입력하세요"
                    onChange={(e) =>
                      handleUpdateEvent(year, index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteEvent(year, index)}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-button"
                onClick={() => handleAddEvent(year)}
              >
                내용 추가
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryForm;
