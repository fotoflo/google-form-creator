import { slidesResults } from "./createSlides";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || !slidesResults[id]) {
    return res.status(404).json({ error: "Slides not found" });
  }

  return res.status(200).json(slidesResults[id]);
}
