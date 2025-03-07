"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/product", (req, res, next) => {
    // Your handler logic here
    res.status(201).json({ msg: "Product API" });
});
exports.default = router;
