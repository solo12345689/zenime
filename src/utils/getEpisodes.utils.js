import axios from "axios";

export default async function getEpisodes(slug, postId) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${api_url}/anime/${slug}/episodes?postId=${postId}&page=1`
    );
    const results = response.data;
    let episodesList = results.episodes || [];
    const maxPages = results.max_pages || 1;

    if (maxPages > 1) {
      const promises = [];
      for (let p = 2; p <= maxPages; p++) {
        promises.push(
          axios.get(
            `${api_url}/anime/${slug}/episodes?postId=${postId}&page=${p}`
          )
        );
      }
      const pageResponses = await Promise.all(promises);
      pageResponses.forEach((res) => {
        if (res.data && res.data.episodes) {
          episodesList = episodesList.concat(res.data.episodes);
        }
      });
    }

    const mappedEpisodes = episodesList.map((ep) => ({
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

