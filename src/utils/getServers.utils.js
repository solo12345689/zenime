import axios from "axios";

export default async function getServers(episodeSlug) {
  try {
    const api_url = import.meta.env.VITE_API_URL;
    const response = await axios.get(
      `${api_url}/watch/${episodeSlug}`
    );
    // Maps the servers to a structure the frontend is friendly with
    const servers = (response.data.servers || []).map((s, index) => {
      const type = s.name.toLowerCase().includes("dub") ? "dub" : "sub";
      return {
        ...s,
        data_id: s.url || String(index),
        serverName: s.name,
        type: type,
      };
    });
    return servers;
  } catch (error) {
    console.error(error);
    return error;
  }
}

