// Same-origin news proxy (production). Delegates to the shared news-feed core so
// the Netlify function and the Vite dev middleware stay in sync.
import { DEFAULT_QUERY, fetchNewsItems } from "./_newsFeed.mjs";

export const handler = async (event) => {
  const params = event?.queryStringParameters || {};
  const query = params.q || DEFAULT_QUERY;
  const limit = params.n || 24;

  try {
    const items = await fetchNewsItems(query, limit);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ items }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ items: [], error: String(error?.message || error) }),
    };
  }
};
