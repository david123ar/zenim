import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import "./CategoryCard.css";
import { useLanguage } from "@/context/LanguageContext";
// import { Link, useNavigate } from "react-router-dom";
import Qtip from "../qtip/Qtip";
import useToolTipPosition from "@/hooks/useToolTipPosition";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CategoryCard = React.memo(
  ({
    label,
    data,
    showViewMore = true,
    className,
    categoryPage = false,
    cardStyle,
    path,
    limit,
    selectL,
    refer,
  }) => {
    const language = selectL;
    const router = useRouter();
    const [showPlay, setShowPlay] = useState(false);
    if (limit) {
      data = data?.slice(0, limit);
    }

    const [itemsToRender, setItemsToRender] = useState({
      firstRow: [],
      remainingItems: [],
    });

    const getItemsToRender = useCallback(() => {
      if (categoryPage) {
        const firstRow =
          typeof window !== "undefined" &&
          window.innerWidth > 758 &&
          data.length > 4
            ? data.slice(0, 4)
            : [];
        const remainingItems =
          typeof window !== "undefined" &&
          window.innerWidth > 758 &&
          data.length > 4
            ? data?.slice(4)
            : data?.slice(0);
        return { firstRow, remainingItems };
      }
      return { firstRow: [], remainingItems: data.slice(0) };
    }, [categoryPage, data]);

    useEffect(() => {
      const handleResize = () => {
        setItemsToRender(getItemsToRender());
      };
      const newItems = getItemsToRender();
      setItemsToRender((prev) => {
        if (
          JSON.stringify(prev.firstRow) !== JSON.stringify(newItems.firstRow) ||
          JSON.stringify(prev.remainingItems) !==
            JSON.stringify(newItems.remainingItems)
        ) {
          return newItems;
        }
        return prev;
      });

      typeof window !== "undefined" &&
        window.addEventListener("resize", handleResize);
      return () => {
        typeof window !== "undefined" &&
          window.removeEventListener("resize", handleResize);
      };
    }, [getItemsToRender]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
      useToolTipPosition(hoveredItem, data);
    const handleMouseEnter = (item, index) => {
      const timeout = setTimeout(() => {
        setHoveredItem(item.id + index);
        setShowPlay(true);
      }, 400);
      setHoverTimeout(timeout);
    };
    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout);
      setHoveredItem(null);
      setShowPlay(false);
    };
    const getLink = (itemId, path, refer) => {
      let lastWatchedEpId = "";
      if (typeof window !== "undefined") {
        lastWatchedEpId = localStorage.getItem(itemId + "-last")
          ? localStorage.getItem(itemId + "-last")
          : "";
      }
      const basePath =
        path === "top-upcoming"
          ? `/${itemId}`
          : lastWatchedEpId
          ? `/watch/${itemId + "?ep=" + lastWatchedEpId}`
          : `/watch/${itemId}`;
      return refer
        ? lastWatchedEpId || basePath.includes("?")
          ? `${basePath}&refer=weebsSecret`
          : `${basePath}?refer=weebsSecret`
        : lastWatchedEpId || basePath.includes("?")
        ? `${basePath}&refer=weebsSecret`
        : `${basePath}?refer=weebsSecret`;
    };

    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl text-[#00f2fe] max-[478px]:text-[18px] capitalize">
            {label}
          </h1>
          {showViewMore && (
            <Link
              href={`/${path}${
                refer ? `?refer=${refer}` : `?refer=weebsSecret`
              }`}
              onClick={() =>
                typeof window !== "undefined" &&
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group"
            >
              <p className="text-white text-[12px] font-semibold h-fit leading-0 group-hover:text-[#00f2fe] transition-all ease-out">
                View more
              </p>
              <FaChevronRight className="text-white text-[10px] group-hover:text-[#00f2fe] transition-all ease-out" />
            </Link>
          )}
        </div>
        <>
          {categoryPage && (
            <div
              className={`grid grid-cols-4 gap-x-3 gap-y-8 transition-all duration-300 ease-in-out ${
                categoryPage && itemsToRender.firstRow.length > 0
                  ? "mt-8 max-[758px]:hidden"
                  : ""
              }`}
            >
              {itemsToRender.firstRow.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col transition-transform duration-300 ease-in-out"
                  style={{ height: "fit-content" }}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <Link
                    href={getLink(item.id, path, refer)}
                    className="w-full relative group hover:cursor-pointer"
                    onClick={() =>
                      typeof window !== "undefined" &&
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    onMouseEnter={() => handleMouseEnter(item, index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hoveredItem === item.id + index && showPlay && (
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-[40px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]"
                      />
                    )}

                    <div className="overlay"></div>
                    <div className="overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className={`w-full h-[320px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] group-hover:blur-[7px] transform transition-all duration-300 ease-in-out ultra-wide:h-[400px] ${cardStyle}`}
                      />
                    </div>
                    {(item.tvInfo?.rating === "18+" ||
                      item?.adultContent === true) && (
                      <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                        18+
                      </div>
                    )}
                    <div className="custom-floating-box">
                      {item.tvInfo?.sub && (
                        <div className="custom-badge">
                          <FontAwesomeIcon
                            icon={faClosedCaptioning}
                            className="text-[12px]"
                          />
                          <p className="text-[12px] font-bold">
                            {item.tvInfo.sub}
                          </p>
                        </div>
                      )}
                      {item.tvInfo?.dub && (
                        <div className="custom-badge-blue">
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            className="text-[12px]"
                          />
                          <p className="text-[12px] font-bold">
                            {item.tvInfo.dub}
                          </p>
                        </div>
                      )}
                      {item.tvInfo?.eps && (
                        <div className="flex space-x-1 justify-center items-center bg-[#a9a6b16f] rounded-[2px] px-[8px] text-white py-[2px]">
                          <p className="text-[12px] font-extrabold">
                            {item.tvInfo.eps}
                          </p>
                        </div>
                      )}
                    </div>

                    {hoveredItem === item.id + index &&
                      typeof window !== "undefined" &&
                      window.innerWidth > 1024 && (
                        <div
                          className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[100000] transform transition-all duration-300 ease-in-out ${
                            hoveredItem === item.id + index
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2"
                          }`}
                        >
                          <Qtip id={item.id} refer={refer} />
                        </div>
                      )}
                  </Link>
                  <Link
                    href={`/${item.id}${
                      refer ? `?refer=${refer}` : `?refer=weebsSecret`
                    }`}
                    className="text-white font-semibold mt-1 item-title hover:text-[#00f2fe] hover:cursor-pointer line-clamp-1"
                    onClick={() =>
                      typeof window !== "undefined" &&
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </Link>
                  {item.description && (
                    <div className="line-clamp-3 text-[13px] font-extralight text-[#b1b0b0] max-[1200px]:hidden">
                      {item.description}
                    </div>
                  )}
                  <div className="flex items-center gap-x-2 w-full mt-2 overflow-hidden">
                    <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                      {item.tvInfo.showType.split(" ").shift()}
                    </div>
                    <div className="dot"></div>
                    <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                      {item.tvInfo?.duration === "m" ||
                      item.tvInfo?.duration === "?" ||
                      item.duration === "m" ||
                      item.duration === "?"
                        ? "N/A"
                        : item.tvInfo?.duration || item.duration || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-6 gap-x-3 gap-y-8 mt-6 transition-all duration-300 ease-in-out max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-2">
            {itemsToRender.remainingItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col transition-transform duration-300 ease-in-out"
                style={{ height: "fit-content" }}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <Link
                  href={getLink(item.id, path, refer)}
                  className="w-full relative group hover:cursor-pointer"
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  onMouseEnter={() => handleMouseEnter(item, index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {hoveredItem === item.id + index && showPlay && (
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="text-[40px] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000]"
                    />
                  )}
                  <div className="overlay"></div>
                  <div className="overflow-hidden">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className={`w-full h-[250px] object-cover max-[1200px]:h-[35vw] max-[758px]:h-[45vw] max-[478px]:h-[60vw] ${cardStyle} group-hover:blur-[7px] transform transition-all duration-300 ease-in-out `}
                    />
                  </div>
                  {(item.tvInfo?.rating === "18+" ||
                    item?.adultContent === true) && (
                    <div className="text-white px-2 rounded-md bg-[#FF5700] absolute top-2 left-2 flex items-center justify-center text-[14px] font-bold">
                      18+
                    </div>
                  )}
                  <div className="custom-floating-box">
                    {item.tvInfo?.sub && (
                      <div className="custom-badge">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.sub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.dub && (
                      <div className="custom-badge-blue">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                  </div>
                  {hoveredItem === item.id + index &&
                    typeof window !== "undefined" &&
                    window.innerWidth > 1024 && (
                      <div
                        className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} z-[100000] transform transition-all duration-300 ease-in-out ${
                          hoveredItem === item.id + index
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                      >
                        <Qtip id={item.id} refer={refer} />
                      </div>
                    )}
                </Link>
                <Link
                  href={`/${item.id}${
                    refer ? `?refer=${refer}` : `?refer=weebsSecret`
                  }`}
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="text-white font-semibold mt-1 item-title hover:text-[#00f2fe] hover:cursor-pointer line-clamp-1"
                >
                  {language === "EN" ? item.title : item.japanese_title}
                </Link>
                <div className="flex items-center gap-x-2 w-full mt-2 overflow-hidden">
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo.showType.split(" ").shift()}
                  </div>
                  <div className="dot"></div>
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo?.duration === "m" ||
                    item.tvInfo?.duration === "?" ||
                    item.duration === "m" ||
                    item.duration === "?"
                      ? "N/A"
                      : item.tvInfo?.duration || item.duration || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    );
  }
);

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
