import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Chat Route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://poly-a88g2gd13-mathew-aks-projects.vercel.app/", // your React app URL
        "X-Title": "PolyAI Chatbot",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct", // stable model
        messages: [
          { role: "system", content: "You are PolyAI, a friendly helpful chatbot assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("🧠 OpenRouter raw response:", JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "⚠️ No response from OpenRouter (check model or API key).";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /api/chat:", error);
    res.status(500).json({ reply: "⚠️ Something went wrong while connecting to OpenRouter." });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `🔑 OpenRouter Key Loaded: ${
      process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ Missing"
    }`
  );
});
export default app;