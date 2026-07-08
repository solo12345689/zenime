import axios from "axios";

const CACHE_KEY = "homeInfoCache_v6";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function getHomeInfo() {
  const api_url = import.meta.env.VITE_API_URL;
  const currentTime = Date.now();

  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cachedData = JSON.parse(cachedRaw);

      const isValidCache =
        cachedData?.data &&
        Object.keys(cachedData.data).length > 0 &&
        currentTime - cachedData.timestamp < CACHE_DURATION;

      if (isValidCache) {
        return cachedData.data;
      }
    }
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }

  const response = await axios.get(`${api_url}/home`);
  const results = response?.data;

  if (!results || typeof results !== "object") {
    return null;
  }

  const mapTitle = (item) => ({
    ...item,
    id: item.slug,
    title: item.title_jp || item.title_en,
    japanese_title: item.title_en || item.title_jp,
    tvInfo: {
      sub: "SUB",
      dub: "DUB",
      showType: "TV",
    }
  });

  const spotlights = (results.spotlights || []).map((item) => {
    const mapped = mapTitle(item);
    return {
      ...mapped,
      poster: item.banner || item.poster,
    };
  });
  const trending = (results.popular_today || []).map((item, idx) => ({
    ...mapTitle(item),
    number: item.rank || idx + 1,
  }));
  const top_airing = (results.top_airing || []).map(mapTitle);
  const most_popular = (results.most_popular || []).map(mapTitle);
  const most_favorite = most_popular;
  const latest_completed = (results.completed_series || []).map(mapTitle);
  const latest_episode = (results.latest_episodes || []).map(mapTitle);
  const recently_added = (results.latest_movies || []).map(mapTitle);
  const top_upcoming = (results.upcoming || []).map(mapTitle);
  const genres = (results.genres || []).map(g => g.slug);
  const topten = (results.popular_today || []).map((item, index) => ({
    ...mapTitle(item),
    id: item.slug,
    rank: index + 1,
  }));

  const finalData = {
    spotlights,
    trending,
    topten,
    todaySchedule: [],
    top_airing,
    most_popular,
    most_favorite,
    latest_completed,
    latest_episode,
    top_upcoming,
    recently_added,
    genres,
  };

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: finalData,
      timestamp: currentTime,
    })
  );

  return finalData;
}



