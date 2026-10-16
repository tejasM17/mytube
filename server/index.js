import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "30mb" }));

app.get("/", (_req, res) => {
  res.send("You tube backend is working");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
