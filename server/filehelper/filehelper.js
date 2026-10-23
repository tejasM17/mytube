"use strict";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const uploadDirectory = process.env.UPLOAD_DIR || path.resolve("uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
        );
    },
});
const filefilter = (req, file, cb) => {
    if (/\.(mp4|webm|mov)$/i.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error("Only MP4, WebM, and MOV video files are allowed."));
    }
};
const upload = multer({ storage: storage, fileFilter: filefilter });
export default upload;
