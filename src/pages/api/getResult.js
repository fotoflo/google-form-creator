import { slidesResults } from "./createSlides";
// Import other result stores as needed

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing result ID" });
  }

  // Check in slides results
  if (slidesResults[id]) {
    return res.status(200).json(slidesResults[id]);
  }

  // Check in other result stores as needed
  // if (docsResults[id]) {
  //   return res.status(200).json(docsResults[id]);
  // }

  return res.status(404).json({ error: "Result not found" });
}
