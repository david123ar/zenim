import axios from "axios";

export async function GET(req, { params }) {
  try {
    const param = await params;
    const { id } = param;
    const workerUrls = process.env.WORKER_URL?.split(",") || [];
    const apis = [
      "https://api.shoko.fun/api",
      "https://api2.shoko.fun/api",
      "https://api3.shoko.fun/api",
    ];

    const baseUrl = apis[Math.floor(Math.random() * apis.length)];

    const finalId = id?.split("-").pop();
    const response = await axios.get(`${baseUrl}/qtip/${finalId}`);

    return new Response(JSON.stringify(response.data.results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/qtip/[id]:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
