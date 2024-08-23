const express = require("express");
const router = express.Router();
const { imageUpload } = require("../controllers/imageController");
const upload = require("../middlewares/upload");

router.post("/image/upload", upload.array("images"), imageUpload);

module.exports = router;
