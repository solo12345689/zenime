import axios from "axios";

const getSearchSuggestion = async (keyword) => {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${api_url}/search/instant?query=${keyword}`
    );
    const results = (response.data.results || []).map((item) => ({
      ...item,
      id: item.slug,
      title: item.title_jp || item.title_en,
      japanese_title: item.title_en || item.title_jp,
    }));
    return results;
  } catch (err) {
    console.error("Error fetching search suggestion:", err);
    return [];
  }
};

export default getSearchSuggestion;
