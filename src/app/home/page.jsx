import Advertize from "@/component/Advertize/Advertize";
import BottomLeftAd from "@/component/BottomLeftAd/BottomLeftAd";
import Home from "@/component/Home/Home";
import Script from "next/script";
import React from "react";

export default async function page({ searchParams }) {
  let dataToCache = {};
  try {
    const res = await fetch("https://kaori.shoko.fun/api/home");
    const data = await res.json();
    const {
      spotlights,
      trending,
      topTen: topten,
      today: todaySchedule,
      topAiring: top_airing,
      mostPopular: most_popular,
      mostFavorite: most_favorite,
      latestCompleted: latest_completed,
      latestEpisode: latest_episode,
      topUpcoming: top_upcoming,
      recentlyAdded: recently_added,
      genres,
    } = data?.data;

    dataToCache = {
      spotlights,
      trending,
      topten,
      todaySchedule,
      top_airing,
      most_popular,
      most_favorite,
      latest_completed,
      latest_episode,
      top_upcoming,
      recently_added,
      genres,
    };
  } catch (err) {
    console.error("Failed to load homepage data:", err);
  }

  const seacrhParam = await searchParams;
  const refer = seacrhParam?.refer;
  return (
    <div>
      <Home refer={refer} data={dataToCache} />
      <Advertize refer={""} />
      {/* <Script
        src="//abackdamstubborn.com/b7/2f/b2/b72fb2e5a32c00a413ee2bb7ea85b317.js"
        strategy="afterInteractive"
        // "afterInteractive" means load script after page hydration
      /> */}
      {/* <BottomLeftAd /> */}
    </div>
  );
}
