const express = require("express");
const router = express.Router();
const filteringController = require("../controllers/filteringController");

router.get("/categories", filteringController.categories);
router.get("/manufacturers", filteringController.manufacturers);
router.get("/models", filteringController.models);
router.get("/parts", filteringController.parts);
router.get("/years", filteringController.years);
module.exports = router;
