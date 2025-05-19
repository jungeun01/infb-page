import React from "react";
import { FaCircleChevronUp } from "react-icons/fa6";

function Scroll(props) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        className="text-4xl text-gray-600 hover:text-black"
        onClick={scrollToTop}
      >
        <FaCircleChevronUp />
      </button>
    </div>
  );
}

export default Scroll;
