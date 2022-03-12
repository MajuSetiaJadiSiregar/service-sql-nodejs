const express = require("express");
const route = express.Router();


const userController = require("../controllers/user");
const authUser = require("../middleware/auth");
const uploadSingleImage = require("../middleware/multer");


route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/experience", authUser.authenticationUser, userController.createExperience);
route.post("/education", authUser.authenticationUser, userController.createEducation);
route.post("/languages", authUser.authenticationUser, userController.createLanguage);
route.put("/update", authUser.authenticationUser, uploadSingleImage, userController.updateUser);
module.exports = route;