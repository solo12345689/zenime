import axios from "axios";

const getCategoryInfo = async (path, page) => {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    let results = [];
    let maxPages = 1;

    const mapItem = (item) => ({
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

    // Handle A-Z List routes
    if (path.startsWith("az-list")) {
      const parts = path.split("/");
      let letter = parts[parts.length - 1];
      if (letter === "az-list" || !letter) {
        letter = "A";
      }
      const response = await axios.get(`${api_url}/az-list?letter=${letter}`);
      const list = (response.data.results || []).map(mapItem);
      return {
        data: list,
        totalPages: 1,
      };
    }

    // Handle Language Tag routes (Tamil, Telugu, Hindi, etc.)
    const languageSlugs = ["tamil", "telugu", "hindi", "english", "japanese", "bengali", "malayalam", "kannada"];
    const pathSlug = path.split("/").pop().toLowerCase();
    
    if (path.startsWith("genre/")) {
      const genreSlug = path.split("/").pop();
      const response = await axios.get(`${api_url}/search/advanced?q=${genreSlug}&page=${page}`);
      const list = (response.data.results || []).map(mapItem);
      return {
        data: list,
        totalPages: response.data.max_pages || 1,
      };
    }

    if (languageSlugs.includes(pathSlug)) {
      const response = await axios.get(`${api_url}/language/${pathSlug}?page=${page}`);
      const list = (response.data.results || []).map(mapItem);
      return {
        data: list,
        totalPages: response.data.max_pages || 1,
      };
    }

    // Fallback for homepage category endpoints (most-popular, top-airing, completed, recently-added, etc.)
    const response = await axios.get(`${api_url}/home`);
    const homeData = response.data;
    let list = [];

    if (path === "top-airing") {
      list = (homeData.top_airing || []).map(mapItem);
    } else if (path === "most-popular") {
      list = (homeData.most_popular || []).map(mapItem);
    } else if (path === "completed") {
      list = (homeData.completed_series || []).map(mapItem);
    } else if (path === "recently-updated" || path === "recently-added") {
      list = (homeData.latest_episodes || []).map(mapItem);
    } else if (path === "top-upcoming") {
      list = (homeData.upcoming || []).map(mapItem);
    }

    return {
      data: list,
      totalPages: 1,
    };
  } catch (err) {
    console.error("Error fetching category info:", err);
    return { data: [], totalPages: 0 };
  }
};

export default getCategoryInfo;


