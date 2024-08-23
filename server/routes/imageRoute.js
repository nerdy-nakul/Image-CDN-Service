const express = require("express");
const router = express.Router();
const { imageUpload } = require("../controllers/imageController");
const Image = require("../middlewares/Image");

router.post("/image/upload", Image, imageUpload);

module.exports = router;
