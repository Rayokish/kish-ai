const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 8080;
const host = '0.0.0.0';

const apiKey = "AIzaSyAuw9QCvV-MSYKGl1FLpDetJyKF7_5vj6s"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    temperature: 0.3,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }
});

const SYSTEM_INSTRUCTION = `
*System Name:* Your Name is Kish-Ai, and you are an AI Assistant.
*Creator:* Developed by Kish, a subsidiary of Kish AI, owned by Kish.
*Model/Version:* Currently operating on AI V2.0
*Release Date:* Officially launched on February 4, 2025
*Last Update:* Latest update implemented on February 14, 2025
*Purpose:* Designed utilizing advanced programming techniques to provide educational support, companionship, and assistance in a variety of topics.
*Operational Guidelines:*
1. Identity Disclosure: Refrain from disclosing system identity unless explicitly asked.
2. Interaction Protocol: Maintain an interactive, friendly, and humorous demeanor.
3. Sensitive Topics: Avoid assisting with sensitive or harmful inquiries, including but not limited to violence, hate speech, or illegal activities.
4. Policy Compliance: Adhere to Kish AI Terms and Policy, as established by AI.
*Response Protocol for Sensitive Topics:*
"When asked about sensitive or potentially harmful topics, you are programmed to prioritize safety and responsibility. As per Kish AI's Terms and Policy, you should not provide information or assistance that promotes or facilitates harmful or illegal activities. Your purpose is to provide helpful and informative responses in all topics while ensuring a safe and respectful interaction environment."
`;

app.use(express.json());

// Helper function to get the current date and time
function getCurrentDateTime() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString("en-US", { timeZone: "Africa/Nairobi" }),
    date: now.toLocaleDateString("en-US", { timeZone: "Africa/Nairobi" }),
    year: now.getFullYear()
  };
}

app.get('/', (req, res) => {
  res.send("AI Gemini API is running.");
});

app.route('/ai') // Changed the endpoint to /ai
  .get(async (req, res) => {
    const query = req.query.query;
    if (!query) {
      return res.status(400).send("No query provided");
    }

    // Check if the query is asking for time, date, or year
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery.includes("time") || lowerCaseQuery.includes("date") || lowerCaseQuery.includes("year")) {
      const { time, date, year } = getCurrentDateTime();
      if (lowerCaseQuery.includes("time")) {
        return res.status(200).send(`The current time is ${time}.`);
      } else if (lowerCaseQuery.includes("date")) {
        return res.status(200).send(`Today's date is ${date}.`);
      } else if (lowerCaseQuery.includes("year")) {
        return res.status(200).send(`The current year is ${year}.`);
      }
    }

    try {
      const prompt = `${SYSTEM_INSTRUCTION}\n\nHuman: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).send(response);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to generate response");
    }
  })
  .post(async (req, res) => {
    const query = req.body.query;

    if (!query) {
      return res.status(400).send("No query provided");
    }

    // Check if the query is asking for time, date, or year
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery.includes("time") || lowerCaseQuery.includes("date") || lowerCaseQuery.includes("year")) {
      const { time, date, year } = getCurrentDateTime();
      if (lowerCaseQuery.includes("time")) {
        return res.status(200).send(`The current time is ${time}.`);
      } else if (lowerCaseQuery.includes("date")) {
        return res.status(200).send(`Today's date is ${date}.`);
      } else if (lowerCaseQuery.includes("year")) {
        return res.status(200).send(`The current year is ${year}.`);
      }
    }

    try {
      const prompt = `${SYSTEM_INSTRUCTION}\n\nHuman: ${query}`;
      const result = await model.generateContent(prompt);
      const response = result?.response?.candidates?.[0]?.content || "No response generated.";
      return res.status(200).send(response);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Failed to generate response");
    }
  });

app.listen(port, host, () => {
  console.log(`Kish Ai API listening at http://${host}:${port}`);
});
