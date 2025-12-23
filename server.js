import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve html, css, js

// Tvoj OpenAI API ključ
const client = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY"
});

// API endpoint za chat
app.post("/api/chat", async (req, res) => {
    try {
        const userMsg = req.body.message;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: userMsg }
            ]
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Server error. Try again later." });
    }
});

// fallback ruta za index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
