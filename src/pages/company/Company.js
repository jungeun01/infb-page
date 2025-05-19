import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { fetchAbout } from "../../store/slices/aboutSlice";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "../../styles/pages/_company.scss";
import Scroll from "../../components/Scroll";

function Company() {
  const dispatch = useDispatch();
  const { about, status, error } = useSelector((state) => state.about);

  useEffect(() => {
    dispatch(fetchAbout({ collectionName: "aboutCompany", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!about || !Array.isArray(about) || about.length === 0) {
    return <div>No data available</div>;
  }

  const aboutData = about[0];
  if (!aboutData.company?.about) {
    return <div>Invalid data structure</div>;
  }

  const { description, slides, services, products } = aboutData.company.about;

  return (
    <div className="main_content">
      <div className="sec1">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          loop={true}
          speed={800}
          className="first-swiper"
        >
          {slides?.map((slide, index) => (
            <SwiperSlide
              key={index}
              className={`main_img1 ${slide.imageClass}`}
            >
              <p>
                {slide.title}
                <span>
                  {slide.description.split("<br />").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </span>
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="sec2">
        <div className="title">
          <p className="sec_title about">
            <span>About</span>
          </p>
        </div>
        <span>
          {description?.split("<br />").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </span>
      </div>

      <div className="sec3">
        <ul>
          {services?.map((service, index) => (
            <li key={index}>
              <p className={service.imageClass}></p>
              <ul>
                <li className="tit">{service.title}</li>
                <li className="con">{service.description}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="sec4">
        <p className="sec_title product">Product</p>
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={40}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          className="second-swiper"
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index} className={product.imageClass}>
              <div>
                <p>
                  <b>{product.title}</b>
                  {product.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Scroll />
    </div>
  );
}

export default Company;
