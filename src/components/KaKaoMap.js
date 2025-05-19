import React, { useEffect } from "react";

function KakaoMap() {
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(36.3504119, 127.3845475),
      level: 1, // 지도 확대 레벨을 2로 조정 (숫자가 작을수록 더 확대됨, 1~14 사이 값)
    };

    const map = new window.kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체를 생성
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색
    geocoder.addressSearch(
      "대전광역시 서구 문예로 69",
      function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
          });

          // 인포윈도우 생성
          const iwContent = '<div style="padding:5px;">인포비정보기술</div>';
          const infowindow = new window.kakao.maps.InfoWindow({
            content: iwContent,
          });

          // 마커에 마우스오버 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseover", function () {
            infowindow.open(map, marker);
          });

          // 마커에 마우스아웃 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseout", function () {
            infowindow.close();
          });

          // window.kakao.maps.event.addListener(marker, "click", function () {
          //   window.open(
          //     "https://map.kakao.com/?map_type=TYPE_MAP&itemId=534109997&q=인포비정보기술&urlLevel=3&urlX=585840&urlY=797298",
          //     "_blank"
          //   );
          // });
          window.kakao.maps.event.addListener(marker, "click", function () {
            window.open(
              "https://map.kakao.com/?map_type=TYPE_MAP&itemId=534109997&q=인포비정보기술&urlLevel=3&urlX=585840&urlY=797298",
              "_blank"
            );
          });

          // 지도의 중심을 결과값으로 받은 위치로 이동
          map.setCenter(coords);
        }
      }
    );
  }, []);

  return <div id="map" className="kakao-map" />;
}

export default KakaoMap;
