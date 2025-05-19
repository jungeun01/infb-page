import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTalent } from "../../store/slices/talentSlice";
import "../../styles/pages/_talent.scss";
import mainPro2 from "../../resources/images/main/ai_icon.png";
import icon4 from "../../resources/images/main/sub_icon1.png";
import icon6 from "../../resources/images/main/car.png";
import icon5 from "../../resources/images/main/monitor.png";
import icon3 from "../../resources/images/main/smile.png";
import icon1 from "../../resources/images/main/time.png";
import icon2 from "../../resources/images/main/growth.png";
import Scroll from "../../components/Scroll";

const Talent = () => {
  const dispatch = useDispatch();
  const { talent, status, error } = useSelector((state) => state.talent);

  useEffect(() => {
    dispatch(fetchTalent({ collectionName: "talent", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!talent || !talent[0]?.company?.talent) {
    return <div>No talent data available</div>;
  }

  const talentData = talent[0].company.talent;
  const benefitsData = talentData.benefits.items || [];
  const description = talentData.description || [];
  const benefitsTitle = talentData.benefits?.title || "복리후생";

  const iconMap = {
    "time.png": icon1,
    "growth.png": icon2,
    "smile.png": icon3,
    "sub_icon1.png": icon4,
    "monitor.png": icon5,
    "car.png": icon6,
  };

  return (
    <div className="recruitment-talent">
      <div className="recruitment-main">
        <div className="talent-header">
          <h1 className="">{talentData.title}</h1>
          <p>{talentData.subtitle}</p>
        </div>
        <div className="talent-content">
          <div>
            <div className="talent-title">
              {description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="talent-button">
              <button onClick={() => window.open(talentData.recruitmentUrl)}>
                채용공고 보기
              </button>
            </div>
          </div>
          <div className="talent-img">
            <img src={mainPro2} />
          </div>
        </div>
      </div>
      <div className="recruitment-benefits">
        <div className="">
          <h1 className="text-4xl py-10 font-bold">{benefitsTitle}</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-white place-items-center ">
          {benefitsData.map((item, i) => (
            <div className="flex items-center gap-6 p-4 lg:w-96 h-52 ">
              <div className="flex-shrink-0">
                <img
                  src={iconMap[item.icon]}
                  className="w-20 h-20 object-contain brightness-150 invert"
                  alt={item.name}
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl lg:text-2xl mb-2">{item.name}</h2>
                <ul className="text-start text-xl space-y-1">
                  {item.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Scroll />
    </div>
  );
};

export default Talent;
