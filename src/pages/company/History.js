import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../../store/slices/historySlice";
import img from "../../resources/images/main/logo_tw.png";
import Scroll from "../../components/Scroll";

function History() {
  const dispatch = useDispatch();
  const { history, status } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchHistory({ collectionName: "hisory", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="py-16 px-8 bg-gray-100 text-gray-900">
        <div className="text-center text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (
    !history ||
    !history[0] ||
    !history[0].company ||
    !history[0].company.history
  ) {
    return (
      <div className="py-16 px-8 bg-gray-100 text-gray-900">
        <div className="text-center text-lg font-medium">
          연혁 데이터가 없습니다.
        </div>
      </div>
    );
  }

  const historyData = history[0].company.history;

  return (
    <div className="mt-10 ">
      <h1 className="text-3xl font-bold px-4 md:pl-20 text-center md:text-left">
        {historyData.title || "회사 연혁"}
      </h1>
      <div className="py-5 md:py-6 px-4 md:px-8 md:mx-36 my-10 bg-[#222222] text-white">
        <div className="flex justify-center">
          <img src={img} className="w-80 " alt="logo" />
        </div>
        <p className="text-center text-base text-white mt-8 mb-16 relative pt-8">
          {historyData.subtitle || ""}
          <span className="absolute from-blue-900 to-yellow-400 top-0  left-1/2 w-3/12 h-[2px] -translate-x-1/2  md:left-1/2 md:w-1/12 md:h-[3px] md:-translate-x-1/2 bg-gradient-to-r "></span>
        </p>
        <div className="relative md:relative max-w-5xl mx-auto">
          <div className="absolute  left-1 w-0.5 bg-white -translate-x-1 md:absolute top-0 bottom-0 md:left-1/2 mdKw-0.5 md:bg-white md:-translate-x-1/2"></div>

          {historyData.timeline &&
            Object.entries(historyData.timeline)
              .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
              .map(([year, data], index) => {
                const isEven = index % 2 === 0;
                const alignment = isEven
                  ? "md:left-1/2 md:pl-8 md:text-left"
                  : "md:right-1/2 md:pr-8 md:text-right";

                return (
                  <div
                    key={year}
                    data-aos="fade-up"
                    className="relative  mb-48 md:mb-36 w-full min-h-[120px] group"
                  >
                    {/* 점표시 */}
                    <div className="absolute top-3  left-[-5px] w-3 h-3 bg-gray-100 border-2 border-gray-800 rounded-full md:left-1/2 md:-translate-x-1/2 group-hover:bg-yellow-400 group-hover:border-blue-900 transition-all duration-300"></div>
                    <div className={`absolute top-0 w-[45%] ${alignment}`}>
                      <h2 className=" font-bold text-yellow-400 text-xl md:group-hover:text-white md:text-2xl transition-all duration-300 group-hover:translate-x-5">
                        {year}년
                      </h2>
                    </div>

                    <div
                      className={`absolute w-full text-start pl-4 top-12 md:top-12 md:w-[45%] ${alignment}`}
                    >
                      {data.events &&
                        data.events.map((event, eventIndex) => (
                          <div
                            key={`${year}-${eventIndex}`}
                            className="md:mb-4 last:mb-0"
                          >
                            <div className="text-base p-0 w-full md:text-base md:font-semibold leading-relaxed transition-all duration-300 ">
                              {event.content}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <Scroll />
    </div>
  );
}

export default History;
