import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config({path:"../../../config/dev.config.env"})
import { parts } from "../../utils/system-rules.js";

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  }; // Removed responseMimeType
  

export const support = async (req,res,next) => {
  const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = configuration.getGenerativeModel({model: "gemini-1.5-flash"});
  const prompt = req.query.text
  parts.push({text: prompt})
  const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig
  });
  const response =  result.response;
  const text = response.text();
  console.log(text);

  res.send(text);
}
