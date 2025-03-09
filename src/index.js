const express = require("express");
require("dotenv").config();
const app = express();
app.get("/", (req, res) => {
  res.send("Done");
});
console.log(process.env);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
});
