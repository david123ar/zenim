import axios from "axios";

export default async function getServers(animeId, episodeId) {
  try {
    const api_url = "https://vimal.animoon.me/api";
    const response = await axios.get(
      `${api_url}/servers/${animeId}?ep=${episodeId}`
    );
    return response.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
}
