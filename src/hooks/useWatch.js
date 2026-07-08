import { useState, useEffect, useRef } from "react";
import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import getEpisodes from "@/src/utils/getEpisodes.utils";
import getServers from "../utils/getServers.utils";

export const useWatch = (animeId, initialEpisodeId, initialPostId) => {
  const [error, setError] = useState(null);
  const [buffering, setBuffering] = useState(true);
  const [streamInfo, setStreamInfo] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [animeInfoLoading, setAnimeInfoLoading] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [servers, setServers] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isFullOverview, setIsFullOverview] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [intro, setIntro] = useState(null);
  const [outro, setOutro] = useState(null);
  const [episodeId, setEpisodeId] = useState(null);
  const [activeEpisodeNum, setActiveEpisodeNum] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [activeServerType, setActiveServerType] = useState(null);
  const [activeServerName, setActiveServerName] = useState(null);
  const [serverLoading, setServerLoading] = useState(true);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);
  const isServerFetchInProgress = useRef(false);

  useEffect(() => {
    setEpisodes(null);
    setEpisodeId(null);
    setActiveEpisodeNum(null);
    setServers(null);
    setActiveServerId(null);
    setStreamInfo(null);
    setStreamUrl(null);
    setSubtitles([]);
    setThumbnail(null);
    setIntro(null);
    setOutro(null);
    setBuffering(true);
    setServerLoading(true);
    setError(null);
    setAnimeInfo(null);
    setSeasons(null);
    setTotalEpisodes(null);
    setAnimeInfoLoading(true);
    isServerFetchInProgress.current = false;
  }, [animeId, initialPostId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setAnimeInfoLoading(true);
        const animeData = await getAnimeInfo(animeId, false);
        setAnimeInfo(animeData);
        setSeasons(animeData?.seasons || []);
        
        const postId = initialPostId || animeData?.postId;
        if (postId) {
          const episodesData = await getEpisodes(animeId, postId);
          setEpisodes(episodesData?.episodes || []);
          setTotalEpisodes(episodesData?.totalEpisodes || 0);

          const defaultEpisodeSlug =
            initialEpisodeId ||
            (episodesData?.episodes?.length > 0
              ? episodesData.episodes[0].slug
              : null);
          setEpisodeId(defaultEpisodeSlug);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setAnimeInfoLoading(false);
      }
    };
    fetchInitialData();
  }, [animeId, initialPostId]);

  useEffect(() => {
    if (!episodes || !episodeId) {
      setActiveEpisodeNum(null);
      return;
    }
    const activeEpisode = episodes.find((episode) => {
      return episode.slug === episodeId || episode.id === episodeId;
    });
    const newActiveEpisodeNum = activeEpisode ? activeEpisode.episode_no : null;
    if (activeEpisodeNum !== newActiveEpisodeNum) {
      setActiveEpisodeNum(newActiveEpisodeNum);
    }
  }, [episodeId, episodes]);

  useEffect(() => {
    if (!episodeId || isServerFetchInProgress.current) return;

    let mounted = true;
    isServerFetchInProgress.current = true;
    setServerLoading(true);

    const fetchServers = async () => {
      try {
        const serversList = await getServers(episodeId);
        if (!mounted) return;

        setServers(serversList || []);
        if (serversList && serversList.length > 0) {
          const initialServer = serversList[0];
          setActiveServerName(initialServer.name);
          setActiveServerId(initialServer.data_id);
          setStreamUrl(initialServer.url);
        }
      } catch (err) {
        console.error("Error fetching servers:", err);
        if (mounted) setError(err.message || "An error occurred.");
      } finally {
        if (mounted) {
          setServerLoading(false);
          setBuffering(false);
          isServerFetchInProgress.current = false;
        }
      }
    };

    fetchServers();

    return () => {
      mounted = false;
      isServerFetchInProgress.current = false;
    };
  }, [episodeId]);

  // When activeServerId changes, update the streamUrl
  useEffect(() => {
    if (!servers || !activeServerId) return;
    const selected = servers.find((s) => s.data_id === activeServerId);
    if (selected) {
      setStreamUrl(selected.url);
    }
  }, [activeServerId, servers]);

  return {
    error,
    buffering,
    serverLoading,
    streamInfo,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    animeInfoLoading,
    totalEpisodes,
    seasons,
    servers,
    streamUrl,
    isFullOverview,
    setIsFullOverview,
    subtitles,
    thumbnail,
    intro,
    outro,
    episodeId,
    setEpisodeId,
    activeEpisodeNum,
    setActiveEpisodeNum,
    activeServerId,
    setActiveServerId,
    activeServerType,
    setActiveServerType,
    activeServerName,
    setActiveServerName,
  };
};
