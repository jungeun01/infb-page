import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/slices/productsSlice";
import "../../styles/pages/_rndBusiness.scss";
import "../../styles/_typography.scss";
import FadeInSection from "../../components/FadeInSection";
import ImageModal from "../../components/ImageModal";
import { fetchImage } from "../API/firebase";

function LeakDetection() {
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
    if (!products || !products[0]?.leakDetection) return;
    const allImages = products[0].leakDetection.flatMap(
      (product) => product.images || []
    );
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
  console.log(
    "Products data structure:",
    JSON.stringify(productsData, null, 2)
  );

  if (!productsData?.leakDetection) {
    return (
      <div className="content-text">
        누출탐지 제품 정보가 올바르지 않습니다.
      </div>
    );
  }

  const leakDetection = productsData.leakDetection;
  // console.log("Leak detection products:", leakDetection);

  if (!Array.isArray(leakDetection)) {
    console.error("leakDetection is not an array:", leakDetection);
    return (
      <div className="content-text">
        누출탐지 제품 데이터 형식이 올바르지 않습니다.
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
            {leakDetection.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-header">
                  <h3 className="sub-title">{product.name}</h3>
                  {product.releaseDate && (
                    <div className="product-badge">{product.releaseDate}</div>
                  )}
                </div>
                <FadeInSection>
                  <div
                    className={`image-grid ${
                      product.id === "lora-repeater" ? "lora-grid" : ""
                    }`}
                  >
                    {product.id === "lora-repeater" ? (
                      <>
                        <div className="image-container main-image">
                          <img
                            src={imageUrls[product.images[0]] || ""}
                            alt={`${product.name} 이미지 1`}
                            onClick={() =>
                              setSelectedImage({
                                src: imageUrls[product.images[0]] || "",
                                alt: `${product.name} 이미지 1`,
                              })
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="image-container vertical-stack">
                          {product.images.slice(1).map((image, index) => (
                            <div key={index} className="stack-item">
                              <img
                                src={imageUrls[image] || ""}
                                alt={`${product.name} 이미지 ${index + 2}`}
                                onClick={() =>
                                  setSelectedImage({
                                    src: imageUrls[image] || "",
                                    alt: `${product.name} 이미지 ${index + 2}`,
                                  })
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      product.images.map((image, index) => (
                        <div key={index} className="image-container">
                          <img
                            src={imageUrls[image] || ""}
                            alt={`${product.name} 이미지 ${index + 1}`}
                            onClick={() =>
                              setSelectedImage({
                                src: imageUrls[image] || "",
                                alt: `${product.name} 이미지 ${index + 1}`,
                              })
                            }
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </FadeInSection>
                <FadeInSection>
                  <div className="product-content">
                    <div
                      className={`features ${
                        location.pathname === "/business/board-products"
                          ? "board-features"
                          : "leak-features"
                      }`}
                    >
                      <h4 className="sub-title">제품 특징</h4>
                      <ul>
                        {product.features.description.map((desc, index) => (
                          <li key={index}>
                            <span className="feature-icon">
                              {getFeatureIcon(index)}
                            </span>
                            <span className="feature-text content-text">
                              {desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {product.specifications && (
                      <div className="specifications">
                        <table className="spec-table">
                          <tbody>
                            {/* 입력 사양 */}
                            <tr>
                              <td
                                className="section-header table-header"
                                rowSpan={
                                  product.specifications.input?.length || 1
                                }
                              >
                                입력
                              </td>
                              {product.specifications.input?.map(
                                (spec, index) => (
                                  <React.Fragment key={index}>
                                    {index === 0 ? (
                                      <>
                                        <td className="table-header">
                                          {spec.name}
                                        </td>
                                        <td className="table-cell">
                                          {spec.value}
                                        </td>
                                      </>
                                    ) : (
                                      <tr>
                                        <td className="table-header">
                                          {spec.name}
                                        </td>
                                        <td className="table-cell">
                                          {spec.value}
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                )
                              )}
                            </tr>

                            {/* 전원 사양 */}
                            <tr>
                              <td
                                className="section-header table-header"
                                rowSpan={3}
                              >
                                전원
                              </td>
                              <td className="table-header">출력1</td>
                              <td className="table-cell">
                                <ul>
                                  <li className="content-text">전압: DC24V</li>
                                  <li className="content-text">
                                    Ripple & Noise: 80mVp-p
                                  </li>
                                  <li className="content-text">
                                    Line Regulation: ±0.5%
                                  </li>
                                  <li className="content-text">
                                    Load Regulation: ±0.5%
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">출력2</td>
                              <td className="table-cell">
                                <ul>
                                  <li className="content-text">전압: DC24V</li>
                                  <li className="content-text">
                                    Ripple & Noise: 120mVp-p
                                  </li>
                                  <li className="content-text">
                                    Line Regulation: ±1%
                                  </li>
                                  <li className="content-text">
                                    Load Regulation: ±2%
                                  </li>
                                </ul>
                              </td>
                            </tr>

                            {/* 무선 사양 */}
                            <tr>
                              <td
                                className="section-header table-header"
                                rowSpan={3}
                              >
                                무선
                              </td>
                              <td className="table-header">주파수</td>
                              <td className="table-cell">
                                <ul>
                                  <li className="content-text">
                                    송신: 920.9MHz ~ 922.9MHz
                                  </li>
                                  <li className="content-text">
                                    주파수 범위: 47~63Hz
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">안테나</td>
                              <td className="table-cell">
                                <ul>
                                  <li className="content-text">
                                    type: 유효방사, Dipole Antenna
                                  </li>
                                  <li className="content-text">
                                    gain: 안테나 이득: 3.83 dBi(925MHz)
                                  </li>
                                  <li className="content-text">
                                    polarization: 공중선의 편파성: 수직, 수평
                                    편파
                                  </li>
                                  <li className="content-text">
                                    size: 크기: 102.2 x 108.1 mm
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="table-header">출력</td>
                              <td className="table-cell">10mW이하</td>
                            </tr>

                            {/* 사용온도 */}
                            <tr>
                              <td className="section-header table-header">
                                사용온도
                              </td>
                              <td className="table-cell" colSpan={2}>
                                -20℃ ~ +50℃
                              </td>
                            </tr>
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
    frequency: "주파수",
    wirelessOutput: "무선출력",
    antenna: "안테나",
    temperature: "사용온도",
  };
  return titles[key] || key;
}

export default LeakDetection;
