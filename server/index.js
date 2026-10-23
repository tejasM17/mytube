import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";

dotenv.config();
const app = express();
import path from "path";
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
}));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static(process.env.UPLOAD_DIR || path.resolve("uploads")));
app.get("/", (req, res) => {
    res.send("MyTube backend is running...");
});

app.use(bodyParser.json());
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/comment", commentroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
const PORT = process.env.PORT || 5000;
const DBURL = process.env.DB_URL;

if (!DBURL) {
    throw new Error("DB_URL environment variable is required");
}

mongoose.connect(DBURL)
    .then(() => {
        console.log("MongoDB is connected");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is live on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    });
