import express from "express";
import connectToDB from "./db/connectDb";
import "dotenv/config";
import mainRouter from "./routes/router";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  res.send("API Working!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server running at port ${PORT}`);
});
