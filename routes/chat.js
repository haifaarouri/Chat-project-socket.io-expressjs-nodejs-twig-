var express = require('express');
var router = express.Router();

router.get("/", (req, res, next) => {
    res.render("formChat")
})

module.exports = router;