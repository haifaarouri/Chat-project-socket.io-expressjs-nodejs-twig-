const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Message = new
    Schema(
        {
            pseudo: String,
            content: String,
            likes: Number
        }
    );
module.exports = mongoose.model("message", Message);