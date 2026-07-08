import axios from "axios";

export default async function fetchAnimeInfo(id, random = false) {
  const api_url = import.meta.env.VITE_API_URL;
  try {
    let response;
    if (random) {
      const randomResponse = await axios.get(`${api_url}/random`);
      const slug = randomResponse.data.slug;
      response = await axios.get(`${api_url}/anime/${slug}`);
    } else {
      response = await axios.get(`${api_url}/anime/${id}`);
    }
    
    const details = response.data;
    let poster = details.poster;
    if (!poster) {
      try {
        const searchTitle = details.title_en || details.title_jp;
        const searchResponse = await axios.get(`${api_url}/search/instant?query=${searchTitle}`);
        const found = (searchResponse.data.results || []).find(x => x.slug === details.slug);
        if (found && found.poster) {
          poster = found.poster;
        }
      } catch (e) {
        console.error("Error resolving fallback poster:", e);
      }
    }

    const mappedDetails = {
      ...details,
      id: details.slug,
      title: details.title_en || details.title_jp,
      description: details.synopsis,
      poster: poster || "https://i.postimg.cc/rFZnx5tQ/2-Kn-Kzog-md.webp",
      genres: details.metadata?.Genre ? details.metadata.Genre.split(",").map(g => g.trim()) : [],
      charactersVoiceActors: [],
      recommended_data: [],
      related_data: [],
      animeInfo: {
        tvInfo: {
          rating: details.metadata?.Rating || "PG-13",
          quality: details.metadata?.Quality || "HD",
          sub: details.metadata?.Language ? (details.metadata.Language.toLowerCase().includes("sub") ? "SUB" : "") : "",
          dub: details.metadata?.Language ? (details.metadata.Language.toLowerCase().includes("dub") ? "DUB" : "") : "",
        }
      }
    };

    const mappedSeasons = (details.seasons || []).map((s) => ({
      id: s.season_id,
      season: s.season_name,
      season_poster: poster || "https://i.postimg.cc/rFZnx5tQ/2-Kn-Kzog-md.webp",
    }));

    return {
      ...mappedDetails,
      data: mappedDetails,
      seasons: mappedSeasons
    };
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return error;
  }
}

