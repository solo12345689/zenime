import axios from "axios";

export default async function getEpisodes(slug, postId) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${api_url}/anime/${slug}/episodes?postId=${postId}`
    );
    const results = response.data;
    const mappedEpisodes = (results.episodes || []).map((ep) => ({
      id: `ep=${ep.number}`,
      episode_no: ep.number,
      title: ep.title || `Episode ${ep.number}`,
      japanese_title: ep.title || `Episode ${ep.number}`,
      released: ep.released,
      slug: ep.slug,
    }));
    return {
      episodes: mappedEpisodes,
      totalEpisodes: mappedEpisodes.length,
    };
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return error;
  }
}

