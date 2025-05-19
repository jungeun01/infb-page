import React from "react";
import "../../../styles/components/admin/forms/_locationForm.scss";

const LocationForm = ({ editData, setEditData }) => {
  return (
    <div className="location-form">
      <div className="form-group">
        <label>주소</label>
        <input
          type="text"
          value={editData.address?.main || ""}
          placeholder="도로명 주소"
          onChange={(e) => {
            const newAddress = { ...editData.address };
            newAddress.main = e.target.value;
            setEditData({ ...editData, address: newAddress });
          }}
        />
      </div>

      <div className="form-group">
        <label>지번 주소</label>
        <input
          type="text"
          value={editData.address?.old || ""}
          placeholder="지번 주소"
          onChange={(e) => {
            const newAddress = { ...editData.address };
            newAddress.old = e.target.value;
            setEditData({ ...editData, address: newAddress });
          }}
        />
      </div>

      <div className="form-group">
        <label>전화번호</label>
        <input
          type="text"
          value={editData.contact?.tel || ""}
          placeholder="전화번호"
          onChange={(e) => {
            const newContact = { ...editData.contact };
            newContact.tel = e.target.value;
            setEditData({ ...editData, contact: newContact });
          }}
        />
      </div>

      <div className="form-group">
        <label>팩스번호</label>
        <input
          type="text"
          value={editData.contact?.fax || ""}
          placeholder="팩스번호"
          onChange={(e) => {
            const newContact = { ...editData.contact };
            newContact.fax = e.target.value;
            setEditData({ ...editData, contact: newContact });
          }}
        />
      </div>
    </div>
  );
};

export default LocationForm;
