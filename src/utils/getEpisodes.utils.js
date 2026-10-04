import axios from "axios";

export default async function getEpisodes(slug, postId, onProgress) {
  const api_url = import.meta.env.VITE_API_URL;
  
  const mapEpisodes = (epList) => epList.map((ep) => ({
    id: `ep=${ep.number}`,
    episode_no: ep.number,
    title: ep.title || `Episode ${ep.number}`,
    japanese_title: ep.title || `Episode ${ep.number}`,
    released: ep.released,
    slug: ep.slug,
  }));

  try {
    const response = await axios.get(
      `${api_url}/anime/${slug}/episodes?postId=${postId}&page=1`
    );
    const results = response.data;
    let episodesList = results.episodes || [];
    const maxPages = results.max_pages || 1;
    
    if (maxPages === 1 && onProgress) {
      onProgress(mapEpisodes(episodesList), episodesList.length);
    }

    if (maxPages > 1) {
      // Fetch in batches of 5 to prevent rate-limiting/overloading the backend
      const batchSize = 5;
      for (let p = 2; p <= maxPages; p += batchSize) {
        const promises = [];
        for (let i = p; i < p + batchSize && i <= maxPages; i++) {
          promises.push(
            axios.get(
              `${api_url}/anime/${slug}/episodes?postId=${postId}&page=${i}`
            ).catch(err => {
              console.error(`Error fetching page ${i}:`, err);
              return null;
            })
          );
        }
        
        const pageResponses = await Promise.all(promises);
        pageResponses.forEach((res) => {
          if (res && res.data && res.data.episodes) {
            episodesList = episodesList.concat(res.data.episodes);
          }
        });
        
        // Only update the UI progressively once we have fetched at least 100 episodes
        if (episodesList.length >= 100 && onProgress) {
          onProgress(mapEpisodes(episodesList), episodesList.length);
        }
      }
    }

    const mappedEpisodes = mapEpisodes(episodesList);
    return {
      episodes: mappedEpisodes,
      totalEpisodes: mappedEpisodes.length,
    };
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return error;
  }
}

