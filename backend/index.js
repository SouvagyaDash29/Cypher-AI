import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
// import path from "path";
// import url from "url";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import dotenv from 'dotenv';
import { Webhook } from "svix";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;
const app = express();

dotenv.config()
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to Mongodb");
  } catch (error) {
    console.error(error);
  }
};

var imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLICKEY,
  privateKey: process.env.IMAGE_KIT_PRIVATEKEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//   const userId = req.auth.userId;
//   // console.log("Success!");
//   console.log(userId);
//   res.send("Success!");
// })

app.post('/api/webhooks',
  bodyParser.raw({ type: "application/json" }),
  function(req, res) {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY)
      const evt = wh.verify(payloadString, svixHeaders);

      const { id, ...attributes } = evt.data;

      const eventType = evt.type;

      if(eventType === 'user.created'){
        console.log(`User ${id} is ${eventType}`)
        console.log(attributes)
      }

      res.status(200).json({
        success: true,
        message: 'Webhook received successfully',
      })

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  })


app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  // const {text} = req.body;
  // console.log(text);
  try {
    //CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    //CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    //IF DOES NOT EXIST CREATE A NEW ONE AND THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChats.save();
    } else {
      //IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
      res.status(201).send(newChat._id);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0].chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding conversation!");
  }
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(401).send("Unauthenticated!");
});

// app.use(express.static(path.join(__dirname, "../frontend")))

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend", "index.html"))
// })

app.listen(port, () => {
  connect();
  console.log(`listening on ${port}`);
});





// for pakeage.json
// --env-file .env