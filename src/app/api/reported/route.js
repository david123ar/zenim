import { connectDB } from "@/lib/mongoClient"; // Import the connectDB utility

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const cate = searchParams.get("cate");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const externalApiUrl = `https://vimal.shoko.fun/api/stream?id=${id}&server=hd-2&type=${cate}`;
    console.log(`Fetching data from: ${externalApiUrl}`);

    // Fetch data from the external API
    const apiResponse = await fetch(externalApiUrl);
    if (!apiResponse.ok) {
      console.error("API fetch failed with status:", apiResponse.status);
      return new Response(
        JSON.stringify({ error: "Failed to fetch data from API" }),
        { status: apiResponse.status }
      );
    }

    const apiData = await apiResponse.json();
    console.log("API Data received:", apiData);

    // Ensure apiData is not null and has the expected structure
    if (!apiData || !apiData.success || Array.isArray(apiData.results)) {
      console.error("Unexpected API response format:", apiData);
      return new Response(
        JSON.stringify({ error: "Invalid data received from API" }),
        { status: 500 }
      );
    }

    // Connect to MongoDB using the connectDB utility
    const db = await connectDB(); // Use connectDB here
    const episodesCollection = db.collection("episo");
    const savi = `streams.${cate}`;

    // Update MongoDB with the fetched data
    const result = await episodesCollection.updateOne(
      { _id: id },
      { $set: { [savi]: apiData } }, // Ensure correct update format
      { upsert: true } // Create document if it doesn't exist
    );

    console.log(
      result.modifiedCount > 0
        ? "Document updated successfully!"
        : "No document was updated."
    );

    // Return the fetched data
    return new Response(JSON.stringify(apiData), { status: 200 });

  } catch (error) {
    console.error("Error fetching data from API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
