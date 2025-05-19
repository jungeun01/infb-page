import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../API/firebase";
import { getStorage, ref, listAll } from "firebase/storage";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchBusiness } from "../../store/slices/businessSlice";
import "../../styles/_typography.scss";

// Storage의 모든 clients 이미지 파일 리스트 가져오기
async function getAllClientImageFiles() {
  const storage = getStorage();
  const folders = ["clients", "clients/static/media"];
  let allFiles = [];
  for (const folder of folders) {
    const listRef = ref(storage, folder);
    const res = await listAll(listRef);
    allFiles = allFiles.concat(
      res.items.map((item) => ({
        path: item.fullPath,
        name: item.name,
      }))
    );
  }
  return allFiles;
}

function Business(props) {
  const dispatch = useDispatch();
  const { business, status } = useSelector((state) => state.business);
  const [imageUrls, setImageUrls] = useState({});
  const [mainImg, setMainImg] = useState("");
  const [userImg, setUserImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchBusiness({ collectionName: "clients", queryOptions: {} }));
  }, [dispatch]);

  useEffect(() => {
    async function loadImages() {
      if (!business || !Array.isArray(business) || business.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const businessData = business[0];
        const allImages = [
          ...businessData.business.map((item) => item.img),
          ...businessData.partner.map((item) => item.img),
          ...businessData.private.map((item) => item.img),
        ].filter(Boolean);
        const uniqueImages = Array.from(new Set(allImages));
        const storageFiles = await getAllClientImageFiles();

        const imgToStoragePath = {};
        uniqueImages.forEach((img) => {
          const base = img.replace(/\.[^/.]+$/, "");
          const found = storageFiles.find((file) => file.name.includes(base));
          if (found) imgToStoragePath[img] = found.path;
        });

        const entries = await Promise.all(
          uniqueImages.map(async (img) => {
            const path = imgToStoragePath[img];
            if (!path) return [img, ""];
            try {
              const url = await fetchImage(path);
              return [img, url];
            } catch (e) {
              return [img, ""];
            }
          })
        );
        setImageUrls(Object.fromEntries(entries));

        const mainIcon = storageFiles.find((file) =>
          file.name.includes("partner")
        );
        const userIcon = storageFiles.find((file) =>
          file.name.includes("users")
        );
        if (mainIcon) fetchImage(mainIcon.path).then(setMainImg);
        if (userIcon) fetchImage(userIcon.path).then(setUserImg);

        setIsLoading(false);
      } catch (error) {
        console.error("이미지 로딩 실패:", error);
        setIsLoading(false);
      }
    }
    loadImages();
  }, [business]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <ClipLoader size={50} color="#000" loading={true} />
      </div>
    );
  }

  if (!business || !Array.isArray(business) || business.length === 0) {
    return (
      <div className="content-text">데이터를 불러오는데 실패했습니다.</div>
    );
  }

  const businessData = business[0];
  console.log(businessData);
  return (
    <div className="mt-10 mx-4 md:mx-8 lg:mx-52">
      <div>
        <h1 className="page-title text-start flex gap-2 items-center">
          고객사
        </h1>
        <div className="flex flex-col mt-10">
          <h1 className="sub-title text-start">공공분야 주요고객</h1>
          <div className="mt-2">
            <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
              {businessData.business.map((item, index) => (
                <li key={index} className="w-36 md:w-48">
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrls[item.img] || ""}
                      className="border border-gray-300 w-full h-12 md:h-16 rounded-md object-contain p-2"
                      alt={item.name || "고객사"}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h1 className="sub-title text-start mt-8">민간분야 주요고객</h1>
          <div className="mt-2">
            <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
              {businessData.private.map((item) => (
                <li key={item.id} className="w-36 md:w-48">
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrls[item.img] || ""}
                      className="border border-gray-300 w-full h-12 md:h-16 rounded-md object-contain p-2"
                      alt={item.name || "고객사"}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 mb-20 md:mb-40">
        <h1 className="page-title text-start flex gap-2 items-center">
          파트너
        </h1>
        <div className="mt-2">
          <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
            {businessData.partner.map((item) => (
              <li key={item.id} className="w-36 md:w-48">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <img
                    src={imageUrls[item.img] || ""}
                    className="border border-gray-300 w-full h-12 md:h-16 rounded-md object-contain p-2"
                    alt={item.name || "파트너"}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Business;
