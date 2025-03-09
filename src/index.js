import express from "express";
import "dotenv/config";
import index from "./db/index";
const app = express();
app.get("/", (req, res) => {
  res.send("Done");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
});
