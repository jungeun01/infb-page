import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChartData } from "../../store/slices/chartSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { HiOutlineDotsVertical, HiOutlineX } from "react-icons/hi";

function DomesticChart() {
  const dispatch = useDispatch();
  const {
    data: chartData = [],
    status,
    error,
  } = useSelector((state) => state.chart);
  const chartRef = useRef(null);
  const exportBtnRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChartData({ collectionName: "chart", qeuryOptions: {} }));
  }, [dispatch]);

  const formatToEokDetailed = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "";

    const eok = Math.floor(num / 100000000); // 억 단위
    const man = Math.floor((num % 100000000) / 10000); // 만 단위

    let result = "";
    if (eok > 0) result += `${eok}억`;
    if (man > 0) result += ` ${man}만원`;
    return result.trim();
  };

  // 드롭다운 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportBtnRef.current &&
        !exportBtnRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleDownload = async (format) => {
    setDropdownOpen(false);
    switch (format) {
      case "xls":
        const ws = XLSX.utils.json_to_sheet(chartData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "국내실적");
        XLSX.writeFile(wb, "국내실적.xlsx");
        break;
      case "csv":
        const csvContent = chartData
          .map((row) => Object.values(row).join(","))
          .join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, "국내실적.csv");
        break;
      case "png":
      case "jpeg":
        const canvas = await html2canvas(chartRef.current);
        const dataUrl = canvas.toDataURL(`image/${format}`);
        saveAs(dataUrl, `국내실적.${format}`);
        break;
      default:
        break;
    }
  };

  // 숫자 천단위 콤마 포맷 함수
  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  return (
    <div className=" lg:mx-20 mt-20 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">국내실적</h1>
      </div>
      {/* 차트와 표를 가로로 배치 */}
      <div className="flex flex-col lg:my-20  lg:flex-row gap-8">
        {/* 차트 영역 */}
        <div
          ref={chartRef}
          // style={{ width: "50%", height: 500, position: "relative" }}
          className="border border-gray-300 rounded-md py-3 px-2 w-full lg:w-1/2 h-[500px] relative"
        >
          {/* Export 버튼 - 차트 우측 상단 */}
          <div
            ref={exportBtnRef}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
          >
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "4px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              {dropdownOpen ? (
                <HiOutlineX size={18} />
              ) : (
                <HiOutlineDotsVertical size={18} />
              )}
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  minWidth: 120,
                  zIndex: 20,
                  padding: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#333",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Export to
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <button
                      className=" hover:font-bold"
                      onClick={() => handleDownload("xls")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0074d9",
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      xls
                    </button>
                    <button
                      className=" hover:font-bold"
                      onClick={() => handleDownload("png")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#b10dc9",
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      png
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <button
                      className=" hover:font-bold"
                      onClick={() => handleDownload("csv")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2ecc40",
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      csv
                    </button>
                    <button
                      className=" hover:font-bold"
                      onClick={() => handleDownload("jpeg")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff4136",
                        cursor: "pointer",
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      jpeg
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {status === "loading" ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart
                data={chartData.map((item) => ({
                  ...item,
                  revenue: item.revenue / 1000000, // 백만원 단위
                  operatingProfit: item.operatingProfit / 1000000,
                  totalAssets: item.totalAssets / 1000000,
                  totalEquity: item.totalEquity / 1000000,
                }))}
                margin={{ top: 30, right: 30, left: 30, bottom: 5 }}
                // padding={{ top: 40, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 14 }} />

                <YAxis
                  domain={[0, 2200]} // 0 ~ 2,200백만원
                  tickCount={12}
                  interval={0}
                  tickFormatter={(value) => `${value}백만원`} // 그대로 표시
                  tick={{ fontSize: 14 }}
                />
                <Tooltip
                  formatter={(value) => formatToEokDetailed(value * 1000000)} // 단위를 원래대로
                  labelFormatter={(label) => `${label}년`}
                />

                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="매출액"
                  stroke="#00C49F"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="operatingProfit"
                  name="영업이익"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalAssets"
                  name="자산총계"
                  stroke="#FFBB28"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalEquity"
                  name="자본총계"
                  stroke="#FF8042"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400 text-xl">
              데이터가 없습니다
            </div>
          )}
        </div>
        {/* 표 영역 */}
        <div className="w-full mb-10 lg:w-1/2 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#f5f5f5] cursor-default">
                  <th className="p-2 border border-1 border-[#e0e0e0] font-bold text-sm md:text-base">
                    년도
                  </th>
                  <th className="p-2 border border-1 border-[#e0e0e0] font-bold text-sm md:text-base">
                    매출액
                  </th>
                  <th className="p-2 border border-1 border-[#e0e0e0] font-bold text-sm md:text-base">
                    영업이익
                  </th>
                  <th className="p-2 border border-1 border-[#e0e0e0] font-bold text-sm md:text-base">
                    자산총계
                  </th>
                  <th className="p-2 border border-1 border-[#e0e0e0] font-bold text-sm md:text-base">
                    자본총계
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.year}>
                    <td className="p-2 border border-1 border-[#e0e0e0] text-center text-sm md:text-base">
                      {row.year}
                    </td>
                    <td className="p-2 border border-1 border-[#e0e0e0] text-right text-sm md:text-base">
                      {formatNumber(row.revenue)}
                    </td>
                    <td className="p-2 border border-1 border-[#e0e0e0] text-right text-sm md:text-base">
                      {formatNumber(row.operatingProfit)}
                    </td>
                    <td className="p-2 border border-1 border-[#e0e0e0] text-right text-sm md:text-base">
                      {formatNumber(row.totalAssets)}
                    </td>
                    <td className="p-2 border border-1 border-[#e0e0e0] text-right text-sm md:text-base">
                      {formatNumber(row.totalEquity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DomesticChart;
