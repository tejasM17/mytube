import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";

dotenv.config();
const app = express();
import path from "path";
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static(path.join("uploads")));
app.get("/", (req, res) => {
    res.send("MyTube backend is running...");
});

app.use(bodyParser.json());
app.use("/user", userroutes);
app.use("/video", videoroutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is Live on port ${PORT}`);
});

const DBURL = process.env.DB_URL;
mongoose
    .connect(DBURL)
    .then(() => {
        console.log("Mongodb is connected");
    })
    .catch((error) => {
        console.log(error);
    });