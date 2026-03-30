export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch("https://api.deezer.com/search?q=" + encodeURIComponent(q) + "&limit=1");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Deezer" });
  }
}
