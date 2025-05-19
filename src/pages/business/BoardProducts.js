import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";
import "../../styles/pages/_rndBusiness.scss";
import "../../styles/_typography.scss";
import FadeInSection from "../../components/FadeInSection";
import ImageModal from "../../components/ImageModal";
import { fetchImage } from "../API/firebase";

function BoardProducts() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    dispatch(
      fetchProducts({ collectionName: "productDetail", queryOptions: {} })
    );
  }, [dispatch]);

  // 이미지 URL을 storage에서 불러오기
  useEffect(() => {
    if (!products || !products[0]?.boardProducts) return;
    const allImages = products[0].boardProducts
      .flatMap((product) =>
        Array.isArray(product.images)
          ? product.images
          : product.image
          ? [product.image]
          : []
      )
      .filter(Boolean);
    const uniqueImages = Array.from(new Set(allImages));
    Promise.all(
      uniqueImages.map(async (img) => {
        const url = await fetchImage(`rnd/${img}`);
        return [img, url];
      })
    ).then((entries) => {
      setImageUrls(Object.fromEntries(entries));
    });
  }, [products]);

  // console.log("Products data:", products);

  if (status === "loading") {
    return <div className="content-text">데이터를 불러오는 중입니다...</div>;
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return <div className="content-text">제품 정보를 찾을 수 없습니다.</div>;
  }

  const productsData = products[0];
  // console.log(
  //   "Products data structure:",
  //   JSON.stringify(productsData, null, 2)
  // );

  if (!productsData?.boardProducts) {
    return (
      <div className="content-text">보드 제품 정보가 올바르지 않습니다.</div>
    );
  }

  const boardProducts = productsData.boardProducts;
  // console.log("Board products:", boardProducts);

  if (!Array.isArray(boardProducts)) {
    // console.error("boardProducts is not an array:", boardProducts);
    return (
      <div className="content-text">
        보드 제품 데이터 형식이 올바르지 않습니다.
      </div>
    );
  }

  return (
    <div className="rn-business">
      {selectedImage && (
        <ImageModal
          image={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}

      <div className="product-navigation">
        <Link
          to="/business/leak-detection"
          className={`nav-item ${
            location.pathname === "/business/leak-detection" ? "active" : ""
          }`}
        >
          누출탐지센서
        </Link>
        <Link
          to="/business/board-products"
          className={`nav-item ${
            location.pathname === "/business/board-products" ? "active" : ""
          }`}
        >
          보드제품
        </Link>
      </div>

      <section className="product-section">
        <FadeInSection>
          <div className="product-list">
            {boardProducts.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-header">
                  <h3 className="sub-title">{product.name}</h3>
                  {product.releaseDate && (
                    <div className="product-badge">{product.releaseDate}</div>
                  )}
                </div>
                <FadeInSection>
                  <div className="image-grid">
                    <div className="image-container">
                      {Array.isArray(product.images) &&
                      product.images.length > 0
                        ? product.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={imageUrls[img] || ""}
                              alt={`${product.name} 이미지`}
                              onClick={() =>
                                setSelectedImage({
                                  src: imageUrls[img] || "",
                                  alt: `${product.name} 이미지`,
                                })
                              }
                              style={{ cursor: "pointer", marginRight: 8 }}
                            />
                          ))
                        : product.image && (
                            <img
                              src={imageUrls[product.image] || ""}
                              alt={`${product.name} 이미지`}
                              onClick={() =>
                                setSelectedImage({
                                  src: imageUrls[product.image] || "",
                                  alt: `${product.name} 이미지`,
                                })
                              }
                              style={{ cursor: "pointer" }}
                            />
                          )}
                    </div>
                  </div>
                </FadeInSection>
                <FadeInSection>
                  <div className="product-content">
                    <div className="features">
                      <h4 className="sub-title">제품 특징</h4>
                      {Array.isArray(product.features.description) ? (
                        <ul className="feature-list">
                          {product.features.description.map((desc, index) => (
                            <li key={index} className="feature-item">
                              <span className="feature-icon">
                                {getFeatureIcon(index)}
                              </span>
                              <span className="feature-text content-text">
                                {desc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="feature-description content-text">
                          {product.features.description}
                        </p>
                      )}
                    </div>
                    {product.features.specifications && (
                      <div className="specifications">
                        <h4 className="sub-title">규격</h4>
                        <table className="spec-table">
                          <tbody>
                            {Object.entries(
                              product.features.specifications
                            ).map(([key, value]) => {
                              if (typeof value === "object" && value !== null) {
                                return Object.entries(value).map(
                                  ([subKey, subValue], subIndex) => (
                                    <tr key={`${key}-${subKey}`}>
                                      {subIndex === 0 && (
                                        <th
                                          className="table-header"
                                          rowSpan={Object.keys(value).length}
                                        >
                                          {getSpecTitle(key)}
                                        </th>
                                      )}
                                      <td className="table-header">
                                        {getSpecTitle(subKey)}
                                      </td>
                                      <td className="table-cell">
                                        {typeof subValue === "object"
                                          ? Object.entries(subValue).map(
                                              ([k, v]) => (
                                                <div
                                                  key={k}
                                                  className="content-text"
                                                >
                                                  {getSpecTitle(k)}: {v}
                                                </div>
                                              )
                                            )
                                          : subValue}
                                      </td>
                                    </tr>
                                  )
                                );
                              }
                              return (
                                <tr key={key}>
                                  <th className="table-header">
                                    {getSpecTitle(key)}
                                  </th>
                                  <td className="table-cell" colSpan="2">
                                    {value}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </FadeInSection>
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}

function getFeatureIcon(index) {
  const icons = ["📡", "🔋", "⚡", "📊", "🔄", "🌐"];
  return icons[index] || "📝";
}

function getSpecTitle(key) {
  const titles = {
    power: "전원",
    무선: "무선",
    frequency: "주파수",
    wirelessOutput: "무선출력",
    antenna: "안테나",
    temperature: "사용온도",
    humidity: "습도",
    voltage: "전압",
    wdt: "WDT",
    communication: "통신",
    전원: "전원",
    사용온도: "사용온도",
  };
  return titles[key] || key;
}

export default BoardProducts;
