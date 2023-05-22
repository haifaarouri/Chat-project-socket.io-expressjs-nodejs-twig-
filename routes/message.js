var express = require('express');
var router = express.Router();
var Message = require("../models/message")

router.get("/", async function (req, res, next) {
    const m = await Message.find();
    res.render(
        "messsageList",
        {
            title: "Message list",
            cont: m
        }
    );
})

router.get("/form", (req, res, next) => {
    res.render("MessageForm")
})

router.post("/addMessage", (req, res) => {
    const m = new Message()
    m.pseudo = req.body.pseudo
    m.content = req.body.content

    m.save()
        .then(() => res.redirect('/messages'))
        .catch(e => console.log(e))
})

router.get("/likeMessage/:id", (req, res) => {
    Message.findById(id)
        .then(m => {
            m.likes = m.likes + 1

            m.save()
                .then(() => res.redirect('/messages'))
                .catch(e => console.log(e))
        })
})

router.get("/:id", (req, res) => {
    Message.findOne({ _id: req.params.id })
        .then((data) => res.send(data))
})

router.put("/:id", (req, res) => {
    Message.findByIdAndUpdate(req.params.id, req.body)
        .then((data) => res.redirect('/messages'))
})

router.delete("/delete/:id", (req, res) => {
    Message.findByIdAndDelete(req.params.id)
        .then((data) => res.redirect('/messages'))
})

module.exports = router;