import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "../styles/pages/_adminLayout.scss";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h1>관리자 페이지</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard" onClick={handleMenuClick}>
                대시보드
              </Link>
            </li>
            <li>
              <Link to="/admin/notices" onClick={handleMenuClick}>
                공지사항 관리
              </Link>
            </li>
            <li>
              <Link to="/admin/posts" onClick={handleMenuClick}>
                게시판 관리
              </Link>
            </li>
            <li>
              <Link to="/admin/collection" onClick={handleMenuClick}>
                컬렉션 데이터 관리
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <button
          className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
