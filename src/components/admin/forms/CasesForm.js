// import React from "react";
// import "../../../styles/components/admin/forms/_casesForm.scss";

// const CasesForm = ({ editData, setEditData }) => {
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({
//       ...prev,
//       performanceCases: {
//         ...prev.performanceCases,
//         [name]: value,
//       },
//     }));
//   };

//   return (
//     <div className="cases-form">
//       <div className="form-group">
//         <label htmlFor="year">연도</label>
//         <input
//           type="text"
//           id="year"
//           name="year"
//           value={editData.performanceCases?.year || ""}
//           onChange={handleInputChange}
//           placeholder="예: 2024"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="category">카테고리</label>
//         <input
//           type="text"
//           id="category"
//           name="category"
//           value={editData.performanceCases?.category || ""}
//           onChange={handleInputChange}
//           placeholder="예: 공공기관"
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="title">프로젝트 제목</label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={editData.performanceCases?.title || ""}
//           onChange={handleInputChange}
//           placeholder="프로젝트 제목을 입력하세요"
//         />
//       </div>
//     </div>
//   );
// };

// export default CasesForm;
