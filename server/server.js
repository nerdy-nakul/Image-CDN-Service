const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const connectDatabase = require("./config/database");
const connectCloudinary = require("./config/cloud");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDatabase();
connectCloudinary();

const imageRoute = require("./routes/imageRoute")
app.use("/api/v1", imageRoute);

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});
