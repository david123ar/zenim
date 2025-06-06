"use client";
import { Skeleton } from "@/component/ui/Skeleton/Skeleton";
import CategoryCardLoader from "./CategoryCardLoader";
import SidecardLoader from "./SidecardLoader";
import "./animeInfoLoader.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const SkeletonItems = ({ count, className }) =>
  [...Array(count)].map((_, index) => (
    <Skeleton key={index} className={className} />
  ));

function AnimeInfoLoader() {
  return (
    <>
      <SessionProvider>
        <Navbar />
        {/* <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "70px",
          }}
        >
          <iframe
            src="/ad6"
            style={{
              width: "fit-content",
              height: "100px",
              border: "none",
              overflow: "hidden",
            }}
            scrolling="no"
          ></iframe>
          <div className="adClusterMain">
            <iframe
              src="/ad"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
          <div className="adCluster">
            <iframe
              src="/ad2"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
        </div> */}
        <div className="categLay">
          <Skeleton
            className="absolute inset-0 w-full h-full blur-lg z-[-900] bg-gray-500"
            animation={false}
          />
          <div className="flex items-start z-10 px-14 py-[70px] bg-[#252434] bg-opacity-70 gap-x-8 max-[1024px]:px-6 max-[1024px]:py-10 max-[1024px]:gap-x-4 max-[575px]:flex-col max-[575px]:items-center max-[575px]:justify-center">
            <Skeleton className="w-[200px] h-[270px] rounded-none" />
            <div className="flex flex-col ml-4 gap-y-5 w-full max-[575px]:items-center max-[575px]:justify-center max-[575px]:mt-0">
              <ul className="flex gap-x-2 items-center w-fit max-[1200px]:hidden">
                <SkeletonItems
                  count={3}
                  className="w-[40px] h-[15px] rounded-xl "
                />
              </ul>
              <div className="flex flex-col gap-y-2">
                <SkeletonItems
                  count={2}
                  className="w-[50%] h-[20px] rounded-xl "
                />
              </div>
              <div className="flex gap-x-[3px]">
                <SkeletonItems
                  count={6}
                  className="w-[30px] h-[20px] rounded-sm"
                />
              </div>
              <Skeleton className="w-[150px] h-[40px] rounded-3xl mt-4" />
              <div className="flex flex-col gap-y-2 mt-5 max-[575px]:hidden">
                <SkeletonItems
                  count={3}
                  className="w-[80%] h-[15px] rounded-3xl "
                />
              </div>
              <div className="flex gap-x-4 items-center mt-4">
                <Skeleton className="w-[60px] h-[60px] rounded-full bg-gray-500 max-[575px]:hidden" />
                <div className="flex flex-col w-fit gap-y-2">
                  <SkeletonItems
                    count={2}
                    className="w-[150px] h-[10px] rounded-xl "
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#4c4b57c3] flex items-center px-8 max-[1200px]:py-10 max-[1200px]:bg-[#363544e0] max-[575px]:p-4">
            <div className="w-full flex flex-col h-fit gap-y-4">
              <SkeletonItems count={6} className="w-full h-[15px] rounded-xl" />
              <div className="flex gap-x-4 py-2 mt-4">
                <Skeleton className="w-[50px] h-[20px] " />
                <div className="flex flex-wrap gap-1">
                  <SkeletonItems
                    count={4}
                    className="w-[30px] h-[20px] rounded-sm bg-gray-500"
                  />
                </div>
              </div>
              <SkeletonItems
                count={2}
                className="w-[90%] h-[15px] rounded-xl  "
              />
            </div>
          </div>
        </div>
        {/* <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "70px",
          }}
        >
          <iframe
            src="/ad5"
            style={{
              width: "fit-content",
              height: "100px",
              border: "none",
              overflow: "hidden",
            }}
            scrolling="no"
          ></iframe>
          <div className="adClusterMain">
            <iframe
              src="/ad4"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
          <div className="adCluster">
            <iframe
              src="/ad3"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
        </div> */}
        <div className="categWrapper">
          <CategoryCardLoader className="mt-[60px]" />
          <SidecardLoader className="mt-[60px]" />
        </div>
        {/* <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "70px",
          }}
        >
          <iframe
            src="/ad6"
            style={{
              width: "fit-content",
              height: "100px",
              border: "none",
              overflow: "hidden",
            }}
            scrolling="no"
          ></iframe>
          <div className="adClusterMain">
            <iframe
              src="/ad"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
          <div className="adCluster">
            <iframe
              src="/ad2"
              style={{
                width: "fit-content",
                height: "100px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
            ></iframe>
          </div>
        </div> */}
        <Footer />
      </SessionProvider>
    </>
  );
}
export default AnimeInfoLoader;
