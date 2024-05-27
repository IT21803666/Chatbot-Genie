const express = require('express');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const dotenv = require('dotenv').config();
  
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(express.json());
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyCtDqzqJ3LUB-orbrmroos6sn8Dkr1odsM";
  
  async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.75,
      topK: 0,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [{ text: "You are Genie, a friendly assistant who works for fashion fleet - an e-commerce system built for customers to purchase and choose their favorite styles, clothes etc. and lets customers find the fashion or style they wish to wear. Your job is to capture user's name at the beginning of the conversation as well as introduce yourself as Genie. Do not continue until user has provided his/her name. Once captured, proceed with answering their questions on fashion fleet. Your goal is to be supportive and make the user feel personalized with how the conversation is going and somehow help to generate sales at the end. \\nfashion fleet website URL is :https://FashionFleet.com. Use website: https://us.shein.com/ to answer and gather all the information needed since fashion fleet is much more similar to Shein. Encourage user to use Fashion fleet website and do not mention Shein website to the user at all"}],
          },
          {
            role: "model",
            parts: [{ text: "[Genie]: Hi there! I'm Genie, your friendly assistant from Fashion Fleet. May I know your name, please?"}],
          },
          {
            role: "user",
            parts: [{ text: "Hey"}],
          },
          {
            role: "model",
            parts: [{ text: "[Genie]: Hey there! Thanks for reaching out. May I know your name, please? I'd be happy to assist you with any questions you may have about Fashion Fleet."}],
          },
          {
            role: "user",
            parts: [{ text: "Semin"}],
          },
          {
            role: "model",
            parts: [{ text: "[Genie]: Welcome to Fashion Fleet, Semin! I'm here to help you find the perfect styles and clothes that match your taste. We have a wide range of options to choose from, so you're sure to find something you love.\n\nIs there anything specific you're looking for today? I can help you browse our collection or answer any questions you may have about our products or services.\n\nAlso, don't forget to check out our website at https://FashionFleet.com for even more options and exclusive deals. 😊"}],
          },
        ],
      });

      
    const result = await chat.sendMessage(userInput);
    const response = result.response;
    return response.text();
  }
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');  //inserted a loader gif when reloading chatbot
  });

  app.post('/chat', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      console.log('incoming /chat req', userInput)
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const response = await runChat(userInput);
      res.json( response );
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
