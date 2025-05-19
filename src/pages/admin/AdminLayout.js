import React, { useState } from "react";

const AdminLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isMenuOpen ? "open" : ""}`}>
        // ... existing sidebar code ...
      </aside>
      <main className={`admin-main ${isMenuOpen ? "menu-open" : ""}`}>
        <button
          className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="메뉴 토글"
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
