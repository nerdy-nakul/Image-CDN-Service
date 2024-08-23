const express = require("express")
const multer = require("multer")

const Image = (req, res, next) => {
    const upload = multer({dest : "uploads/"});
    upload.single("image")(req, res, (err) => {
        if(err){
            res.status(400).json({message: err.message})
        }
        console.log(req.file);
    } );
    next();
    console.log("middleware")
}
module.exports = Image;