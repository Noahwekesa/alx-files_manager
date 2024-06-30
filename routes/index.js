import { Router } from "express";

const express = require("express");

const AppController = require("../controllers/AppController");
const UserController = require("../controllers/UserController");

const router = Router();

// route
router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UserController.postNewUser);

module.exports = router;
