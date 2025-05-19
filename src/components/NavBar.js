import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../resources/images/main/logo_tw.png";
import "../styles/components/_navbar.scss";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../pages/API/firebase";
import { doc, getDoc } from "firebase/firestore";
import brochurePdf from "../resources/documents/infob_brochure.pdf";

function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // 반응형 체크
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로그인 상태 체크
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            ...currentUser,
            name: userData.name,
          });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 로그아웃
  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/login/login");
    });
  };

  const menuItems = [
    {
      title: "회사소개",
      path: "/company/ceo",
      submenu: [
        { title: "CEO 인사말", path: "/company/ceo" },
        { title: "연혁", path: "/company/history" },
        { title: "인증 및 특허", path: "/company/certification" },
        { title: "비즈니스", path: "/company/business" },
        { title: "오시는 길", path: "/company/location" },
      ],
    },
    {
      title: "사업소개",
      path: "/business/info",
      submenu: [
        { title: "사업정보", path: "/business/info" },
        { title: "R&D 연구사업", path: "/business/rn-d" },
      ],
    },
    {
      title: "수행실적",
      path: "/performance/cases",
      submenu: [
        { title: "구축사례", path: "/performance/cases" },
        { title: "국내실적", path: "/performance/domesticChart" },
      ],
    },
    {
      title: "채용",
      path: "/recruitment/talent",
      submenu: [{ title: "인재상", path: "/recruitment/talent" }],
    },
    {
      title: "커뮤니티",
      path: "/community/announcement",
      submenu: [
        { title: "공지사항", path: "/community/announcement" },
        { title: "게시판", path: "/community/post" },
      ],
    },
  ];

  const handleMenuClick = (index, e, path) => {
    if (isMobile) {
      e.preventDefault();
      setActiveMenu(activeMenu === index ? null : index);
    }
    navigate(path);
  };

  const handleMenuHover = (index) => {
    if (!isMobile) {
      setActiveMenu(index);
    }
  };

  const handleMenuLeave = () => {
    if (!isMobile) {
      setActiveMenu(null);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSubmenuClick = (path) => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleFontSize = () => {
    setFontSize(fontSize === "small" ? "large" : "small");
    document.documentElement.style.setProperty(
      "--font-size-multiplier",
      fontSize === "small" ? "1.1" : "0.9"
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__logo">
          <Link to="/">
            <img src={logo} alt="INFOB" />
          </Link>
        </div>

        <div className="navbar__font-size">
          <button className="navbar__font-size-btn" onClick={handleFontSize}>
            가<sub>{fontSize === "small" ? "소" : "대"}</sub>
          </button>
        </div>

        <button
          className={`navbar__mobile-toggle ${
            isMobileMenuOpen ? "active" : ""
          }`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__menu ${isMobileMenuOpen ? "active" : ""}`}>
          {menuItems.map((item, index) => (
            <div
              key={item.title}
              className={`navbar__menu-item ${
                activeMenu === index ? "active" : ""
              }`}
              onMouseEnter={() => handleMenuHover(index)}
              onMouseLeave={handleMenuLeave}
            >
              <a
                href={item.path}
                className="navbar__menu-link"
                onClick={(e) => handleMenuClick(index, e, item.path)}
              >
                {item.title}
              </a>
              {item.submenu && (
                <div
                  className={`navbar__submenu ${
                    activeMenu === index ? "active" : ""
                  }`}
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.title}
                      to={subItem.path}
                      className="navbar__submenu-link"
                      onClick={() => handleSubmenuClick(subItem.path)}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="navbar__menu-item">
            <a
              href={brochurePdf}
              download="infob_brochure.pdf"
              className="navbar__menu-link navbar__brochure-btn"
            >
              Brochure
            </a>
          </div>
          <div className="navbar__menu-item">
            {user ? (
              <div className="navbar__user-menu">
                <span className="navbar__user-name">
                  <button className="hover:border-b border-gray-500">
                    {user.displayName || user.name || user.email} 님
                  </button>
                </span>
                <button onClick={handleLogout} className="navbar__logout-btn">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link to="/login/login" className="navbar__menu-link">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
