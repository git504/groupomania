// image Upload
const multer = require("multer");
const path = require("path"); // multer est un package de gestion de fichiers.
// Sa méthode diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
// Sa méthode single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

module.exports = { upload };
