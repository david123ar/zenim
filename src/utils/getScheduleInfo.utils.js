import axios from "axios";

export default async function getSchedInfo(date) {
  try {
    const api_url = "https://vimal.animoon.me/api";
    const response = await axios.get(`${api_url}/schedule?date=${date}`);
    return response.data.results;
  } catch (error) {
    console.error(error);
    return error;
  }
}
