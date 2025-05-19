import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";
import "../../styles/pages/_performanceCase.scss";
import "../../styles/_typography.scss";
import FadeInSection from "../../components/FadeInSection";
import noImage from "../../resources/images/clients/no_img2.png";
import { fetchImage } from "../API/firebase";

// 카테고리와 이미지 파일명 매핑 하드코딩 부분 주석처리
// const categoryToImage = { ... };

function PerformanceCase() {
  const [selectedYear, setSelectedYear] = useState("2021");
  const [imageUrls, setImageUrls] = useState({});
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({ collectionName: "performance", queryOptions: {} })
    );
  }, [dispatch]);

  // 연도별 프로젝트의 모든 카테고리명(기관명) 수집 및 Storage에서 이미지 동적 fetch
  useEffect(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return;
    const performanceData = products[0]?.company?.performanceCases;
    if (!performanceData) return;
    const timelineData = performanceData.timeline || [];
    const allCategories = timelineData
      .flatMap((item) => item.projects.map((project) => project.category))
      .filter(Boolean);
    const uniqueCategories = Array.from(new Set(allCategories));
    Promise.all(
      uniqueCategories.map(async (category) => {
        // '/'가 있으면 앞부분만 사용
        const mainCategory = category.split("/")[0];
        try {
          const url = await fetchImage(`clients/${mainCategory}.png`);
          return [category, url];
        } catch (e) {
          return [category, ""];
        }
      })
    ).then((entries) => {
      setImageUrls(Object.fromEntries(entries));
    });
  }, [products]);

  if (status === "loading") {
    return <div className="content-text">데이터를 불러오는 중입니다...</div>;
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="content-text">구축 사례 정보를 찾을 수 없습니다.</div>
    );
  }

  const performanceData = products[0]?.company?.performanceCases;

  if (!performanceData) {
    return (
      <div className="content-text">구축 사례 정보가 올바르지 않습니다.</div>
    );
  }

  // timeline 데이터 정렬
  const timelineData = performanceData.timeline || [];
  const sortedTimeline = [...timelineData].sort((a, b) => b.year - a.year);

  const selectedYearData = sortedTimeline.find(
    (item) => String(item.year) === selectedYear
  );

  if (!selectedYearData) {
    return (
      <div className="content-text">해당 연도의 데이터를 찾을 수 없습니다.</div>
    );
  }

  // getImageFileName, getImageSource 등 하드코딩 함수 주석처리
  // const getImageFileName = ...
  // const getImageSource = ...

  return (
    <div className="performance-case">
      <div className="performance-case__header">
        <h2 className="page-title">{performanceData.title || "구축 사례"}</h2>
        <p className="content-text">{performanceData.description}</p>
      </div>

      <div className="performance-case__years">
        {sortedTimeline.map((item) => (
          <button
            key={item.year}
            className={`performance-case__year-btn button-text ${
              selectedYear === String(item.year) ? "active" : ""
            }`}
            onClick={() => setSelectedYear(String(item.year))}
          >
            {item.year}
          </button>
        ))}
      </div>

      <div className="performance-case__content">
        <FadeInSection>
          <div className="performance-case__list">
            {selectedYearData.projects.map((project, index) => (
              <div key={index} className="performance-case__item">
                <div className="performance-case__item-header">
                  <div className="logo">
                    <img
                      src={
                        project.logo
                          ? project.logo
                          : imageUrls[project.category] || noImage
                      }
                      alt={`${project.category} 로고`}
                    />
                  </div>
                </div>
                <div className="performance-case__item-content">
                  <div className="organization sub-title">
                    {project.category}
                  </div>
                  <div className="category content-text">{project.title}</div>
                  <div className="details">
                    <span className="year meta-text">{selectedYear}</span>
                    <span className="status meta-text">완료</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}

export default PerformanceCase;
