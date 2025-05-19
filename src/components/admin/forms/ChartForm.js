import React from "react";
import "../../../styles/components/admin/forms/_performanceForm.scss";

const ChartForm = ({ editData, setEditData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      chart: {
        ...prev.chart,
        [name]: value,
      },
    }));
  };

  return (
    <div className="performance-form">
      <div className="form-group">
        <label htmlFor="year">연도</label>
        <input
          type="text"
          id="year"
          name="year"
          value={editData.chart.year || ""}
          onChange={handleInputChange}
          placeholder="예: 2024"
        />
      </div>
      <div className="form-group">
        <label htmlFor="revenue">매출액</label>
        <input
          type="number"
          id="revenue"
          name="revenue"
          value={editData.chart.revenue || ""}
          onChange={handleInputChange}
          placeholder="예: 100000000"
        />
      </div>
      <div className="form-group">
        <label htmlFor="operatingProfit">영업이익</label>
        <input
          type="number"
          id="operatingProfit"
          name="operatingProfit"
          value={editData.chart.operatingProfit || ""}
          onChange={handleInputChange}
          placeholder="예: 50000000"
        />
      </div>
      <div className="form-group">
        <label htmlFor="totalAssets">자산총계</label>
        <input
          type="number"
          id="totalAssets"
          name="totalAssets"
          value={editData.chart.totalAssets || ""}
          onChange={handleInputChange}
          placeholder="예: 200000000"
        />
      </div>
      <div className="form-group">
        <label htmlFor="totalEquity">자본총계</label>
        <input
          type="number"
          id="totalEquity"
          name="totalEquity"
          value={editData.chart.totalEquity || ""}
          onChange={handleInputChange}
          placeholder="예: 100000000"
        />
      </div>
    </div>
  );
};

export default ChartForm;
